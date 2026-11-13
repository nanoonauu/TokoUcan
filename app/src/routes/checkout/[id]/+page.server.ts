import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { paymentGatewayService } from '#lib/server/modules/payment.js';
import { deliveryService } from '#lib/server/modules/delivery.js';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, `/auth/login?redirectTo=/checkout/${params.id}`);
	}

	const { data: order, error: orderError } = await locals.supabase
		.from('orders')
		.select('*, order_items(*)')
		.eq('id', params.id)
		.maybeSingle();

	if (orderError || !order) {
		throw error(404, 'Pesanan tidak ditemukan.');
	}

	if (order.buyer_id !== user.id) {
		throw error(403, 'Akses ditolak: Anda bukan pemilik pesanan ini.');
	}

	// Fetch delivered vault credentials if order is paid
	let deliveredCredentials: Array<{
		id: string;
		label: string | null;
		credential_type: string;
		status: string;
		delivered_at: string | null;
		purge_at: string | null;
	}> = [];

	if (order.status === 'paid') {
		const { data: vaultItems } = await locals.supabase
			.from('vault_credentials')
			.select('id, label, credential_type, status, delivered_at, purge_at')
			.eq('order_id', order.id);

		if (vaultItems) {
			deliveredCredentials = vaultItems;
		}
	}

	return {
		user,
		order,
		deliveredCredentials
	};
};

export const actions: Actions = {
	payMock: async ({ params, locals }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/checkout/${params.id}`);
		}

		const { data: order, error: orderError } = await locals.supabase
			.from('orders')
			.select('id, buyer_id, total_amount, status')
			.eq('id', params.id)
			.maybeSingle();

		if (orderError || !order) {
			return fail(404, { error: 'Pesanan tidak ditemukan.' });
		}

		if (order.buyer_id !== user.id) {
			return fail(403, { error: 'Akses ditolak.' });
		}

		try {
			const result = await paymentGatewayService.processWebhook({
				orderId: order.id,
				transactionId: `mock_tx_${Date.now()}`,
				amount: order.total_amount,
				status: 'settlement',
				signature: 'mock_simulated_sig',
				rawPayload: {
					payment_type: 'mock_simulated',
					simulated_by: user.email,
					timestamp: new Date().toISOString()
				}
			});

			return {
				success: true,
				result
			};
		} catch (err) {
			return fail(500, {
				error: (err as Error).message || 'Gagal memproses simulasi pembayaran.'
			});
		}
	},

	revealSecret: async ({ params, locals, getClientAddress, request }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(303, `/auth/login?redirectTo=/checkout/${params.id}`);
		}

		const clientIp = getClientAddress();
		const userAgent = request.headers.get('user-agent') || 'unknown';

		try {
			const decryptedItems = await deliveryService.getDecryptedOrderCredentials(
				params.id,
				user.id,
				clientIp,
				userAgent
			);

			return {
				revealed: true,
				secrets: decryptedItems
			};
		} catch (err) {
			return fail(500, {
				error: (err as Error).message || 'Gagal mendekripsi kredensial vault.'
			});
		}
	}
};
