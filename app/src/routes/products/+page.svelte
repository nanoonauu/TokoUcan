<script lang="ts">
	import ProductCard from '#lib/components/product-card.svelte';
	import ProductCardSkeleton from '#lib/components/product-card-skeleton.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { formatRupiah } from '#lib/utils.js';

	let { data } = $props();

	// Calculate total products across all categories
	function getTotalCount(categories: Array<{ product_count?: number }>): number {
		return categories.reduce((sum, cat) => sum + (cat.product_count ?? 0), 0);
	}

	// Helper to generate search query URL
	function buildUrl(params: {
		category?: string;
		search?: string;
		sort?: string;
		min_price?: number;
		max_price?: number;
		page?: number;
	}): string {
		const parts: string[] = [];

		const cat = params.category ?? data.query.category;
		if (cat) parts.push(`category=${encodeURIComponent(cat)}`);

		const q = params.search !== undefined ? params.search : data.query.search;
		if (q && q.trim()) parts.push(`search=${encodeURIComponent(q.trim())}`);

		const s = params.sort ?? data.query.sort;
		if (s && s !== 'newest') parts.push(`sort=${encodeURIComponent(s)}`);

		const min = params.min_price !== undefined ? params.min_price : data.query.min_price;
		if (typeof min === 'number' && min > 0) parts.push(`min_price=${min}`);

		const max = params.max_price !== undefined ? params.max_price : data.query.max_price;
		if (typeof max === 'number' && max > 0) parts.push(`max_price=${max}`);

		const p = params.page ?? data.query.page;
		if (p && p > 1) parts.push(`page=${p}`);

		return parts.length > 0 ? `/products?${parts.join('&')}` : '/products';
	}
</script>

<svelte:head>
	<title>Katalog Produk Digital Resmi — TokoUcan</title>
	<meta
		name="description"
		content="Jelajahi 100+ lisensi software, akun kerja resmi, dan aset digital bersertifikasi dengan serah terima otomatis dan brankas beretensi 30 hari."
	/>
</svelte:head>

