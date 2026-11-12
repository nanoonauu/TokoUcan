/**
 * Module Boundary: Automated Delivery
 * Architecture design for Phase 2:
 * - Allocates available inventory inside a database transaction with row-level locking.
 * - Associates delivery with buyer and encrypts credential payload.
 * - Sets delivered_at and schedules purge_at (delivered_at + 30 days).
 */

export interface DeliveryRecord {
	id: string;
	orderId: string;
	buyerId: string;
	inventoryId: string;
	deliveredAt: Date;
	purgeAt: Date;
}

export interface DeliveryService {
	allocateAndDeliver(orderId: string, buyerId: string, productId: string): Promise<DeliveryRecord>;
}
