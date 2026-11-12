<script lang="ts">
	import type { Product } from '#lib/schemas/catalog.js';
	import { formatRupiah } from '#lib/utils.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let { product }: { product: Product } = $props();
</script>

<article
	class="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
>
	<div>
		<div class="mb-3 flex items-center justify-between gap-2">
			<span
				class="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
			>
				{product.category?.name ?? 'Kategori'}
			</span>
			<span
				class="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
			>
				Resmi &amp; Sah
			</span>
		</div>

		<h3
			class="mb-1.5 line-clamp-2 text-base font-semibold text-foreground transition group-hover:text-primary"
		>
			<a href="/products/{product.slug}">
				{product.title}
			</a>
		</h3>

		<p class="mb-4 line-clamp-2 text-xs text-muted-foreground">
			{product.description}
		</p>
	</div>

	<div class="border-t border-border/60 pt-3">
		<div class="mb-3 flex items-baseline justify-between">
			<span class="text-xs text-muted-foreground">Harga</span>
			<span class="text-lg font-bold text-foreground">
				{formatRupiah(product.price)}
			</span>
		</div>

		<div class="mb-3 flex items-center gap-1 text-[11px] text-muted-foreground/80">
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
			<span>Retensi kredensial 30 hari pasca kirim</span>
		</div>

		<a href="/products/{product.slug}" class="block">
			<Button variant="default" size="sm" class="w-full">Lihat Detail</Button>
		</a>
	</div>
</article>
