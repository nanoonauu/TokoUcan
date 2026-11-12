import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().trim().email({ message: 'Email tidak valid' }),
	password: z.string().min(6, { message: 'Password minimal 6 karakter' })
});

export const registerSchema = z
	.object({
		displayName: z
			.string()
			.trim()
			.min(2, { message: 'Nama tampilan minimal 2 karakter' })
			.max(50, { message: 'Nama tampilan maksimal 50 karakter' }),
		email: z.string().trim().email({ message: 'Email tidak valid' }),
		password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
		confirmPassword: z.string().min(8, { message: 'Konfirmasi password minimal 8 karakter' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password dan konfirmasi password tidak cocok',
		path: ['confirmPassword']
	});

export const resetPasswordSchema = z.object({
	email: z.string().trim().email({ message: 'Email tidak valid' })
});

export const updatePasswordSchema = z
	.object({
		password: z.string().min(8, { message: 'Password minimal 8 karakter' }),
		confirmPassword: z.string().min(8, { message: 'Konfirmasi password minimal 8 karakter' })
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Password dan konfirmasi password tidak cocok',
		path: ['confirmPassword']
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
