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
  stock?: number;
  colorId?: string;
  sizeId?: string;
  selectedColor?: {
    id: string;
    name: string;
    value: string;
    stock: number;
  };
  selectedSize?: {
    id: string;
    name: string;
    value: string;
    stock: number;
  };
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => 
          item.id === data.id && 
          item.selectedColor?.id === data.selectedColor?.id && 
          item.selectedSize?.id === data.selectedSize?.id
        );

        const availableStock = data.selectedSize?.stock ?? 
                               data.selectedColor?.stock ?? 
                               data.stock ?? 
                               0;

        if (data.quantity > availableStock) {
          toast.error("Not enough stock available.");
          return;
        }

        if (existingItem) {
          const updatedItems = currentItems.map(item => {
            if (item === existingItem) {
              return {
                ...item,
                quantity: data.quantity
              };
            }
            return item;
          });

          set({ items: updatedItems });
          toast.success("Item quantity updated in cart.");
          return;
        }

        set({ items: [...currentItems, data] });
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
