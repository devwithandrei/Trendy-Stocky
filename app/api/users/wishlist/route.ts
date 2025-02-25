import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Get user's wishlist
export async function GET(
  req: Request,
) {
    try {
      const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const decodedUserId = decodeURIComponent(userId);
    console.log('Decoded User ID (GET):', decodedUserId);

    const user = await currentUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Clerk user not found.' }), { status: 404 });
    }

    let existingUser = await prismadb.user.findFirst({
      where: { id: decodedUserId },
      include: {
        wishlistProducts: {
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
          }
        }
      },
    });

    if (!existingUser) {
      existingUser = await prismadb.user.create({
        data: {
          id: decodedUserId,
          email: user.emailAddresses[0].emailAddress,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        },
        include: {
          wishlistProducts: {
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
            }
          }
        }
      });
    }

    return NextResponse.json(existingUser?.wishlistProducts || []);
  } catch (error: any) {
    console.log('[WISHLIST_GET]', error.message);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Add product to wishlist
export async function POST(
    req: Request,
  ) {
    try {
      const { userId } = await auth();
      const body = await req.json();
      console.log('Request Body:', body);
      const productId = body.productId;

      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      if (!productId) {
        console.error('Product ID is undefined.');
        return new NextResponse(JSON.stringify({ error: 'Product ID is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }

      console.log('Product ID:', productId);

      const decodedUserId = decodeURIComponent(userId);
      console.log('Decoded User ID (POST):', decodedUserId);

      const user = await currentUser();
      if (!user) {
        return new NextResponse(JSON.stringify({ error: 'Clerk user not found.' }), { status: 404 });
      }

      let userExists = await prismadb.user.findFirst({
        where: { id: decodedUserId },
      });

      if (!userExists) {
        userExists = await prismadb.user.create({
          data: {
            id: decodedUserId,
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          },
          include: {
            wishlistProducts: {
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
              }
            }
          }
        });
      }

      const productExists = await prismadb.product.findUnique({
        where: { id: productId.toString() },
      });

      if (!productExists) {
        console.error('Product does not exist.');
        return new NextResponse(JSON.stringify({ error: 'Product does not exist.' }), { status: 404 });
      }

      const updatedUser = await prismadb.user.update({
        where: { id: decodedUserId },
        data: {
          wishlistProducts: {
            connect: { id: productId.toString() }
          }
        },
        include: {
          wishlistProducts: {
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
            }
          }
        }
      });

      return NextResponse.json(updatedUser.wishlistProducts);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

// Remove product from wishlist
export async function DELETE(req: Request) {
    try {
        const { userId } = await auth();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!productId) {
            return new NextResponse('Product ID is required.', { status: 400 });
        }

        const decodedUserId = decodeURIComponent(userId);

        const userExists = await prismadb.user.findUnique({
            where: { id: decodedUserId },
        });

        if (!userExists) {
            return new NextResponse('User not found', { status: 404 });
        }

        await prismadb.user.update({
            where: { id: decodedUserId },
            data: {
                wishlistProducts: {
                    disconnect: { id: productId },
                },
            },
        });

        return new NextResponse('Product removed from wishlist', { status: 200 });
    } catch (error) {
        console.error('[WISHLIST_DELETE]', error);
        return new NextResponse('Internal error', { status: 500 });
    }
}
