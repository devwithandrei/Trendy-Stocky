import { Category } from "@/types";

const getCategories = async (params?: { isFeatured?: boolean, includeBillboard?: boolean }): Promise<Category[]> => {
  let query = '';
  if (params) {
    const queryParams = [];
    if (params.isFeatured) {
      queryParams.push(`isFeatured=${params.isFeatured}`);
    }
    if (params.includeBillboard) {
      queryParams.push(`includeBillboard=true`);
    }
    if (queryParams.length > 0) {
      query = `?${queryParams.join('&')}`;
    }
  }
  try {
    // Remove categoryId from the fetch URL
    const res = await fetch(`http://localhost:3000/api/84eeb702-de97-4f9d-a56b-a1050254c564/categories${query}`);
    if (!res.ok) {
      throw new Error(`Error fetching categories: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('[getCategories]', error);
    throw error;
  }
};

export default getCategories;