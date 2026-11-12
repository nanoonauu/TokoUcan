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

	return {
		user,
		profile,
		roles
	};
};
