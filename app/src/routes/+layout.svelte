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
	class="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-foreground"
>
	<!-- Environment Warning Banner (Subtle & Informative) -->
	{#if !data.envValidation.isConfigured}
		<div
			class="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-900 dark:text-amber-200"
			role="status"
		>
			<div class="container mx-auto flex items-center justify-center gap-2">
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
					<strong>Pengaturan Awal:</strong> Supabase environment variables belum lengkap ({data.envValidation.missingPublic.join(
						', '
					)}). Buka file <code class="rounded bg-amber-500/20 px-1 py-0.5 font-mono">.env</code> untuk
					melengkapi.
				</span>
			</div>
		</div>
	{/if}

	<!-- Sticky Header / Navbar -->
	<header
		class="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md transition-all"
	>
		<div class="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
			<!-- Brand Logo -->
			<div class="flex items-center gap-6">
				<a
					href="/"
					class="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onclick={closeMobileMenu}
				>
					<div
						class="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
					>
						<svg
							class="size-5"
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
					<div class="flex flex-col text-left">
						<span class="text-base leading-tight font-bold tracking-tight text-foreground"
							>TokoUcan</span
						>
						<span class="text-[10px] leading-none font-medium text-muted-foreground"
							>Digital Marketplace</span
						>
					</div>
				</a>

				<!-- Desktop Navigation Links -->
				<nav class="hidden items-center gap-1 text-sm font-medium md:flex">
					<a
						href="/"
						class="rounded-md px-3 py-1.5 transition-colors {page.url.pathname === '/'
							? 'bg-muted font-semibold text-foreground'
							: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
					>
						Beranda
					</a>
					<a
						href="/products"
						class="rounded-md px-3 py-1.5 transition-colors {page.url.pathname.startsWith(
							'/products'
						)
							? 'bg-muted font-semibold text-foreground'
							: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
					>
						Katalog
					</a>
					<a
						href="/dashboard"
						class="rounded-md px-3 py-1.5 transition-colors {page.url.pathname.startsWith(
							'/dashboard'
						)
							? 'bg-muted font-semibold text-foreground'
							: 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}"
					>
						Dashboard
					</a>
				</nav>
			</div>

			<!-- Center/Right Search Bar (Desktop) -->
			<div class="mx-4 hidden max-w-xs flex-1 lg:flex">
				<form action="/products" method="GET" class="relative w-full">
					<input
						type="search"
						name="search"
						placeholder="Cari lisensi, akun, software..."
						class="h-9 w-full rounded-lg border border-input bg-muted/40 pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-ring focus:outline-none"
					/>
					<svg
						class="absolute top-2.5 left-2.5 size-4 text-muted-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</form>
			</div>

			<!-- User Profile / Auth Action (Desktop) -->
			<div class="hidden items-center gap-3 md:flex">
				{#if data.user}
					<a
						href="/dashboard"
						class="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-foreground transition-colors hover:bg-muted"
					>
						<div
							class="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary"
						>
							{data.user.email ? data.user.email.charAt(0).toUpperCase() : 'U'}
						</div>
						<span class="max-w-[140px] truncate font-medium">
							{data.user.email?.split('@')[0]}
						</span>
					</a>
					<form action="/auth/logout" method="POST">
						<Button type="submit" variant="outline" size="sm" class="h-8 text-xs">Keluar</Button>
					</form>
				{:else}
					<a href="/auth/login">
						<Button variant="ghost" size="sm" class="h-8 text-xs font-medium">Masuk</Button>
					</a>
					<a href="/auth/register">
						<Button variant="default" size="sm" class="h-8 text-xs font-medium shadow-sm">
							Daftar Akun
						</Button>
					</a>
				{/if}
			</div>

			<!-- Mobile Hamburger Button -->
			<div class="flex items-center gap-2 md:hidden">
				{#if data.user}
					<a
						href="/dashboard"
						class="flex size-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary"
					>
						{data.user.email ? data.user.email.charAt(0).toUpperCase() : 'U'}
					</a>
				{/if}
				<button
					type="button"
					class="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card p-2 text-foreground transition-colors hover:bg-muted focus:ring-2 focus:ring-ring focus:outline-none"
					onclick={toggleMobileMenu}
					aria-expanded={isMobileMenuOpen}
					aria-label="Toggle navigasi menu"
				>
					{#if isMobileMenuOpen}
						<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<svg class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
				class="animate-in space-y-4 border-b border-border bg-card px-4 pt-3 pb-5 duration-200 slide-in-from-top-2 md:hidden"
			>
				<!-- Search Bar in Mobile -->
				<form action="/products" method="GET" class="relative w-full" onsubmit={closeMobileMenu}>
					<input
						type="search"
						name="search"
						placeholder="Cari produk digital..."
						class="h-9 w-full rounded-lg border border-input bg-background pr-3 pl-8 text-xs text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
					/>
					<svg
						class="absolute top-2.5 left-2.5 size-4 text-muted-foreground"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</form>

				<!-- Nav Links in Mobile -->
				<nav class="flex flex-col space-y-1">
					<a
						href="/"
						onclick={closeMobileMenu}
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors {page
							.url.pathname === '/'
							? 'bg-primary/10 font-semibold text-primary'
							: 'text-foreground hover:bg-muted'}"
					>
						<svg class="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
							/>
						</svg>
						Beranda
					</a>
					<a
						href="/products"
						onclick={closeMobileMenu}
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors {page.url.pathname.startsWith(
							'/products'
						)
							? 'bg-primary/10 font-semibold text-primary'
							: 'text-foreground hover:bg-muted'}"
					>
						<svg class="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
							/>
						</svg>
						Katalog Produk
					</a>
					<a
						href="/dashboard"
						onclick={closeMobileMenu}
						class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors {page.url.pathname.startsWith(
							'/dashboard'
						)
							? 'bg-primary/10 font-semibold text-primary'
							: 'text-foreground hover:bg-muted'}"
					>
						<svg class="size-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						Dashboard Vault
					</a>
				</nav>

				<!-- Auth in Mobile -->
				<div class="border-t border-border/80 pt-3">
					{#if data.user}
						<div class="flex items-center justify-between pb-2">
							<span class="truncate text-xs text-muted-foreground">{data.user.email}</span>
							<form action="/auth/logout" method="POST" onsubmit={closeMobileMenu}>
								<Button type="submit" variant="outline" size="sm" class="text-xs">Keluar</Button>
							</form>
						</div>
					{:else}
						<div class="grid grid-cols-2 gap-2">
							<a href="/auth/login" onclick={closeMobileMenu}>
								<Button variant="outline" size="sm" class="w-full text-xs">Masuk</Button>
							</a>
							<a href="/auth/register" onclick={closeMobileMenu}>
								<Button variant="default" size="sm" class="w-full text-xs">Daftar Akun</Button>
							</a>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</header>

	<!-- Main Page Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	<!-- Comprehensive Modern Footer -->
	<footer class="border-t border-border bg-card/40 text-muted-foreground">
		<div class="container mx-auto px-4 py-12 sm:px-6">
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
				<!-- Brand Col -->
				<div class="space-y-3 lg:col-span-2">
					<div class="flex items-center gap-2.5">
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
						<span class="size-2 animate-pulse rounded-full bg-emerald-500"></span>
						Sistem Operasional &amp; Pengiriman Aktif
					</div>
				</div>

				<!-- Marketplace Col -->
				<div class="space-y-2.5">
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
				</div>

				<!-- Keamanan Col -->
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

				<!-- Akun Col -->
				<div class="space-y-2.5">
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
				</div>
			</div>

			<!-- Bottom Copyright Bar -->
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
