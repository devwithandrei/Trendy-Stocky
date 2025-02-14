import axios from "axios";
import { Product, ProductQuery } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/{Product}', '');

interface Query {
  categoryId?: string;
  brandId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  limit?: number;
  search?: string;
}

const getProducts = async (query: ProductQuery = {}): Promise<Product[]> => {
  try {
    // Remove undefined values from query
    const cleanQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    );

    console.log("🔍 Fetching products:", {
      baseUrl,
      query: cleanQuery
    });

    const response = await axios.get(`${baseUrl}/products`, {
      params: cleanQuery,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.data) {
      console.log("❌ No products found");
      return [];
    }

    console.log("✅ Products fetched successfully:", {
      count: response.data.length,
      sample: response.data[0] ? {
        id: response.data[0].id,
        name: response.data[0].name,
        sizesCount: response.data[0].sizes?.length,
        colorsCount: response.data[0].colors?.length
      } : null
    });

    const products: Product[] = response.data.map((item: any) => ({
      id: item.id,
      category: {
        id: item.category?.id || '',
        name: item.category?.name || '',
        billboardId: item.category?.billboardId || '',
        createdAt: item.category?.createdAt || new Date().toISOString(),
        updatedAt: item.category?.updatedAt || new Date().toISOString()
      },
      brand: {
        id: item.brand?.id || '',
        name: item.brand?.name || '',
        value: item.brand?.value || '',
        createdAt: item.brand?.createdAt || new Date().toISOString(),
        updatedAt: item.brand?.updatedAt || new Date().toISOString()
      },
      description: item.description ? {
        id: item.description.id || '',
        name: item.description.name || '',
        value: item.description.value || '',
        createdAt: item.description.createdAt || new Date().toISOString(),
        updatedAt: item.description.updatedAt || new Date().toISOString()
      } : null,
      name: item.name,
      price: item.price,
      isFeatured: Boolean(item.isFeatured),
      isArchived: Boolean(item.isArchived),
      sizes: Array.isArray(item.sizes) ? item.sizes.map((size: any) => ({
        id: size.id,
        name: size.name,
        value: size.value,
        stock: typeof size.stock === 'number' ? size.stock : 0
      })) : [],
      colors: Array.isArray(item.colors) ? item.colors.map((color: any) => ({
        id: color.id,
        name: color.name,
        value: color.value,
        stock: typeof color.stock === 'number' ? color.stock : 0
      })) : [],
      images: Array.isArray(item.images) ? item.images.map((image: any) => ({
        id: image.id,
        url: image.url,
        createdAt: image.createdAt || new Date().toISOString(),
        updatedAt: image.updatedAt || new Date().toISOString()
      })) : [],
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    }));

    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

export default getProducts;
