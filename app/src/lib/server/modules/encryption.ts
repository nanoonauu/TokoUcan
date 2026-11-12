/**
 * Module Boundary: Credential Encryption
 * Architecture design for Phase 2:
 * - Uses authenticated encryption (AES-256-GCM) with random 96-bit IV.
 * - Supports envelope encryption with unique data encryption keys (DEK) per delivery record.
 * - Key material is kept strictly isolated from ciphertext storage.
 */

export interface EncryptedPayload {
	ciphertext: string;
	iv: string;
	tag: string;
	keyId?: string;
}

export interface CredentialEncryptor {
	encrypt(plainText: string): Promise<EncryptedPayload>;
	decrypt(payload: EncryptedPayload): Promise<string>;
}
