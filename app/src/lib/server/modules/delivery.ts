import { getSupabaseAdmin } from '../supabase-admin.js';
import { decryptCredential } from './encryption.js';

/**
 * Module Boundary: Automated Delivery & Inventory Allocation
 * Architecture design for Phase 2:
 * - Allocates available inventory inside a database transaction with row-level locking (FOR UPDATE SKIP LOCKED).
 * - Prevents overselling or double-allocation race conditions during concurrent checkouts.
 * - Associates delivery with buyer, order, and order_item.
 * - Sets delivered_at and schedules purge_at (delivered_at + 30 days retention policy).
 * - Emits audit logs for traceability and compliance.
 */

export interface DeliveryRecord {
	id: string;
	orderId: string;
	buyerId: string;
	inventoryId: string;
	productId: string;
	orderItemId?: string | null;
	credentialType: string;
	label?: string | null;
	deliveredAt: Date;
	purgeAt: Date;
}

export interface OrderDeliveryResult {
	orderId: string;
	allocatedCount: number;
	orderStatus: string;
	records: DeliveryRecord[];
}

export interface DecryptedCredentialItem {
	id: string;
	productId: string;
	credentialType: string;
	label: string | null;
	secret: string;
	secretObject: Record<string, unknown> | null;
	deliveredAt: string | null;
	purgeAt: string | null;
}

export interface DeliveryService {
	allocateAndDeliver(
		orderId: string,
		buyerId: string,
		productId: string,
		orderItemId?: string,
		quantity?: number
	): Promise<DeliveryRecord[]>;
	allocateOrderInventory(orderId: string): Promise<OrderDeliveryResult>;
	getAvailableStockCount(productId: string): Promise<number>;
	getDecryptedOrderCredentials(
		orderId: string,
		buyerId: string,
		clientIp?: string,
		userAgent?: string
	): Promise<DecryptedCredentialItem[]>;
}

export class InstantDeliveryService implements DeliveryService {
	/**
	 * Get the real-time available stock count for a specific product.
	 */
	async getAvailableStockCount(productId: string): Promise<number> {
		const supabase = getSupabaseAdmin();
		const { count, error } = await supabase
			.from('vault_credentials')
			.select('id', { count: 'exact', head: true })
			.eq('product_id', productId)
			.eq('status', 'available')
			.is('deleted_at', null);

		if (error) {
			throw new Error(`Failed to check stock for product ${productId}: ${error.message}`);
		}

		return count ?? 0;
	}

	/**
	 * Atomically allocate single-item credentials using row-level locking.
	 */
	async allocateAndDeliver(
		orderId: string,
		buyerId: string,
		productId: string,
		orderItemId?: string,
		quantity: number = 1
	): Promise<DeliveryRecord[]> {
		if (quantity < 1) {
			throw new Error('Allocation quantity must be at least 1.');
		}

		const supabase = getSupabaseAdmin();

		const { data, error } = await supabase.rpc('allocate_vault_credentials', {
			p_order_id: orderId,
			p_order_item_id: orderItemId ?? null,
			p_buyer_id: buyerId,
			p_product_id: productId,
			p_quantity: quantity
		});

		if (error) {
			throw new Error(`Delivery allocation failed: ${error.message}`);
		}

		if (!data || !Array.isArray(data) || data.length < quantity) {
			throw new Error(
				`Insufficient inventory allocated. Expected ${quantity}, received ${data?.length ?? 0}.`
			);
		}

		return data.map((row) => ({
			id: row.id,
			orderId: row.order_id,
			buyerId: row.buyer_id,
			inventoryId: row.id,
			productId: row.product_id,
			orderItemId: row.order_item_id,
			credentialType: row.credential_type,
			label: row.label,
			deliveredAt: new Date(row.delivered_at),
			purgeAt: new Date(row.purge_at)
		}));
	}

