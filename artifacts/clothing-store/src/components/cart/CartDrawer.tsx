import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Link } from "wouter";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Your Cart
          </SheetTitle>
          <SheetDescription>
            {items.length === 0 ? "Your cart is currently empty." : `You have ${items.length} items in your cart.`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
                <ShoppingBag className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Button asChild className="mt-4" onClick={() => setIsOpen(false)}>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 animate-in slide-in-from-right-4 fade-in">
                  <div className="h-24 w-20 rounded-sm overflow-hidden bg-muted flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {item.color && <span className="capitalize">{item.color}</span>}
                          {item.color && item.size && <span>•</span>}
                          {item.size && <span className="uppercase">{item.size}</span>}
                        </div>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(item.product.price)}</p>
                    </div>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-sm">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors text-sm flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-medium">Subtotal</span>
              <span className="font-serif text-xl font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              Shipping and taxes calculated at checkout.
            </p>
            <Button asChild className="w-full h-12 text-base" onClick={() => setIsOpen(false)}>
              <Link href="/cart">Proceed to Checkout</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
