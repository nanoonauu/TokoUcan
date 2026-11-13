import { z } from 'zod';

export const productStatusSchema = z.enum(['draft', 'published', 'archived']);

export const categorySchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(2, { message: 'Nama kategori minimal 2 karakter' }),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug kategori tidak valid' }),
	description: z.string().nullable().optional(),
	icon: z.string().nullable().optional(),
	sort_order: z.number().int().default(0),
	is_active: z.boolean().default(true),
	created_at: z.string(),
	updated_at: z.string(),
	product_count: z.number().int().optional()
});

export const productSchema = z.object({
	id: z.string().uuid(),
	category_id: z.string().uuid(),
	title: z.string().min(3, { message: 'Judul produk minimal 3 karakter' }),
	slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug produk tidak valid' }),
	description: z.string().min(10, { message: 'Deskripsi minimal 10 karakter' }),
	price: z.number().int().min(1000, { message: 'Harga minimal Rp 1.000' }),
	status: productStatusSchema,
	transfer_terms: z.string().min(10),
	retention_notice: z.string().min(10),
	created_at: z.string(),
	updated_at: z.string(),
	category: categorySchema.optional()
});

export const catalogQuerySchema = z.object({
	category: z.string().optional(),
	search: z.string().optional(),
	sort: z.enum(['newest', 'price-asc', 'price-desc']).default('newest'),
	min_price: z.coerce.number().int().min(0).optional(),
	max_price: z.coerce.number().int().min(0).optional(),
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(50).default(12)
});

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductStatus = z.infer<typeof productStatusSchema>;
export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
