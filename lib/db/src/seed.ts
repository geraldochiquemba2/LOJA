import { db, categoriesTable, productsTable } from "./index";

async function seed() {
  console.log("Seeding database...");

  // 1. Categories
  const categories = await db.insert(categoriesTable).values([
    {
      name: "Feminino",
      slug: "feminino",
      description: "Roupas femininas elegantes e modernas",
      imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop",
    },
    {
      name: "Masculino",
      slug: "masculino",
      description: "Roupas masculinas com estilo e conforto",
      imageUrl: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop",
    },
    {
      name: "Acessórios",
      slug: "acessorios",
      description: "Complementos perfeitos para seu visual",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    },
    {
      name: "Calçados",
      slug: "calcados",
      description: "Passos firmes com estilo",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    },
  ]).returning();

  const [female, male, accessory, shoe] = categories;

  // 2. Products
  await db.insert(productsTable).values([
    {
      name: "Vestido Floral de Verão",
      description: "Vestido leve e fresco, perfeito para dias ensolarados.",
      price: "189.90",
      originalPrice: "249.90",
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1946&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1946&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=2073&auto=format&fit=crop"
      ],
      categoryId: female.id,
      sizes: ["P", "M", "G"],
      colors: ["Floral", "Azul"],
      inStock: true,
      featured: true,
    },
    {
      name: "Camiseta Slim Fit",
      description: "Camiseta de algodão premium com corte slim.",
      price: "79.90",
      originalPrice: "99.90",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1780&auto=format&fit=crop"],
      categoryId: male.id,
      sizes: ["M", "G", "GG"],
      colors: ["Branco", "Preto", "Cinza"],
      inStock: true,
      featured: true,
    },
    {
      name: "Relógio Minimalista",
      description: "Design limpo e sofisticado para todas as ocasiões.",
      price: "349.00",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"],
      categoryId: accessory.id,
      inStock: true,
      featured: false,
    },
    {
      name: "Tênis Esportivo Pro",
      description: "Alta performance e conforto para seus treinos.",
      price: "459.90",
      originalPrice: "599.90",
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"],
      categoryId: shoe.id,
      sizes: ["38", "39", "40", "41", "42"],
      colors: ["Vermelho", "Preto"],
      inStock: true,
      featured: true,
    },
    {
      name: "Jaqueta de Couro",
      description: "Estilo clássico e atemporal com couro sintético de alta qualidade.",
      price: "299.90",
      imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5bab3?q=80&w=1935&auto=format&fit=crop",
      images: ["https://images.unsplash.com/photo-1521223890158-f9f7c3d5bab3?q=80&w=1935&auto=format&fit=crop"],
      categoryId: male.id,
      sizes: ["M", "G"],
      colors: ["Preto"],
      inStock: true,
      featured: false,
    }
  ]);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:");
  console.error(err);
  process.exit(1);
});
