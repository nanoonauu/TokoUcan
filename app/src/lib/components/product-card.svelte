<script lang="ts">
	import type { Product } from '#lib/schemas/catalog.js';
	import { formatRupiah } from '#lib/utils.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let { product }: { product: Product } = $props();
</script>

<article
	class="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
>
	<div>
		<!-- Top Badges -->
		<div class="mb-3 flex items-center justify-between gap-2">
			<span
				class="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
			>
				{product.category?.name ?? 'Barang Digital'}
			</span>
			<span
				class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
			>
				<span class="size-1.5 rounded-full bg-emerald-500"></span>
				Tersedia &amp; Sah
			</span>
		</div>

		<!-- Title -->
		<h3
			class="mb-2 line-clamp-2 text-base leading-snug font-semibold text-foreground transition-colors group-hover:text-primary"
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

	<!-- Bottom Section -->
	<div class="border-t border-border/60 pt-3.5">
		<div class="mb-3 flex items-baseline justify-between">
			<div>
				<span class="block text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
					Harga Resmi
				</span>
				<span class="text-lg font-bold text-foreground">
					{formatRupiah(product.price)}
				</span>
			</div>
			<span
				class="inline-flex items-center gap-1 rounded bg-muted/80 px-1.5 py-0.5 text-[10px] text-muted-foreground"
			>
				Instant Delivery
			</span>
		</div>

		<!-- Retention Reminder -->
		<div class="mb-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
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
				class="w-full font-medium transition-transform active:scale-[0.99]"
			>
				Lihat Rincian
			</Button>
		</a>
	</div>
</article>
