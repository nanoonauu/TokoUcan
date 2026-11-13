<script lang="ts">
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let { data, children } = $props();

	let isMobileMenuOpen = $state(false);

	onMount(() => {
		const {
			data: { subscription }
		} = data.supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== data.session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}
</script>

<div
	class="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/15 selection:text-foreground"
>
	<!-- Skip to Content Link (Aksesibilitas Keyboard / Screen Reader) -->
	<a
		href="#main-content"
		class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-primary-foreground focus:shadow-md focus:ring-2 focus:ring-ring focus:outline-none"
	>
		Lewati ke konten utama
	</a>

	<!-- Environment Status Banner (Hanya muncul jika Supabase belum disetel) -->
	{#if !data.envValidation.isConfigured}
		<aside
			class="border-b border-amber-500/25 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-900 dark:text-amber-200"
			role="status"
		>
			<div class="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 sm:px-6">
				<svg
					class="size-4 shrink-0 text-amber-600 dark:text-amber-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
				<span>
					<strong>Supabase Belum Dikonfigurasi:</strong> Lengkapi kredensial di file
					<code class="rounded bg-amber-500/20 px-1 py-0.5 font-mono">.env</code> untuk mengaktifkan autentikasi
					database.
				</span>
			</div>
		</aside>
	{/if}

	<!-- Header / Navbar (Selaras dengan lebar max-w-6xl body) -->
	<header
		class="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md transition-all"
	>
		<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
			<!-- Zona Kiri: Brand Identity -->
			<div class="flex items-center">
				<a
					href="/"
					class="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onclick={closeMobileMenu}
				>
					<div
						class="flex size-8.5 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs"
					>
						<svg
							class="size-4.5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 2L2 7l10 5 10-5-10-5z" />
							<path d="M2 17l10 5 10-5" />
							<path d="M2 12l10 5 10-5" />
						</svg>
					</div>
					<div class="flex items-baseline gap-1">
						<span class="text-lg font-extrabold tracking-tight text-foreground">TokoUcan</span>
						<span class="size-1.5 rounded-full bg-brand-gold"></span>
					</div>
				</a>
			</div>

			<!-- Zona Tengah: Centered Floating Navigation Pills (Desktop) -->
			<nav
				aria-label="Navigasi utama"
				class="hidden items-center rounded-full border border-border/80 bg-muted/40 p-1 text-xs font-medium shadow-2xs backdrop-blur-xs md:flex"
			>
				<a
					href="/"
					class="rounded-full px-4 py-1.5 transition-all duration-150 {page.url.pathname === '/'
						? 'bg-background font-semibold text-foreground shadow-xs'
						: 'text-muted-foreground hover:text-foreground'}"
					aria-current={page.url.pathname === '/' ? 'page' : undefined}
				>
					Beranda
				</a>
				<a
					href="/products"
					class="rounded-full px-4 py-1.5 transition-all duration-150 {page.url.pathname.startsWith(
						'/products'
					)
						? 'bg-background font-semibold text-foreground shadow-xs'
						: 'text-muted-foreground hover:text-foreground'}"
					aria-current={page.url.pathname.startsWith('/products') ? 'page' : undefined}
				>
					Katalog
				</a>
				<a
					href="/dashboard"
					class="rounded-full px-4 py-1.5 transition-all duration-150 {page.url.pathname.startsWith(
						'/dashboard'
					)
						? 'bg-background font-semibold text-foreground shadow-xs'
						: 'text-muted-foreground hover:text-foreground'}"
					aria-current={page.url.pathname.startsWith('/dashboard') ? 'page' : undefined}
				>
					Dashboard
				</a>
			</nav>

			<!-- Zona Kanan: Action & Auth Controls -->
			<div class="hidden items-center gap-2.5 md:flex">
				<!-- Quick Search Trigger -->
				<a
					href="/products"
					class="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
					title="Cari Produk di Katalog"
					aria-label="Cari produk"
				>
					<svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</a>

				<div class="h-4 w-px bg-border/80"></div>

				{#if data.user}
					<a
						href="/dashboard"
						class="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:shadow-2xs"
					>
						<span
							class="flex size-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary"
						>
							{data.user.email ? data.user.email.charAt(0).toUpperCase() : 'U'}
						</span>
						<span class="max-w-[120px] truncate">
							{data.user.email?.split('@')[0]}
						</span>
					</a>
					<form action="/auth/logout" method="POST">
						<Button
							type="submit"
							variant="ghost"
							size="sm"
							class="h-8 text-xs font-medium text-muted-foreground hover:text-destructive"
						>
							Keluar
						</Button>
					</form>
				{:else}
					<a href="/auth/login">
						<Button variant="ghost" size="sm" class="h-8 px-3 text-xs font-medium">Masuk</Button>
					</a>
					<a href="/auth/register">
						<Button variant="default" size="sm" class="h-8 px-3.5 text-xs font-semibold shadow-xs">
							Daftar
						</Button>
					</a>
				{/if}
			</div>

			<!-- Mobile Controls: Avatar / Hamburger -->
			<div class="flex items-center gap-2 md:hidden">
				<a
					href="/products"
					class="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted"
					aria-label="Cari produk"
				>
					<svg class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</a>

				<button
					type="button"
					class="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none"
					onclick={toggleMobileMenu}
					aria-expanded={isMobileMenuOpen}
					aria-controls="mobile-nav"
					aria-label={isMobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
				>
					{#if isMobileMenuOpen}
						<svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<svg class="size-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</div>

		<!-- Mobile Navigation Drawer -->
		{#if isMobileMenuOpen}
			<div
				id="mobile-nav"
				class="animate-in border-b border-border bg-card/95 backdrop-blur-md duration-150 slide-in-from-top-2 md:hidden"
			>
				<div class="mx-auto max-w-6xl space-y-4 px-4 pt-3 pb-5">
					<!-- Navigation Links -->
					<nav aria-label="Navigasi menu seluler" class="flex flex-col space-y-1">
						<a
							href="/"
							onclick={closeMobileMenu}
							class="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors {page
								.url.pathname === '/'
								? 'bg-primary/10 font-semibold text-primary'
								: 'text-foreground hover:bg-muted'}"
							aria-current={page.url.pathname === '/' ? 'page' : undefined}
						>
							<span>Beranda</span>
							<svg
								class="size-4 text-muted-foreground"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
						<a
							href="/products"
							onclick={closeMobileMenu}
							class="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors {page.url.pathname.startsWith(
								'/products'
							)
								? 'bg-primary/10 font-semibold text-primary'
								: 'text-foreground hover:bg-muted'}"
							aria-current={page.url.pathname.startsWith('/products') ? 'page' : undefined}
						>
							<span>Katalog Produk</span>
							<svg
								class="size-4 text-muted-foreground"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
						<a
							href="/dashboard"
							onclick={closeMobileMenu}
							class="flex items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors {page.url.pathname.startsWith(
								'/dashboard'
							)
								? 'bg-primary/10 font-semibold text-primary'
								: 'text-foreground hover:bg-muted'}"
							aria-current={page.url.pathname.startsWith('/dashboard') ? 'page' : undefined}
						>
							<span>Dashboard Vault</span>
							<svg
								class="size-4 text-muted-foreground"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</nav>

					<!-- Mobile Auth Actions -->
					<div class="border-t border-border pt-3.5">
						{#if data.user}
							<div class="flex items-center justify-between gap-3">
								<div class="flex items-center gap-2 truncate">
									<span
										class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
									>
										{data.user.email ? data.user.email.charAt(0).toUpperCase() : 'U'}
									</span>
									<span class="truncate text-xs font-medium text-foreground">{data.user.email}</span
									>
								</div>
								<form action="/auth/logout" method="POST" onsubmit={closeMobileMenu}>
									<Button type="submit" variant="outline" size="sm" class="h-8 text-xs">
										Keluar
									</Button>
								</form>
							</div>
						{:else}
							<div class="grid grid-cols-2 gap-2.5">
								<a href="/auth/login" onclick={closeMobileMenu}>
									<Button variant="outline" size="sm" class="w-full text-xs font-medium">
										Masuk
									</Button>
								</a>
								<a href="/auth/register" onclick={closeMobileMenu}>
									<Button variant="default" size="sm" class="w-full text-xs font-semibold">
										Daftar Akun
									</Button>
								</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</header>

	<!-- Main Page Content -->
	<main id="main-content" tabindex="-1" class="flex-1 focus:outline-none">
		{@render children()}
	</main>

	<!-- Clean Professional Footer (Selaras dengan lebar max-w-6xl body) -->
	<footer class="border-t border-border/80 bg-card/40 text-muted-foreground">
		<div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
				<!-- Brand Column -->
				<div class="space-y-3 lg:col-span-2">
					<div class="flex items-center gap-2">
						<div
							class="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
						>
							<svg
								class="size-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M12 2L2 7l10 5 10-5-10-5z" />
								<path d="M2 17l10 5 10-5" />
								<path d="M2 12l10 5 10-5" />
							</svg>
						</div>
						<span class="text-base font-bold text-foreground">TokoUcan</span>
					</div>
					<p class="max-w-sm text-xs leading-relaxed text-muted-foreground">
						Marketplace barang digital resmi dan terverifikasi. Transaksi transparan dengan serah
						terima otomatis, enkripsi kredensial vault, dan kebijakan retensi 30 hari.
					</p>
					<div
						class="flex items-center gap-2 pt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
					>
						<span class="size-2 rounded-full bg-emerald-500"></span>
						Sistem Operasional &amp; Pengiriman Siap
					</div>
				</div>

				<!-- Links: Marketplace -->
				<nav aria-label="Tautan marketplace" class="space-y-2.5">
					<p class="text-xs font-semibold tracking-wider text-foreground uppercase">Marketplace</p>
					<ul class="space-y-1.5 text-xs">
						<li>
							<a href="/products" class="transition-colors hover:text-foreground">Semua Produk</a>
						</li>
						<li>
							<a
								href="/products?category=software-os"
								class="transition-colors hover:text-foreground">Lisensi Software</a
							>
						</li>
						<li>
							<a
								href="/products?category=produktivitas"
								class="transition-colors hover:text-foreground">Akun Produktivitas</a
							>
						</li>
						<li>
							<a
								href="/products?category=desain-kreatif"
								class="transition-colors hover:text-foreground">Tools Desain</a
							>
						</li>
					</ul>
				</nav>

				<!-- Links: Security -->
				<div class="space-y-2.5">
					<p class="text-xs font-semibold tracking-wider text-foreground uppercase">
						Keamanan &amp; Data
					</p>
					<ul class="space-y-1.5 text-xs">
						<li><span class="text-foreground/80">Retensi 30 Hari Otomatis</span></li>
						<li><span class="text-foreground/80">Enkripsi AES-256 Vault</span></li>
						<li><span class="text-foreground/80">Legalitas Pemindahtanganan</span></li>
						<li><span class="text-foreground/80">Anti-Pencurian Akun</span></li>
					</ul>
				</div>

				<!-- Links: Account -->
				<nav aria-label="Tautan akun pembeli" class="space-y-2.5">
					<p class="text-xs font-semibold tracking-wider text-foreground uppercase">Akun Pembeli</p>
					<ul class="space-y-1.5 text-xs">
						<li>
							<a href="/dashboard" class="transition-colors hover:text-foreground"
								>Dashboard Pribadi</a
							>
						</li>
						<li>
							<a href="/auth/login" class="transition-colors hover:text-foreground">Masuk Akun</a>
						</li>
						<li>
							<a href="/auth/register" class="transition-colors hover:text-foreground"
								>Daftar Pembeli Baru</a
							>
						</li>
						<li>
							<a href="/auth/reset-password" class="transition-colors hover:text-foreground"
								>Bantuan Kata Sandi</a
							>
						</li>
					</ul>
				</nav>
			</div>

			<!-- Bottom Bar -->
			<div
				class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground/80 sm:flex-row"
			>
				<p>&copy; 2026 TokoUcan. Hak cipta dilindungi undang-undang.</p>
				<p class="text-[11px]">
					Hanya memperdagangkan barang digital yang sah dialihkan sesuai ketentuan penyedia.
				</p>
			</div>
		</div>
	</footer>
</div>
