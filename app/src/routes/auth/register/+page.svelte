<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';

	let { form } = $props();
</script>

<svelte:head>
	<title>Daftar Akun — TokoUcan</title>
</svelte:head>

<section class="container mx-auto max-w-md px-4 py-12">
	<div class="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
		<div class="mb-6 text-center">
			<h1 class="text-2xl font-bold tracking-tight text-foreground">Buat Akun Baru</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Daftar untuk membeli dan mengelola produk digital dengan aman
			</p>
		</div>

		{#if form?.success}
			<div class="rounded-lg border border-primary/20 bg-primary/10 p-4 text-center">
				<h2 class="mb-1 font-semibold text-primary">Pendaftaran Berhasil</h2>
				<p class="text-sm text-muted-foreground">
					Tautan konfirmasi telah dikirim ke <span class="font-medium text-foreground"
						>{form.email}</span
					>. Silakan periksa inbox Anda untuk mengaktifkan akun.
				</p>
				<div class="mt-4">
					<a href="/auth/login">
						<Button variant="outline" size="sm">Menuju Halaman Masuk</Button>
					</a>
				</div>
			</div>
		{:else}
			{#if form?.errorMessage}
				<div
					class="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
					role="alert"
				>
					{form.errorMessage}
				</div>
			{/if}

			<form method="POST" class="space-y-4">
				<div>
					<label for="displayName" class="mb-1.5 block text-sm font-medium text-foreground">
						Nama Tampilan
					</label>
					<input
						id="displayName"
						name="displayName"
						type="text"
						required
						value={form?.displayName ?? ''}
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						placeholder="Contoh: Budi Santoso"
					/>
					{#if form?.fieldErrors?.displayName}
						<p class="mt-1 text-xs text-destructive">{form.fieldErrors.displayName[0]}</p>
					{/if}
				</div>

				<div>
					<label for="email" class="mb-1.5 block text-sm font-medium text-foreground">
						Alamat Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						value={form?.email ?? ''}
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						placeholder="nama@email.com"
					/>
					{#if form?.fieldErrors?.email}
						<p class="mt-1 text-xs text-destructive">{form.fieldErrors.email[0]}</p>
					{/if}
				</div>

				<div>
					<label for="password" class="mb-1.5 block text-sm font-medium text-foreground">
						Kata Sandi (Min. 8 karakter)
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="new-password"
						required
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						placeholder="••••••••"
					/>
					{#if form?.fieldErrors?.password}
						<p class="mt-1 text-xs text-destructive">{form.fieldErrors.password[0]}</p>
					{/if}
				</div>

				<div>
					<label for="confirmPassword" class="mb-1.5 block text-sm font-medium text-foreground">
						Konfirmasi Kata Sandi
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autocomplete="new-password"
						required
						class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						placeholder="••••••••"
					/>
					{#if form?.fieldErrors?.confirmPassword}
						<p class="mt-1 text-xs text-destructive">{form.fieldErrors.confirmPassword[0]}</p>
					{/if}
				</div>

				<Button type="submit" class="mt-2 w-full">Daftar Akun</Button>
			</form>

			<div class="mt-6 text-center text-xs text-muted-foreground">
				Sudah memiliki akun?
				<a href="/auth/login" class="ml-1 font-medium text-primary hover:underline">
					Masuk di sini
				</a>
			</div>
		{/if}
	</div>
</section>
