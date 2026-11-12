import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$app/env/public';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, fetch }) => {
	depends('supabase:auth');

	const supabaseUrl = PUBLIC_SUPABASE_URL || '';
	const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY || '';

	const supabase = isBrowser()
		? createBrowserClient(supabaseUrl, supabaseAnonKey)
		: createServerClient(supabaseUrl, supabaseAnonKey, {
				global: { fetch },
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	return {
		...data,
		supabase,
		session: session ?? data.session,
		user: user ?? data.user
	};
};
