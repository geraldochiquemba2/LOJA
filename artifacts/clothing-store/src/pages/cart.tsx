import { useCart } from "@/hooks/use-cart";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from "lucide-react";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  
  const shipping = subtotal > 150 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% estimated tax
  const total = subtotal + shipping + tax;

  return (
    <Layout>
      <div className="bg-muted/30 border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold">Shopping Cart</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {items.length === 0 ? (
          <div className="text-center py-24 bg-muted/10 border border-dashed border-border rounded-sm max-w-3xl mx-auto">
            <h2 className="font-serif text-2xl mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              You haven't added any items to your cart yet. Discover our latest arrivals and elevate your wardrobe.
            </p>
            <Button size="lg" asChild>
              <Link href="/products">Shop New Arrivals</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-medium uppercase tracking-wider text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>
              
              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center">
                    {/* Mobile: Product Info */}
                    <div className="col-span-6 flex gap-4 w-full">
                      <div className="h-32 w-24 shrink-0 bg-muted rounded-sm overflow-hidden relative">
                        <img src={item.product.imageUrl} alt={item.product.name} className="object-cover w-full h-full" />
                      </div>
                      <div className="flex flex-col justify-center flex-1">
                        <Link href={`/products/${item.product.id}`} className="font-medium text-base hover:text-accent transition-colors line-clamp-2 mb-1">
                          {item.product.name}
                        </Link>
                        <p className="text-sm font-medium md:hidden mb-2">{formatCurrency(item.product.price)}</p>
                        
                        <div className="text-xs text-muted-foreground space-y-1 mb-3">
                          {item.color && <p><span className="font-medium">Color:</span> <span className="capitalize">{item.color}</span></p>}
                          {item.size && <p><span className="font-medium">Size:</span> <span className="uppercase">{item.size}</span></p>}
                        </div>
                        
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 mt-auto w-fit"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Desktop: Quantity */}
                    <div className="col-span-3 w-full flex md:justify-center mt-4 md:mt-0">
                      <div className="flex items-center border border-border rounded-sm h-10 w-32">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex-1 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex-1 h-full flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Desktop: Total */}
                    <div className="col-span-3 text-right hidden md:block">
                      <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between items-center pt-6 border-t border-border">
                <Button variant="outline" asChild>
                  <Link href="/products">Continue Shopping</Link>
                </Button>
                <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-foreground underline">
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-muted/30 p-6 md:p-8 rounded-sm border border-border sticky top-24">
                <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Shipping</span>
                    <span className="font-medium">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                  </div>
                </div>
                
                <div className="border-t border-border pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">Total</span>
                    <span className="font-serif font-bold text-2xl">{formatCurrency(total)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      Add {formatCurrency(150 - subtotal)} more to get free shipping.
                    </p>
                  )}
                </div>
                
                <Button size="lg" className="w-full h-14 text-base mb-6 group">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <div className="space-y-4 text-xs text-muted-foreground">
                  <div className="flex gap-3">
                    <ShieldCheck className="h-8 w-8 shrink-0 text-primary" strokeWidth={1} />
                    <p>Secure Checkout. Your payment information is encrypted and safe.</p>
                  </div>
                  <div className="flex gap-3">
                    <Truck className="h-8 w-8 shrink-0 text-primary" strokeWidth={1} />
                    <p>Free shipping on all orders over $150. Free returns within 30 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
