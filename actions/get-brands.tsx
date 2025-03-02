import { Brand } from "@/types";
import prismadb from "@/lib/prismadb";

const getBrands = async (storeId?: string): Promise<Brand[]> => {
  try {
    const brands = await prismadb.brand.findMany({
      where: {
        storeId: storeId || process.env.STORE_ID
      },
      orderBy: {
        name: 'asc'
      }
    });

    return brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      value: brand.value,
      createdAt: brand.createdAt.toISOString(),
      updatedAt: brand.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error("❌ Error fetching brands:", error);
    return [];
  }
};

export default getBrands;
