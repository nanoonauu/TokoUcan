<script lang="ts">
	import { formatRupiah } from '#lib/utils.js';

	let { data } = $props();
	const product = $derived(data.product);
</script>

<svelte:head>
	<title>{product.title} — TokoUcan</title>
	<meta name="description" content={product.description} />
</svelte:head>

<div class="container mx-auto max-w-5xl px-4 py-10">
	<!-- Breadcrumbs -->
	<nav class="mb-6 flex items-center gap-2 text-xs text-muted-foreground" aria-label="Breadcrumb">
		<a href="/" class="transition hover:text-foreground">Beranda</a>
		<span>/</span>
		<a href="/products" class="transition hover:text-foreground">Katalog</a>
		<span>/</span>
		{#if product.category}
			<a href="/products?category={product.category.slug}" class="transition hover:text-foreground">
				{product.category.name}
			</a>
			<span>/</span>
		{/if}
		<span class="max-w-xs truncate font-medium text-foreground">{product.title}</span>
	</nav>

	<div class="grid gap-8 md:grid-cols-12">
		<!-- Main Content (Deskripsi & Kebijakan) -->
		<div class="space-y-6 md:col-span-7">
			<div>
				<div class="mb-2 flex items-center gap-2">
					<span class="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
						{product.category?.name ?? 'Kategori Digital'}
					</span>
					<span
						class="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400"
					>
						Terverifikasi &amp; Sah
					</span>
				</div>
				<h1 class="text-3xl font-extrabold tracking-tight text-foreground">
					{product.title}
				</h1>
			</div>

			<!-- Deskripsi Produk -->
			<section class="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 class="mb-3 text-base font-semibold text-foreground">Deskripsi Produk</h2>
				<div class="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
					{product.description}
				</div>
			</section>

			<!-- Ketentuan Pemindahtanganan & Legalitas -->
			<section class="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 class="mb-2 flex items-center gap-2 text-base font-semibold text-foreground">
					<svg
						class="size-4 shrink-0 text-emerald-500"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					Ketentuan Pemindahtanganan (Transferability)
				</h2>
				<p class="text-xs leading-relaxed text-muted-foreground">
					{product.transfer_terms}
				</p>
			</section>

			<!-- Pemberitahuan Retensi 30 Hari Wajib -->
			<section class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 shadow-sm">
				<h2
					class="mb-2 flex items-center gap-2 text-base font-semibold text-amber-900 dark:text-amber-200"
				>
					<svg
						class="size-4 shrink-0 text-amber-600 dark:text-amber-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					Pemberitahuan Retensi Kredensial 30 Hari
				</h2>
				<p class="text-xs leading-relaxed text-amber-900/90 dark:text-amber-200/90">
					{product.retention_notice}
				</p>
			</section>
		</div>

		<!-- Sidebar / CTA Pembelian -->
		<aside class="md:col-span-5">
			<div class="sticky top-24 space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm">
				<div>
					<span class="mb-1 block text-xs text-muted-foreground">Harga Beli Resmi</span>
					<div class="text-3xl font-extrabold text-foreground">
						{formatRupiah(product.price)}
					</div>
					<span class="mt-1 block text-[11px] text-muted-foreground">
						Termasuk garansi penyerahan sah &amp; pengiriman otomatis
					</span>
				</div>

				<div class="space-y-2 rounded-lg bg-muted/60 p-3.5 text-xs text-muted-foreground">
					<div class="flex items-center gap-2">
						<svg
							class="size-4 shrink-0 text-primary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						<span>Pengiriman otomatis instan pasca verifikasi bayar</span>
					</div>
					<div class="flex items-center gap-2">
						<svg
							class="size-4 shrink-0 text-primary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
							/>
						</svg>
						<span>Tersimpan di vault pribadi pembeli (AES-256)</span>
					</div>
				</div>

				<!-- Tombol Checkout -->
				<a
					href="/checkout?productId={product.id}"
					class="flex w-full items-center justify-center rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				>
					Beli Sekarang
				</a>

				<p class="text-center text-[11px] text-muted-foreground">
					Wajib memiliki akun TokoUcan sebelum checkout untuk pengamanan vault.
				</p>
			</div>
		</aside>
	</div>
</div>
