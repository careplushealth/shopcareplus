
let _neon;
async function getNeonSql(dbUrl) {
  if (!_neon) {
    const mod = await import("@neondatabase/serverless");
    _neon = mod.neon;
  }
  return _neon(dbUrl);
}

let _Stripe;
async function createStripe(secretKey, options) {
  if (!_Stripe) {
    const mod = await import("stripe");
    _Stripe = mod.default || mod;
  }
  return new _Stripe(secretKey, options);
}


import url from "url";
import fs from "fs";
import path from "path";

function getStripeKeys() {
  let secretKey = process.env.STRIPE_SECRET_KEY || "";
  let publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
    const secretMatch = envFile.match(/STRIPE_SECRET_KEY=["']?([^"'\n\r]+)["']?/);
    const pubMatch = envFile.match(/VITE_STRIPE_PUBLISHABLE_KEY=["']?([^"'\n\r]+)["']?/);
    if (secretMatch) secretKey = secretMatch[1].trim();
    if (pubMatch) publishableKey = pubMatch[1].trim();
  } catch {
  }
  return { secretKey, publishableKey };
}
function getDbUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
    const match = envFile.match(/DATABASE_URL=["']?([^"'\n\r]+)["']?/);
    if (match) return match[1].trim();
  } catch {
  }
  return "";
}
function getAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf-8");
    const match = envFile.match(/ADMIN_PASSWORD=["']?([^"'\n\r]+)["']?/);
    if (match) return match[1].trim();
  } catch {
  }
  return "careplus2026!";
}
function getNeonBranch() {
  return process.env.NEON_BRANCH || "production";
}
function verifyAuthHeader(req, adminPassword) {
  const auth = req.headers["authorization"];
  if (!auth || !auth.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith("careplus-admin:");
  } catch {
    return false;
  }
}
function mapProductRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category,
    subcategory: row.subcategory,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : void 0,
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
    description: row.description || "",
    keyFeatures: Array.isArray(row.key_features) ? row.key_features : [],
    ingredients: row.ingredients || "",
    dosageUsage: row.dosage_usage || "",
    warnings: row.warnings || "",
    deliveryInfo: row.delivery_info || "",
    packSizes: Array.isArray(row.pack_sizes) ? row.pack_sizes : [],
    dietaryTags: Array.isArray(row.dietary_tags) ? row.dietary_tags : []
  };
}
function parseJsonBody(req) {
  if (req.body) {
    if (typeof req.body === "string") {
      try {
        return Promise.resolve(JSON.parse(req.body));
      } catch {
        return Promise.resolve({});
      }
    }
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}
async function handleApiRequest(req, res) {
  const parsedUrl = url.parse(req.url || "", true);
  let pathname = parsedUrl.pathname || "";
  if (parsedUrl.query && parsedUrl.query.__path) {
    pathname = "/api/" + parsedUrl.query.__path;
  } else if (req.headers["x-matched-path"] && req.headers["x-matched-path"].startsWith("/api")) {
    pathname = req.headers["x-matched-path"];
  }

  const matchedPath = req.headers["x-matched-path"];
  if (typeof matchedPath === "string" && matchedPath.startsWith("/api")) {
    pathname = matchedPath;
  }
  if (!pathname.startsWith("/api")) {
    pathname = "/api" + (pathname.startsWith("/") ? pathname : "/" + pathname);
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return true;
  }
  const dbUrl = getDbUrl();
  const adminPassword = getAdminPassword();
  const neonBranch = getNeonBranch();
  res.setHeader("Content-Type", "application/json");
  if (pathname === "/api/health") {
    if (!dbUrl) {
      res.statusCode = 503;
      return res.end(
        JSON.stringify({
          status: "error",
          database: "disconnected",
          databaseUrlConfigured: false,
          message: "DATABASE_URL is not configured."
        })
      );
    }
    try {
      const sql = await getNeonSql(dbUrl);
      const result = await sql`SELECT 1 as connected, NOW() as server_time, version() as version`;
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          status: "ok",
          database: "connected",
          databaseUrlConfigured: true,
          neonBranch: getNeonBranch(),
          time: result[0]?.server_time,
          version: result[0]?.version
        })
      );
    } catch (err) {
      res.statusCode = 500;
      return res.end(
        JSON.stringify({
          status: "error",
          database: "disconnected",
          databaseUrlConfigured: true,
          error: err.message
        })
      );
    }
  }
  if (pathname === "/api/products" && req.method === "GET") {
    if (!dbUrl) {
      res.statusCode = 503;
      return res.end(JSON.stringify({ success: false, error: "Database not configured" }));
    }
    try {
      const sql = await getNeonSql(dbUrl);
      const rows = await sql`
          SELECT * FROM products 
          ORDER BY updated_at DESC, name ASC
        `;
      const products = rows.map(mapProductRow);
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, products }));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }
  if (pathname === "/api/stripe-config" && req.method === "GET") {
    const { secretKey, publishableKey } = getStripeKeys();
    const configured = Boolean(
      secretKey && publishableKey && (secretKey.startsWith("sk_test_") || secretKey.startsWith("sk_live_")) && (publishableKey.startsWith("pk_test_") || publishableKey.startsWith("pk_live_"))
    );
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        configured,
        publishableKey: publishableKey || "",
        currency: "gbp"
      })
    );
  }
  if (pathname === "/api/stripe-config" && req.method === "POST") {
    try {
      const { secretKey: existingSecret } = getStripeKeys();
      if (existingSecret && !verifyAuthHeader(req, adminPassword)) {
        res.statusCode = 403;
        return res.end(
          JSON.stringify({
            success: false,
            error: "Forbidden. Admin authentication required to update payment gateway keys."
          })
        );
      }
      const body = await parseJsonBody(req);
      const secretKey = (body.secretKey || "").trim();
      const publishableKey = (body.publishableKey || "").trim();
      if (!secretKey || !publishableKey) {
        res.statusCode = 400;
        return res.end(
          JSON.stringify({
            success: false,
            error: "Both Secret Key (sk_...) and Publishable Key (pk_...) are required."
          })
        );
      }
      const stripe = await createStripe(secretKey);
      await stripe.paymentIntents.list({ limit: 1 });
      const envPath = path.resolve(process.cwd(), ".env.local");
      let envContent = "";
      try {
        envContent = fs.readFileSync(envPath, "utf-8");
      } catch {
      }
      if (envContent.includes("STRIPE_SECRET_KEY=")) {
        envContent = envContent.replace(/STRIPE_SECRET_KEY=.*/g, `STRIPE_SECRET_KEY="${secretKey}"`);
      } else {
        envContent += `
STRIPE_SECRET_KEY="${secretKey}"`;
      }
      if (envContent.includes("VITE_STRIPE_PUBLISHABLE_KEY=")) {
        envContent = envContent.replace(/VITE_STRIPE_PUBLISHABLE_KEY=.*/g, `VITE_STRIPE_PUBLISHABLE_KEY="${publishableKey}"`);
      } else {
        envContent += `
VITE_STRIPE_PUBLISHABLE_KEY="${publishableKey}"`;
      }
      fs.writeFileSync(envPath, envContent.trim() + "\n", "utf-8");
      process.env.STRIPE_SECRET_KEY = secretKey;
      process.env.VITE_STRIPE_PUBLISHABLE_KEY = publishableKey;
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          success: true,
          configured: true,
          publishableKey,
          message: "Stripe API keys verified and saved successfully to .env.local!"
        })
      );
    } catch (err) {
      res.statusCode = 400;
      return res.end(
        JSON.stringify({
          success: false,
          error: `Stripe validation failed: ${err.message}`
        })
      );
    }
  }
  if (pathname === "/api/create-checkout-session" && req.method === "POST") {
    try {
      const { secretKey } = getStripeKeys();
      const mode = "payment";
      const body = await parseJsonBody(req).catch(() => ({}));
      const items = Array.isArray(body?.items) && body.items.length > 0 ? body.items : null;
      let line_items = [
        {
          price: "price_...",
          quantity: 1
        }
      ];
      if (items) {
        line_items = items.map((item) => ({
          price_data: {
            currency: "gbp",
            product_data: {
              name: item.product?.name || item.name || "CarePlus Dispensary Item"
            },
            unit_amount: Math.round(Number(item.product?.price || item.price || 0) * 100)
          },
          quantity: Number(item.quantity || 1)
        }));
      }
      const sessionParams = {
        ui_mode: "form",
        mode,
        customer_creation: "always",
        billing_address_collection: "auto",
        phone_number_collection: {
          enabled: false
        },
        automatic_tax: {
          enabled: false
        },
        submit_type: "auto",
        name_collection: {
          individual: {
            enabled: true,
            optional: true
          },
          business: {
            enabled: true,
            optional: true
          }
        },
        saved_payment_method_options: {
          payment_method_save: "enabled"
        },
        integration_identifier: "custom_embedded_web_0001",
        line_items
      };
      if (mode === "subscription") {
        sessionParams.payment_method_collection = "always";
      }
      if (!secretKey) {
        res.statusCode = 200;
        return res.end(
          JSON.stringify({
            client_secret: "cs_test_placeholder_session_secret",
            message: "Please configure STRIPE_SECRET_KEY in .env.local"
          })
        );
      }
      const stripe = await createStripe(secretKey, { apiVersion: "2026-03-25.dahlia" });
      let session;
      try {
        session = await stripe.checkout.sessions.create(sessionParams);
      } catch (sessionErr) {
        if (sessionErr.message?.includes("price_...")) {
          sessionParams.line_items = [
            {
              price_data: {
                currency: "gbp",
                product_data: { name: "CarePlus Health Dispensary Order" },
                unit_amount: 1e3
              },
              quantity: 1
            }
          ];
          session = await stripe.checkout.sessions.create(sessionParams);
        } else {
          throw sessionErr;
        }
      }
      res.statusCode = 200;
      return res.end(JSON.stringify({ client_secret: session.client_secret }));
    } catch (err) {
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          client_secret: "cs_test_placeholder_session_secret",
          error: err.message
        })
      );
    }
  }
  if (pathname === "/api/webhook" && req.method === "POST") {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
      const body = await parseJsonBody(req);
      event = body;
      if (endpointSecret) {
        const { secretKey } = getStripeKeys();
        const stripe = await createStripe(secretKey, { apiVersion: "2026-03-25.dahlia" });
        const signature = req.headers["stripe-signature"];
        if (signature) {
          try {
            event = stripe.webhooks.constructEvent(JSON.stringify(body), signature, endpointSecret);
          } catch (err) {
            console.log("Webhook signature verification failed:", err.message);
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: err.message }));
          }
        }
      }
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data?.object;
          console.log("Checkout completed:", session?.id);
          if (session?.consent?.terms_of_service === "accepted") {
            console.log("Customer accepted terms of service");
          }
          if (session?.consent?.promotions === "opt_in") {
            const email = session?.customer_details?.email;
            console.log("Customer opted in for promotional emails:", email);
          }
          break;
        default:
          console.log("Unhandled event type:", event.type);
      }
      res.statusCode = 200;
      return res.end(JSON.stringify({ received: true }));
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: err.message }));
    }
  }
  if (pathname === "/api/create-payment-intent" && req.method === "POST") {
    try {
      const body = await parseJsonBody(req);
      const items = Array.isArray(body.items) ? body.items : [];
      const customer = body.customer || {};
      const deliveryMethod = body.deliveryMethod || "rm48";
      const promoCode = (body.promoCode || "").trim().toUpperCase();
      const subtotal = items.reduce((acc, item) => {
        const price = Number(item.product?.price || item.price || 0);
        const qty = Number(item.quantity || 1);
        return acc + price * qty;
      }, 0);
      const discountRate = promoCode === "CAREPLUS15" ? 0.15 : promoCode === "SAVE5" ? 0.05 : promoCode === "WELLBEING10" ? 0.1 : 0;
      const discountAmount = subtotal * discountRate;
      const isFreeDelivery = subtotal >= 35;
      let shipping = 0;
      if (deliveryMethod === "rm48") shipping = isFreeDelivery ? 0 : 2.99;
      else if (deliveryMethod === "rm24") shipping = 4.49;
      else if (deliveryMethod === "dpd") shipping = 6.99;
      const grandTotal = Math.max(0, subtotal - discountAmount + shipping);
      const amountInPence = Math.round(grandTotal * 100);
      const orderNumber = `CP-${Math.floor(1e5 + Math.random() * 9e5)}`;
      const { secretKey, publishableKey } = getStripeKeys();
      if (!secretKey || !publishableKey) {
        res.statusCode = 200;
        return res.end(
          JSON.stringify({
            success: false,
            needsConfig: true,
            orderNumber,
            amount: grandTotal,
            currency: "gbp",
            message: "Stripe is ready to be configured. Enter your Stripe keys in .env.local to activate real card payments."
          })
        );
      }
      const stripe = await createStripe(secretKey);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPence,
        currency: "gbp",
        automatic_payment_methods: { enabled: true },
        receipt_email: customer.email || void 0,
        metadata: {
          orderNumber,
          customerName: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
          customerEmail: customer.email || "",
          customerPhone: customer.phone || "",
          postcode: customer.postcode || "",
          deliveryMethod,
          itemsCount: String(items.length)
        },
        description: `CarePlus Health Order ${orderNumber} - Wilmslow Road Pharmacy`
      });
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          orderNumber,
          amount: grandTotal,
          currency: "gbp"
        })
      );
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }
  if (pathname === "/api/orders") {
    if (!dbUrl) {
      res.statusCode = 503;
      return res.end(JSON.stringify({ success: false, error: "Database not configured" }));
    }
    const sql = await getNeonSql(dbUrl);
    if (req.method === "GET") {
      const orderNumber = parsedUrl.query.orderNumber;
      const lookup = parsedUrl.query.lookup;
      try {
        if (orderNumber) {
          const cleanNum = orderNumber.trim().toUpperCase();
          const rows2 = await sql`
              SELECT * FROM orders 
              WHERE UPPER(order_number) = ${cleanNum}
              LIMIT 1
            `;
          if (rows2.length === 0) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ success: false, message: "Order not found" }));
          }
          const row = rows2[0];
          if (lookup) {
            const cleanLookup = lookup.trim().toLowerCase().replace(/\s+/g, "");
            const emailMatch = row.customer_email.toLowerCase() === cleanLookup;
            const postcodeMatch = row.postcode.toLowerCase().replace(/\s+/g, "") === cleanLookup;
            if (!emailMatch && !postcodeMatch) {
              res.statusCode = 403;
              return res.end(JSON.stringify({ success: false, message: "Verification details do not match" }));
            }
          }
          const formattedOrder = {
            orderNumber: row.order_number,
            orderDate: row.order_date,
            items: row.items,
            subtotal: Number(row.subtotal),
            shipping: Number(row.shipping),
            discount: Number(row.discount),
            total: Number(row.total),
            customer: {
              email: row.customer_email,
              phone: row.customer_phone,
              firstName: row.customer_name.split(" ")[0] || "",
              lastName: row.customer_name.split(" ").slice(1).join(" ") || "",
              addressLine1: row.delivery_address,
              city: "",
              postcode: row.postcode,
              country: "United Kingdom",
              deliveryOptionId: "",
              paymentMethod: row.payment_method
            },
            deliveryMethodName: row.delivery_method,
            estimatedDelivery: "2\u20133 Working Days",
            status: row.status || "confirmed"
          };
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true, order: formattedOrder }));
        }
        const rows = await sql`
            SELECT * FROM orders 
            ORDER BY created_at DESC 
            LIMIT 10
          `;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, orders: rows }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (req.method === "POST") {
      const body = await parseJsonBody(req);
      if (!body || !body.orderNumber) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ success: false, error: "Invalid order payload" }));
      }
      try {
        const customerName = `${body.customer?.firstName || ""} ${body.customer?.lastName || ""}`.trim() || "Valued Customer";
        const deliveryAddress = [
          body.customer?.addressLine1,
          body.customer?.addressLine2,
          body.customer?.city
        ].filter(Boolean).join(", ");
        await sql`
            INSERT INTO orders (
              order_number,
              order_date,
              customer_email,
              customer_phone,
              customer_name,
              delivery_address,
              postcode,
              delivery_method,
              payment_method,
              items,
              subtotal,
              shipping,
              discount,
              total,
              status,
              payment_intent_id
            ) VALUES (
              ${body.orderNumber},
              ${body.orderDate || (/* @__PURE__ */ new Date()).toISOString()},
              ${body.customer?.email || "customer@example.co.uk"},
              ${body.customer?.phone || ""},
              ${customerName},
              ${deliveryAddress || "UK Address"},
              ${body.customer?.postcode || "M1"},
              ${body.deliveryMethodName || "Royal Mail Tracked 48"},
              ${body.customer?.paymentMethod || "card"},
              ${JSON.stringify(body.items || [])},
              ${body.subtotal || 0},
              ${body.shipping || 0},
              ${body.discount || 0},
              ${body.total || 0},
              'confirmed',
              ${body.paymentIntentId || null}
            )
            ON CONFLICT (order_number) DO UPDATE SET
              items = EXCLUDED.items,
              total = EXCLUDED.total,
              payment_intent_id = EXCLUDED.payment_intent_id;
          `;
        res.statusCode = 201;
        return res.end(
          JSON.stringify({
            success: true,
            message: "Order saved to Neon Postgres",
            orderNumber: body.orderNumber
          })
        );
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
  }
  if (pathname === "/api/newsletter" && req.method === "POST") {
    if (!dbUrl) {
      res.statusCode = 503;
      return res.end(JSON.stringify({ success: false, error: "Database not configured" }));
    }
    try {
      const body = await parseJsonBody(req);
      if (!body.email) {
        res.statusCode = 400;
        return res.end(JSON.stringify({ success: false, error: "Email is required" }));
      }
      const sql = await getNeonSql(dbUrl);
      await sql`
          INSERT INTO newsletter_subscribers (email)
          VALUES (${body.email.trim().toLowerCase()})
          ON CONFLICT (email) DO NOTHING;
        `;
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, message: "Subscribed to CarePlus updates!" }));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }
  if (pathname === "/api/contact" && req.method === "POST") {
    if (!dbUrl) {
      res.statusCode = 503;
      return res.end(JSON.stringify({ success: false, error: "Database not configured" }));
    }
    try {
      const body = await parseJsonBody(req);
      const sql = await getNeonSql(dbUrl);
      await sql`
          INSERT INTO contact_messages (name, email, order_number, subject, message)
          VALUES (
            ${body.name || "Anonymous"},
            ${body.email || ""},
            ${body.orderNumber || null},
            ${body.subject || "General Inquiry"},
            ${body.message || ""}
          );
        `;
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, message: "Inquiry saved in Neon Postgres" }));
    } catch (err) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ success: false, error: err.message }));
    }
  }
  if (pathname === "/api/admin/login" && req.method === "POST") {
    const body = await parseJsonBody(req);
    const providedPassword = (body.password || "").trim();
    if (!adminPassword) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ success: false, message: "ADMIN_PASSWORD is not configured in server environment." }));
    }
    if (providedPassword && providedPassword === adminPassword) {
      const token = Buffer.from(`careplus-admin:${Date.now()}:${Math.random().toString(36)}`).toString("base64");
      res.statusCode = 200;
      return res.end(
        JSON.stringify({
          success: true,
          token,
          role: "Super Admin",
          pharmacy: "Wilmslow Road Pharmacy (CarePlus)",
          neonBranch: getNeonBranch(),
          expiresIn: "24h"
        })
      );
    }
    res.statusCode = 401;
    return res.end(JSON.stringify({ success: false, message: "Incorrect admin password. Please try again." }));
  }
  if (pathname.startsWith("/api/admin/")) {
    const isAuth = verifyAuthHeader(req, adminPassword);
    if (!isAuth) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ success: false, message: "Unauthorized. Admin authentication required." }));
    }
    if (!dbUrl) {
      res.statusCode = 503;
      return res.end(JSON.stringify({ success: false, error: "Neon database not configured" }));
    }
    const sql = await getNeonSql(dbUrl);
    if (pathname === "/api/admin/verify" && req.method === "GET") {
      res.statusCode = 200;
      return res.end(JSON.stringify({ success: true, authenticated: true, neonBranch: getNeonBranch() }));
    }
    if (pathname === "/api/admin/products" && req.method === "GET") {
      try {
        const rows = await sql`
            SELECT * FROM products 
            ORDER BY updated_at DESC
          `;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, products: rows.map(mapProductRow) }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (pathname === "/api/admin/products" && req.method === "POST") {
      try {
        const p = await parseJsonBody(req);
        if (!p.name || !p.price) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ success: false, message: "Product name and price are required" }));
        }
        const id = p.id || `cp-${Date.now().toString(36)}`;
        const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        await sql`
            INSERT INTO products (
              id, slug, name, brand, category, subcategory, price, original_price,
              rating, review_count, in_stock, stock_count, is_best_seller, is_featured, is_new,
              image, gallery_images, short_description, description, key_features,
              ingredients, dosage_usage, warnings, delivery_info, pack_sizes, dietary_tags
            ) VALUES (
              ${id},
              ${slug},
              ${p.name},
              ${p.brand || "CarePlus Approved"},
              ${p.category || "Everyday Healthcare"},
              ${p.subcategory || "General"},
              ${Number(p.price)},
              ${p.originalPrice ? Number(p.originalPrice) : null},
              ${Number(p.rating || 5)},
              ${Number(p.reviewCount || 0)},
              ${p.inStock !== false},
              ${Number(p.stockCount ?? 50)},
              ${Boolean(p.isBestSeller)},
              ${Boolean(p.isFeatured)},
              ${Boolean(p.isNew)},
              ${p.image || "/images/products/panadol-advance.jpg"},
              ${JSON.stringify(p.galleryImages || [p.image || "/images/products/panadol-advance.jpg"])},
              ${p.shortDescription || p.name},
              ${p.description || ""},
              ${JSON.stringify(p.keyFeatures || [])},
              ${p.ingredients || ""},
              ${p.dosageUsage || ""},
              ${p.warnings || ""},
              ${p.deliveryInfo || "Dispatched promptly via Royal Mail."},
              ${JSON.stringify(p.packSizes || ["Standard Pack"])},
              ${JSON.stringify(p.dietaryTags || [])}
            );
          `;
        res.statusCode = 201;
        return res.end(JSON.stringify({ success: true, message: "Product added successfully to Neon Postgres!", id }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (pathname.startsWith("/api/admin/products/") && req.method === "PUT") {
      const id = pathname.replace("/api/admin/products/", "").trim();
      try {
        const p = await parseJsonBody(req);
        await sql`
            UPDATE products SET
              name = COALESCE(${p.name}, name),
              brand = COALESCE(${p.brand}, brand),
              category = COALESCE(${p.category}, category),
              subcategory = COALESCE(${p.subcategory}, subcategory),
              price = COALESCE(${p.price !== void 0 ? Number(p.price) : null}, price),
              original_price = ${p.originalPrice !== void 0 ? p.originalPrice ? Number(p.originalPrice) : null : null},
              in_stock = COALESCE(${p.inStock !== void 0 ? Boolean(p.inStock) : null}, in_stock),
              stock_count = COALESCE(${p.stockCount !== void 0 ? Number(p.stockCount) : null}, stock_count),
              is_best_seller = COALESCE(${p.isBestSeller !== void 0 ? Boolean(p.isBestSeller) : null}, is_best_seller),
              is_featured = COALESCE(${p.isFeatured !== void 0 ? Boolean(p.isFeatured) : null}, is_featured),
              image = COALESCE(${p.image}, image),
              short_description = COALESCE(${p.shortDescription}, short_description),
              description = COALESCE(${p.description}, description),
              ingredients = COALESCE(${p.ingredients}, ingredients),
              dosage_usage = COALESCE(${p.dosageUsage}, dosage_usage),
              warnings = COALESCE(${p.warnings}, warnings),
              pack_sizes = COALESCE(${p.packSizes ? JSON.stringify(p.packSizes) : null}::jsonb, pack_sizes),
              updated_at = NOW()
            WHERE id = ${id};
          `;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, message: `Product ${id} updated successfully in Neon!` }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (pathname.startsWith("/api/admin/products/") && req.method === "DELETE") {
      const id = pathname.replace("/api/admin/products/", "").trim();
      try {
        await sql`DELETE FROM products WHERE id = ${id}`;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, message: `Product ${id} deleted from Neon Postgres!` }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (pathname === "/api/admin/orders" && req.method === "GET") {
      try {
        const rows = await sql`
            SELECT * FROM orders 
            ORDER BY created_at DESC 
            LIMIT 50
          `;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, orders: rows }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (pathname.startsWith("/api/admin/orders/") && req.method === "PUT") {
      const orderNumber = pathname.replace("/api/admin/orders/", "").trim();
      try {
        const body = await parseJsonBody(req);
        await sql`
            UPDATE orders 
            SET status = ${body.status || "confirmed"}
            WHERE UPPER(order_number) = UPPER(${orderNumber});
          `;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, message: `Order ${orderNumber} updated` }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (pathname === "/api/admin/subscribers" && req.method === "GET") {
      try {
        const rows = await sql`
            SELECT * FROM newsletter_subscribers 
            ORDER BY created_at DESC
          `;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, subscribers: rows }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
    if (pathname === "/api/admin/messages" && req.method === "GET") {
      try {
        const rows = await sql`
            SELECT * FROM contact_messages 
            ORDER BY created_at DESC
          `;
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, messages: rows }));
      } catch (err) {
        res.statusCode = 500;
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ success: false, message: `Endpoint not found: ${pathname}` }));
  return true;
}
export {
  handleApiRequest
};

export default async function handler(req, res) {
  try {
    return await handleApiRequest(req, res);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      success: false,
      error: "Internal Serverless Function Error",
      message: err.message,
      stack: err.stack
    }));
  }
}
