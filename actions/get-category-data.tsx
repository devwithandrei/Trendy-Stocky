import { Category } from "@/types";
import prismadb from "@/lib/prismadb";

// Add this to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getCategoryData = async (categoryId: string, storeId: string = process.env.STORE_ID || ''): Promise<Category | null> => {
  try {
    console.log("getCategoryData - Fetching category with ID:", categoryId);
    console.log("getCategoryData - Using storeId:", storeId);

    // Make sure we have a valid storeId
    if (!storeId) {
      console.error("No storeId provided and no STORE_ID environment variable found");
      return null;
    }

    const category = await prismadb.category.findFirst({
      where: {
        id: categoryId,
        storeId: storeId
      },
      include: {
        billboard: true
      }
    });

    if (!category) {
      console.error(`Category with ID ${categoryId} not found in store ${storeId}`);
      return null;
    }

    console.log("getCategoryData - Found category:", category.name);

    return {
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
    };
  } catch (error) {
    console.error("❌ Error fetching category data:", error);
    return null;
  }
};

export default getCategoryData;
