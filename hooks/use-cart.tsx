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
  removeItem: (id: string, selectedSize?: { id: string; name: string; value: string; stock: number }, selectedColor?: { id: string; name: string; value: string; stock: number }) => void;
  removeAll: () => void;
  updateQuantity: (id: string, quantity: number, selectedSize?: { id: string; name: string; value: string; stock: number }, selectedColor?: { id: string; name: string; value: string; stock: number }) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      addItem: (data: CartItem) => {
        try {
          const currentItems = get().items;
          const existingItem = currentItems.find((item) => 
            item.id === data.id && 
            item.selectedColor?.id === data.selectedColor?.id && 
            item.selectedSize?.id === data.selectedSize?.id
          );

          // Ensure quantity is at least 1
          const quantity = Math.max(1, data.quantity || 1);

          const newItem = {
            ...data,
            quantity
          };

          const availableStock = newItem.selectedSize?.stock ?? 
                               newItem.selectedColor?.stock ?? 
                               newItem.stock ?? 
                               0;

          if (!availableStock) {
            toast.error("Product is out of stock.");
            return;
          }

          if (quantity > availableStock) {
            toast.error(`Only ${availableStock} items available in stock.`);
            return;
          }

          if (existingItem) {
            const updatedItems = currentItems.map(item => {
              if (item === existingItem) {
                const newQuantity = quantity;
                const itemStock = item.selectedSize?.stock ?? 
                                 item.selectedColor?.stock ?? 
                                 item.stock ?? 
                                 0;

                if (!itemStock) {
                  toast.error("Product is out of stock.");
                  return item;
                }

                if (newQuantity > itemStock) {
                  toast.error(`Only ${itemStock} items available in stock.`);
                  return item;
                }

                return {
                  ...item,
                  quantity: newQuantity
                };
              }
              return item;
            });

            set({ items: updatedItems });
            toast.success("Cart updated successfully.");
            return;
          }

          set({ items: [...currentItems, newItem] });
          toast.success("Item added to cart.");
        } catch (error) {
          console.error("Error adding item to cart:", error);
          toast.error("Failed to add item to cart. Please try again.");
        }
      },
      removeItem: (id: string, selectedSize, selectedColor) => {
        const currentItems = get().items;
        const filteredItems = currentItems.filter(item => {
          const sizeMatch = (!selectedSize && !item.selectedSize) || 
                          (selectedSize?.id === item.selectedSize?.id);
          const colorMatch = (!selectedColor && !item.selectedColor) || 
                           (selectedColor?.id === item.selectedColor?.id);
          return !(item.id === id && sizeMatch && colorMatch);
        });
        set({ items: filteredItems });
        toast.success("Item removed from cart.");
      },

      removeAll: () => {
        set({ items: [] });
        toast.success("Cart cleared");
      },

      updateQuantity: (id: string, quantity: number, selectedSize, selectedColor) => {
        try {
          // Ensure quantity is at least 1
          const newQuantity = Math.max(1, quantity);

          if (newQuantity < 1) {
            get().removeItem(id, selectedSize, selectedColor);
            return;
          }

          const currentItems = get().items;
          const updatedItems = currentItems.map(item => {
            const sizeMatch = (!selectedSize && !item.selectedSize) || 
                            (selectedSize?.id === item.selectedSize?.id);
            const colorMatch = (!selectedColor && !item.selectedColor) || 
                             (selectedColor?.id === item.selectedColor?.id);
            
            if (item.id === id && sizeMatch && colorMatch) {
              const availableStock = item.selectedSize?.stock ?? 
                                   item.selectedColor?.stock ?? 
                                   item.stock ?? 
                                   0;
              
              if (!availableStock) {
                toast.error("Product is out of stock");
                return item;
              }
              
              if (newQuantity > availableStock) {
                toast.error(`Only ${availableStock} items available in stock`);
                return item;
              }
              
              return {
                ...item,
                quantity: newQuantity
              };
            }
            return item;
          });
          
          set({ items: updatedItems });
          toast.success("Cart updated successfully");
        } catch (error) {
          console.error("Error updating quantity:", error);
          toast.error("Failed to update quantity. Please try again.");
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          return total + (Number(item.price) * (item.quantity || 1));
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
