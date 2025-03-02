import prismadb from "@/lib/prismadb";
import { Category } from "@/types";

// Add this to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getCategories = async (storeId: string = process.env.STORE_ID || ''): Promise<Category[]> => {
  try {
    console.log("getCategories - Fetching categories for store:", storeId);

    // Make sure we have a valid storeId
    if (!storeId) {
      console.error("No storeId provided and no STORE_ID environment variable found");
      return [];
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId
      },
      include: {
        billboard: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    console.log(`getCategories - Found ${categories.length} categories`);

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      billboardId: category.billboardId,
      billboard: {
        id: category.billboard.id,
        label: category.billboard.label,
        imageUrl: category.billboard.imageUrl
      },
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
};

export default getCategories;
