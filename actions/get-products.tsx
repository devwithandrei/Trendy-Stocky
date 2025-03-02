import { Product } from "@/types";
import prismadb from "@/lib/prismadb";

interface Query {
  categoryId?: string;
  brandId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  limit?: number;
  search?: string;
  storeId?: string;
}

const getProducts = async (query: Query = {}): Promise<Product[]> => {
  try {
    const {
      categoryId,
      brandId,
      colorId,
      sizeId,
      isFeatured,
      limit,
      search,
      storeId = process.env.STORE_ID
    } = query;

    console.log("Fetching products with params:", query);
    console.log("Using storeId:", storeId);

    // Make sure we have a valid storeId
    if (!storeId) {
      console.error("No storeId provided and no STORE_ID environment variable found");
      return [];
    }

    // Build the where clause
    const where: any = {
      storeId,
      isArchived: false
    };

    console.log("Query where clause:", where);

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (brandId) {
      where.brandId = brandId;
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          description: {
            value: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          category: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    // Handle color and size filtering
    let productIds: string[] | undefined;

    if (colorId) {
      const productColors = await prismadb.productColor.findMany({
        where: { colorId },
        select: { productId: true }
      });
      productIds = productColors.map(pc => pc.productId);
      if (productIds.length === 0) return [];
      where.id = { in: productIds };
    }

    if (sizeId) {
      const productSizes = await prismadb.productSize.findMany({
        where: { sizeId },
        select: { productId: true }
      });
      const sizeProductIds = productSizes.map(ps => ps.productId);
      if (sizeProductIds.length === 0) return [];
      
      // If we already have productIds from color filter, find intersection
      if (productIds) {
        productIds = productIds.filter(id => sizeProductIds.includes(id));
        if (productIds.length === 0) return [];
        where.id = { in: productIds };
      } else {
        where.id = { in: sizeProductIds };
      }
    }

    // Fetch products with all related data
    const products = await prismadb.product.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit || undefined
    });

    // Transform the data to match the Product interface
    const formattedProducts = products.map(product => ({
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
    }));

    // Log the number of products found
    console.log("Found products:", formattedProducts.length);
    if (formattedProducts.length > 0) {
      // Log a sample product for debugging
      console.log("Sample product:", formattedProducts[0].id, ":", {
        name: formattedProducts[0].name,
        stock: formattedProducts[0].stock,
        sizeCount: formattedProducts[0].sizes?.length || 0,
        colorCount: formattedProducts[0].colors?.length || 0
      });
    }

    return formattedProducts;
  } catch (error: any) {
    console.error('[getProducts] Error:', error.message);
    return [];
  }
};

export default getProducts;
