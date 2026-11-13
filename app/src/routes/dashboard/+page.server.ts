import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserRoles } from '#lib/server/auth/roles.js';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();

	if (!user) {
		throw redirect(303, '/auth/login?redirectTo=/dashboard');
	}

	const { data: profile } = await locals.supabase
		.from('profiles')
		.select('*')
		.eq('id', user.id)
		.maybeSingle();

	const roles = await getUserRoles(locals.supabase, user.id);

	// Fetch user's orders with items
	const { data: orders } = await locals.supabase
		.from('orders')
		.select('*, order_items(*)')
		.order('created_at', { ascending: false });

	// Fetch delivered or purged vault credentials
	const { data: vaultCredentials } = await locals.supabase
		.from('vault_credentials')
		.select(
			'id, product_id, order_id, credential_type, label, status, delivered_at, purge_at, purged_at'
		)
		.order('delivered_at', { ascending: false, nullsFirst: false });

	return {
		user,
		profile,
		roles,
		orders: orders || [],
		vaultCredentials: vaultCredentials || []
	};
};
