import axios from "axios";
import { Product, Category, Brand } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getProduct = async (id: string): Promise<Product | null> => {
  try {
    // Remove {Product} from the API URL if present and construct the proper endpoint
    const baseUrl = API_URL?.replace('/{Product}', '');
    const url = `${baseUrl}/products/${id}`;
    
    console.log("🔍 Fetching product:", {
      baseUrl,
      finalUrl: url,
      originalUrl: API_URL,
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

    // Validate and create category object
    if (!item.category?.id || !item.category?.name) {
      console.error("❌ Invalid category data:", item.category);
      return null;
    }

    const category: Category = {
      id: item.category.id,
      name: item.category.name,
      billboardId: item.category.billboardId || '',
      createdAt: item.category.createdAt || new Date().toISOString(),
      updatedAt: item.category.updatedAt || new Date().toISOString()
    };

    // Validate and create brand object
    if (!item.brand?.id || !item.brand?.name) {
      console.error("❌ Invalid brand data:", item.brand);
      return null;
    }

    const brand: Brand = {
      id: item.brand.id,
      name: item.brand.name,
      value: item.brand.value || '',
      createdAt: item.brand.createdAt || new Date().toISOString(),
      updatedAt: item.brand.updatedAt || new Date().toISOString()
    };

    // Transform the product data with proper type checking
    const product: Product = {
      id: item.id,
      name: item.name,
      price: item.price,
      isFeatured: Boolean(item.isFeatured),
      isArchived: Boolean(item.isArchived),
      category,
      brand,
      description: item.description ? {
        id: item.description.id || '',
        name: item.description.name || '',
        value: item.description.value || '',
        createdAt: item.description.createdAt || new Date().toISOString(),
        updatedAt: item.description.updatedAt || new Date().toISOString()
      } : null,
      sizes: Array.isArray(item.sizes) ? item.sizes.map((size: { id: string; name: string; value: string; stock?: number }) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        stock: typeof size.stock === 'number' ? size.stock : 0
      })) : [],
      colors: Array.isArray(item.colors) ? item.colors.map((color: { id: string; name: string; value: string; stock?: number }) => ({
        id: color.id,
        name: color.name,
        value: color.value,
        stock: typeof color.stock === 'number' ? color.stock : 0
      })) : [],
      images: Array.isArray(item.images) ? item.images.map((image: { id: string; url: string; createdAt?: string; updatedAt?: string }) => ({
        id: image.id,
        url: image.url,
        createdAt: image.createdAt || new Date().toISOString(),
        updatedAt: image.updatedAt || new Date().toISOString()
      })) : [],
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    };

    console.log("✅ Product transformed successfully:", {
      id: product.id,
      name: product.name,
      sizesCount: product.sizes.length,
      colorsCount: product.colors.length,
      hasDescription: !!product.description,
      imagesCount: product.images.length
    });

    return product;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
};

export default getProduct;
