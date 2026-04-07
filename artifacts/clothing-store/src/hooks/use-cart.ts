import { useState, useEffect, useCallback } from "react";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string; // unique id combining productId + size + color
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("moda_cart");
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("moda_cart", JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1, size?: string, color?: string) => {
    setItems((currentItems) => {
      const id = `${product.id}-${size || 'default'}-${color || 'default'}`;
      const existingItemIndex = currentItems.findIndex(i => i.id === id);

      if (existingItemIndex >= 0) {
        const newItems = [...currentItems];
        newItems[existingItemIndex].quantity += quantity;
        toast({ title: "Updated cart", description: `Increased quantity for ${product.name}` });
        return newItems;
      }

      toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
      return [...currentItems, { id, product, quantity, size, color }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(currentItems => {
      if (quantity <= 0) return currentItems.filter(i => i.id !== id);
      return currentItems.map(i => i.id === id ? { ...i, quantity } : i);
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    isOpen,
    setIsOpen
  };
}
