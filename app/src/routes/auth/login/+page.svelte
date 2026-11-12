<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Masuk — TokoUcan</title>
</svelte:head>

<section class="container mx-auto max-w-md px-4 py-12">
	<div class="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
		<div class="mb-6 text-center">
			<h1 class="text-2xl font-bold tracking-tight text-foreground">Masuk ke Akun Anda</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Akses dashboard TokoUcan dan kelola pesanan barang digital Anda
			</p>
		</div>

		{#if form?.errorMessage}
			<div
				class="mb-5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
				role="alert"
			>
				{form.errorMessage}
			</div>
		{/if}

		<form
			method="POST"
			action="?redirectTo={encodeURIComponent(data.redirectTo)}"
			class="space-y-4"
		>
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
				<div class="mb-1.5 flex items-center justify-between">
					<label for="password" class="block text-sm font-medium text-foreground">
						Kata Sandi
					</label>
					<a href="/auth/reset-password" class="text-xs text-primary hover:underline">
						Lupa sandi?
					</a>
				</div>
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					placeholder="••••••••"
				/>
				{#if form?.fieldErrors?.password}
					<p class="mt-1 text-xs text-destructive">{form.fieldErrors.password[0]}</p>
				{/if}
			</div>

			<Button type="submit" class="mt-2 w-full">Masuk</Button>
		</form>

		<div class="mt-6 text-center text-xs text-muted-foreground">
			Belum memiliki akun?
			<a href="/auth/register" class="ml-1 font-medium text-primary hover:underline">
				Daftar sekarang
			</a>
		</div>
	</div>
</section>
