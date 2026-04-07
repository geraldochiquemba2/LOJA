import { useGetFeaturedProducts, useGetNewArrivals, useListCategories } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featured, isLoading: isLoadingFeatured } = useGetFeaturedProducts();
  const { data: newArrivals, isLoading: isLoadingNew } = useGetNewArrivals({ limit: 4 });
  const { data: categories, isLoading: isLoadingCategories } = useListCategories();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-muted">
        <img 
          src="/images/hero.png" 
          alt="Modern fashion editorial" 
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center sm:justify-start sm:px-12 md:px-24">
          <div className="text-center sm:text-left max-w-xl animate-in slide-in-from-bottom-8 duration-1000 fade-in px-4">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
              Effortless Style. <br /> Everyday.
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-md mx-auto sm:mx-0">
              Discover our new collection of premium essentials designed for the modern professional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
              <Button size="lg" className="bg-white text-black hover:bg-white/90 rounded-none px-8" asChild>
                <Link href="/products">Shop Collection</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black rounded-none px-8 bg-transparent" asChild>
                <Link href="/category/new-arrivals">Explore New</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 md:px-6 container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl font-bold">Shop by Category</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoadingCategories ? (
            Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-sm" />
            ))
          ) : (
            categories?.slice(0, 3).map((category, index) => (
              <Link 
                key={category.id} 
                href={`/category/${category.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-sm bg-muted animate-in fade-in zoom-in"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: "both" }}
              >
                <img 
                  src={category.imageUrl} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity group-hover:opacity-80" />
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-3xl font-bold text-white mb-2">{category.name}</h3>
                  <div className="flex items-center text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    Explore <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 md:px-6 container mx-auto bg-muted/30">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">Editor's Picks</h2>
            <p className="text-muted-foreground">Curated essentials for your wardrobe.</p>
          </div>
          <Link href="/products?featured=true" className="hidden sm:flex items-center text-sm font-medium hover:text-accent transition-colors">
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoadingFeatured ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            featured?.slice(0, 4).map((product, index) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
        <div className="mt-8 sm:hidden flex justify-center">
          <Button variant="outline" className="w-full" asChild>
             <Link href="/products?featured=true">View All Editor's Picks</Link>
          </Button>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-4 md:px-6 container mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-muted-foreground">The latest pieces added to our collection.</p>
          </div>
          <Link href="/products?sort=newest" className="hidden sm:flex items-center text-sm font-medium hover:text-accent transition-colors">
            Shop New <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {isLoadingNew ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          ) : (
            newArrivals?.map((product, index) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}>
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Brand Story Teaser */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
           <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
             <path d="M0,100 L100,0 L100,100 Z" fill="currentColor" />
           </svg>
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Designed with Intention</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 leading-relaxed">
            We believe that great style shouldn't be complicated. Every piece in our collection is crafted with premium materials and thoughtful details, designed to be worn effortlessly season after season.
          </p>
          <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent rounded-sm px-8" asChild>
            <Link href="/about">Read Our Story</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
