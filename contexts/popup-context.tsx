"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types';
import ProductDetailsPopup from '@/components/ProductDetailsPopup';

interface PopupContextType {
  activePopup: string | null;
  activeProduct: Product | null;
  openProductDetails: (product: Product) => void;
  closePopup: () => void;
  isPopupOpen: (popupId: string) => boolean;
}

export const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Specific function for product details popup
  const openProductDetails = (product: Product) => {
    // Close any existing popup first
    setActivePopup('product-details');
    setActiveProduct(product);
    
    // Prevent body scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  const closePopup = () => {
    setActivePopup(null);
    setActiveProduct(null);
    
    // Re-enable body scrolling when popup is closed
    document.body.style.overflow = '';
  };

  const isPopupOpen = (popupId: string) => {
    return activePopup === popupId;
  };

  return (
    <PopupContext.Provider
      value={{
        activePopup,
        activeProduct,
        openProductDetails,
        closePopup,
        isPopupOpen,
      }}
    >
      {children}
      {/* Global Product Details Popup */}
      {activePopup === 'product-details' && activeProduct && (
        <ProductDetailsPopup
          isOpen={true}
          onClose={closePopup}
          data={activeProduct}
        />
      )}
    </PopupContext.Provider>
  );
};

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};