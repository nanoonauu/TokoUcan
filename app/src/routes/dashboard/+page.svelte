<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Dashboard — TokoUcan</title>
</svelte:head>

<div class="container mx-auto max-w-4xl px-4 py-8">
	<div class="mb-8">
		<h1 class="text-3xl font-bold tracking-tight text-foreground">Dashboard Pembeli</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Area terproteksi untuk melihat profil akun dan status pesanan barang digital.
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2">
		<!-- Profil Card -->
		<div class="rounded-xl border border-border bg-card p-6 shadow-sm">
			<h2 class="mb-4 text-lg font-semibold text-foreground">Informasi Akun</h2>
			<dl class="space-y-3 text-sm">
				<div>
					<dt class="text-xs font-medium text-muted-foreground">User ID (Supabase Auth)</dt>
					<dd class="mt-0.5 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
						{data.user.id}
					</dd>
				</div>
				<div>
					<dt class="text-xs font-medium text-muted-foreground">Email</dt>
					<dd class="mt-0.5 font-medium text-foreground">{data.user.email}</dd>
				</div>
				<div>
					<dt class="text-xs font-medium text-muted-foreground">Nama Tampilan (Profiles)</dt>
					<dd class="mt-0.5 text-foreground">
						{data.profile?.display_name ?? 'Belum diatur'}
					</dd>
				</div>
				<div>
					<dt class="text-xs font-medium text-muted-foreground">Role Terverifikasi (user_roles)</dt>
					<dd class="mt-0.5 flex gap-1">
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
								buyer (default)
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
				<h2 class="mb-2 text-lg font-semibold text-foreground">Vault Kredensial Digital</h2>
				<p class="mb-4 text-sm text-muted-foreground">
					Setiap kredensial produk digital yang Anda beli akan tersimpan aman dengan enkripsi
					terautentikasi dan memiliki batas retensi penyimpanan selama 30 hari sejak serah terima.
				</p>
				<div class="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
					<p class="mb-1 font-medium text-foreground">Status Fondasi (Phase 0):</p>
					Sesi autentikasi SSR dan Row Level Security (RLS) aktif melindungi data pribadi Anda dari akses
					tidak sah.
				</div>
			</div>
		</div>
	</div>
</div>
