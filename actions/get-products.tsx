import { Product } from "@/types";
import qs from "query-string";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined. Check your environment variables.");
}

const URL = `${API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  brandId?: string;
  descriptionId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: { 
      categoryId: query.categoryId,
      colorId: query.colorId,
      sizeId: query.sizeId,
      brandId: query.brandId,
      descriptionId: query.descriptionId,
      isFeatured: query.isFeatured,
    },
  });

  console.log("Fetching products from URL:", url);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status} - ${res.statusText}`);
    }

    const products: Product[] = await res.json();
    console.log("Fetched Products:", products);
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return []; // Return an empty array instead of throwing an error
  }
};

export default getProducts;
