import { Color } from "@/types";
import prismadb from "@/lib/prismadb";

const getColors = async (storeId?: string): Promise<Color[]> => {
  try {
    const colors = await prismadb.color.findMany({
      where: {
        storeId: storeId || process.env.STORE_ID
      },
      include: {
        productColors: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return colors.map(color => ({
      id: color.id,
      name: color.name,
      value: color.value,
      // For the frontend, we'll set a default stock value
      // The actual stock is managed per product-color combination
      stock: 0,
      createdAt: color.createdAt.toISOString(),
      updatedAt: color.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error("❌ Error fetching colors:", error);
    return [];
  }
};

export default getColors;
