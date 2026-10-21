import { neon } from '@neondatabase/serverless';
import url from 'url';

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return res.status(200).json({ success: true, message: 'DATABASE_URL not configured in environment' });
  }

  const parsedUrl = url.parse(req.url || '', true);
  let id = parsedUrl.query.id;
  if (!id) {
    const parts = (parsedUrl.pathname || '').split('/');
    const lastPart = parts[parts.length - 1];
    if (lastPart && lastPart !== 'products') {
      id = decodeURIComponent(lastPart);
    }
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch {}
  }
  if (!id && body?.id) id = body.id;

  const sql = neon(dbUrl);

  // 1. GET ALL
  if (req.method === 'GET') {
    try {
      const rows = await sql`
        SELECT * FROM products 
        ORDER BY updated_at DESC, name ASC
      `;
      return res.status(200).json({ success: true, products: rows.map(mapProductRow) });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. CREATE (POST)
  if (req.method === 'POST') {
    try {
      const p = body || {};
      const newId = p.id || `cp-${Date.now().toString(36)}`;
      const slug = p.slug || (p.name || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      await sql`
        INSERT INTO products (
          id, slug, name, brand, category, subcategory, price, original_price,
          rating, review_count, in_stock, stock_count, is_best_seller, is_featured, is_new,
          image, gallery_images, short_description, description, key_features,
          ingredients, dosage_usage, warnings, delivery_info, pack_sizes, dietary_tags
        ) VALUES (
          ${newId},
          ${slug},
          ${p.name || 'New Product'},
          ${p.brand || 'CarePlus Approved'},
          ${p.category || 'Everyday Healthcare'},
          ${p.subcategory || 'General'},
          ${Number(p.price || 0)},
          ${p.originalPrice ? Number(p.originalPrice) : null},
          ${Number(p.rating || 5.0)},
          ${Number(p.reviewCount || 0)},
          ${p.inStock !== false},
          ${Number(p.stockCount ?? 50)},
          ${Boolean(p.isBestSeller)},
          ${Boolean(p.isFeatured)},
          ${Boolean(p.isNew)},
          ${p.image || '/images/products/panadol-advance.jpg'},
          ${JSON.stringify(p.galleryImages || [p.image || '/images/products/panadol-advance.jpg'])},
          ${p.shortDescription || p.name || ''},
          ${p.description || ''},
          ${JSON.stringify(p.keyFeatures || [])},
          ${p.ingredients || ''},
          ${p.dosageUsage || ''},
          ${p.warnings || ''},
          ${p.deliveryInfo || 'Dispatched promptly via Royal Mail.'},
          ${JSON.stringify(p.packSizes || ['Standard Pack'])},
          ${JSON.stringify(p.dietaryTags || [])}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          in_stock = EXCLUDED.in_stock,
          stock_count = EXCLUDED.stock_count,
          updated_at = NOW();
      `;
      return res.status(201).json({ success: true, message: 'Product added successfully to Neon Postgres!', id: newId });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. UPDATE (PUT)
  if (req.method === 'PUT') {
    if (!id) return res.status(400).json({ success: false, message: 'Product ID is required for update' });
    try {
      const p = body || {};
      await sql`
        UPDATE products SET
          name = COALESCE(${p.name}, name),
          brand = COALESCE(${p.brand}, brand),
          category = COALESCE(${p.category}, category),
          subcategory = COALESCE(${p.subcategory}, subcategory),
          price = COALESCE(${p.price !== undefined ? Number(p.price) : null}, price),
          original_price = ${p.originalPrice !== undefined ? (p.originalPrice ? Number(p.originalPrice) : null) : null},
          in_stock = COALESCE(${p.inStock !== undefined ? Boolean(p.inStock) : null}, in_stock),
          stock_count = COALESCE(${p.stockCount !== undefined ? Number(p.stockCount) : null}, stock_count),
          is_best_seller = COALESCE(${p.isBestSeller !== undefined ? Boolean(p.isBestSeller) : null}, is_best_seller),
          is_featured = COALESCE(${p.isFeatured !== undefined ? Boolean(p.isFeatured) : null}, is_featured),
          image = COALESCE(${p.image}, image),
          short_description = COALESCE(${p.shortDescription}, short_description),
          description = COALESCE(${p.description}, description),
          updated_at = NOW()
        WHERE id = ${id};
      `;
      return res.status(200).json({ success: true, message: `Product ${id} updated in Neon Postgres!` });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. DELETE (DELETE)
  if (req.method === 'DELETE') {
    if (!id) return res.status(400).json({ success: false, message: 'Product ID is required for deletion' });
    try {
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.status(200).json({ success: true, message: `Product ${id} deleted from Neon Postgres!` });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
