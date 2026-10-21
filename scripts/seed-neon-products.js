import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf-8');
    const match = envFile.match(/DATABASE_URL="([^"]+)"/);
    if (match) return match[1];
  } catch {}
  throw new Error('DATABASE_URL not found in .env.local');
}

async function run() {
  const dbUrl = getDatabaseUrl();
  console.log('Connecting to Neon Postgres to create and seed products table...');
  const sql = neon(dbUrl);

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(100) PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      category VARCHAR(100) NOT NULL,
      subcategory VARCHAR(100) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      original_price NUMERIC(10, 2),
      rating NUMERIC(3, 1) DEFAULT 5.0,
      review_count INTEGER DEFAULT 0,
      in_stock BOOLEAN DEFAULT true,
      stock_count INTEGER DEFAULT 50,
      is_best_seller BOOLEAN DEFAULT false,
      is_featured BOOLEAN DEFAULT false,
      is_new BOOLEAN DEFAULT false,
      image TEXT NOT NULL,
      gallery_images JSONB DEFAULT '[]'::jsonb,
      short_description TEXT NOT NULL,
      description TEXT,
      key_features JSONB DEFAULT '[]'::jsonb,
      ingredients TEXT,
      dosage_usage TEXT,
      warnings TEXT,
      delivery_info TEXT,
      pack_sizes JSONB DEFAULT '[]'::jsonb,
      dietary_tags JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `;
  console.log('✓ Table "products" created/verified in Neon.');

  // Import products dynamically from compiled or parsed products.ts
  const productsFile = fs.readFileSync(path.resolve(process.cwd(), 'src/data/products.ts'), 'utf-8');
  
  // Extract products array using node execution or regex
  // Let's seed the existing products
  const productsModule = await import('../src/data/products.ts');
  const products = productsModule.PRODUCTS || [];

  console.log(`Seeding ${products.length} products into Neon Postgres...`);

  for (const p of products) {
    await sql`
      INSERT INTO products (
        id, slug, name, brand, category, subcategory, price, original_price,
        rating, review_count, in_stock, stock_count, is_best_seller, is_featured, is_new,
        image, gallery_images, short_description, description, key_features,
        ingredients, dosage_usage, warnings, delivery_info, pack_sizes, dietary_tags
      ) VALUES (
        ${p.id}, ${p.slug}, ${p.name}, ${p.brand}, ${p.category}, ${p.subcategory},
        ${p.price}, ${p.originalPrice || null}, ${p.rating}, ${p.reviewCount},
        ${p.inStock}, ${p.stockCount}, ${Boolean(p.isBestSeller)}, ${Boolean(p.isFeatured)}, ${Boolean(p.isNew)},
        ${p.image}, ${JSON.stringify(p.galleryImages || [])}, ${p.shortDescription},
        ${p.description || ''}, ${JSON.stringify(p.keyFeatures || [])},
        ${p.ingredients || ''}, ${p.dosageUsage || ''}, ${p.warnings || ''},
        ${p.deliveryInfo || ''}, ${JSON.stringify(p.packSizes || [])}, ${JSON.stringify(p.dietaryTags || [])}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        stock_count = EXCLUDED.stock_count,
        in_stock = EXCLUDED.in_stock,
        image = EXCLUDED.image,
        updated_at = NOW();
    `;
  }

  const count = await sql`SELECT COUNT(*) FROM products;`;
  console.log(`✓ Products table now contains ${count[0].count} products in Neon Postgres!`);
}

run().catch((err) => {
  console.error('Error seeding products:', err);
  process.exit(1);
});