	/**
	 * Atomically allocate all items in an order and mark order as paid.
	 * Executes under PostgreSQL FOR UPDATE SKIP LOCKED row-level locking.
	 */
	async allocateOrderInventory(orderId: string): Promise<OrderDeliveryResult> {
		const supabase = getSupabaseAdmin();

		const { data: rpcData, error: rpcError } = await supabase.rpc('allocate_order_inventory', {
			p_order_id: orderId
		});

		if (rpcError) {
			throw new Error(`Order allocation transaction failed: ${rpcError.message}`);
		}

		const allocationSummary = Array.isArray(rpcData) ? rpcData[0] : rpcData;
		const allocatedCount = allocationSummary?.allocated_count ?? 0;
		const orderStatus = allocationSummary?.order_status ?? 'paid';

		// Retrieve all allocated credentials for the order
		const { data: credentials, error: credError } = await supabase
			.from('vault_credentials')
			.select(
				'id, product_id, order_id, order_item_id, buyer_id, credential_type, label, delivered_at, purge_at'
			)
			.eq('order_id', orderId)
			.eq('status', 'delivered');

		if (credError) {
			throw new Error(`Failed to fetch allocated credentials: ${credError.message}`);
		}

		const records: DeliveryRecord[] = (credentials || []).map((row) => ({
			id: row.id,
			orderId: row.order_id,
			buyerId: row.buyer_id,
			inventoryId: row.id,
			productId: row.product_id,
			orderItemId: row.order_item_id,
			credentialType: row.credential_type,
			label: row.label,
			deliveredAt: new Date(row.delivered_at),
			purgeAt: new Date(row.purge_at)
		}));

		return {
			orderId,
			allocatedCount,
			orderStatus,
			records
		};
	}

	/**
	 * Decrypt delivered credentials on-demand for the authorized buyer.
	 * Writes an immutable audit log entry for the decryption event.
	 */
	async getDecryptedOrderCredentials(
		orderId: string,
		buyerId: string,
		clientIp?: string,
		userAgent?: string
	): Promise<DecryptedCredentialItem[]> {
		const supabase = getSupabaseAdmin();

		// Verify order ownership
		const { data: order, error: orderError } = await supabase
			.from('orders')
			.select('id, buyer_id, status')
			.eq('id', orderId)
			.maybeSingle();

		if (orderError || !order) {
			throw new Error('Order not found.');
		}

		if (order.buyer_id !== buyerId) {
			throw new Error('Unauthorized: You do not own this order.');
		}

		// Retrieve delivered vault items
		const { data: credentials, error: credError } = await supabase
			.from('vault_credentials')
			.select(
				'id, product_id, credential_type, label, ciphertext, iv, tag, key_id, status, delivered_at, purge_at'
			)
			.eq('order_id', orderId)
			.eq('buyer_id', buyerId)
			.eq('status', 'delivered')
			.is('deleted_at', null);

		if (credError) {
			throw new Error(`Failed to retrieve credentials: ${credError.message}`);
		}

		if (!credentials || credentials.length === 0) {
			return [];
		}

		const decryptedList: DecryptedCredentialItem[] = [];

		for (const row of credentials) {
			if (!row.ciphertext || !row.iv || !row.tag) {
				continue;
			}

			const plaintext = await decryptCredential({
				ciphertext: row.ciphertext,
				iv: row.iv,
				tag: row.tag,
				keyId: row.key_id
			});

			let parsedObject: Record<string, unknown> | null = null;
			try {
				parsedObject = JSON.parse(plaintext);
			} catch {
				// Non-JSON plaintext string, leave parsedObject as null
			}

			decryptedList.push({
				id: row.id,
				productId: row.product_id,
				credentialType: row.credential_type,
				label: row.label,
				secret: plaintext,
				secretObject: parsedObject,
				deliveredAt: row.delivered_at,
				purgeAt: row.purge_at
			});
		}

		// Record audit log for decryption access
		await supabase.from('audit_logs').insert({
			actor_id: buyerId,
			actor_role: 'buyer',
			action: 'vault.credential_decrypted_view',
			resource_type: 'orders',
			resource_id: orderId,
			ip_address: clientIp ?? null,
			user_agent: userAgent ?? null,
			details: {
				credentials_count: decryptedList.length,
				timestamp: new Date().toISOString()
			}
		});

		return decryptedList;
	}
}

export const deliveryService = new InstantDeliveryService();