<div class="container mx-auto max-w-7xl px-4 py-6 sm:px-6">
	<!-- Breadcrumb Navigation -->
	<nav aria-label="Breadcrumb" class="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
		<a href="/" class="transition-colors hover:text-foreground">Beranda</a>
		<span>/</span>
		<span class="font-medium text-foreground">Katalog Produk</span>
		{#if data.query.category}
			<span>/</span>
			<span class="font-medium text-primary capitalize"
				>{data.query.category.replace('-', ' ')}</span
			>
		{/if}
	</nav>

	<!-- Main 2-Column Marketplace Layout -->
	<div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
		<!-- ============================================================== -->
		<!-- LEFT SIDEBAR: Kategori & Filter (3 cols on lg)                  -->
		<!-- ============================================================== -->
		<aside class="space-y-6 lg:col-span-3">
			<!-- 1. Kategori Box (Mirip Sidebar Shopee) -->
			<div class="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xs">
				<div class="mb-3 flex items-center gap-2 border-b border-border/60 pb-3">
					<svg class="size-4.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h7"
						/>
					</svg>
					<h2 class="text-sm font-bold tracking-tight text-foreground">Semua Kategori</h2>
				</div>

				<nav aria-label="Daftar Kategori" class="space-y-1">
					{#await data.streamed.categories}
						{#each Array.from({ length: 8 }, (_, i) => i) as idx (idx)}
							<div class="h-8 w-full animate-pulse rounded-lg bg-muted"></div>
						{/each}
					{:then categories}
						<!-- Semua Kategori Link -->
						<a
							href={buildUrl({ category: '', page: 1 })}
							class="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors {!data
								.query.category
								? 'bg-primary/10 font-semibold text-primary'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
						>
							<span class="flex items-center gap-2">
								<span
									class="size-1.5 rounded-full {!data.query.category
										? 'bg-primary'
										: 'bg-muted-foreground/40'}"
								></span>
								Semua Produk
							</span>
							<span class="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
								{getTotalCount(categories)}
							</span>
						</a>

						<!-- Category List Items -->
						{#each categories as category (category.id)}
							{@const isActive = data.query.category === category.slug}
							<a
								href={buildUrl({ category: category.slug, page: 1 })}
								class="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors {isActive
									? 'bg-primary/10 font-semibold text-primary'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'}"
							>
								<span class="flex items-center gap-2 truncate">
									<span
										class="size-1.5 shrink-0 rounded-full {isActive
											? 'bg-primary'
											: 'bg-muted-foreground/30'}"
									></span>
									<span class="truncate">{category.name}</span>
								</span>
								{#if category.product_count !== undefined}
									<span
										class="ml-2 shrink-0 rounded px-1.5 py-0.5 text-[10px] {isActive
											? 'bg-primary/20 font-semibold text-primary'
											: 'bg-muted text-muted-foreground'}"
									>
										{category.product_count}
									</span>
								{/if}
							</a>
						{/each}
					{/await}
				</nav>
			</div>

			<!-- 2. Filter Box (Rentang Harga & Reset) -->
			<div class="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-2xs">
				<div class="mb-3 flex items-center justify-between border-b border-border/60 pb-3">
					<div class="flex items-center gap-2">
						<svg class="size-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
							/>
						</svg>
						<h2 class="text-sm font-bold tracking-tight text-foreground">Filter Harga</h2>
					</div>
					{#if data.query.min_price || data.query.max_price || data.query.search || data.query.category}
						<a href="/products" class="text-[11px] font-medium text-primary hover:underline">
							Reset
						</a>
					{/if}
				</div>

				<!-- Form Filter Harga -->
				<form method="GET" action="/products" class="space-y-3">
					{#if data.query.category}
						<input type="hidden" name="category" value={data.query.category} />
					{/if}
					{#if data.query.search}
						<input type="hidden" name="search" value={data.query.search} />
					{/if}
					{#if data.query.sort !== 'newest'}
						<input type="hidden" name="sort" value={data.query.sort} />
					{/if}

					<div class="space-y-2">
						<div>
							<label
								for="min_price"
								class="mb-1 block text-[11px] font-medium text-muted-foreground"
							>
								Harga Minimum (Rp)
							</label>
							<input
								id="min_price"
								name="min_price"
								type="number"
								min="0"
								step="10000"
								value={data.query.min_price ?? ''}
								placeholder="0"
								class="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
							/>
						</div>

						<div>
							<label
								for="max_price"
								class="mb-1 block text-[11px] font-medium text-muted-foreground"
							>
								Harga Maksimum (Rp)
							</label>
							<input
								id="max_price"
								name="max_price"
								type="number"
								min="0"
								step="10000"
								value={data.query.max_price ?? ''}
								placeholder="1.000.000"
								class="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
							/>
						</div>
					</div>

					<Button type="submit" variant="default" size="sm" class="w-full text-xs font-medium">
						Terapkan Filter
					</Button>
				</form>
			</div>

			<!-- 3. Jaminan Layanan Digital TokoUcan -->
			<div class="rounded-xl border border-dashed border-border bg-card/60 p-4 text-xs">
				<h3 class="mb-2 font-semibold text-foreground">Kredensial Aman</h3>
				<ul class="space-y-2 text-muted-foreground">
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-emerald-500">✓</span>
						<span>Aktivasi langsung ke akun / lisensi resmi.</span>
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-emerald-500">✓</span>
						<span>Enkripsi brankas tingkat tinggi AES-256.</span>
					</li>
					<li class="flex items-start gap-1.5">
						<span class="font-bold text-amber-500">⏱</span>
						<span>Pemusnahan rahasia otomatis setelah 30 hari.</span>
					</li>
				</ul>
			</div>
		</aside>

		<!-- ============================================================== -->
		<!-- RIGHT CONTENT: Top Sorting Bar & Products Grid (9 cols on lg)   -->
		<!-- ============================================================== -->
		<main class="space-y-5 lg:col-span-9">
			<!-- Top Search & Quick Input -->
			<form method="GET" action="/products" class="relative">
				{#if data.query.category}
					<input type="hidden" name="category" value={data.query.category} />
				{/if}
				{#if data.query.sort !== 'newest'}
					<input type="hidden" name="sort" value={data.query.sort} />
				{/if}
				{#if data.query.min_price}
					<input type="hidden" name="min_price" value={data.query.min_price} />
				{/if}
				{#if data.query.max_price}
					<input type="hidden" name="max_price" value={data.query.max_price} />
				{/if}

				<div class="relative flex items-center">
					<svg
						class="absolute left-3.5 size-4 text-muted-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="search"
						name="search"
						value={data.query.search ?? ''}
						placeholder="Cari lisensi, software, akun produktivitas, VPN..."
						class="h-10 w-full rounded-xl border border-border bg-card pr-24 pl-10 text-xs text-foreground shadow-2xs placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
					/>
					<Button type="submit" size="sm" class="absolute right-1.5 h-7 px-3.5 text-xs font-medium">
						Cari
					</Button>
				</div>
			</form>

			<!-- Top Sorting Toolbar (Mirip Bar Atas Shopee) -->
			<div
				class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-2xs"
			>
				<!-- Left: Sort Tabs -->
				<div class="flex flex-wrap items-center gap-1.5 text-xs">
					<span class="mr-1 text-muted-foreground">Urutkan:</span>

					<a href={buildUrl({ sort: 'newest', page: 1 })}>
						<Button
							variant={data.query.sort === 'newest' ? 'default' : 'outline'}
							size="sm"
							class="h-7 text-xs font-medium"
						>
							Terbaru
						</Button>
					</a>

					<a href={buildUrl({ sort: 'price-asc', page: 1 })}>
						<Button
							variant={data.query.sort === 'price-asc' ? 'default' : 'outline'}
							size="sm"
							class="h-7 text-xs font-medium"
						>
							Harga Terendah
						</Button>
					</a>

					<a href={buildUrl({ sort: 'price-desc', page: 1 })}>
						<Button
							variant={data.query.sort === 'price-desc' ? 'default' : 'outline'}
							size="sm"
							class="h-7 text-xs font-medium"
						>
							Harga Tertinggi
						</Button>
					</a>
				</div>

				<!-- Right: Mini Pagination Toolbar -->
				{#await data.streamed.catalogResult}
					<div class="h-7 w-24 animate-pulse rounded bg-muted"></div>
				{:then catalogResult}
					<div class="flex items-center gap-2 text-xs">
						<span class="text-muted-foreground">
							<strong class="font-semibold text-foreground">{catalogResult.page}</strong>
							/ {catalogResult.totalPages > 0 ? catalogResult.totalPages : 1}
						</span>

						<div class="flex items-center gap-1">
							<!-- Prev Page Button -->
							{#if catalogResult.page > 1}
								<a
									href={buildUrl({ page: catalogResult.page - 1 })}
									aria-label="Halaman sebelumnya"
								>
									<Button variant="outline" size="sm" class="size-7 p-0">&lt;</Button>
								</a>
							{:else}
								<Button variant="outline" size="sm" class="size-7 p-0 opacity-40" disabled>
									&lt;
								</Button>
							{/if}

							<!-- Next Page Button -->
							{#if catalogResult.page < catalogResult.totalPages}
								<a
									href={buildUrl({ page: catalogResult.page + 1 })}
									aria-label="Halaman berikutnya"
								>
									<Button variant="outline" size="sm" class="size-7 p-0">&gt;</Button>
								</a>
							{:else}
								<Button variant="outline" size="sm" class="size-7 p-0 opacity-40" disabled>
									&gt;
								</Button>
							{/if}
						</div>
					</div>
				{/await}
			</div>

			<!-- Active Filter Tags (jika ada filter aktif) -->
			{#if data.query.search || data.query.category || data.query.min_price || data.query.max_price}
				<div class="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
					<span class="font-medium">Filter Aktif:</span>

					{#if data.query.category}
						<span
							class="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-primary"
						>
							Kategori: {data.query.category}
							<a
								href={buildUrl({ category: '', page: 1 })}
								class="ml-1 font-bold hover:text-foreground"
								aria-label="Hapus filter kategori"
							>
								×
							</a>
						</span>
					{/if}

					{#if data.query.search}
						<span
							class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-foreground"
						>
							Cari: "{data.query.search}"
							<a
								href={buildUrl({ search: '', page: 1 })}
								class="ml-1 font-bold hover:text-muted-foreground"
								aria-label="Hapus filter pencarian"
							>
								×
							</a>
						</span>
					{/if}

					{#if data.query.min_price || data.query.max_price}
						<span
							class="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-foreground"
						>
							Harga: {data.query.min_price ? formatRupiah(data.query.min_price) : 'Rp 0'} - {data
								.query.max_price
								? formatRupiah(data.query.max_price)
								: 'Bebas'}
							<a
								href={buildUrl({ min_price: 0, max_price: 0, page: 1 })}
								class="ml-1 font-bold hover:text-muted-foreground"
								aria-label="Hapus filter harga"
							>
								×
							</a>
						</span>
					{/if}

					<a
						href="/products"
						class="ml-2 text-xs text-muted-foreground hover:text-primary hover:underline"
					>
						Hapus Semua
					</a>
				</div>
			{/if}

			<!-- Products Grid (3 Columns on Large Desktop) -->
			{#await data.streamed.catalogResult}
				<!-- Skeleton Grid -->
				<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
					{#each Array.from({ length: 6 }, (_, i) => i) as skIdx (skIdx)}
						<ProductCardSkeleton />
					{/each}
				</div>
			{:then catalogResult}
				{#if catalogResult.products.length > 0}
					<div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
						{#each catalogResult.products as product (product.id)}
							<ProductCard {product} />
						{/each}
					</div>

					<!-- Bottom Detailed Pagination -->
					{#if catalogResult.totalPages > 1}
						<nav
							aria-label="Navigasi halaman katalog lengkap"
							class="mt-10 flex flex-wrap items-center justify-center gap-1.5"
						>
							<!-- Previous Button -->
							{#if catalogResult.page > 1}
								<a href={buildUrl({ page: catalogResult.page - 1 })}>
									<Button variant="outline" size="sm" class="h-8 px-3 text-xs">Sebelumnya</Button>
								</a>
							{/if}

							<!-- Numbered Pages -->
							{#each Array.from({ length: catalogResult.totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
								<a
									href={buildUrl({ page: pageNum })}
									aria-label="Halaman {pageNum}"
									aria-current={catalogResult.page === pageNum ? 'page' : undefined}
								>
									<Button
										variant={catalogResult.page === pageNum ? 'default' : 'outline'}
										size="sm"
										class="size-8 p-0 text-xs"
									>
										{pageNum}
									</Button>
								</a>
							{/each}

							<!-- Next Button -->
							{#if catalogResult.page < catalogResult.totalPages}
								<a href={buildUrl({ page: catalogResult.page + 1 })}>
									<Button variant="outline" size="sm" class="h-8 px-3 text-xs">Selanjutnya</Button>
								</a>
							{/if}
						</nav>
					{/if}
				{:else}
					<!-- Empty State -->
					<div class="rounded-xl border border-dashed border-border p-12 text-center">
						<div
							class="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground"
						>
							<svg class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
								/>
							</svg>
						</div>
						<h2 class="mb-1 text-base font-semibold text-foreground">
							Tidak Ada Produk yang Cocok
						</h2>
						<p class="mx-auto mb-4 max-w-md text-xs text-muted-foreground">
							Kriteria pencarian atau filter yang Anda terapkan tidak menghasilkan produk apa pun.
							Silakan sesuaikan rentang harga, pilih kategori lain, atau reset filter.
						</p>
						<a href="/products">
							<Button variant="outline" size="sm" class="text-xs">Reset Semua Filter</Button>
						</a>
					</div>
				{/if}
			{/await}
		</main>
	</div>
</div>
