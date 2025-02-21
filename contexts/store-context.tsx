"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Extract store ID from the API URL
const getDefaultStoreId = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const match = apiUrl.match(/\/api\/([^/]+)/);
  return match ? match[1] : '';
};

interface StoreContextType {
  storeId: string;
  setStoreId: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [storeId, setStoreId] = useState(getDefaultStoreId());

  useEffect(() => {
    // Update storeId if API URL changes
    const defaultId = getDefaultStoreId();
    if (defaultId && !storeId) {
      setStoreId(defaultId);
    }
  }, [storeId]);

  return (
    <StoreContext.Provider value={{ storeId, setStoreId }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
