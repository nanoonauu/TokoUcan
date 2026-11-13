<script lang="ts">
	import { formatRupiah } from '#lib/utils.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let { data, form } = $props();

	let quantity = $state(1);
	let paymentGateway = $state('mock');

	const maxQuantity = $derived(Math.min(data.availableStock, 10));
	const subtotal = $derived(data.product.price * quantity);
</script>

<svelte:head>
	<title>Checkout — {data.product.title} — TokoUcan</title>
</svelte:head>

<main id="main-content" tabindex="-1" class="container mx-auto max-w-4xl px-4 py-8">
	<!-- Progress Flow -->
	<nav aria-label="Alur transaksi" class="mb-6">
		<ol class="flex items-center gap-2 text-xs text-muted-foreground">
			<li class="flex items-center gap-1.5 font-medium text-foreground">
				<span
					class="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground"
				>
					1
				</span>
				<span>Konfirmasi Pesanan</span>
			</li>
			<li aria-hidden="true" class="text-muted-foreground/50">/</li>
			<li class="flex items-center gap-1.5">
				<span
					class="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground"
				>
					2
				</span>
				<span>Pembayaran</span>
			</li>
			<li aria-hidden="true" class="text-muted-foreground/50">/</li>
			<li class="flex items-center gap-1.5">
				<span
					class="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground"
				>
					3
				</span>
				<span>Serah Terima Vault</span>
			</li>
		</ol>
	</nav>

	<div class="mb-8">
		<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Checkout Pesanan</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Tinjau rincian barang digital dan tentukan metode pembayaran sebelum menyelesaikan pesanan.
		</p>
	</div>

	{#if form?.error}
		<div
			role="alert"
			class="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive"
		>
			<p class="font-semibold">Terjadi Kesalahan</p>
			<p class="mt-0.5">{form.error}</p>
		</div>
	{/if}

	<div class="grid gap-8 md:grid-cols-12">
		<!-- Form Konfirmasi -->
		<section class="space-y-6 md:col-span-7" aria-labelledby="order-details-heading">
			<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 id="order-details-heading" class="mb-4 text-lg font-semibold text-foreground">
					Item Produk Digital
				</h2>

				<article class="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/30 p-4">
					<div class="flex items-start justify-between gap-4">
						<div>
							<span
								class="inline-block rounded bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
							>
								{data.product.category?.name || 'Digital Goods'}
							</span>
							<h3 class="mt-1 text-base font-semibold text-foreground">
								{data.product.title}
							</h3>
						</div>
						<div class="text-right">
							<div class="font-bold text-foreground">
								{formatRupiah(data.product.price)}
							</div>
							<span class="text-[11px] text-muted-foreground">per unit</span>
						</div>
					</div>

					<div class="flex items-center gap-2 text-xs text-muted-foreground">
						<span
							class="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400"
						>
							<span class="size-1.5 rounded-full bg-emerald-500"></span>
							Tersedia: {data.availableStock} unit
						</span>
						<span>•</span>
						<span>Pengiriman Otomatis Instan</span>
					</div>
				</article>

				<form method="POST" class="mt-6 space-y-6">
					<input type="hidden" name="productId" value={data.product.id} />

					<!-- Pilihan Jumlah -->
					<div>
						<label for="quantity-input" class="block text-sm font-medium text-foreground">
							Jumlah Unit Pembelian
						</label>
						<p class="mt-0.5 text-xs text-muted-foreground">
							Maksimal pembelian {maxQuantity} unit per transaksi.
						</p>
						<div class="mt-2 flex items-center gap-3">
							<input
								id="quantity-input"
								name="quantity"
								type="number"
								min="1"
								max={maxQuantity}
								bind:value={quantity}
								class="w-24 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
								required
							/>
							<span class="text-xs text-muted-foreground">
								x {formatRupiah(data.product.price)}
							</span>
						</div>
					</div>

					<!-- Metode Pembayaran -->
					<div>
						<fieldset class="space-y-3">
							<legend class="text-sm font-medium text-foreground"> Metode Pembayaran </legend>
							<p class="text-xs text-muted-foreground">
								Pilih jalur pembayaran untuk verifikasi transaksi.
							</p>

							<div class="space-y-2.5">
								<label
									class="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/50 has-checked:border-primary has-checked:bg-primary/5"
								>
									<input
										type="radio"
										name="paymentGateway"
										value="mock"
										bind:group={paymentGateway}
										class="mt-1 size-4 text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
									/>
									<div>
										<span class="block text-sm font-semibold text-foreground">
											Simulasi Instant (Development Mock)
										</span>
										<span class="block text-xs text-muted-foreground">
											Verifikasi instan otomatis tanpa pemotongan saldo nyata (uji coba alur serah
											terima).
										</span>
									</div>
								</label>

								<label
									class="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3.5 transition-colors hover:bg-muted/50 has-checked:border-primary has-checked:bg-primary/5"
								>
									<input
										type="radio"
										name="paymentGateway"
										value="midtrans"
										bind:group={paymentGateway}
										class="mt-1 size-4 text-primary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
									/>
									<div>
										<span class="block text-sm font-semibold text-foreground">
											Midtrans Payment Gateway
										</span>
										<span class="block text-xs text-muted-foreground">
											Mendukung QRIS, GoPay, ShopeePay, dan Virtual Account Bank.
										</span>
									</div>
								</label>
							</div>
						</fieldset>
					</div>

					<!-- Proteksi Vault & Retensi -->
					<div
						class="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
					>
						<div class="flex items-start gap-2.5">
							<svg
								class="size-4 shrink-0 text-amber-600 dark:text-amber-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							<div>
								<span class="font-semibold">Ketentuan Retensi Brankas Digital:</span>
								<p class="mt-0.5 leading-relaxed">
									Kredensial produk akan dienkripsi dengan AES-256-GCM ke akun Anda. Sesuai
									kebijakan keamanan, kredensial sensitif akan dihapus permanen 30 hari pasca serah
									terima.
								</p>
							</div>
						</div>
					</div>

					<Button
						type="submit"
						size="lg"
						class="w-full font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						Lanjutkan ke Pembayaran ({formatRupiah(subtotal)})
					</Button>
				</form>
			</div>
		</section>

		<!-- Sidebar Ringkasan Harga -->
		<aside class="space-y-6 md:col-span-5" aria-labelledby="summary-heading">
			<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 id="summary-heading" class="mb-4 text-lg font-semibold text-foreground">
					Ringkasan Pembayaran
				</h2>

				<dl class="space-y-3 text-sm">
					<div class="flex justify-between text-muted-foreground">
						<dt>Harga Produk (x{quantity})</dt>
						<dd class="font-medium text-foreground">{formatRupiah(subtotal)}</dd>
					</div>
					<div class="flex justify-between text-muted-foreground">
						<dt>Biaya Layanan &amp; Vault</dt>
						<dd class="font-medium text-emerald-600 dark:text-emerald-400">Gratis (Rp 0)</dd>
					</div>
					<div class="flex justify-between text-muted-foreground">
						<dt>Alokasi Kredensial</dt>
						<dd class="font-medium text-foreground">Instan (Row-Lock)</dd>
					</div>

					<div class="border-t border-border pt-3">
						<div class="flex justify-between text-base font-bold text-foreground">
							<dt>Total Tagihan</dt>
							<dd class="text-xl text-primary">{formatRupiah(subtotal)}</dd>
						</div>
					</div>
				</dl>

				<div class="mt-6 space-y-2 text-[11px] text-muted-foreground">
					<div class="flex items-center gap-1.5">
						<svg
							class="size-3.5 text-primary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span>Pembayaran terverifikasi secara realtime</span>
					</div>
					<div class="flex items-center gap-1.5">
						<svg
							class="size-3.5 text-primary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span>Dekripsi aman kapan saja di dashboard pembeli</span>
					</div>
				</div>
			</div>
		</aside>
	</div>
</main>
