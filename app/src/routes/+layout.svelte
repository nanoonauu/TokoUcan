<script lang="ts">
	import './layout.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let { data, children } = $props();

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
</script>

<div class="flex min-h-screen flex-col bg-background font-sans text-foreground">
	{#if !data.envValidation.isConfigured}
		<div
			class="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-900 sm:text-sm dark:text-amber-200"
		>
			<span class="font-semibold">Perhatian:</span> Supabase environment variables belum lengkap ({data.envValidation.missingPublic.join(
				', '
			)}). Silakan lengkapi file
			<code class="rounded bg-amber-500/20 px-1 py-0.5 font-mono">.env</code>.
		</div>
	{/if}

	<header class="sticky top-0 z-40 border-b border-border bg-card/50 backdrop-blur">
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<div class="flex items-center gap-6">
				<a
					href="/"
					class="text-xl font-bold tracking-tight text-foreground transition hover:opacity-90"
				>
					TokoUcan
				</a>
				<nav class="hidden items-center gap-4 text-sm font-medium text-muted-foreground sm:flex">
					<a href="/" class="transition hover:text-foreground">Beranda</a>
					<a href="/products" class="transition hover:text-foreground">Katalog</a>
					<a href="/dashboard" class="transition hover:text-foreground">Dashboard</a>
				</nav>
			</div>

			<div class="flex items-center gap-2">
				{#if data.user}
					<span class="hidden text-xs text-muted-foreground md:inline-block">
						{data.user.email}
					</span>
					<form action="/auth/logout" method="POST">
						<Button type="submit" variant="outline" size="sm">Keluar</Button>
					</form>
				{:else}
					<a href="/auth/login">
						<Button variant="ghost" size="sm">Masuk</Button>
					</a>
					<a href="/auth/register">
						<Button variant="default" size="sm">Daftar</Button>
					</a>
				{/if}
			</div>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="border-t border-border py-6 text-center text-xs text-muted-foreground">
		<div class="container mx-auto px-4">
			&copy; 2026 TokoUcan. Marketplace barang digital resmi &amp; aman.
		</div>
	</footer>
</div>
