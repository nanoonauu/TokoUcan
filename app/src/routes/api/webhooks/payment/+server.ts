import { json, type RequestHandler } from '@sveltejs/kit';
import { paymentGatewayService, type PaymentNotification } from '#lib/server/modules/payment.js';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const payload = (await request.json()) as Record<string, unknown>;

		const orderId = (payload.order_id || payload.orderId) as string;
		const transactionId = (payload.transaction_id ||
			payload.transactionId ||
			`tx_${Date.now()}`) as string;
		const transactionStatus = (payload.transaction_status || payload.status) as string;
		const fraudStatus = (payload.fraud_status as string) || 'accept';
		const signatureKey = (payload.signature_key || payload.signature) as string;
		const statusCode = (payload.status_code as string) || '200';
		const grossAmount = (payload.gross_amount as string) || String(payload.amount || '');

		if (!orderId) {
			return json({ error: 'Missing required field: order_id' }, { status: 400 });
		}

		// Verify Midtrans signature if signatureKey is present and not an explicit mock call
		if (signatureKey && !payload.mock && statusCode && grossAmount) {
			const isValid = paymentGatewayService.verifyMidtransSignature(
				orderId,
				statusCode,
				grossAmount,
				signatureKey
			);

			if (!isValid) {
				return json({ error: 'Invalid webhook signature.' }, { status: 401 });
			}
		}

		// Map status to PaymentNotification status
		let normalizedStatus: PaymentNotification['status'] = 'pending';

		if (
			transactionStatus === 'settlement' ||
			(transactionStatus === 'capture' && fraudStatus === 'accept')
		) {
			normalizedStatus = 'settlement';
		} else if (transactionStatus === 'cancel') {
			normalizedStatus = 'cancel';
		} else if (transactionStatus === 'expire') {
			normalizedStatus = 'expire';
		} else if (transactionStatus === 'deny') {
			normalizedStatus = 'deny';
		}

		const notification: PaymentNotification = {
			orderId,
			transactionId,
			amount: Math.round(Number(grossAmount) || 0),
			status: normalizedStatus,
			signature: signatureKey || 'mock-signature',
			rawPayload: payload
		};

		const result = await paymentGatewayService.processWebhook(notification);

		return json({
			success: true,
			data: result
		});
	} catch (err) {
		const errorMessage = (err as Error).message;
		return json(
			{
				success: false,
				error: errorMessage
			},
			{ status: 500 }
		);
	}
};
