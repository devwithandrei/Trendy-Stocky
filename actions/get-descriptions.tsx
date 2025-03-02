import { Description } from "@/types";
import prismadb from "@/lib/prismadb";

const getDescriptions = async (storeId?: string): Promise<Description[]> => {
  try {
    const descriptions = await prismadb.description.findMany({
      where: {
        storeId: storeId || process.env.STORE_ID
      },
      orderBy: {
        name: 'asc'
      }
    });

    return descriptions.map(description => ({
      id: description.id,
      name: description.name,
      value: description.value,
      createdAt: description.createdAt.toISOString(),
      updatedAt: description.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error("❌ Error fetching descriptions:", error);
    return [];
  }
};

export default getDescriptions;
