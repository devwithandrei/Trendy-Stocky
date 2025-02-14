"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  name: string;
  price: string;
  images: Array<{
    url: string;
  }>;
  colorId?: string;
  sizeId?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem, colorId?: string, sizeId?: string) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem, colorId?: string, sizeId?: string) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => 
          item.id === data.id && 
          item.colorId === colorId && 
          item.sizeId === sizeId
        );

        if (existingItem) {
          toast.error("Item already in cart.");
          return;
        }

        const newItem = {
          ...data,
          colorId,
          sizeId,
        };

        set({ items: [...currentItems, newItem] });
        toast.success("Item added to cart.");
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;