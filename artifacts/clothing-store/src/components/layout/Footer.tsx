import { Link } from "wouter";
import { ArrowRight, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="font-serif text-3xl font-bold tracking-tight mb-6 inline-block">
              MODA
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6 max-w-xs">
              Accessible, contemporary fashion for young professionals who want to look polished without overthinking it.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/70 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Shop</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/products" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">New Arrivals</Link></li>
              <li><Link href="/category/womens" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">Women's</Link></li>
              <li><Link href="/category/mens" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">Men's</Link></li>
              <li><Link href="/category/accessories" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">Accessories</Link></li>
              <li><Link href="/products?sort=price_asc" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">Stores</a></li>
              <li><a href="#" className="text-primary-foreground/70 hover:text-white text-sm transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Newsletter</h4>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Subscribe to get 10% off your first order and stay updated on new releases.
            </p>
            <form className="flex border-b border-primary-foreground/20 pb-2 focus-within:border-white transition-colors">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-primary-foreground/40"
              />
              <button type="submit" className="text-white hover:text-accent transition-colors">
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} MODA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Shipping & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
