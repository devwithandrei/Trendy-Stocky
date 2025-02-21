import { Category } from "@/types";

interface Size {
  // Add properties for Size interface if needed
}

interface Color {
  // Add properties for Color interface if needed
}

interface ProductInterface {
  id: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  sizes?: Size[];
  colors?: Color[];
  images: string[];
  description: string;
  category: string;
  brand: string;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

interface Product extends ProductInterface {}

interface CartProduct extends ProductInterface {
  selectedSize?: Size;
  selectedColor?: Color;
  quantity: number;
}

const URL=`${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id: string): Promise<Category> => {
  try {
    const res = await fetch(`${URL}/${id}`);
    if (!res.ok) {
      throw new Error(`Error fetching category: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error('[getCategory]', error);
    throw error;
  }
};

export default getCategory;
