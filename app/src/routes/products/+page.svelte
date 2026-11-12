<script lang="ts">
	import ProductCard from '#lib/components/product-card.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Katalog Produk Digital Resmi — TokoUcan</title>
</svelte:head>

<div class="container mx-auto max-w-6xl px-4 py-8">
	<!-- Header & Intro -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold tracking-tight text-foreground">Katalog Produk Digital</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Temukan produk, lisensi, dan langganan digital resmi yang dapat dipindahtangankan secara sah.
		</p>
	</div>

	<!-- Filter & Search Bar -->
	<form
		method="GET"
		class="mb-8 grid gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:grid-cols-12"
	>
		<div class="sm:col-span-5">
			<label for="search" class="sr-only">Cari produk</label>
			<input
				id="search"
				name="search"
				type="search"
				value={data.query.search ?? ''}
				placeholder="Cari nama produk digital..."
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			/>
		</div>

		<div class="sm:col-span-4">
			<label for="category" class="sr-only">Kategori</label>
			<select
				id="category"
				name="category"
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				<option value="">Semua Kategori</option>
				{#each data.categories as cat (cat.id)}
					<option value={cat.slug} selected={data.query.category === cat.slug}>
						{cat.name}
					</option>
				{/each}
			</select>
		</div>

		<div class="flex gap-2 sm:col-span-3">
			<select
				name="sort"
				class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				<option value="newest" selected={data.query.sort === 'newest'}>Terbaru</option>
				<option value="price-asc" selected={data.query.sort === 'price-asc'}>Harga Terendah</option>
				<option value="price-desc" selected={data.query.sort === 'price-desc'}
					>Harga Tertinggi</option
				>
			</select>
			<Button type="submit" variant="default" size="default">Filter</Button>
		</div>
	</form>

	<!-- Produk Grid -->
	{#if data.catalogResult.products.length > 0}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.catalogResult.products as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>

		<!-- Pagination -->
		{#if data.catalogResult.totalPages > 1}
			<div class="mt-10 flex items-center justify-center gap-2">
				{#each Array.from({ length: data.catalogResult.totalPages }, (_, i) => i + 1) as pageNum (pageNum)}
					<a
						href="?page={pageNum}{data.query.category
							? `&category=${data.query.category}`
							: ''}{data.query.search
							? `&search=${encodeURIComponent(data.query.search)}`
							: ''}&sort={data.query.sort}"
					>
						<Button variant={data.catalogResult.page === pageNum ? 'default' : 'outline'} size="sm">
							{pageNum}
						</Button>
					</a>
				{/each}
			</div>
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
			<h2 class="mb-1 text-lg font-semibold text-foreground">Belum Ada Produk Ditemukan</h2>
			<p class="mx-auto mb-4 max-w-md text-sm text-muted-foreground">
				{data.query.search || data.query.category
					? 'Tidak ada produk yang cocok dengan kriteria pencarian Anda. Coba ubah kata kunci atau filter kategori.'
					: 'Katalog produk saat ini masih kosong atau tabel database Supabase belum diisi migrasi catalog.'}
			</p>
			{#if data.query.search || data.query.category}
				<a href="/products">
					<Button variant="outline" size="sm">Reset Filter</Button>
				</a>
			{/if}
		</div>
	{/if}
</div>
