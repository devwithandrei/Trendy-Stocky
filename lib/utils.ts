import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getStoreId(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }
  
  // Extract store ID from the API URL
  // Format: http://localhost:3000/api/[storeId]
  const storeId = apiUrl.split('/api/')[1];
  if (!storeId) {
    throw new Error('Could not extract store ID from API URL');
  }
  
  return storeId;
}
