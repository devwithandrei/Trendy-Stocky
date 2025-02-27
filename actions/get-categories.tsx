import prismadb from "@/lib/prismadb";
import { Category } from "@/types";

const getCategories = async (storeId?: string): Promise<Category[]> => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        storeId: storeId
      },
      include: {
        billboard: true,
        products: {
          include: {
            images: true,
            category: true,
            brand: true,
            description: true,
            productSizes: {
              include: {
                size: true
              }
            },
            productColors: {
              include: {
                color: true
              }
            }
          }
        }
      }
    });

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
