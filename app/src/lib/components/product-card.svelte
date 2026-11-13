<script lang="ts">
	import type { Product } from '#lib/schemas/catalog.js';
	import { formatRupiah } from '#lib/utils.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let { product }: { product: Product } = $props();

	// Style badges and accents according to product category
	function getCategoryStyle(slug?: string) {
		switch (slug) {
			case 'software-os':
				return {
					bg: 'from-blue-500/10 via-slate-500/5 to-indigo-500/10',
					iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
					border: 'group-hover:border-blue-500/40'
				};
			case 'produktivitas':
				return {
					bg: 'from-amber-500/10 via-yellow-500/5 to-orange-500/10',
					iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
					border: 'group-hover:border-amber-500/40'
				};
			case 'desain-kreatif':
				return {
					bg: 'from-purple-500/10 via-pink-500/5 to-rose-500/10',
					iconBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
					border: 'group-hover:border-purple-500/40'
				};
			case 'cloud-dev':
				return {
					bg: 'from-cyan-500/10 via-sky-500/5 to-blue-500/10',
					iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
					border: 'group-hover:border-cyan-500/40'
				};
			case 'streaming-hiburan':
				return {
					bg: 'from-rose-500/10 via-red-500/5 to-amber-500/10',
					iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
					border: 'group-hover:border-rose-500/40'
				};
			case 'keamanan-vpn':
				return {
					bg: 'from-emerald-500/10 via-teal-500/5 to-green-500/10',
					iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
					border: 'group-hover:border-emerald-500/40'
				};
			case 'ai-machine-learning':
				return {
					bg: 'from-violet-500/10 via-fuchsia-500/5 to-purple-500/10',
					iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
					border: 'group-hover:border-violet-500/40'
				};
			case 'edukasi-kursus':
				return {
					bg: 'from-teal-500/10 via-blue-500/5 to-sky-500/10',
					iconBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
					border: 'group-hover:border-teal-500/40'
				};
			default:
				return {
					bg: 'from-primary/10 via-muted/40 to-accent/10',
					iconBg: 'bg-primary/15 text-primary',
					border: 'group-hover:border-primary/40'
				};
		}
	}

	const categoryStyle = $derived(getCategoryStyle(product.category?.slug));
</script>

<article
	class="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md {categoryStyle.border}"
>
	<!-- Top Visual Container (Digital Goods Header) -->
	<div
		class="relative flex h-32 items-center justify-center bg-linear-to-br {categoryStyle.bg} p-4"
	>
		<!-- Badges Overlay -->
		<div class="absolute top-2.5 right-2.5 left-2.5 flex items-center justify-between gap-1.5">
			<span
				class="inline-flex items-center rounded-md border border-border/60 bg-card/90 px-2 py-0.5 text-[11px] font-medium text-foreground/90 backdrop-blur-xs"
			>
				{product.category?.name ?? 'Digital Item'}
			</span>
			<span
				class="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-card/90 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 backdrop-blur-xs dark:text-emerald-400"
			>
				<span class="size-1.5 rounded-full bg-emerald-500"></span>
				Siap Kirim
			</span>
		</div>

		<!-- Central Digital Badge / Icon -->
		<div
			class="flex size-14 items-center justify-center rounded-2xl shadow-xs transition-transform duration-200 group-hover:scale-105 {categoryStyle.iconBg}"
		>
			{#if product.category?.slug === 'software-os'}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
					/>
				</svg>
			{:else if product.category?.slug === 'produktivitas'}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			{:else if product.category?.slug === 'desain-kreatif'}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M7 21a4 4 0 01-4-4 4 4 0 014-4c.72 0 1.39.2 1.96.55L17 5.46a2 2 0 012.83 0l.71.71a2 2 0 010 2.83l-8.09 8.09c.35.57.55 1.24.55 1.96a4 4 0 01-4 4z"
					/>
				</svg>
			{:else if product.category?.slug === 'cloud-dev'}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
					/>
				</svg>
			{:else if product.category?.slug === 'streaming-hiburan'}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			{:else if product.category?.slug === 'keamanan-vpn'}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			{:else if product.category?.slug === 'ai-machine-learning'}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					/>
				</svg>
			{:else}
				<svg class="size-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.8"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
			{/if}
		</div>

		<!-- Subtle instant delivery tag at bottom of visual banner -->
		<div class="absolute right-3 bottom-2">
			<span class="text-[10px] font-medium text-muted-foreground/80">
				⚡ Serah Terima Otomatis
			</span>
		</div>
	</div>

	<!-- Content Body -->
	<div class="flex flex-1 flex-col justify-between p-4">
		<div>
			<!-- Product Title -->
			<h3
				class="mb-1.5 line-clamp-2 text-sm leading-snug font-semibold text-foreground transition-colors group-hover:text-primary"
			>
				<a href="/products/{product.slug}" class="focus:underline focus:outline-none">
					{product.title}
				</a>
			</h3>

			<!-- Description -->
			<p class="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
				{product.description}
			</p>
		</div>

		<!-- Price & Action Section -->
		<div class="border-t border-border/60 pt-3">
			<div class="mb-2.5 flex items-baseline justify-between">
				<div>
					<span
						class="block text-[10px] font-semibold tracking-wider text-muted-foreground uppercase"
					>
						Harga Resmi
					</span>
					<span class="text-base font-bold text-foreground">
						{formatRupiah(product.price)}
					</span>
				</div>
				<span
					class="inline-flex items-center gap-1 rounded bg-muted/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
				>
					Garansi Resmi
				</span>
			</div>

			<!-- Retention & Vault Indicator -->
			<div class="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground">
				<svg
					class="size-3.5 shrink-0 text-amber-500"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span class="truncate">Vault terenkripsi &amp; retensi 30 hari</span>
			</div>

			<a href="/products/{product.slug}" class="block">
				<Button
					variant="default"
					size="sm"
					class="w-full text-xs font-medium transition-transform active:scale-[0.99]"
				>
					Lihat Rincian
				</Button>
			</a>
		</div>
	</div>
</article>
