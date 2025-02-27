import axios from "axios";
import { Product, ProductQuery } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Query {
  categoryId?: string;
  brandId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  limit?: number;
  search?: string;
  storeId?: string;
}

const getProducts = async (query: Query = {}): Promise<Product[]> => {
  try {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    console.log("Fetching products with params:", query);

    // Clean up the query parameters
    const cleanQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined && value !== '')
    );

    const response = await axios.get(`${API_URL}/products`, {
      params: cleanQuery,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.data) {
      console.log("No products found");
      return [];
    }

    const products = response.data;

    // Log the number of products found
    console.log("Found products:", products.length);
    if (products.length > 0) {
      // Log a sample product for debugging
      console.log("Sample product:", products[0].id, ":", {
        name: products[0].name,
        stock: products[0].stock,
        sizeCount: products[0].sizes?.length || 0,
        colorCount: products[0].colors?.length || 0
      });
    }

    return products;
  } catch (error: any) {
    console.error('[getProducts] Error:', error.message);
    return [];
  }
};

export default getProducts;