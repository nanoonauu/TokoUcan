import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { loginSchema } from '#lib/schemas/auth.js';

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user } = await locals.safeGetSession();
	const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';

	if (user) {
		throw redirect(303, redirectTo);
	}

	return { redirectTo };
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';

		const parseResult = loginSchema.safeParse({ email, password });
		if (!parseResult.success) {
			const errors = parseResult.error.flatten().fieldErrors;
			return fail(400, {
				errorMessage: 'Harap periksa form input Anda.',
				fieldErrors: errors,
				email: typeof email === 'string' ? email : ''
			});
		}

		const { error } = await locals.supabase.auth.signInWithPassword({
			email: parseResult.data.email,
			password: parseResult.data.password
		});

		if (error) {
			return fail(400, {
				errorMessage: error.message,
				fieldErrors: {} as Record<string, string[]>,
				email: parseResult.data.email
			});
		}

		throw redirect(303, redirectTo);
	}
};
