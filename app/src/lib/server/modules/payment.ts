/**
 * Module Boundary: Payment Integration
 * Architecture design for Phase 1:
 * - Supports Midtrans / Xendit webhook handling.
 * - Enforces server-side signature verification.
 * - Enforces idempotent processing of webhook events.
 */

export interface PaymentNotification {
	orderId: string;
	transactionId: string;
	amount: number;
	status: 'pending' | 'settlement' | 'expire' | 'cancel' | 'deny';
	signature: string;
	rawPayload: Record<string, unknown>;
}

export interface PaymentGatewayService {
	verifySignature(payload: Record<string, unknown>, signature: string): boolean;
	processWebhook(
		notification: PaymentNotification
	): Promise<{ processed: boolean; orderId: string }>;
}
