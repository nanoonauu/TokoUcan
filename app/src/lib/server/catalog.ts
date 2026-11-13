import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category, Product, CatalogQuery } from '#lib/schemas/catalog.js';

export interface CatalogResult {
	products: Product[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Fetch active categories sorted by sort_order.
 */
export async function getActiveCategories(supabase: SupabaseClient): Promise<Category[]> {
	try {
		const { data, error } = await supabase
			.from('categories')
			.select('*')
			.eq('is_active', true)
			.order('sort_order', { ascending: true });

		if (error || !data) {
			return [];
		}

		return data as Category[];
	} catch {
		return [];
	}
}

/**
 * Fetch published products with category details, search, filtering, and pagination.
 */
export async function getPublishedProducts(
	supabase: SupabaseClient,
	query: CatalogQuery
): Promise<CatalogResult> {
	const { category, search, sort = 'newest', page = 1, limit = 12 } = query;
	const from = (page - 1) * limit;
	const to = from + limit - 1;

	try {
		let categoryId: string | null = null;

		if (category) {
			const { data: catData } = await supabase
				.from('categories')
				.select('id')
				.eq('slug', category)
				.eq('is_active', true)
				.maybeSingle();

			categoryId = catData?.id ?? null;

			if (!categoryId) {
				return { products: [], total: 0, page, limit, totalPages: 0 };
			}
		}

		let dbQuery = supabase
			.from('products')
			.select('*, category:categories(*)', { count: 'exact' })
			.eq('status', 'published');

		if (categoryId) {
			dbQuery = dbQuery.eq('category_id', categoryId);
		}

		if (search && search.trim()) {
			dbQuery = dbQuery.ilike('title', `%${search.trim()}%`);
		}

		if (sort === 'price-asc') {
			dbQuery = dbQuery.order('price', { ascending: true });
		} else if (sort === 'price-desc') {
			dbQuery = dbQuery.order('price', { ascending: false });
		} else {
			dbQuery = dbQuery.order('created_at', { ascending: false });
		}

		const { data, count, error } = await dbQuery.range(from, to);

		if (error || !data) {
			return { products: [], total: 0, page, limit, totalPages: 0 };
		}

		const total = count ?? data.length;
		const totalPages = Math.ceil(total / limit);

		return {
			products: data as Product[],
			total,
			page,
			limit,
			totalPages
		};
	} catch {
		return { products: [], total: 0, page, limit, totalPages: 0 };
	}
}

/**
 * Fetch a single product by slug.
 */
export async function getProductBySlug(
	supabase: SupabaseClient,
	slug: string
): Promise<Product | null> {
	try {
		const { data, error } = await supabase
			.from('products')
			.select('*, category:categories(*)')
			.eq('slug', slug)
			.eq('status', 'published')
			.maybeSingle();

		if (error || !data) {
			return null;
		}

		return data as Product;
	} catch {
		return null;
	}
}
