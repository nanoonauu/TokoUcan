import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { resetPasswordSchema } from '#lib/schemas/auth.js';

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		const parseResult = resetPasswordSchema.safeParse({ email });
		if (!parseResult.success) {
			return fail(400, {
				errorMessage: 'Harap masukkan alamat email yang valid.',
				email: typeof email === 'string' ? email : ''
			});
		}

		const redirectTo = `${url.origin}/auth/update-password`;
		const { error } = await locals.supabase.auth.resetPasswordForEmail(parseResult.data.email, {
			redirectTo
		});

		if (error) {
			return fail(400, {
				errorMessage: error.message,
				email: parseResult.data.email
			});
		}

		return {
			success: true,
			email: parseResult.data.email
		};
	}
};
