import type { PageServerLoad } from './$types';
import { getActiveCategories, getPublishedProducts } from '#lib/server/catalog.js';
import type { Product, Category } from '#lib/schemas/catalog.js';

// Curated sample data shown when Supabase database is still empty (e.g. before initial migration is seeded)
const fallbackCategories: Category[] = [
	{
		id: 'cat-1',
		name: 'Lisensi Software',
		slug: 'software-os',
		description: 'Kunci aktivasi dan lisensi resmi software profesional.',
		icon: 'code',
		sort_order: 1,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'cat-2',
		name: 'Akun Produktivitas',
		slug: 'produktivitas',
		description: 'Akun langganan resmi untuk produktivitas kerja dan tim.',
		icon: 'briefcase',
		sort_order: 2,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'cat-3',
		name: 'Desain & Kreatif',
		slug: 'desain-kreatif',
		description: 'Tools pembuatan konten, editing visual, dan AI generation.',
		icon: 'palette',
		sort_order: 3,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	},
	{
		id: 'cat-4',
		name: 'Cloud & Developer',
		slug: 'cloud-dev',
		description: 'Server credit, developer tools, dan platform cloud terverifikasi.',
		icon: 'server',
		sort_order: 4,
		is_active: true,
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString()
	}
];

const fallbackFeaturedProducts: Product[] = [
	{
		id: 'prod-1',
		category_id: 'cat-1',
		title: 'Microsoft 365 Personal (Langganan 1 Tahun Resmi)',
		slug: 'microsoft-365-personal-1-tahun',
		description:
			'Akses penuh aplikasi Word, Excel, PowerPoint, dan Outlook dengan cloud storage OneDrive 1TB. Aktivasi resmi ke email pembeli.',
		price: 249000,
		status: 'published',
		transfer_terms:
			'Produk ini dialokasikan dari lisensi resmi distributor terdaftar yang sah dipindahtangankan tanpa melanggar ketentuan Microsoft.',
		retention_notice:
			'Kredensial dan kode lisensi tersimpan di vault pribadi Anda dengan retensi 30 hari pasca serah terima.',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		category: fallbackCategories[0]
	},
	{
		id: 'prod-2',
		category_id: 'cat-2',
		title: 'Canva Pro Edu / Team Member (Garansi 1 Tahun)',
		slug: 'canva-pro-member-1-tahun',
		description:
			'Akses tanpa batas ke jutaan aset grafis premium, Magic Resize, background remover, dan generator AI Canva.',
		price: 89000,
		status: 'published',
		transfer_terms:
			'Aktivasi resmi melalui undangan tim legal yang memenuhi syarat transferability penyedia.',
		retention_notice:
			'Kredensial aktivasi diproteksi enkripsi AES-256 dan secara permanen dimusnahkan setelah 30 hari.',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		category: fallbackCategories[1]
	},
	{
		id: 'prod-3',
		category_id: 'cat-4',
		title: 'JetBrains All Products Pack (Lisensi Individual 1 Tahun)',
		slug: 'jetbrains-all-products-pack',
		description:
			'Lisensi lengkap untuk semua IDE JetBrains: IntelliJ IDEA Ultimate, WebStorm, PyCharm Pro, GoLand, CLion, dan DataGrip.',
		price: 490000,
		status: 'published',
		transfer_terms:
			'Kunci lisensi resmi aktivasi mandiri yang sah dialihkan sesuai lisensi software komersial.',
		retention_notice:
			'Data rahasia lisensi akan dihapus otomatis dari server TokoUcan dalam 30 hari setelah pesanan selesai.',
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
		category: fallbackCategories[3]
	}
];

export const load: PageServerLoad = async ({ locals }) => {
	const [dbCategories, dbCatalogResult] = await Promise.all([
		getActiveCategories(locals.supabase),
		getPublishedProducts(locals.supabase, { limit: 6, sort: 'newest', page: 1 })
	]);

	const categories = dbCategories.length > 0 ? dbCategories : fallbackCategories;
	const featuredProducts =
		dbCatalogResult.products.length > 0 ? dbCatalogResult.products : fallbackFeaturedProducts;

	return {
		categories,
		featuredProducts,
		isUsingSampleData: dbCatalogResult.products.length === 0
	};
};
