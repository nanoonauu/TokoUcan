import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getProductBySlug } from '#lib/server/catalog.js';

export const load: PageServerLoad = async ({ locals, params }) => {
	const product = await getProductBySlug(locals.supabase, params.slug);

	if (!product) {
		throw error(404, {
			message: 'Produk digital tidak ditemukan atau belum dipublikasikan.'
		});
	}

	return {
		product
	};
};
