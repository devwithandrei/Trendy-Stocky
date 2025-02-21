import axios from "axios";
import { Category } from "@/types";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const getCategoryData = async (categoryId: string, storeId: string): Promise<Category> => {
  try {
    const apiUrl = `${baseUrl}/getCategory?categoryId=${categoryId}&storeId=${storeId}`;
    const res = await axios.get(apiUrl);
    return res.data;
  } catch (error) {
    console.error('[getCategoryData]', error);
    throw error;
  }
};

export default getCategoryData;
