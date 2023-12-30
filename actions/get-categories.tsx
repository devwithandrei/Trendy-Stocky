import { Category } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (params?: { isFeatured: boolean }): Promise<Category[]> => {
  const query = params ? `?isFeatured=${params.isFeatured}` : '';
  const res = await fetch(`${URL}${query}`);

  return res.json();
};

export default getCategories;