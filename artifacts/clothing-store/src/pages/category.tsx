import { useGetCategoryBySlug, useListProducts, getGetCategoryBySlugQueryKey, getListProductsQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryBySlug(slug || "", {
    query: { enabled: !!slug, queryKey: getGetCategoryBySlugQueryKey(slug || "") }
  });
  
  const { data: productsData, isLoading: isLoadingProducts } = useListProducts(
    { categoryId: category?.id, limit: 50 },
    { query: { enabled: !!category?.id, queryKey: getListProductsQueryKey({ categoryId: category?.id, limit: 50 }) } }
  );

  if (isLoadingCategory) {
    return (
      <Layout>
        <div className="w-full h-64 md:h-80 bg-muted animate-pulse" />
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {Array(8).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/products" className="text-accent hover:underline inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Category Header */}
      <section className="relative h-64 md:h-96 w-full overflow-hidden bg-muted">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-4">
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4">
              {category.name}
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 delay-150 fill-mode-both">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="flex items-center justify-between mb-8">
          <p className="text-muted-foreground font-medium">
            {productsData?.total || 0} items
          </p>
        </div>

        {isLoadingProducts ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array(8).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
          </div>
        ) : productsData?.products.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-sm">
            <h3 className="text-lg font-medium mb-2">Check back soon</h3>
            <p className="text-muted-foreground">We're updating our collection for this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {productsData?.products.map((product, index) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${(index % 8) * 100}ms`, animationFillMode: "both" }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
