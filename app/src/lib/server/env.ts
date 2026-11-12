import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$app/env/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$app/env/private';

export interface EnvValidationResult {
	isConfigured: boolean;
	hasServiceRole: boolean;
	missingPublic: string[];
	missingPrivate: string[];
}

export function validateSupabaseEnv(): EnvValidationResult {
	const missingPublic: string[] = [];
	const missingPrivate: string[] = [];

	if (!PUBLIC_SUPABASE_URL) missingPublic.push('PUBLIC_SUPABASE_URL');
	if (!PUBLIC_SUPABASE_ANON_KEY) missingPublic.push('PUBLIC_SUPABASE_ANON_KEY');
	if (!SUPABASE_SERVICE_ROLE_KEY) missingPrivate.push('SUPABASE_SERVICE_ROLE_KEY');

	return {
		isConfigured: missingPublic.length === 0,
		hasServiceRole: missingPrivate.length === 0,
		missingPublic,
		missingPrivate
	};
}
