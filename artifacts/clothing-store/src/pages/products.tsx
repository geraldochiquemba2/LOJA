import { useListProducts, useListCategories, useGetProductsSummary } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation, useSearch } from "wouter";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ListProductsSort } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Products() {
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const [, setLocation] = useLocation();

  // Parse filters from URL
  const categoryId = searchParams.get("category") ? Number(searchParams.get("category")) : undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const search = searchParams.get("search") || undefined;
  const sort = (searchParams.get("sort") as ListProductsSort) || undefined;

  // Local state for responsive inputs before applying to URL
  const [localSearch, setLocalSearch] = useState(search || "");
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice || 0, maxPrice || 500]);
  
  const { data: summary } = useGetProductsSummary();
  const { data: categories } = useListCategories();
  
  const { data, isLoading } = useListProducts({
    categoryId,
    minPrice,
    maxPrice,
    search,
    sort,
    limit: 50
  });

  // Update URL params helper
  const updateFilters = (updates: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, String(value));
      }
    });
    setLocation(`/products?${newParams.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: localSearch || null });
  };

  const clearFilters = () => {
    setLocalSearch("");
    setPriceRange([0, summary?.priceRange.max || 500]);
    setLocation("/products");
  };

  const hasActiveFilters = categoryId || minPrice || maxPrice || search || sort;

  const FiltersContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Search</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input 
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search products..." 
            className="pl-9 rounded-sm bg-muted/50 border-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>
      </div>

      <div>
        <h3 className="font-medium mb-4 text-sm uppercase tracking-wider">Categories</h3>
        <div className="space-y-2">
          <button 
            onClick={() => updateFilters({ category: null })}
            className={`block text-sm w-full text-left transition-colors ${!categoryId ? 'font-semibold text-accent' : 'text-muted-foreground hover:text-foreground'}`}
          >
            All Products
          </button>
          {categories?.map(cat => (
            <button 
              key={cat.id}
              onClick={() => updateFilters({ category: cat.id })}
              className={`block text-sm w-full text-left transition-colors ${categoryId === cat.id ? 'font-semibold text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {cat.name} ({cat.productCount})
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-sm uppercase tracking-wider">Price Range</h3>
          <span className="text-xs text-muted-foreground">${priceRange[0]} - ${priceRange[1]}</span>
        </div>
        <Slider 
          defaultValue={[0, 500]} 
          value={priceRange}
          max={summary?.priceRange.max || 500} 
          step={10}
          onValueChange={(val) => setPriceRange(val as [number, number])}
          onValueCommit={(val) => updateFilters({ minPrice: val[0] > 0 ? val[0] : null, maxPrice: val[1] < (summary?.priceRange.max || 500) ? val[1] : null })}
          className="mt-2"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="outline" className="w-full rounded-sm" onClick={clearFilters}>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="bg-muted/30 py-8 md:py-12 border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            {categoryId && categories ? categories.find(c => c.id === categoryId)?.name : 'All Products'}
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            {categoryId && categories 
              ? categories.find(c => c.id === categoryId)?.description 
              : 'Explore our complete collection of meticulously crafted essentials.'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0 pr-8 border-r border-border">
            <FiltersContent />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <div className="flex items-center gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="md:hidden rounded-sm flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" /> Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-md">
                    <SheetHeader className="mb-6">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <FiltersContent />
                  </SheetContent>
                </Sheet>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Showing {data?.products.length || 0} results
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">Sort by:</span>
                <Select 
                  value={sort || "newest"} 
                  onValueChange={(val) => updateFilters({ sort: val })}
                >
                  <SelectTrigger className="w-[160px] rounded-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    <SelectItem value="name_asc">Name: A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {categoryId && (
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    Category: {categories?.find(c => c.id === categoryId)?.name}
                    <button onClick={() => updateFilters({ category: null })} className="hover:text-destructive"><X className="h-3 w-3"/></button>
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    Search: "{search}"
                    <button onClick={() => { setLocalSearch(""); updateFilters({ search: null }); }} className="hover:text-destructive"><X className="h-3 w-3"/></button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                    Price: ${minPrice || 0} - ${maxPrice || summary?.priceRange.max || 500}
                    <button onClick={() => { setPriceRange([0, summary?.priceRange.max || 500]); updateFilters({ minPrice: null, maxPrice: null }); }} className="hover:text-destructive"><X className="h-3 w-3"/></button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[3/4] w-full rounded-sm" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                ))}
              </div>
            ) : data?.products.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-sm border border-dashed border-border">
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">We couldn't find anything matching your current filters.</p>
                <Button onClick={clearFilters} variant="outline">Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {data?.products.map((product, index) => (
                  <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${(index % 10) * 50}ms`, animationFillMode: "both" }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
