<script lang="ts">
	import { formatRupiah } from '#lib/utils.js';
	import { Button } from '#lib/components/ui/button/index.js';

	let { data, form } = $props();

	let copiedId = $state<string | null>(null);

	function copyToClipboard(text: string, id: string) {
		navigator.clipboard.writeText(text);
		copiedId = id;
		setTimeout(() => {
			if (copiedId === id) copiedId = null;
		}, 2000);
	}

	function calculateDaysLeft(purgeAtStr: string | null): number {
		if (!purgeAtStr) return 30;
		const diff = new Date(purgeAtStr).getTime() - Date.now();
		return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	}
</script>

<svelte:head>
	<title>Pesanan {data.order.order_number} — TokoUcan</title>
</svelte:head>

<main id="main-content" tabindex="-1" class="container mx-auto max-w-4xl px-4 py-8">
	<!-- Flow Stepper -->
	<nav aria-label="Alur transaksi" class="mb-6">
		<ol class="flex items-center gap-2 text-xs text-muted-foreground">
			<li class="flex items-center gap-1.5">
				<span
					class="flex size-5 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground"
				>
					✓
				</span>
				<span>Konfirmasi Pesanan</span>
			</li>
			<li aria-hidden="true" class="text-muted-foreground/50">/</li>
			<li
				class="flex items-center gap-1.5 font-medium {data.order.status === 'paid'
					? 'text-muted-foreground'
					: 'text-foreground'}"
			>
				<span
					class="flex size-5 items-center justify-center rounded-full {data.order.status === 'paid'
						? 'bg-muted text-muted-foreground'
						: 'bg-primary text-primary-foreground'} text-[11px] font-bold"
				>
					{data.order.status === 'paid' ? '✓' : '2'}
				</span>
				<span>Pembayaran</span>
			</li>
			<li aria-hidden="true" class="text-muted-foreground/50">/</li>
			<li
				class="flex items-center gap-1.5 font-medium {data.order.status === 'paid'
					? 'text-foreground'
					: 'text-muted-foreground'}"
			>
				<span
					class="flex size-5 items-center justify-center rounded-full {data.order.status === 'paid'
						? 'bg-primary text-primary-foreground'
						: 'bg-muted text-muted-foreground'} text-[11px] font-bold"
				>
					3
				</span>
				<span>Serah Terima Vault</span>
			</li>
		</ol>
	</nav>

	<!-- Header Detail Pesanan -->
	<div class="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<div class="flex items-center gap-2">
				<span class="font-mono text-xs text-muted-foreground">{data.order.order_number}</span>
				{#if data.order.status === 'paid'}
					<span
						class="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
					>
						Lunas &amp; Terkirim
					</span>
				{:else if data.order.status === 'pending'}
					<span
						class="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
					>
						Menunggu Pembayaran
					</span>
				{:else}
					<span
						class="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground uppercase"
					>
						{data.order.status}
					</span>
				{/if}
			</div>
			<h1 class="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
				Detail Tagihan Pesanan
			</h1>
		</div>

		<div class="text-left sm:text-right">
			<span class="text-xs text-muted-foreground">Total Tagihan</span>
			<div class="text-2xl font-extrabold text-primary">
				{formatRupiah(data.order.total_amount)}
			</div>
		</div>
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
		<!-- Main Content -->
		<section class="space-y-6 md:col-span-7" aria-labelledby="order-items-heading">
			<!-- Order Items Card -->
			<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 id="order-items-heading" class="mb-4 text-lg font-semibold text-foreground">
					Item yang Dipesan
				</h2>

				<ul class="divide-y divide-border/60">
					{#each data.order.order_items as item (item.id)}
						<li class="flex items-center justify-between py-3">
							<div>
								<h3 class="text-sm font-semibold text-foreground">
									{item.product_title}
								</h3>
								<span class="text-xs text-muted-foreground">
									Kuantitas: {item.quantity} unit
								</span>
							</div>
							<div class="text-right">
								<span class="text-sm font-medium text-foreground">
									{formatRupiah(item.price_at_purchase * item.quantity)}
								</span>
							</div>
						</li>
					{/each}
				</ul>
			</div>

			<!-- PENDING PAYMENT STATE -->
			{#if data.order.status === 'pending'}
				<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
					<h2 class="mb-2 text-lg font-semibold text-foreground">Selesaikan Pembayaran</h2>
					<p class="mb-4 text-xs text-muted-foreground">
						Metode terpilih: <strong class="font-medium text-foreground uppercase"
							>{data.order.payment_gateway}</strong
						>. Selesaikan sebelum batas kedaluwarsa.
					</p>

					<div class="mb-6 rounded-lg border border-border/80 bg-muted/40 p-4 text-xs">
						<div class="flex items-center justify-between">
							<span class="text-muted-foreground">Batas Waktu:</span>
							<span class="font-mono font-medium text-foreground">
								{new Date(data.order.expires_at).toLocaleString('id-ID')}
							</span>
						</div>
					</div>

					<form method="POST" action="?/payMock">
						<Button
							type="submit"
							size="lg"
							class="w-full font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						>
							Bayar Sekarang (Simulasi Mock Instant)
						</Button>
					</form>
				</div>
			{/if}

			<!-- PAID / DELIVERED VAULT STATE -->
			{#if data.order.status === 'paid'}
				<div
					class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-sm dark:border-emerald-500/30"
				>
					<div class="mb-4 flex items-center gap-3">
						<div
							class="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
						>
							<svg
								class="size-6"
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
						</div>
						<div>
							<h2 class="text-lg font-bold text-foreground">Kredensial Siap Digunakan</h2>
							<p class="text-xs text-muted-foreground">
								Stok telah dialokasikan secara instan dan dienkripsi dengan AES-256-GCM.
							</p>
						</div>
					</div>

					<!-- Form Reveal Secrets -->
					{#if !form?.revealed}
						<form method="POST" action="?/revealSecret" class="mt-4">
							<Button
								type="submit"
								size="lg"
								class="w-full font-semibold focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
							>
								Dekripsi &amp; Tampilkan Kredensial Vault
							</Button>
						</form>
					{:else if form?.secrets}
						<div class="mt-4 space-y-4">
							<div
								class="rounded-lg border border-primary/20 bg-background p-4 text-xs shadow-inner"
							>
								<h3 class="mb-3 font-semibold text-foreground">
									Kredensial Terdekripsi On-Demand:
								</h3>

								{#each form.secrets as secretItem, idx (secretItem.id)}
									<div class="space-y-3 rounded border border-border bg-muted/40 p-3">
										<div class="flex items-center justify-between">
											<span class="font-medium text-foreground">
												{secretItem.label || `Kredensial Unit #${idx + 1}`}
											</span>
											<span class="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
												{secretItem.credentialType}
											</span>
										</div>

										{#if secretItem.secretObject}
											<dl class="space-y-1.5 text-xs">
												{#if secretItem.secretObject.account}
													<div>
														<dt class="text-[11px] text-muted-foreground">Akun / Email:</dt>
														<dd class="flex items-center justify-between font-mono font-medium">
															<span>{secretItem.secretObject.account}</span>
															<button
																type="button"
																class="text-xs text-primary underline hover:text-primary/80"
																onclick={() =>
																	copyToClipboard(
																		String(secretItem.secretObject?.account),
																		`${secretItem.id}-acc`
																	)}
															>
																{copiedId === `${secretItem.id}-acc` ? 'Tersalin!' : 'Salin'}
															</button>
														</dd>
													</div>
												{/if}

												{#if secretItem.secretObject.license_key}
													<div>
														<dt class="text-[11px] text-muted-foreground">Kunci Lisensi:</dt>
														<dd class="flex items-center justify-between font-mono font-medium">
															<span>{secretItem.secretObject.license_key}</span>
															<button
																type="button"
																class="text-xs text-primary underline hover:text-primary/80"
																onclick={() =>
																	copyToClipboard(
																		String(secretItem.secretObject?.license_key),
																		`${secretItem.id}-lic`
																	)}
															>
																{copiedId === `${secretItem.id}-lic` ? 'Tersalin!' : 'Salin'}
															</button>
														</dd>
													</div>
												{/if}

												{#if secretItem.secretObject.instructions}
													<div class="border-t border-border/50 pt-1.5">
														<dt class="text-[11px] text-muted-foreground">Petunjuk:</dt>
														<dd class="text-muted-foreground">
															{secretItem.secretObject.instructions}
														</dd>
													</div>
												{/if}
											</dl>
										{:else}
											<div class="flex items-center justify-between font-mono">
												<span class="text-xs break-all">{secretItem.secret}</span>
												<button
													type="button"
													class="text-xs text-primary underline hover:text-primary/80"
													onclick={() => copyToClipboard(secretItem.secret, secretItem.id)}
												>
													{copiedId === secretItem.id ? 'Tersalin!' : 'Salin'}
												</button>
											</div>
										{/if}
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</section>

		<!-- Sidebar Status & Retensi -->
		<aside class="space-y-6 md:col-span-5" aria-labelledby="status-heading">
			<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h2 id="status-heading" class="mb-4 text-lg font-semibold text-foreground">
					Status &amp; Garansi
				</h2>

				<dl class="space-y-3 text-xs">
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Waktu Pemesanan</dt>
						<dd class="font-medium text-foreground">
							{new Date(data.order.created_at).toLocaleString('id-ID')}
						</dd>
					</div>

					{#if data.order.paid_at}
						<div class="flex justify-between">
							<dt class="text-muted-foreground">Waktu Pembayaran</dt>
							<dd class="font-medium text-emerald-600 dark:text-emerald-400">
								{new Date(data.order.paid_at).toLocaleString('id-ID')}
							</dd>
						</div>
					{/if}

					<div class="flex justify-between">
						<dt class="text-muted-foreground">Metode Pembayaran</dt>
						<dd class="font-medium text-foreground uppercase">
							{data.order.payment_gateway}
						</dd>
					</div>
				</dl>

				<!-- 30-Day Retention Countdown -->
				<div class="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-xs">
					<div class="flex items-start gap-2">
						<svg
							class="mt-0.5 size-4 shrink-0 text-amber-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div>
							<span class="font-semibold text-foreground">Hitung Mundur Retensi 30 Hari:</span>
							{#if data.deliveredCredentials.length > 0}
								{@const days = calculateDaysLeft(data.deliveredCredentials[0]?.purge_at)}
								<p class="mt-0.5 text-muted-foreground">
									Sisa penyimpanan di vault: <strong class="text-amber-600 dark:text-amber-400"
										>{days} hari</strong
									>. Setelah itu data kredensial akan dimusnahkan permanen.
								</p>
							{:else}
								<p class="mt-0.5 text-muted-foreground">
									Retensi 30 hari akan aktif segera setelah pembayaran diselesaikan.
								</p>
							{/if}
						</div>
					</div>
				</div>

				<div class="mt-6">
					<a
						href="/dashboard"
						class="flex w-full items-center justify-center rounded-lg border border-border bg-background py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
					>
						Kembali ke Dashboard Pembeli
					</a>
				</div>
			</div>
		</aside>
	</div>
</main>
