import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { ChevronRight, ArrowLeft, Ruler, Truck, ShieldAlert } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  
  const { data: product, isLoading } = useGetProduct(productId, { 
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) } 
  });
  
  const { addItem } = useCart();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const displayImage = selectedImage || product?.imageUrl;
  
  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
  };

  const isAddToCartDisabled = !product?.inStock || 
    (product?.sizes.length > 0 && !selectedSize) || 
    (product?.colors.length > 0 && !selectedColor);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-4 w-32 mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-[3/4] w-full rounded-sm" />
            <div className="space-y-6 pt-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-4 pt-6">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild><Link href="/products">Back to Shop</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4 h-12 flex items-center text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href={`/category/${product.categoryId}`} className="hover:text-foreground transition-colors">{product.categoryName}</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16">
        <div className="flex mb-6 md:hidden">
          <Link href="/products" className="text-sm font-medium flex items-center hover:text-accent transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 lg:gap-x-20">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4 h-fit sticky top-24">
            {/* Thumbnails */}
            {product.images && product.images.length > 0 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 hide-scrollbar md:w-20 lg:w-24 shrink-0">
                <button 
                  onClick={() => setSelectedImage(product.imageUrl)}
                  className={`relative aspect-[3/4] overflow-hidden rounded-sm border-2 transition-all ${selectedImage === product.imageUrl || (!selectedImage && displayImage === product.imageUrl) ? 'border-primary' : 'border-transparent hover:border-muted-foreground'}`}
                >
                  <img src={product.imageUrl} alt={`${product.name} thumbnail`} className="object-cover w-full h-full" />
                </button>
                {product.images.map((img, i) => (
                  <button 
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative aspect-[3/4] overflow-hidden rounded-sm border-2 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-muted-foreground'}`}
                  >
                    <img src={img} alt={`${product.name} view ${i+1}`} className="object-cover w-full h-full" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image */}
            <div className="flex-1 aspect-[3/4] md:aspect-[4/5] bg-muted rounded-sm overflow-hidden relative">
              <img 
                src={displayImage} 
                alt={product.name} 
                className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500"
                key={displayImage} // Force re-render for animation on change
              />
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground text-xs font-semibold px-3 py-1.5 rounded uppercase tracking-wider">
                  Sale
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="mb-2">
              <Link href={`/category/${product.categoryId}`} className="text-sm font-medium tracking-wide text-accent uppercase hover:underline">
                {product.categoryName}
              </Link>
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through decoration-destructive decoration-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="space-y-8 mb-8 border-t border-b border-border py-8">
              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium uppercase tracking-wider">Color</h3>
                    <span className="text-sm text-muted-foreground capitalize">{selectedColor || "Select color"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center
                          ${selectedColor === color ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent hover:border-muted-foreground'}
                        `}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-medium uppercase tracking-wider">Size</h3>
                    <button className="text-xs text-muted-foreground hover:text-foreground hover:underline flex items-center">
                      <Ruler className="w-3 h-3 mr-1" /> Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-sm font-medium uppercase transition-colors rounded-sm border
                          ${selectedSize === size 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'bg-transparent text-foreground border-border hover:border-primary'}
                        `}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quantity */}
              <div>
                 <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Quantity</h3>
                 <div className="flex items-center w-32 border border-border rounded-sm">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 flex-1 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50 text-xl"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="h-12 w-12 flex items-center justify-center font-medium border-x border-border">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 flex-1 flex items-center justify-center hover:bg-muted transition-colors text-xl"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-base rounded-sm mb-4" 
              onClick={handleAddToCart}
              disabled={isAddToCartDisabled}
            >
              {!product.inStock 
                ? "Out of Stock" 
                : isAddToCartDisabled 
                  ? "Select Size and Color" 
                  : "Add to Cart"}
            </Button>
            
            {product.inStock && (
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> In stock and ready to ship
              </p>
            )}

            <div className="mt-12">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="details" className="border-t">
                  <AccordionTrigger className="hover:no-underline font-medium text-base">Product Details</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Designed for versatility and longevity. This piece features reinforced stitching, premium hardware, and a tailored fit that flatters without restricting movement. 
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                      <li>Premium ethically sourced materials</li>
                      <li>Tailored athletic fit</li>
                      <li>Pre-washed to minimize shrinkage</li>
                      <li>Designed in San Francisco</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping">
                  <AccordionTrigger className="hover:no-underline font-medium text-base">
                    <span className="flex items-center gap-2"><Truck className="w-4 h-4"/> Shipping & Returns</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Free standard shipping on all orders over $150. Delivery typically takes 3-5 business days. 
                    Need it faster? Expedited shipping options available at checkout.
                    <br/><br/>
                    We accept returns within 30 days of purchase for a full refund. Items must be unworn and unwashed with tags attached.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care">
                  <AccordionTrigger className="hover:no-underline font-medium text-base">
                     <span className="flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> Care Instructions</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Machine wash cold with like colors. Tumble dry low or hang dry for best results. Do not bleach. Warm iron if needed.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
