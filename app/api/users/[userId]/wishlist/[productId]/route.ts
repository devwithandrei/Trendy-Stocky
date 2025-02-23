import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Delete product from wishlist
export async function DELETE(
  req: Request,
  { params }: { params: { userId: string; productId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Ensure the authenticated user is only modifying their own wishlist
    if (userId !== decodeURIComponent(params.userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const productExists = await prismadb.product.findUnique({
      where: { id: decodeURIComponent(params.productId) }
    });

    if (!productExists) {
      return new NextResponse('Product does not exist', { status: 404 });
    }

    const user = await prismadb.user.update({
      where: { id: decodeURIComponent(params.userId) },
      data: {
        wishlistProducts: {
          disconnect: { id: decodeURIComponent(params.productId) }
        }
      },
      include: {
        wishlistProducts: true,
      }
    });

    return NextResponse.json(user.wishlistProducts);
  } catch (error) {
    console.log('[WISHLIST_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
