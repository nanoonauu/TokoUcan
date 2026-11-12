<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>TokoUcan — Marketplace Barang Digital Resmi</title>
</svelte:head>

<section class="container mx-auto max-w-4xl px-4 py-16 sm:py-24">
	<div class="space-y-4 text-center">
		<div
			class="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground"
		>
			<span class="inline-block size-2 rounded-full bg-emerald-500"></span>
			Phase 0: Project &amp; Backend Foundation
		</div>

		<h1 class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
			Marketplace Barang Digital Resmi &amp; Terpercaya
		</h1>

		<p class="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
			TokoUcan menyediakan akses terverifikasi untuk akun, lisensi, dan produk digital resmi dengan
			pengiriman otomatis dan vault terenkripsi beretensi 30 hari.
		</p>

		<div class="flex items-center justify-center gap-3 pt-4">
			<a href="/products">
				<Button size="lg">Jelajahi Katalog</Button>
			</a>
			{#if data.user}
				<a href="/dashboard">
					<Button variant="outline" size="lg">Dashboard</Button>
				</a>
			{:else}
				<a href="/auth/register">
					<Button variant="outline" size="lg">Daftar Akun</Button>
				</a>
			{/if}
		</div>
	</div>

	<!-- Status Arsitektur Card -->
	<div class="mt-16 rounded-xl border border-border bg-card p-6 shadow-sm">
		<h2 class="mb-4 text-lg font-semibold text-foreground">Status Fondasi Sistem (Phase 0)</h2>
		<div class="grid gap-4 text-sm sm:grid-cols-3">
			<div class="rounded-lg border border-border/60 bg-background/50 p-4">
				<p class="font-medium text-foreground">SvelteKit + SSR</p>
				<p class="mt-1 text-xs text-muted-foreground">
					TypeScript, Tailwind CSS v4, shadcn-svelte komponen aktif.
				</p>
			</div>
			<div class="rounded-lg border border-border/60 bg-background/50 p-4">
				<p class="font-medium text-foreground">Supabase SSR Auth</p>
				<p class="mt-1 text-xs text-muted-foreground">
					Validasi sesi server-side melalui cookie terenkripsi dan safeGetSession.
				</p>
			</div>
			<div class="rounded-lg border border-border/60 bg-background/50 p-4">
				<p class="font-medium text-foreground">RLS &amp; Migration</p>
				<p class="mt-1 text-xs text-muted-foreground">
					Skema tabel profiles &amp; user_roles dengan proteksi hak akses terisolasi.
				</p>
			</div>
		</div>
	</div>
</section>
