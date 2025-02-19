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
    const cleanQuery = Object.fromEntries(
      Object.entries(query).filter(([_, value]) => value !== undefined)
    );
    const res = await axios.get(`${baseUrl}/products`, { params: cleanQuery });
    return res.data;
  } catch (error) {
    console.error('[getProducts]', error);
    throw error;
  }
};

export default getProducts;
