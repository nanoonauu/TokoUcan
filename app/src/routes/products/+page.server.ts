import type { PageServerLoad } from './$types';
import { getActiveCategories, getPublishedProducts } from '#lib/server/catalog.js';
import { catalogQuerySchema } from '#lib/schemas/catalog.js';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rawParams = {
		category: url.searchParams.get('category') || undefined,
		search: url.searchParams.get('search') || undefined,
		sort: url.searchParams.get('sort') || 'newest',
		page: url.searchParams.get('page') || 1,
		limit: url.searchParams.get('limit') || 12
	};

	const query = catalogQuerySchema.parse(rawParams);

	return {
		query,
		streamed: {
			categories: getActiveCategories(locals.supabase),
			catalogResult: getPublishedProducts(locals.supabase, query)
		}
	};
};
