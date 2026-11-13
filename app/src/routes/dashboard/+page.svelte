<script lang="ts">
	import { formatRupiah } from '#lib/utils.js';

	let { data } = $props();

	function calculateDaysLeft(purgeAtStr: string | null): number {
		if (!purgeAtStr) return 0;
		const diff = new Date(purgeAtStr).getTime() - Date.now();
		return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	}
</script>

<svelte:head>
	<title>Dashboard Pembeli — TokoUcan</title>
</svelte:head>

<main id="main-content" tabindex="-1" class="container mx-auto max-w-5xl px-4 py-8">
	<!-- Page Heading -->
	<div class="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
				Dashboard Pembeli
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Kelola informasi akun, pantau riwayat transaksi, dan akses brankas kredensial digital Anda.
			</p>
		</div>

		<div>
			<a
				href="/products"
				class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				Belanja Produk Lainnya
			</a>
		</div>
	</div>

	<!-- Section 1: Profil Akun & Status Vault -->
	<section aria-labelledby="profile-heading" class="mb-8">
		<h2 id="profile-heading" class="sr-only">Informasi Profil dan Brankas</h2>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Profil Card -->
			<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
				<h3 class="mb-4 text-base font-semibold text-foreground">Informasi Akun</h3>
				<dl class="space-y-3 text-sm">
					<div>
						<dt class="text-xs font-medium text-muted-foreground">Email Terdaftar</dt>
						<dd class="mt-0.5 font-medium text-foreground">{data.user.email}</dd>
					</div>
					<div>
						<dt class="text-xs font-medium text-muted-foreground">Nama Tampilan</dt>
						<dd class="mt-0.5 text-foreground">
							{data.profile?.display_name ?? 'Belum diatur'}
						</dd>
					</div>
					<div>
						<dt class="text-xs font-medium text-muted-foreground">Peran Pengguna</dt>
						<dd class="mt-0.5 flex gap-1.5">
							{#if data.roles.length > 0}
								{#each data.roles as role (role)}
									<span
										class="inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary uppercase"
									>
										{role}
									</span>
								{/each}
							{:else}
								<span
									class="inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground uppercase"
								>
									Pembeli (Buyer)
								</span>
							{/if}
						</dd>
					</div>
				</dl>
			</div>

			<!-- Status Retensi & Vault Card -->
			<div
				class="flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm"
			>
				<div>
					<h3 class="mb-2 text-base font-semibold text-foreground">Protokol Keamanan Vault</h3>
					<p class="mb-4 text-xs leading-relaxed text-muted-foreground">
						Kredensial produk digital diamankan menggunakan enkripsi simetris terautentikasi
						AES-256-GCM. Kredensial sensitif disimpan selama <strong>30 hari</strong> sejak tanggal serah
						terima, lalu dimusnahkan secara permanen untuk mematuhi kebijakan privasi data.
					</p>
				</div>

				<div
					class="rounded-lg border border-amber-200/60 bg-amber-50/60 p-3 text-xs text-amber-900 dark:border-amber-900/30 dark:bg-amber-950/20 dark:text-amber-200"
				>
					<span class="font-medium">Tips:</span> Segera amankan atau ubah kata sandi akun sesaat setelah
					membuka brankas.
				</div>
			</div>
		</div>
	</section>

	<!-- Section 2: Riwayat Pesanan -->
	<section aria-labelledby="orders-heading" class="mb-8">
		<div class="mb-4 flex items-center justify-between">
			<h2 id="orders-heading" class="text-lg font-bold text-foreground">Riwayat Pesanan</h2>
			<span class="text-xs text-muted-foreground">Total: {data.orders.length} transaksi</span>
		</div>

		{#if data.orders.length === 0}
			<div
				class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center"
			>
				<p class="text-sm font-medium text-foreground">Belum ada pesanan aktif</p>
				<p class="mt-1 text-xs text-muted-foreground">
					Anda belum melakukan transaksi produk digital di TokoUcan.
				</p>
				<a
					href="/products"
					class="mt-4 inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
				>
					Mulai Belanja Sekarang
				</a>
			</div>
		{:else}
			<div class="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
				<div class="overflow-x-auto">
					<table class="w-full text-left text-xs">
						<thead class="border-b border-border bg-muted/50 text-muted-foreground">
							<tr>
								<th scope="col" class="px-4 py-3 font-medium">Nomor Pesanan</th>
								<th scope="col" class="px-4 py-3 font-medium">Item &amp; Kuantitas</th>
								<th scope="col" class="px-4 py-3 font-medium">Total Tagihan</th>
								<th scope="col" class="px-4 py-3 font-medium">Status</th>
								<th scope="col" class="px-4 py-3 font-medium">Waktu Transaksi</th>
								<th scope="col" class="px-4 py-3 text-right font-medium">Tindakan</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border">
							{#each data.orders as order (order.id)}
								<tr class="transition-colors hover:bg-muted/30">
									<td class="px-4 py-3 font-mono font-medium text-foreground">
										{order.order_number}
									</td>
									<td class="px-4 py-3 text-foreground">
										{#if order.order_items && order.order_items.length > 0}
											<span>{order.order_items[0].product_title}</span>
											{#if order.order_items.length > 1}
												<span class="text-muted-foreground"
													>(+{order.order_items.length - 1} lainnya)</span
												>
											{/if}
										{:else}
											<span class="text-muted-foreground">Digital Item</span>
										{/if}
									</td>
									<td class="px-4 py-3 font-semibold text-foreground">
										{formatRupiah(order.total_amount)}
									</td>
									<td class="px-4 py-3">
										{#if order.status === 'paid'}
											<span
												class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
											>
												Lunas / Terkirim
											</span>
										{:else if order.status === 'pending'}
											<span
												class="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400"
											>
												Menunggu Bayar
											</span>
										{:else}
											<span
												class="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground uppercase"
											>
												{order.status}
											</span>
										{/if}
									</td>
									<td class="px-4 py-3 text-muted-foreground">
										{new Date(order.created_at).toLocaleDateString('id-ID', {
											day: 'numeric',
											month: 'short',
											year: 'numeric'
										})}
									</td>
									<td class="px-4 py-3 text-right">
										<a
											href="/checkout/{order.id}"
											class="inline-flex items-center rounded border border-border px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
										>
											{order.status === 'paid' ? 'Buka Vault' : 'Bayar'}
										</a>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
		{/if}
	</section>

	<!-- Section 3: Brankas Kredensial (Vault Items) -->
	<section aria-labelledby="vault-heading">
		<div class="mb-4 flex items-center justify-between">
			<h2 id="vault-heading" class="text-lg font-bold text-foreground">
				Brankas Kredensial Pribadi (Vault)
			</h2>
			<span class="text-xs text-muted-foreground">
				{data.vaultCredentials.length} item tersimpan
			</span>
		</div>

		{#if data.vaultCredentials.length === 0}
			<div class="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
				<p class="text-sm text-muted-foreground">
					Belum ada kredensial yang diserahkan ke brankas Anda. Kredensial akan muncul otomatis
					setelah pembayaran pesanan dikonfirmasi.
				</p>
			</div>
		{:else}
			<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.vaultCredentials as item (item.id)}
					<article
						class="flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm"
					>
						<div>
							<div class="flex items-center justify-between gap-2">
								<span
									class="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase"
								>
									{item.credential_type}
								</span>

								{#if item.status === 'delivered'}
									<span
										class="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
									>
										Tersimpan Aman
									</span>
								{:else if item.status === 'purged'}
									<span
										class="inline-flex items-center rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive"
									>
										Dimusnahkan (30 Hari)
									</span>
								{/if}
							</div>

							<h3 class="mt-2 text-sm font-semibold text-foreground">
								{item.label || 'Kredensial Digital'}
							</h3>

							<div class="mt-3 space-y-1 text-xs text-muted-foreground">
								{#if item.delivered_at}
									<p>
										Diserahkan: {new Date(item.delivered_at).toLocaleDateString('id-ID')}
									</p>
								{/if}

								{#if item.status === 'delivered'}
									{@const daysLeft = calculateDaysLeft(item.purge_at)}
									<p class="font-medium text-amber-600 dark:text-amber-400">
										Sisa Retensi: {daysLeft} hari lagi
									</p>
								{:else if item.status === 'purged'}
									<p class="text-[11px] text-destructive">
										Telah dimusnahkan secara otomatis demi privasi.
									</p>
								{/if}
							</div>
						</div>

						<div class="mt-4 border-t border-border/60 pt-3">
							{#if item.order_id && item.status === 'delivered'}
								<a
									href="/checkout/{item.order_id}"
									class="flex w-full items-center justify-center rounded-lg bg-primary/10 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
								>
									Dekripsi &amp; Lihat Kredensial
								</a>
							{:else}
								<span class="block text-center text-[11px] text-muted-foreground">
									Kredensial tidak dapat didekripsi
								</span>
							{/if}
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</section>
</main>
