import crypto from 'node:crypto';
import { PAYMENT_SERVER_KEY } from '$app/env/private';
import { getSupabaseAdmin } from '../supabase-admin.js';
import { deliveryService, type OrderDeliveryResult } from './delivery.js';

/**
 * Module Boundary: Payment Integration & Webhook Handling
 * Architecture design for Phase 2:
 * - Supports Midtrans and mock payment webhooks.
 * - Enforces server-side signature verification (SHA-512 for Midtrans).
 * - Enforces idempotent processing of webhook events to prevent duplicate deliveries.
 * - Triggers instant inventory allocation upon settlement.
 * - Records audit logs for all payment events.
 */

export interface PaymentNotification {
	orderId: string;
	transactionId: string;
	amount: number;
	status: 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny';
	signature: string;
	rawPayload: Record<string, unknown>;
}

export interface WebhookProcessResult {
	processed: boolean;
	orderId: string;
	orderNumber: string;
	status: string;
	alreadyProcessed: boolean;
	deliveryResult?: OrderDeliveryResult | null;
	message: string;
}

export interface PaymentGatewayService {
	verifyMidtransSignature(
		orderId: string,
		statusCode: string,
		grossAmount: string,
		signature: string
	): boolean;
	processWebhook(notification: PaymentNotification): Promise<WebhookProcessResult>;
}

export class DefaultPaymentGatewayService implements PaymentGatewayService {
	private getServerKey(): string {
		const key = PAYMENT_SERVER_KEY || process.env.PAYMENT_SERVER_KEY || 'mock-server-key';
		return key.trim();
	}

	/**
	 * Verify Midtrans SHA-512 signature hash.
	 * Formula: SHA512(order_id + status_code + gross_amount + ServerKey)
	 */
	verifyMidtransSignature(
		orderId: string,
		statusCode: string,
		grossAmount: string,
		signature: string
	): boolean {
		const serverKey = this.getServerKey();
		const rawString = `${orderId}${statusCode}${grossAmount}${serverKey}`;
		const computedHash = crypto.createHash('sha512').update(rawString).digest('hex');

		return computedHash.toLowerCase() === signature.toLowerCase();
	}

	/**
	 * Process incoming webhook notification idempotently.
	 */
	async processWebhook(notification: PaymentNotification): Promise<WebhookProcessResult> {
		const supabase = getSupabaseAdmin();
		const { orderId, transactionId, status, rawPayload } = notification;

		// 1. Locate the order by ID or order_number
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.select('id, order_number, buyer_id, status, total_amount')
			.or(`id.eq.${orderId},order_number.eq.${orderId}`)
			.maybeSingle();

		if (orderError || !order) {
			throw new Error(`Order not found for notification orderId: ${orderId}`);
		}

		// 2. Check Idempotency: if order is already paid, do not re-deliver
		if (order.status === 'paid') {
			return {
				processed: true,
				orderId: order.id,
				orderNumber: order.order_number,
				status: order.status,
				alreadyProcessed: true,
				deliveryResult: null,
				message: 'Order was already processed and delivered.'
			};
		}

		// 3. Handle status transitions
		let deliveryResult: OrderDeliveryResult | null = null;
		let updatedStatus: string = order.status;

		if (status === 'settlement') {
			// Atomically allocate vault inventory and mark order as paid
			deliveryResult = await deliveryService.allocateOrderInventory(order.id);
			updatedStatus = 'paid';

			// Record payment reference details on the order
			await supabase
				.from('orders')
				.update({
					payment_ref: transactionId,
					payment_method:
						(rawPayload.payment_type as string) ||
						(rawPayload.payment_method as string) ||
						'gateway',
					updated_at: new Date().toISOString()
				})
				.eq('id', order.id);
		} else if (status === 'cancel') {
			updatedStatus = 'cancelled';
			await supabase
				.from('orders')
				.update({
					status: 'cancelled',
					cancelled_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				})
				.eq('id', order.id);
		} else if (status === 'expire') {
			updatedStatus = 'expired';
			await supabase
				.from('orders')
				.update({
					status: 'expired',
					updated_at: new Date().toISOString()
				})
				.eq('id', order.id);
		} else if (status === 'deny') {
			updatedStatus = 'failed';
			await supabase
				.from('orders')
				.update({
					status: 'failed',
					updated_at: new Date().toISOString()
				})
				.eq('id', order.id);
		}

		// 4. Record audit log for payment webhook event
		await supabase.from('audit_logs').insert({
			actor_id: order.buyer_id,
			actor_role: 'system',
			action: `payment.webhook_${status}`,
			resource_type: 'orders',
			resource_id: order.id,
			details: {
				transactionId,
				previous_status: order.status,
				new_status: updatedStatus,
				allocated_items: deliveryResult?.allocatedCount ?? 0,
				rawPayload
			}
		});

		return {
			processed: true,
			orderId: order.id,
			orderNumber: order.order_number,
			status: updatedStatus,
			alreadyProcessed: false,
			deliveryResult,
			message: `Order successfully updated to ${updatedStatus}.`
		};
	}
}

export const paymentGatewayService = new DefaultPaymentGatewayService();
