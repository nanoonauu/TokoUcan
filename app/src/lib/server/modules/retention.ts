/**
 * Module Boundary: 30-Day Sensitive Data Retention & Purge
 * Architecture design for Phase 2:
 * - Runs as a scheduled task / cron worker.
 * - Targets delivery secrets where purge_at <= current_timestamp.
 * - Permanently shreds ciphertext and associated DEK key material.
 * - Leaves non-sensitive order and transaction metadata intact for compliance and audit.
 */

export interface PurgeResult {
	purgedCount: number;
	timestamp: Date;
	errorCount: number;
}

export interface RetentionWorker {
	executePurgeJob(): Promise<PurgeResult>;
}
