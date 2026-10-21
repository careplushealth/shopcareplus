import { neon } from '@neondatabase/serverless';

function mapProductRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating),
    reviewCount: Number(row.review_count || 0),
    inStock: Boolean(row.in_stock),
    stockCount: Number(row.stock_count || 0),
    isBestSeller: Boolean(row.is_best_seller),
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    image: row.image,
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    shortDescription: row.short_description,
    description: row.description || '',
    keyFeatures: Array.isArray(row.key_features) ? row.key_features : [],
    ingredients: row.ingredients || '',
    dosageUsage: row.dosage_usage || '',
    warnings: row.warnings || '',
    deliveryInfo: row.delivery_info || '',
    packSizes: Array.isArray(row.pack_sizes) ? row.pack_sizes : [],
    dietaryTags: Array.isArray(row.dietary_tags) ? row.dietary_tags : [],
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(200).json({ success: true, products: [] });
  }

  try {
    const sql = neon(dbUrl);
    const rows = await sql`
      SELECT * FROM products 
      ORDER BY updated_at DESC, name ASC
    `;
    const products = rows.map(mapProductRow);
    return res.status(200).json({ success: true, products });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
