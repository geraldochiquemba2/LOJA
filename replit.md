# Workspace

## Overview

MODA - Loja de roupas online. pnpm workspace monorepo using TypeScript.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Architecture

- `artifacts/clothing-store/` — React + Vite frontend (clothing store UI)
- `artifacts/api-server/` — Express 5 API server
- `lib/db/` — PostgreSQL database schema (Drizzle ORM)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/` — Generated React Query hooks
- `lib/api-zod/` — Generated Zod schemas for API validation

## Database Tables

- **categories**: id, name, slug, description, image_url
- **products**: id, name, description, price, original_price, image_url, images (jsonb), category_id (FK), sizes (jsonb), colors (jsonb), in_stock, featured, created_at

## API Endpoints

- `GET /api/categories` — List all categories with product counts
- `GET /api/categories/:slug` — Get category by slug
- `GET /api/products` — List products with filters (categoryId, search, minPrice, maxPrice, sort, limit, offset)
- `GET /api/products/featured` — Get featured products
- `GET /api/products/new-arrivals` — Get newest products
- `GET /api/products/:id` — Get single product
- `GET /api/products/summary` — Get store stats

## Frontend Pages

- `/` — Home (hero, featured products, new arrivals, categories)
- `/products` — Product catalog with filters
- `/products/:id` — Product detail page
- `/cart` — Shopping cart (client-side with localStorage)
- `/about` — About the brand
- `/category/:slug` — Category-specific product listing

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
