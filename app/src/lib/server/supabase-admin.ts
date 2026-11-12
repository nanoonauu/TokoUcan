import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL } from '$app/env/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$app/env/private';

let adminClient: SupabaseClient | null = null;

/**
 * Server-only privileged Supabase client with service-role key.
 * Never import or invoke this in client-side code.
 */
export function getSupabaseAdmin(): SupabaseClient {
	if (!PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
		throw new Error(
			'Admin client creation failed: PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not defined.'
		);
	}

	if (!adminClient) {
		adminClient = createClient(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
			auth: {
				autoRefreshToken: false,
				persistSession: false
			}
		});
	}

	return adminClient;
}
