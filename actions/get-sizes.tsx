import { Size } from "@/types";
import prismadb from "@/lib/prismadb";

const getSizes = async (storeId?: string): Promise<Size[]> => {
  try {
    const sizes = await prismadb.size.findMany({
      where: {
        storeId: storeId || process.env.STORE_ID
      },
      include: {
        productSizes: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return sizes.map(size => ({
      id: size.id,
      name: size.name,
      value: size.value,
      // For the frontend, we'll set a default stock value
      // The actual stock is managed per product-size combination
      stock: 0,
      createdAt: size.createdAt.toISOString(),
      updatedAt: size.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error("❌ Error fetching sizes:", error);
    return [];
  }
};

export default getSizes;
