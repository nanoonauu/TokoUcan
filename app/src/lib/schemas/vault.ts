import { z } from 'zod';

export const vaultStatusSchema = z.enum(['available', 'reserved', 'delivered', 'purged']);

export const credentialTypeSchema = z.enum(['account', 'license_key', 'token', 'other']);

export const vaultCredentialSchema = z.object({
	id: z.string().uuid(),
	product_id: z.string().uuid(),
	order_id: z.string().uuid().nullable().optional(),
	order_item_id: z.string().uuid().nullable().optional(),
	buyer_id: z.string().uuid().nullable().optional(),
	credential_type: credentialTypeSchema,
	label: z.string().nullable().optional(),
	ciphertext: z.string().nullable().optional(),
	iv: z.string().nullable().optional(),
	tag: z.string().nullable().optional(),
	key_id: z.string().default('v1'),
	status: vaultStatusSchema,
	delivered_at: z.string().nullable().optional(),
	purge_at: z.string().nullable().optional(),
	purged_at: z.string().nullable().optional(),
	deleted_at: z.string().nullable().optional(),
	created_at: z.string(),
	updated_at: z.string()
});

export const auditLogSchema = z.object({
	id: z.string().uuid(),
	actor_id: z.string().uuid().nullable().optional(),
	actor_role: z.string().default('buyer'),
	action: z.string().min(2),
	resource_type: z.string().min(2),
	resource_id: z.string(),
	ip_address: z.string().nullable().optional(),
	user_agent: z.string().nullable().optional(),
	details: z.record(z.string(), z.unknown()).default({}),
	created_at: z.string()
});

export type VaultStatus = z.infer<typeof vaultStatusSchema>;
export type CredentialType = z.infer<typeof credentialTypeSchema>;
export type VaultCredential = z.infer<typeof vaultCredentialSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;
