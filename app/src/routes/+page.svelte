<script lang="ts">
	import ProductCard from '#lib/components/product-card.svelte';
	import ProductCardSkeleton from '#lib/components/product-card-skeleton.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>TokoUcan — Marketplace Barang Digital Resmi &amp; Terverifikasi</title>
	<meta
		name="description"
		content="Beli akun langganan resmi, lisensi software, dan aset digital sah dengan serah terima otomatis dan vault terenkripsi beretensi 30 hari."
	/>
</svelte:head>

<!-- Hero Section -->
<section
	class="relative overflow-hidden border-b border-border/60 bg-linear-to-b from-muted/30 via-background to-background py-16 sm:py-24"
>
	<div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
		<!-- Trust Badge Pill -->
		<div
			class="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1 text-xs font-medium text-foreground shadow-xs backdrop-blur"
		>
			<span class="size-2 animate-pulse rounded-full bg-emerald-500"></span>
			100% Produk Sah &amp; Bergaransi Serah Terima
		</div>

		<!-- Main Headline -->
		<h1 class="mt-5 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
			Marketplace Barang Digital <br class="hidden sm:inline" />
			<span class="text-primary">Resmi &amp; Terverifikasi</span>
		</h1>

		<!-- Subtitle -->
		<p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
			Beli akun langganan kerja, lisensi software, dan layanan cloud yang sah dipindahtangankan.
			Kredensial tersimpan di vault pribadi terenkripsi dengan proteksi retensi 30 hari.
		</p>

		<!-- Hero Search Form -->
		<div class="mx-auto mt-8 max-w-xl">
			<form
				action="/products"
				method="GET"
				role="search"
				class="flex items-center gap-2 rounded-xl border border-border bg-card p-2 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20"
			>
				<div class="relative flex-1">
					<label for="hero-search" class="sr-only">Cari produk digital</label>
					<svg
						class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						id="hero-search"
						type="search"
						name="search"
						placeholder="Cari produk: Office 365, Canva Pro, JetBrains..."
						class="h-10 w-full rounded-lg bg-transparent pr-3 pl-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
					/>
				</div>
				<Button type="submit" size="default" class="h-10 shrink-0 px-5 font-medium">
					Cari Produk
				</Button>
			</form>

			<!-- Quick Keyword Suggestions -->
			<div
				class="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground"
			>
				<span class="font-medium text-foreground/80">Populer:</span>
				<a
					href="/products?search=Office"
					class="rounded bg-muted px-2 py-0.5 transition-colors hover:text-foreground">Office 365</a
				>
				<a
					href="/products?search=Canva"
					class="rounded bg-muted px-2 py-0.5 transition-colors hover:text-foreground">Canva Pro</a
				>
				<a
					href="/products?search=JetBrains"
					class="rounded bg-muted px-2 py-0.5 transition-colors hover:text-foreground">JetBrains</a
				>
				<a
					href="/products?category=software-os"
					class="rounded bg-muted px-2 py-0.5 transition-colors hover:text-foreground"
					>Software OS</a
				>
			</div>
		</div>

		<!-- 4 Value Pillars -->
		<ul class="mt-14 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
			<li class="rounded-xl border border-border/80 bg-card/60 p-4 shadow-2xs backdrop-blur-xs">
				<div
					class="mb-2.5 flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
				>
					<svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
				</div>
				<h2 class="text-xs font-semibold text-foreground">100% Sah &amp; Legal</h2>
				<p class="mt-1 text-[11px] leading-relaxed text-muted-foreground">
					Sesuai ketentuan transferability penyedia resmi.
				</p>
			</li>

			<li class="rounded-xl border border-border/80 bg-card/60 p-4 shadow-2xs backdrop-blur-xs">
				<div
					class="mb-2.5 flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400"
				>
					<svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 10V3L4 14h7v7l9-11h-7z"
						/>
					</svg>
				</div>
				<h2 class="text-xs font-semibold text-foreground">Serah Terima Instan</h2>
				<p class="mt-1 text-[11px] leading-relaxed text-muted-foreground">
					Alokasi stok otomatis tepat setelah verifikasi bayar.
				</p>
			</li>

			<li class="rounded-xl border border-border/80 bg-card/60 p-4 shadow-2xs backdrop-blur-xs">
				<div
					class="mb-2.5 flex size-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400"
				>
					<svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
				</div>
				<h2 class="text-xs font-semibold text-foreground">Vault Terenkripsi</h2>
				<p class="mt-1 text-[11px] leading-relaxed text-muted-foreground">
					Kredensial disimpan aman dengan enkripsi AES-256.
				</p>
			</li>

			<li class="rounded-xl border border-border/80 bg-card/60 p-4 shadow-2xs backdrop-blur-xs">
				<div
					class="mb-2.5 flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400"
				>
					<svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h2 class="text-xs font-semibold text-foreground">Retensi 30 Hari</h2>
				<p class="mt-1 text-[11px] leading-relaxed text-muted-foreground">
					Pemusnahan permanen data sensitif demi privasi Anda.
				</p>
			</li>
		</ul>
	</div>
