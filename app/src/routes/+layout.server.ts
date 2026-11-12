import type { LayoutServerLoad } from './$types';
import { validateSupabaseEnv } from '#lib/server/env.js';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const { session, user } = await locals.safeGetSession();
	const envValidation = validateSupabaseEnv();

	return {
		session,
		user,
		cookies: cookies.getAll(),
		envValidation
	};
};
