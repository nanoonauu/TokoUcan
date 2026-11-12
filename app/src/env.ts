import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_SUPABASE_URL: { public: true, static: false },
	PUBLIC_SUPABASE_ANON_KEY: { public: true, static: false },
	SUPABASE_SERVICE_ROLE_KEY: { public: false, static: false },
	PAYMENT_SERVER_KEY: { public: false, static: false },
	CREDENTIAL_ENCRYPTION_KEY: { public: false, static: false }
});
