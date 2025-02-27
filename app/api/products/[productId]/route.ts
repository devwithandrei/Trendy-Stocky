import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId
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
      return new NextResponse("Product not found", { status: 404 });
    }

    // Transform product sizes and colors to match the expected format
    const transformedProduct = {
      ...product,
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
      productSizes: undefined,
      productColors: undefined
    };

    return NextResponse.json(transformedProduct);
  } catch (error: any) {
    console.error('[PRODUCT_GET]', error);
    if (error.response?.status === 404) {
      return new NextResponse("Product not found", { status: 404 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
