import { Product } from "@/types";
import prismadb from "@/lib/prismadb";

// Add this to prevent caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const getProduct = async (id: string, storeId: string = process.env.STORE_ID || ''): Promise<Product | null> => {
  try {
    console.log("getProduct - Fetching product with ID:", id);
    console.log("getProduct - Using storeId:", storeId);

    // Make sure we have a valid storeId
    if (!storeId) {
      console.error("No storeId provided and no STORE_ID environment variable found");
      return null;
    }

    const product = await prismadb.product.findFirst({
      where: {
        id: id,
        storeId: storeId
      },
      include: {
        images: true,
        category: {
          include: {
            billboard: true
          }
        },
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
    });

    if (!product) {
      console.error(`Product with ID ${id} not found in store ${storeId}`);
      return null;
    }

    console.log("getProduct - Found product:", product.name);

    // Transform the data to match the Product interface
    return {
      id: product.id,
      name: product.name,
      price: String(product.price),
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        value: product.brand.value,
        createdAt: product.brand.createdAt.toISOString(),
        updatedAt: product.brand.updatedAt.toISOString()
      },
      category: {
        id: product.category.id,
        name: product.category.name,
        billboardId: product.category.billboardId,
        billboard: {
          id: product.category.billboard.id,
          label: product.category.billboard.label,
          imageUrl: product.category.billboard.imageUrl
        },
        createdAt: product.category.createdAt.toISOString(),
        updatedAt: product.category.updatedAt.toISOString()
      },
      description: product.description ? {
        id: product.description.id,
        name: product.description.name,
        value: product.description.value,
        createdAt: product.description.createdAt.toISOString(),
        updatedAt: product.description.updatedAt.toISOString()
      } : null,
      sizes: product.productSizes.map(ps => ({
        id: ps.size.id,
        name: ps.size.name,
        value: ps.size.value,
        stock: ps.stock
      })),
      colors: product.productColors.map(pc => ({
        id: pc.color.id,
        name: pc.color.name,
        value: pc.color.value,
        stock: pc.stock
      })),
      images: product.images.map(image => ({
        id: image.id,
        url: image.url,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString()
      })),
      stock: product.stock || 0,
      isFeatured: product.isFeatured,
      isArchived: product.isArchived,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    };
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
};

export default getProduct;
