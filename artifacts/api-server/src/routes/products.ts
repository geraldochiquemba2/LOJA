import { Router, type IRouter } from "express";
import { eq, sql, desc, asc, ilike, and, gte, lte } from "drizzle-orm";
import { db, productsTable, categoriesTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetFeaturedProductsResponse,
  GetNewArrivalsQueryParams,
  GetNewArrivalsResponse,
  GetProductParams,
  GetProductResponse,
  GetProductsSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function buildProductSelect() {
  return {
    id: productsTable.id,
    name: productsTable.name,
    description: productsTable.description,
    price: productsTable.price,
    originalPrice: productsTable.originalPrice,
    imageUrl: productsTable.imageUrl,
    images: productsTable.images,
    categoryId: productsTable.categoryId,
    categoryName: categoriesTable.name,
    sizes: productsTable.sizes,
    colors: productsTable.colors,
    inStock: productsTable.inStock,
    featured: productsTable.featured,
    createdAt: productsTable.createdAt,
  };
}

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { categoryId, search, minPrice, maxPrice, sort, limit = 20, offset = 0 } = parsed.data;

  const conditions = [];
  if (categoryId != null) {
    conditions.push(eq(productsTable.categoryId, categoryId));
  }
  if (search) {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }
  if (minPrice != null) {
    conditions.push(gte(productsTable.price, String(minPrice)));
  }
  if (maxPrice != null) {
    conditions.push(lte(productsTable.price, String(maxPrice)));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  switch (sort) {
    case "price_asc":
      orderBy = asc(productsTable.price);
      break;
    case "price_desc":
      orderBy = desc(productsTable.price);
      break;
    case "newest":
      orderBy = desc(productsTable.createdAt);
      break;
    case "name_asc":
      orderBy = asc(productsTable.name);
      break;
    default:
      orderBy = desc(productsTable.createdAt);
  }

  const [products, countResult] = await Promise.all([
    db
      .select(buildProductSelect())
      .from(productsTable)
      .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(where)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(productsTable)
      .where(where),
  ]);

  const total = countResult[0]?.count ?? 0;
  const formattedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  }));

  res.json(
    ListProductsResponse.parse({
      products: formattedProducts,
      total,
      hasMore: offset + limit < total,
    }),
  );
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select(buildProductSelect())
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.featured, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(8);

  const formatted = products.map((p) => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  }));

  res.json(GetFeaturedProductsResponse.parse(formatted));
});

router.get("/products/new-arrivals", async (req, res): Promise<void> => {
  const parsed = GetNewArrivalsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const limit = parsed.data.limit ?? 8;

  const products = await db
    .select(buildProductSelect())
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .orderBy(desc(productsTable.createdAt))
    .limit(limit);

  const formatted = products.map((p) => ({
    ...p,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  }));

  res.json(GetNewArrivalsResponse.parse(formatted));
});

router.get("/products/summary", async (_req, res): Promise<void> => {
  const [productStats] = await db
    .select({
      totalProducts: sql<number>`cast(count(*) as int)`,
      minPrice: sql<number>`cast(min(${productsTable.price}) as float)`,
      maxPrice: sql<number>`cast(max(${productsTable.price}) as float)`,
      featuredCount: sql<number>`cast(count(*) filter (where ${productsTable.featured} = true) as int)`,
    })
    .from(productsTable);

  const [categoryStats] = await db
    .select({
      totalCategories: sql<number>`cast(count(*) as int)`,
    })
    .from(categoriesTable);

  res.json(
    GetProductsSummaryResponse.parse({
      totalProducts: productStats?.totalProducts ?? 0,
      totalCategories: categoryStats?.totalCategories ?? 0,
      priceRange: {
        min: productStats?.minPrice ?? 0,
        max: productStats?.maxPrice ?? 0,
      },
      featuredCount: productStats?.featuredCount ?? 0,
    }),
  );
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select(buildProductSelect())
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(
    GetProductResponse.parse({
      ...product,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    }),
  );
});

router.post("/products", async (req, res): Promise<void> => {
  // Simple auth check for the token we defined in auth.ts
  const token = req.headers["x-admin-token"];
  if (token !== "admin-session-token-hardcoded") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // We use the insert schema from the DB package
  const { insertProductSchema } = await import("@workspace/db");
  const parsed = insertProductSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [newProduct] = await db.insert(productsTable).values(parsed.data).returning();

    // Re-fetch to get the join with category name for the full response
    const [productWithCategory] = await db
      .select(buildProductSelect())
      .from(productsTable)
      .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
      .where(eq(productsTable.id, newProduct.id));

    res.status(201).json({
      ...productWithCategory,
      price: Number(productWithCategory.price),
      originalPrice: productWithCategory.originalPrice ? Number(productWithCategory.originalPrice) : null,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

export default router;
