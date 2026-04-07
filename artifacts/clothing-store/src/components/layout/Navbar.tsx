import { Link } from "wouter";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useListCategories } from "@workspace/api-client-react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { data: categories } = useListCategories();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-foreground">
            MODA
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-medium hover:text-accent transition-colors">
            All Products
          </Link>
          {categories?.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="text-sm font-medium hover:text-accent transition-colors">
              {category.name}
            </Link>
          ))}
          <Link href="/about" className="text-sm font-medium hover:text-accent transition-colors">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <Link href="/products">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Cart</span>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/login">
              <User className="h-5 w-5" />
              <span className="sr-only">Login Admin</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <Link href="/products" className="text-base font-medium py-2 hover:text-accent" onClick={() => setIsMenuOpen(false)}>
            All Products
          </Link>
          {categories?.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="text-base font-medium py-2 hover:text-accent" onClick={() => setIsMenuOpen(false)}>
              {category.name}
            </Link>
          ))}
          <Link href="/about" className="text-base font-medium py-2 hover:text-accent" onClick={() => setIsMenuOpen(false)}>
            About
          </Link>
          <div className="pt-4 border-t border-border">
            <Link href="/products" className="flex items-center gap-2 text-base font-medium py-2 hover:text-accent" onClick={() => setIsMenuOpen(false)}>
              <Search className="h-4 w-4" /> Search Products
            </Link>
          </div>
        </div>
      )}
      <CartDrawer />
    </header>
  );
}
