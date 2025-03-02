import { Category } from "@/types";
import prismadb from "@/lib/prismadb";

// Add this to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getCategory = async (id: string, storeId: string = process.env.STORE_ID || ''): Promise<Category | null> => {
  try {
    console.log("getCategory - Fetching category with ID:", id);
    console.log("getCategory - Using storeId:", storeId);

    // Try to find by ID first
    let category = await prismadb.category.findFirst({
      where: {
        id,
        storeId
      },
      include: {
        billboard: true
      }
    });

    // If not found by ID, try to find by name (case-insensitive)
    if (!category) {
      console.log("Category not found by ID, trying by name...");
      category = await prismadb.category.findFirst({
        where: {
          name: {
            equals: id,
            mode: 'insensitive'
          },
          storeId
        },
        include: {
          billboard: true
        }
      });
    }

    if (!category) {
      console.error(`Category with ID/name ${id} not found in store ${storeId}`);
      return null;
    }

    console.log("getCategory - Found category:", category.name);

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
    console.error("❌ Error fetching category:", error);
    return null;
  }
};

export default getCategory;
