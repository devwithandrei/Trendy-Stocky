import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Get user's wishlist
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure the authenticated user is only accessing their own wishlist
    if (userId !== decodeURIComponent(params.userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: { id: decodeURIComponent(params.userId) },
      include: {
        wishlistProducts: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            isFeatured: true,
            isArchived: true,
            images: {
              select: {
                id: true,
                url: true
              },
              take: 1 // Only take the first image for performance
            },
            category: {
              select: {
                id: true,
                name: true
              }
            },
            brand: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user.wishlistProducts);
  } catch (error: any) {
    console.log('[WISHLIST_GET]', error.message);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Add product to wishlist
export async function POST(
    req: Request,
    { params }: { params: { userId: string } }
  ) {
    try {
      const { userId } = await auth();
      const { productId } = await req.json();

      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      if (!productId) {
        return new NextResponse("Product ID is required", { status: 400 });
      }

      // Ensure the authenticated user is only modifying their own wishlist
      if (userId !== decodeURIComponent(params.userId)) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const productExists = await prismadb.product.findUnique({
        where: { id: productId }
      });

      if (!productExists) {
        return new NextResponse('Product does not exist', { status: 404 });
      }

      const user = await prismadb.user.update({
        where: { id: decodeURIComponent(params.userId) },
        data: {
          wishlistProducts: {
            connect: { id: productId }
          }
        },
        include: {
          wishlistProducts: {
            select: {
              id: true,
              name: true,
              price: true,
              stock: true,
              isFeatured: true,
              isArchived: true,
              images: {
                select: {
                  id: true,
                  url: true
                },
                take: 1 // Only take the first image for performance
              },
              category: {
                select: {
                  id: true,
                  name: true
                }
              },
              brand: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
  
      return NextResponse.json(user.wishlistProducts);
    } catch (error) {
      console.log('[WISHLIST_POST]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
