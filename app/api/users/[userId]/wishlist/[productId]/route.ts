import { getAuth } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import prismadb from "@/lib/prismadb";

// Remove product from wishlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string; productId: string } }
) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the authenticated user is only modifying their own wishlist
    if (userId !== params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.update({
      where: { id: params.userId },
      data: {
        wishlistProducts: {
          disconnect: { id: params.productId }
        }
      },
      include: {
        wishlistProducts: true
      }
    });

    return NextResponse.json(user.wishlistProducts);
  } catch (error) {
    console.log('[WISHLIST_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
