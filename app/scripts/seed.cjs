/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require('crypto');

// Master encryption key (32 bytes)
const rawKey = 'tokoucan-master-secret-key-32b!!';
const cipherKey = Buffer.from(rawKey, 'utf-8');

function encryptSecret(plaintext) {
	const iv = crypto.randomBytes(12); // 96 bits
	const cipher = crypto.createCipheriv('aes-256-gcm', cipherKey, iv);
	let encrypted = cipher.update(plaintext, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	const tag = cipher.getAuthTag().toString('hex');
	return {
		ciphertext: encrypted,
		iv: iv.toString('hex'),
		tag: tag
	};
}

const token = process.env.SUPABASE_ACCESS_TOKEN;
const ref = process.env.SUPABASE_PROJECT_REF || 'qxncscbzvvrnljlszngn';

if (!token) {
	console.error('Error: Set SUPABASE_ACCESS_TOKEN environment variable before running this script.');
	process.exit(1);
}

async function seed() {
	const categories = [
		{
			id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
			name: 'Lisensi Software',
			slug: 'software-os',
			description:
				'Kunci aktivasi dan lisensi resmi software profesional, sistem operasi, dan utilitas.',
			icon: 'code',
			sort_order: 1,
			is_active: true
		},
		{
			id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
			name: 'Akun Produktivitas',
			slug: 'produktivitas',
			description:
				'Akun langganan resmi untuk produktivitas kerja, kolaborasi tim, dan office suite.',
			icon: 'briefcase',
			sort_order: 2,
			is_active: true
		},
		{
			id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
			name: 'Desain & Kreatif',
			slug: 'desain-kreatif',
			description: 'Tools pembuatan konten grafis, editing visual, dan generator AI terverifikasi.',
			icon: 'palette',
			sort_order: 3,
			is_active: true
		},
		{
			id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
			name: 'Cloud & Developer',
			slug: 'cloud-dev',
			description: 'Server credit, lisensi IDE developer, dan platform cloud terverifikasi.',
			icon: 'server',
			sort_order: 4,
			is_active: true
		}
	];

	const products = [
		{
			id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11',
			category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
			title: 'Microsoft 365 Personal (Langganan 1 Tahun Resmi)',
			slug: 'microsoft-365-personal-1-tahun',
			description:
				'Akses penuh aplikasi Word, Excel, PowerPoint, dan Outlook dengan cloud storage OneDrive 1TB. Aktivasi resmi ke email pembeli.',
			price: 249000,
			status: 'published',
			transfer_terms:
				'Produk ini dialokasikan dari lisensi resmi distributor terdaftar yang sah dipindahtangankan tanpa melanggar ketentuan Microsoft.',
			retention_notice:
				'Kredensial dan kode lisensi tersimpan di vault pribadi Anda dengan retensi 30 hari pasca serah terima.'
		},
		{
			id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b22',
			category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
			title: 'Windows 11 Pro Retail License (Aktivasi Permanen)',
			slug: 'windows-11-pro-retail-permanen',
			description:
				'Product key resmi Windows 11 Pro edisi Retail dengan aktivasi online langsung via server Microsoft. Bebas install ulang seumur hidup.',
			price: 185000,
			status: 'published',
			transfer_terms:
				'Lisensi Retail legal dan terverifikasi digital entitlement yang sah dipindahtangankan untuk 1 perangkat PC/Laptop.',
			retention_notice:
				'Kode aktivasi disimpan di vault terenkripsi dan dihapus secara soft delete setelah 30 hari.'
		},
		{
			id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b33',
			category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
			title: 'Canva Pro Team Member (Garansi 1 Tahun)',
			slug: 'canva-pro-member-1-tahun',
			description:
				'Akses tanpa batas ke jutaan aset grafis premium, Magic Resize, background remover, font kustom, dan generator AI Canva.',
			price: 89000,
			status: 'published',
			transfer_terms:
				'Aktivasi resmi melalui undangan tim legal yang memenuhi syarat transferability penyedia layanan.',
			retention_notice:
				'Kredensial aktivasi diproteksi enkripsi AES-256 dan secara permanen dimusnahkan setelah 30 hari.'
		},
		{
			id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b44',
			category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
			title: 'Adobe Creative Cloud All Apps (Langganan 3 Bulan Resmi)',
			slug: 'adobe-cc-all-apps-3-bulan',
			description:
				'Akses 20+ aplikasi desktop Adobe termasuk Photoshop, Illustrator, Premiere Pro, After Effects, plus 100GB Cloud Storage.',
			price: 375000,
			status: 'published',
			transfer_terms:
				'Undangan lisensi resmi Adobe enterprise seat yang dipindahtangankan secara sah ke email pembeli.',
			retention_notice:
				'Detail kredensial dienkripsi dan dibersihkan otomatis 30 hari pasca aktivasi.'
		},
		{
			id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b55',
			category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
			title: 'Notion Plus + AI Unlimited (Langganan 1 Tahun)',
			slug: 'notion-plus-ai-1-tahun',
			description:
				'Ruang kerja produktivitas tanpa batas untuk catatan, database, manajemen proyek tim, serta fitur Notion AI tanpa kuota batasan.',
			price: 145000,
			status: 'published',
			transfer_terms:
				'Aktivasi workspace resmi dengan transfer hak kepemilikan admin ke akun email Anda.',
			retention_notice:
				'Data login dan token workspace tersimpan di vault selama 30 hari untuk verifikasi.'
		},
		{
			id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b66',
			category_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
			title: 'JetBrains All Products Pack (Lisensi Individual 1 Tahun)',
			slug: 'jetbrains-all-products-pack',
			description:
				'Lisensi lengkap untuk semua IDE JetBrains: IntelliJ IDEA Ultimate, WebStorm, PyCharm Pro, GoLand, CLion, dan DataGrip.',
			price: 490000,
			status: 'published',
			transfer_terms:
				'Kunci lisensi resmi aktivasi mandiri yang sah dialihkan sesuai ketentuan lisensi software komersial.',
			retention_notice:
				'Data rahasia lisensi akan dihapus otomatis dari server TokoUcan dalam 30 hari setelah pesanan selesai.'
		}
	];

	let sql = 'BEGIN;\n';

	// Seed Categories
	for (const c of categories) {
		const safeName = c.name.replace(/'/g, "''");
		const safeDesc = c.description.replace(/'/g, "''");
		sql += `INSERT INTO public.categories (id, name, slug, description, icon, sort_order, is_active) VALUES ('${c.id}', '${safeName}', '${c.slug}', '${safeDesc}', '${c.icon}', ${c.sort_order}, true) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;\n`;
	}

	// Seed Products
	for (const p of products) {
		const safeTitle = p.title.replace(/'/g, "''");
		const safeDesc = p.description.replace(/'/g, "''");
		const safeTerms = p.transfer_terms.replace(/'/g, "''");
		const safeNotice = p.retention_notice.replace(/'/g, "''");
		sql += `INSERT INTO public.products (id, category_id, title, slug, description, price, status, transfer_terms, retention_notice) VALUES ('${p.id}', '${p.category_id}', '${safeTitle}', '${p.slug}', '${safeDesc}', ${p.price}, '${p.status}', '${safeTerms}', '${safeNotice}') ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, description = EXCLUDED.description;\n`;
	}

	// Seed Available Vault Stock for Each Product
	for (const p of products) {
		for (let i = 1; i <= 3; i++) {
			const dummySecret = JSON.stringify({
				account: `user_${p.slug.substring(0, 8)}_${i}@tokoucan.id`,
				license_key: `UCAN-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
				instructions: 'Gunakan kredensial ini untuk login atau aktivasi di portal resmi.'
			});
			const enc = encryptSecret(dummySecret);
			sql += `INSERT INTO public.vault_credentials (product_id, credential_type, label, ciphertext, iv, tag, key_id, status) VALUES ('${p.id}', 'account', 'Stok Siap Kirim #${i}', '${enc.ciphertext}', '${enc.iv}', '${enc.tag}', 'v1', 'available');\n`;
		}
	}

	sql += 'COMMIT;\n';

	console.log('Sending seed query to Supabase...');
	const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query: sql })
	});

	const data = await res.json();
	if (!res.ok) {
		console.error('Seed failed:', data);
		process.exit(1);
	}
	console.log('SEED DATA INSERTED SUCCESSFULLY!');
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
