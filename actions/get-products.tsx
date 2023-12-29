import { Product } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  brandId?: string;
  descriptionId?: string;
  isFeatured?: boolean;
  searchTerm?: string; // Add searchTerm property here
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: { 
      colorId: query.colorId,
      sizeId: query.sizeId,
      brandId: query.sizeId,
      descriptionId: query.descriptionId,
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
      searchTerm: query.searchTerm, // Use searchTerm from query object here
    },
  });

  const res = await fetch(url);

  return res.json();
};

export default getProducts;