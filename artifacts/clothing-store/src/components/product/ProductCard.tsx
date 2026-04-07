import { Link } from "wouter";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group block relative overflow-hidden focus:outline-none rounded-sm">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-sm mb-4">
        {product.images && product.images.length > 1 ? (
          <>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-0"
              loading="lazy"
            />
            <img 
              src={product.images[1]} 
              alt={`${product.name} alternate view`} 
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"
              loading="lazy"
            />
          </>
        ) : (
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}
        
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-medium px-2 py-1 rounded">
            Sale
          </div>
        )}
        {product.featured && !product.originalPrice && (
          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
            Featured
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-background text-foreground px-4 py-2 text-sm font-semibold tracking-wider uppercase shadow-md rounded-sm">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-start gap-1">
        <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.categoryName}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-foreground">{formatCurrency(product.price)}</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
