<script lang="ts">
	import type { Product } from '#lib/schemas/catalog.js';
	import { formatRupiah } from '#lib/utils.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let { product }: { product: Product } = $props();
</script>

<article
	class="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
>
	<div>
		<!-- Top Badges Row -->
		<div class="mb-3 flex items-center justify-between gap-2">
			<span
				class="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
			>
				{product.category?.name ?? 'Barang Digital'}
			</span>
			<span
				class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
			>
				<span class="size-1.5 rounded-full bg-emerald-500"></span>
				Instant
			</span>
		</div>

		<!-- Title -->
		<h3
			class="mb-1.5 line-clamp-2 text-sm leading-snug font-semibold text-foreground transition-colors group-hover:text-primary"
		>
			<a href="/products/{product.slug}" class="focus:underline focus:outline-none">
				{product.title}
			</a>
		</h3>

		<!-- Description -->
		<p class="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
			{product.description}
		</p>
	</div>

	<!-- Bottom Section: Price & Action -->
	<div class="border-t border-border/60 pt-3">
		<div class="mb-3 flex items-baseline justify-between">
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
				class="inline-flex items-center rounded bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
			>
				Garansi Resmi
			</span>
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
</article>
