import { Billboard } from "@/types";
import prismadb from "@/lib/prismadb";

// Add this to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getBillboard = async (id: string, storeId: string = process.env.STORE_ID || ''): Promise<Billboard | null> => {
  try {
    console.log("getBillboard - Fetching billboard with ID:", id);
    console.log("getBillboard - Using storeId:", storeId);

    // Make sure we have a valid storeId
    if (!storeId) {
      console.error("No storeId provided and no STORE_ID environment variable found");
      return null;
    }

    const billboard = await prismadb.billboard.findFirst({
      where: {
        id,
        storeId
      }
    });

    if (!billboard) {
      console.error(`Billboard with ID ${id} not found in store ${storeId}`);
      return null;
    }

    console.log("getBillboard - Found billboard:", billboard.label);

    return {
      id: billboard.id,
      label: billboard.label,
      imageUrl: billboard.imageUrl,
      storeId: billboard.storeId
    };
  } catch (error) {
    console.error("❌ Error fetching billboard:", error);
    return null;
  }
};

export default getBillboard;
