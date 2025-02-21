import axios from "axios";
import { Product, Category, Brand } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getProduct = async (id: string): Promise<Product | null> => {
  try {
    if (!API_URL) {
      throw new Error("API_URL is not defined");
    }

    // The API_URL should already include the store ID, so we just need to append the product endpoint
    const url = `${API_URL}/products/${id}`;
    
    console.log("🔍 Fetching product:", {
      url,
      id
    });

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.data) {
      console.log("❌ No product found - response.data is empty");
      return null;
    }

    const item = response.data;
    
    // Log the raw response data
    console.log("📦 Raw API Response:", JSON.stringify(item, null, 2));

    // Validate required fields
    if (!item.id || !item.name || !item.price) {
      console.error("❌ Missing basic product fields:", {
        hasId: !!item.id,
        hasName: !!item.name,
        hasPrice: !!item.price,
        receivedFields: Object.keys(item)
      });
      return null;
    }

    // Transform the response into the expected Product type
    const product: Product = {
      id: item.id,
      category: item.category,
      name: item.name,
      price: item.price,
      brand: item.brand,
      description: item.description,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      sizes: item.sizes || [],
      colors: item.colors || [],
      images: item.images || [],
      stock: item.stock || 0,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    };

    return product;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
};

export default getProduct;
