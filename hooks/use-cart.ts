import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Size, Color, CartProduct } from '@/types';

interface CartStore {
  items: CartProduct[];
  addItem: (data: CartProduct) => void;
  removeItem: (id: string, selectedSize?: Size, selectedColor?: Color) => void;
  removeAll: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartProduct) => {
        const currentItems = get().items;
        console.log('Adding item:', data);

        // Check if item with same options exists
        const existingItem = currentItems.find((item) => {
          const sameProduct = item.id === data.id;
          
          // Check sizes - must be exactly the same (both null or same ID)
          const sameSize = (!data.selectedSize && !item.selectedSize) || 
                          (data.selectedSize?.id === item.selectedSize?.id);
          
          // Check colors - must be exactly the same (both null or same ID)
          const sameColor = (!data.selectedColor && !item.selectedColor) || 
                          (data.selectedColor?.id === item.selectedColor?.id);
          
          const isMatch = sameProduct && sameSize && sameColor;
          console.log('Checking against:', {
            item,
            sameProduct,
            sameSize,
            sameColor,
            isMatch
          });
          return isMatch;
        });
        
        if (existingItem) {
          // Update quantity if it's the same variation
          console.log('Found existing item, updating:', existingItem);
          const updatedItems = currentItems.map(item => 
            item === existingItem ? { ...data } : item
          );
          set({ items: updatedItems });
          return;
        }

        console.log('Adding new item to cart');
        set({ items: [...currentItems, data] });
        toast.success('Item added to cart.');
      },
      removeItem: (id: string, selectedSize?: Size, selectedColor?: Color) => {
        const currentItems = get().items;
        
        console.log('Removing item:', { id, selectedSize, selectedColor });
        console.log('Current items:', currentItems);
        
        const remainingItems = currentItems.filter((item) => {
          // For debugging
          const itemDetails = {
            id: item.id,
            itemSize: item.selectedSize,
            targetSize: selectedSize,
            itemColor: item.selectedColor,
            targetColor: selectedColor
          };
          console.log('Checking item:', itemDetails);

          // Different product ID - keep the item
          if (item.id !== id) {
            console.log('Different ID - keeping item');
            return true;
          }
          
          // Same product, check sizes
          if (selectedSize) {
            if (!item.selectedSize) {
              console.log('Target has size but item doesnt - keeping item');
              return true;
            }
            if (item.selectedSize.id !== selectedSize.id) {
              console.log('Different size IDs - keeping item');
              return true;
            }
          } else if (item.selectedSize) {
            console.log('Target has no size but item does - keeping item');
            return true;
          }
          
          // Check colors
          if (selectedColor) {
            if (!item.selectedColor) {
              console.log('Target has color but item doesnt - keeping item');
              return true;
            }
            if (item.selectedColor.id !== selectedColor.id) {
              console.log('Different color IDs - keeping item');
              return true;
            }
          } else if (item.selectedColor) {
            console.log('Target has no color but item does - keeping item');
            return true;
          }
          
          console.log('Item matches criteria - removing');
          return false;
        });

        console.log('Remaining items:', remainingItems);
        set({ items: remainingItems });
      },
      removeAll: () => {
        set({ items: [] });
      },
      updateQuantity: (id: string, quantity: number) => {
        const currentItems = get().items;
        const updatedItems = currentItems.map(item => 
          item.id === id ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export default useCart;
