import crypto from 'node:crypto';
import { CREDENTIAL_ENCRYPTION_KEY } from '$app/env/private';

/**
 * Module Boundary: Credential Encryption
 * Architecture design for Phase 2:
 * - Uses authenticated encryption (AES-256-GCM) with random 96-bit (12-byte) IV.
 * - Produces and verifies 128-bit (16-byte) authentication tags to guarantee integrity.
 * - Key material is kept strictly isolated from ciphertext storage.
 * - Plaintext accounts, licenses, and tokens are encrypted before inserting into vault_credentials.
 */

export interface EncryptedPayload {
	ciphertext: string;
	iv: string;
	tag: string;
	keyId?: string;
}

export interface CredentialEncryptor {
	encrypt(plainText: string, keyId?: string): Promise<EncryptedPayload>;
	decrypt(payload: EncryptedPayload): Promise<string>;
	encryptObject<T>(data: T, keyId?: string): Promise<EncryptedPayload>;
	decryptObject<T>(payload: EncryptedPayload): Promise<T>;
}

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12; // 96 bits recommended for AES-GCM
const AUTH_TAG_LENGTH_BYTES = 16; // 128 bits standard tag
const DEFAULT_KEY_ID = 'v1';

/**
 * Resolve master key from environment to a strict 32-byte (256-bit) Buffer.
 * Supports:
 * - 32-byte Buffer directly
 * - 64-character hex string
 * - 32-byte base64 encoded string
 * - 32-character UTF-8 raw string
 */
export function resolveEncryptionKey(rawKey?: string | Buffer): Buffer {
	if (rawKey instanceof Buffer) {
		if (rawKey.length === 32) {
			return rawKey;
		}
		throw new Error(
			`Invalid master encryption key length: Expected 32 bytes (256 bits), but got ${rawKey.length} bytes.`
		);
	}

	const keyStr = rawKey || CREDENTIAL_ENCRYPTION_KEY || process.env.CREDENTIAL_ENCRYPTION_KEY;

	if (!keyStr || typeof keyStr !== 'string') {
		throw new Error(
			'CREDENTIAL_ENCRYPTION_KEY is not defined. Ensure it is configured in server environment.'
		);
	}

	const trimmed = keyStr.trim();

	// Check if 64-char hex string (32 bytes)
	if (/^[0-9a-fA-F]{64}$/.test(trimmed)) {
		return Buffer.from(trimmed, 'hex');
	}

	// Check if base64 string decoding to 32 bytes
	if (/^[A-Za-z0-9+/=]+$/.test(trimmed)) {
		const base64Buf = Buffer.from(trimmed, 'base64');
		if (base64Buf.length === 32) {
			return base64Buf;
		}
	}

	// Fallback to UTF-8 buffer
	const utf8Buf = Buffer.from(trimmed, 'utf8');
	if (utf8Buf.length === 32) {
		return utf8Buf;
	}

	throw new Error(
		`Invalid master encryption key length: Expected 32 bytes (256 bits), but got ${utf8Buf.length} bytes.`
	);
}

/**
 * Encrypt a plaintext string using AES-256-GCM with a random 96-bit IV.
 */
export async function encryptCredential(
	plainText: string,
	keyId: string = DEFAULT_KEY_ID,
	customKey?: string | Buffer
): Promise<EncryptedPayload> {
	if (typeof plainText !== 'string' || plainText.length === 0) {
		throw new Error('Encryption failed: plaintext cannot be empty.');
	}

	const key = resolveEncryptionKey(customKey);
	const iv = crypto.randomBytes(IV_LENGTH_BYTES);
	const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

	let ciphertext = cipher.update(plainText, 'utf8', 'hex');
	ciphertext += cipher.final('hex');

	const tag = cipher.getAuthTag();

	return {
		ciphertext,
		iv: iv.toString('hex'),
		tag: tag.toString('hex'),
		keyId
	};
}

/**
 * Decrypt an EncryptedPayload back to original plaintext string with authentication verification.
 */
export async function decryptCredential(
	payload: EncryptedPayload,
	customKey?: string | Buffer
): Promise<string> {
	if (!payload || !payload.ciphertext || !payload.iv || !payload.tag) {
		throw new Error('Decryption failed: payload must contain ciphertext, iv, and tag.');
	}

	const ivBuf = Buffer.from(payload.iv, 'hex');
	if (ivBuf.length !== IV_LENGTH_BYTES) {
		throw new Error(
			`Decryption failed: invalid IV length (${ivBuf.length} bytes, expected ${IV_LENGTH_BYTES}).`
		);
	}

	const tagBuf = Buffer.from(payload.tag, 'hex');
	if (tagBuf.length !== AUTH_TAG_LENGTH_BYTES) {
		throw new Error(
			`Decryption failed: invalid tag length (${tagBuf.length} bytes, expected ${AUTH_TAG_LENGTH_BYTES}).`
		);
	}

	const key = resolveEncryptionKey(customKey);

	try {
		const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuf);
		decipher.setAuthTag(tagBuf);

		let decrypted = decipher.update(payload.ciphertext, 'hex', 'utf8');
		decrypted += decipher.final('utf8');

		return decrypted;
	} catch (err) {
		throw new Error(
			`Decryption failed: auth tag mismatch or corrupted ciphertext. (${(err as Error).message})`,
			{ cause: err }
		);
	}
}

/**
 * Encrypt any JSON-serializable object.
 */
export async function encryptCredentialObject<T>(
	data: T,
	keyId: string = DEFAULT_KEY_ID,
	customKey?: string | Buffer
): Promise<EncryptedPayload> {
	const jsonStr = JSON.stringify(data);
	return encryptCredential(jsonStr, keyId, customKey);
}

/**
 * Decrypt an EncryptedPayload and parse as JSON object.
 */
export async function decryptCredentialObject<T>(
	payload: EncryptedPayload,
	customKey?: string | Buffer
): Promise<T> {
	const jsonStr = await decryptCredential(payload, customKey);
	return JSON.parse(jsonStr) as T;
}

/**
 * Standard implementation of CredentialEncryptor interface
 */
export class AesGcmCredentialEncryptor implements CredentialEncryptor {
	constructor(private readonly defaultKeyId: string = DEFAULT_KEY_ID) {}

	async encrypt(plainText: string, keyId?: string): Promise<EncryptedPayload> {
		return encryptCredential(plainText, keyId ?? this.defaultKeyId);
	}

	async decrypt(payload: EncryptedPayload): Promise<string> {
		return decryptCredential(payload);
	}

	async encryptObject<T>(data: T, keyId?: string): Promise<EncryptedPayload> {
		return encryptCredentialObject(data, keyId ?? this.defaultKeyId);
	}

	async decryptObject<T>(payload: EncryptedPayload): Promise<T> {
		return decryptCredentialObject<T>(payload);
	}
}

export const credentialEncryptor = new AesGcmCredentialEncryptor();
