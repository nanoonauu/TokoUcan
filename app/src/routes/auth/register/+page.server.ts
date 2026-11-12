import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registerSchema } from '#lib/schemas/auth.js';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = await locals.safeGetSession();
	if (user) {
		throw redirect(303, '/dashboard');
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const displayName = formData.get('displayName');
		const email = formData.get('email');
		const password = formData.get('password');
		const confirmPassword = formData.get('confirmPassword');

		const parseResult = registerSchema.safeParse({
			displayName,
			email,
			password,
			confirmPassword
		});

		if (!parseResult.success) {
			const errors = parseResult.error.flatten().fieldErrors;
			return fail(400, {
				errorMessage: 'Harap periksa isian formulir pendaftaran.',
				fieldErrors: errors,
				displayName: typeof displayName === 'string' ? displayName : '',
				email: typeof email === 'string' ? email : '',
				success: false
			});
		}

		const { error } = await locals.supabase.auth.signUp({
			email: parseResult.data.email,
			password: parseResult.data.password,
			options: {
				data: {
					display_name: parseResult.data.displayName
				}
			}
		});

		if (error) {
			return fail(400, {
				errorMessage: error.message,
				fieldErrors: {} as Record<string, string[]>,
				displayName: parseResult.data.displayName,
				email: parseResult.data.email,
				success: false
			});
		}

		return {
			errorMessage: '',
			fieldErrors: {} as Record<string, string[]>,
			displayName: parseResult.data.displayName,
			email: parseResult.data.email,
			success: true
		};
	}
};