</section>

<!-- Category Showcase Grid -->
<section class="border-b border-border/60 py-14 sm:py-16">
	<div class="container mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<h2 class="text-2xl font-bold tracking-tight text-foreground">
					Jelajahi Berdasarkan Kategori
				</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					Koleksi produk digital terstruktur untuk kebutuhan kerja, desain, dan pengembangan.
				</p>
			</div>
			<a href="/products" class="text-xs font-semibold text-primary hover:underline">
				Lihat Semua Kategori &rarr;
			</a>
		</div>

		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#await data.streamed.categories}
				{#each Array.from({ length: 4 }, (_, i) => i) as skIdx (skIdx)}
					<div class="rounded-xl border border-border bg-card p-5 shadow-2xs">
						<div class="mb-3 h-10 w-10 animate-pulse rounded-lg bg-muted"></div>
						<div class="mb-2 h-4 w-32 animate-pulse rounded bg-muted"></div>
						<div class="h-3 w-full animate-pulse rounded bg-muted"></div>
						<div class="mt-1 h-3 w-3/4 animate-pulse rounded bg-muted"></div>
						<div class="mt-4 h-3 w-20 animate-pulse rounded bg-muted"></div>
					</div>
				{/each}
			{:then categories}
				{#each categories as category (category.id)}
					<a
						href="/products?category={category.slug}"
						class="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
					>
						<div>
							<div
								class="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
							>
								<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
									/>
								</svg>
							</div>
							<h3
								class="text-sm font-semibold text-foreground transition-colors group-hover:text-primary"
							>
								{category.name}
							</h3>
							<p class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
								{category.description ?? 'Pilihan produk digital terverifikasi dalam kategori ini.'}
							</p>
						</div>

						<div class="mt-4 flex items-center text-xs font-medium text-primary">
							<span>Buka Kategori</span>
							<svg
								class="ml-1 size-3.5 transition-transform group-hover:translate-x-1"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</a>
				{/each}
			{/await}
		</div>
	</div>
</section>

<!-- Featured Products Section -->
<section class="bg-muted/20 py-14 sm:py-20">
	<div class="container mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<div class="mb-1 flex items-center gap-2">
					<span class="size-2 rounded-full bg-emerald-500"></span>
					<span class="text-xs font-semibold tracking-wider text-muted-foreground uppercase"
						>Koleksi Terpopuler</span
					>
				</div>
				<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
					Produk Pilihan Siap Kirim
				</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					Produk digital yang siap diserahterimakan secara instan ke dashboard pembeli.
				</p>
			</div>

			<a href="/products">
				<Button variant="outline" size="sm" class="text-xs font-medium">
					Buka Katalog Lengkap
				</Button>
			</a>
		</div>

		<!-- Product Grid -->
		{#await data.streamed.featuredProducts}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each Array.from({ length: 6 }, (_, i) => i) as skIdx (skIdx)}
					<ProductCardSkeleton />
				{/each}
			</div>
		{:then featuredProducts}
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each featuredProducts as product (product.id)}
					<ProductCard {product} />
				{/each}
			</div>
		{/await}

		<!-- Bottom Catalog Banner -->
		<div
			class="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:flex-row sm:p-8 sm:text-left"
		>
			<div class="max-w-xl space-y-1.5">
				<h3 class="text-lg font-bold text-foreground">
					Mencari lisensi atau software spesifik lainnya?
				</h3>
				<p class="text-xs leading-relaxed text-muted-foreground">
					Jelajahi seluruh kategori di katalog kami dengan filter harga, status legalitas, dan
					pencarian instan.
				</p>
			</div>
			<a href="/products" class="shrink-0">
				<Button size="lg" class="px-6 font-semibold">Lihat Seluruh Katalog</Button>
			</a>
		</div>
	</div>
</section>

<!-- How It Works (Cara Kerja Sistem TokoUcan) -->
<section id="cara-kerja" class="border-t border-border/60 py-16 sm:py-24">
	<div class="mx-auto max-w-6xl px-4 text-center sm:px-6">
		<span class="text-xs font-semibold tracking-wider text-primary uppercase"
			>Transparan &amp; Terpercaya</span
		>
		<h2 class="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
			Bagaimana TokoUcan Bekerja?
		</h2>
		<p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
			Dirancang khusus untuk mengeliminasi risiko transaksi akun manual di chat dengan proses
			otomatis dan perlindungan privasi.
		</p>

		<ol class="mt-12 grid gap-8 text-left sm:grid-cols-3">
			<!-- Step 1 -->
			<li class="relative rounded-xl border border-border bg-card p-6 shadow-xs">
				<div
					class="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
					aria-hidden="true"
				>
					1
				</div>
				<h3 class="text-base font-semibold text-foreground">1. Pilih Produk &amp; Bayar Aman</h3>
				<p class="mt-2 text-xs leading-relaxed text-muted-foreground">
					Pilih lisensi atau akun kerja yang sah dipindahtangankan. Lakukan pembayaran resmi melalui
					gateway pembayaran tepercaya.
				</p>
			</li>

			<!-- Step 2 -->
			<li class="relative rounded-xl border border-border bg-card p-6 shadow-xs">
				<div
					class="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
					aria-hidden="true"
				>
					2
				</div>
				<h3 class="text-base font-semibold text-foreground">2. Serah Terima Otomatis</h3>
				<p class="mt-2 text-xs leading-relaxed text-muted-foreground">
					Server memverifikasi pembayaran secara otomatis dan mengalokasikan akun ke dalam Vault
					Akun pribadi Anda tanpa menunggu admin manual.
				</p>
			</li>

			<!-- Step 3 -->
			<li class="relative rounded-xl border border-border bg-card p-6 shadow-xs">
				<div
					class="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground"
					aria-hidden="true"
				>
					3
				</div>
				<h3 class="text-base font-semibold text-foreground">3. Vault Aman &amp; Retensi 30 Hari</h3>
				<p class="mt-2 text-xs leading-relaxed text-muted-foreground">
					Kredensial Anda dienkripsi AES-256. Sistem kami menjadwalkan pembersihan permanen setelah
					30 hari demi menjaga privasi data Anda.
				</p>
			</li>
		</ol>

		<!-- Safety & Policy Compliance Callout -->
		<div
			class="mt-12 flex items-start gap-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-left"
		>
			<svg
				class="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
				/>
			</svg>
			<div class="text-xs leading-relaxed text-muted-foreground">
				<strong class="font-semibold text-foreground"
					>Komitmen Kepatuhan &amp; Anti-Akun Ilegal:</strong
				>
				TokoUcan secara tegas melarang listing akun curian, bajakan, akun identitas pribadi, atau akun
				yang melanggar ketentuan penyedia asal. Setiap transaksi dilindungi pencatatan audit tanpa menyimpan
				kredensial rahasia secara terbuka.
			</div>
		</div>
	</div>
</section>
