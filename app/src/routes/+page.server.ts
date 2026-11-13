import type { PageServerLoad } from './$types';
import { getActiveCategories, getPublishedProducts } from '#lib/server/catalog.js';

export const load: PageServerLoad = async ({ locals }) => {
	return {
		streamed: {
			categories: getActiveCategories(locals.supabase),
			featuredProducts: getPublishedProducts(locals.supabase, {
				limit: 6,
				sort: 'newest',
				page: 1
			}).then((r) => r.products)
		}
	};
};
