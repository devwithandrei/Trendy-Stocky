import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const storeId = searchParams.get('storeId') || undefined;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!search) {
      return new NextResponse("Search term is required", { status: 400 });
    }

    const where: any = {
      storeId,
      isArchived: false,
      OR: [
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
      ]
    };

    const products = await prismadb.product.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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

    return NextResponse.json(formattedProducts);

  } catch (error) {
    console.log('[PRODUCTS_SEARCH_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
