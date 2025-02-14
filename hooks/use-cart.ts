import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Size, Color, CartProduct } from '@/types';

interface CartStore {
  items: CartProduct[];
  addItem: (data: CartProduct) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartProduct) => {
        const currentItems = get().items;

        // Check if item with same options exists
        const existingItem = currentItems.find((item) => 
          item.id === data.id && 
          item.selectedSize?.id === data.selectedSize?.id && 
          item.selectedColor?.id === data.selectedColor?.id
        );
        
        if (existingItem) {
          toast.error('Item already in cart.');
          return;
        }

        set({ items: [...currentItems, data] });
        toast.success('Item added to cart.');
      },
      removeItem: (id: string) => {
        const currentItems = get().items;
        set({ items: currentItems.filter((item) => item.id !== id) });
      },
      removeAll: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useCart;
