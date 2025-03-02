"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Get the store ID from environment variables
const getDefaultStoreId = () => {
  // First try to get it from the STORE_ID environment variable
  const envStoreId = process.env.STORE_ID;
  if (envStoreId) return envStoreId;
  
  // Fallback to extracting from API URL if needed
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
    // Update storeId if it's not set
    const defaultId = getDefaultStoreId();
    if (defaultId && !storeId) {
      setStoreId(defaultId);
    }
    
    // Log the store ID for debugging
    console.log("Store Context - Using store ID:", storeId || defaultId);
    console.log("Store Context - Environment STORE_ID:", process.env.STORE_ID);
    console.log("Store Context - API URL:", process.env.NEXT_PUBLIC_API_URL);
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
