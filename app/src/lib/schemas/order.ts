import { z } from 'zod';

export const orderStatusSchema = z.enum([
	'pending',
	'processing',
	'paid',
	'cancelled',
	'expired',
	'failed'
]);

export const paymentGatewaySchema = z.enum(['mock', 'midtrans', 'xendit', 'qris']);

export const checkoutPayloadSchema = z.object({
	productId: z.string().uuid({ message: 'ID produk tidak valid' }),
	quantity: z
		.number()
		.int()
		.min(1, { message: 'Jumlah minimal 1 unit' })
		.max(10, { message: 'Jumlah maksimal 10 unit per transaksi' })
		.default(1),
	paymentGateway: paymentGatewaySchema.default('mock')
});

export const orderItemSchema = z.object({
	id: z.string().uuid(),
	order_id: z.string().uuid(),
	product_id: z.string().uuid(),
	quantity: z.number().int().min(1).max(10),
	price_at_purchase: z.number().int().min(1000),
	product_title: z.string().min(1),
	created_at: z.string()
});

export const orderSchema = z.object({
	id: z.string().uuid(),
	order_number: z.string().min(8),
	buyer_id: z.string().uuid(),
	status: orderStatusSchema,
	total_amount: z.number().int().min(1000),
	payment_gateway: paymentGatewaySchema,
	payment_method: z.string().nullable().optional(),
	payment_ref: z.string().nullable().optional(),
	paid_at: z.string().nullable().optional(),
	cancelled_at: z.string().nullable().optional(),
	expires_at: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	order_items: z.array(orderItemSchema).optional()
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentGateway = z.infer<typeof paymentGatewaySchema>;
export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
