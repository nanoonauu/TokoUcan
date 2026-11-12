import type { SupabaseClient } from '@supabase/supabase-js';

export type UserRole = 'buyer' | 'admin';

export interface UserRoleRecord {
	id: string;
	user_id: string;
	role: UserRole;
	created_at: string;
}

/**
 * Retrieves the roles assigned to a user from the trusted user_roles table.
 * Never trust user_metadata for role authorization.
 */
export async function getUserRoles(supabase: SupabaseClient, userId: string): Promise<UserRole[]> {
	const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', userId);

	if (error || !data) {
		return [];
	}

	return data.map((r: { role: string }) => r.role as UserRole);
}

/**
 * Checks whether the user possesses the admin role.
 */
export async function isUserAdmin(supabase: SupabaseClient, userId: string): Promise<boolean> {
	const roles = await getUserRoles(supabase, userId);
	return roles.includes('admin');
}
