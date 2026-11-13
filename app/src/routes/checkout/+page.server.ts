import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { checkoutPayloadSchema } from '#lib/schemas/order.js';
import { deliveryService } from '#lib/server/modules/delivery.js';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();

	const productId = url.searchParams.get('productId') || url.searchParams.get('product');

	if (!productId) {
		throw redirect(303, '/products');
	}

	if (!user) {
		throw redirect(303, `/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
	}

	const { data: product, error: prodError } = await locals.supabase
		.from('products')
		.select('*, category:categories(*)')
		.eq('id', productId)
		.eq('status', 'published')
		.maybeSingle();

	if (prodError || !product) {
		throw error(404, 'Produk tidak ditemukan atau tidak aktif.');
	}

	const availableStock = await deliveryService.getAvailableStockCount(product.id);

	return {
		user,
		product,
		availableStock
	};
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const { user } = await locals.safeGetSession();

		if (!user) {
			throw redirect(
				303,
				`/auth/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`
			);
		}

		const formData = await request.formData();
		const rawProductId = formData.get('productId');
		const rawQuantity = Number(formData.get('quantity') || 1);
		const rawGateway = formData.get('paymentGateway') || 'mock';

		const parseResult = checkoutPayloadSchema.safeParse({
			productId: rawProductId,
			quantity: rawQuantity,
			paymentGateway: rawGateway
		});

		if (!parseResult.success) {
			return fail(400, {
				error: parseResult.error.issues[0]?.message || 'Data transaksi tidak valid.'
			});
		}

		const { productId, quantity, paymentGateway } = parseResult.data;

		// Fetch product details
		const { data: product, error: prodError } = await locals.supabase
			.from('products')
			.select('id, title, price, status')
			.eq('id', productId)
			.eq('status', 'published')
			.maybeSingle();

		if (prodError || !product) {
			return fail(404, { error: 'Produk tidak ditemukan.' });
		}

		// Verify available stock
		const availableStock = await deliveryService.getAvailableStockCount(productId);
		if (availableStock < quantity) {
			return fail(400, {
				error: `Stok produk tidak mencukupi (tersedia: ${availableStock}, diminta: ${quantity}).`
			});
		}

		// Generate unique order number (e.g. ORD-M8XY12-7492)
		const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(
			1000 + Math.random() * 9000
		)}`;
		const totalAmount = product.price * quantity;

		// Insert order record
		const { data: order, error: orderInsertError } = await locals.supabase
			.from('orders')
			.insert({
				order_number: orderNumber,
				buyer_id: user.id,
				status: 'pending',
				total_amount: totalAmount,
				payment_gateway: paymentGateway,
				expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
			})
			.select('id, order_number')
			.single();

		if (orderInsertError || !order) {
			return fail(500, {
				error: `Gagal membuat pesanan: ${orderInsertError?.message || 'Database error'}`
			});
		}

		// Insert order item
		const { error: itemInsertError } = await locals.supabase.from('order_items').insert({
			order_id: order.id,
			product_id: product.id,
			quantity,
			price_at_purchase: product.price,
			product_title: product.title
		});

		if (itemInsertError) {
			return fail(500, {
				error: `Gagal mencatat rincian pesanan: ${itemInsertError.message}`
			});
		}

		// Audit log
		await locals.supabase.from('audit_logs').insert({
			actor_id: user.id,
			actor_role: 'buyer',
			action: 'order.created',
			resource_type: 'orders',
			resource_id: order.id,
			details: {
				order_number: order.order_number,
				product_id: product.id,
				quantity,
				total_amount: totalAmount
			}
		});

		throw redirect(303, `/checkout/${order.id}`);
	}
};
