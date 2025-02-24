import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Delete product from wishlist
export async function DELETE(
  req: Request,
  { params }: { params: { productId: string } }
) {
    try {
      const userId = await auth().then((session) => session.userId);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    console.log('User ID (DELETE):', userId);
    console.log('Product ID (DELETE):', params.productId);

    const decodedUserId = decodeURIComponent(userId);

    const user = await prismadb.user.update({
      where: { id: decodedUserId },
      data: {
        wishlistProducts: {
          disconnect: { id: decodeURIComponent(params.productId).toString() }
        }
      },
      include: {
        wishlistProducts: true,
      }
    });

    return NextResponse.json(user.wishlistProducts);
  } catch (error: any) {
    console.log('[WISHLIST_DELETE]', error);
    return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
  }
}
