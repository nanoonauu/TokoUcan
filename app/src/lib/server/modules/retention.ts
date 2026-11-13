import { getSupabaseAdmin } from '../supabase-admin.js';

/**
 * Module Boundary: 30-Day Sensitive Data Retention & Soft-Delete Purge
 * Architecture design for Phase 2:
 * - Runs as a scheduled task / cron worker or on-demand retention trigger.
 * - Targets delivered secrets where purge_at <= now().
 * - Permanently shreds ciphertext, IV, and auth tag (cryptographic zeroing).
 * - Leaves non-sensitive order and transaction metadata intact for compliance and audit.
 */

export interface PurgeResult {
	purgedCount: number;
	timestamp: Date;
	errorCount: number;
	purgedIds: string[];
}

export interface RetentionWorker {
	executePurgeJob(): Promise<PurgeResult>;
	getUpcomingPurgeCount(hoursAhead?: number): Promise<number>;
}

export class DefaultRetentionWorker implements RetentionWorker {
	/**
	 * Execute the 30-day soft-delete purge job.
	 * Invokes Postgres stored procedure soft_delete_expired_vault_credentials().
	 */
	async executePurgeJob(): Promise<PurgeResult> {
		const supabase = getSupabaseAdmin();
		const timestamp = new Date();

		try {
			const { data, error } = await supabase.rpc('soft_delete_expired_vault_credentials');

			if (error) {
				throw new Error(`Retention purge RPC execution failed: ${error.message}`);
			}

			const purgedRows = Array.isArray(data) ? data : [];
			const purgedIds: string[] = purgedRows.map((row: { purged_id: string }) => row.purged_id);
			const purgedCount = purgedIds.length;

			// If any credentials were shredded, log an immutable audit trail
			if (purgedCount > 0) {
				await supabase.from('audit_logs').insert({
					actor_id: null,
					actor_role: 'system',
					action: 'retention.purged_expired_credentials',
					resource_type: 'vault_credentials',
					resource_id: 'batch',
					details: {
						purged_count: purgedCount,
						purged_ids: purgedIds,
						executed_at: timestamp.toISOString()
					}
				});
			}

			return {
				purgedCount,
				timestamp,
				errorCount: 0,
				purgedIds
			};
		} catch (err) {
			const errorMsg = (err as Error).message;

			// Log failure in audit_logs
			await supabase.from('audit_logs').insert({
				actor_id: null,
				actor_role: 'system',
				action: 'retention.purge_failed',
				resource_type: 'vault_credentials',
				resource_id: 'batch',
				details: {
					error: errorMsg,
					attempted_at: timestamp.toISOString()
				}
			});

			return {
				purgedCount: 0,
				timestamp,
				errorCount: 1,
				purgedIds: []
			};
		}
	}

	/**
	 * Query count of credentials nearing the 30-day purge threshold.
	 */
	async getUpcomingPurgeCount(hoursAhead: number = 24): Promise<number> {
		const supabase = getSupabaseAdmin();
		const threshold = new Date(Date.now() + hoursAhead * 60 * 60 * 1000).toISOString();

		const { count, error } = await supabase
			.from('vault_credentials')
			.select('id', { count: 'exact', head: true })
			.eq('status', 'delivered')
			.is('deleted_at', null)
			.lte('purge_at', threshold);

		if (error) {
			throw new Error(`Failed to query upcoming purges: ${error.message}`);
		}

		return count ?? 0;
	}
}

export const retentionWorker = new DefaultRetentionWorker();
