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

    const user = await currentUser();
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'Clerk user not found.' }), { status: 404 });
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
      return new NextResponse(JSON.stringify({ error: 'No email address found for user.' }), { status: 400 });
    }

    const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

    // Find user by Clerk ID
    let existingUser = await prismadb.user.findUnique({
      where: { id: userId },
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

    // If user doesn't exist, create them
    if (!existingUser) {
      try {
        console.log('Creating new user with Clerk ID:', userId);
        existingUser = await prismadb.user.create({
          data: {
            id: userId,
            email,
            name: name || 'User',
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
        console.log('User created successfully for wishlist access');
      } catch (error) {
        console.error('Error creating user for wishlist:', error);
        return new NextResponse(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
      }
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

      const user = await currentUser();
      if (!user) {
        return new NextResponse(JSON.stringify({ error: 'Clerk user not found.' }), { status: 404 });
      }

      const email = user.emailAddresses[0]?.emailAddress;
      if (!email) {
        return new NextResponse(JSON.stringify({ error: 'No email address found for user.' }), { status: 400 });
      }

      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim();

      // Find user by Clerk ID
      let userExists = await prismadb.user.findUnique({
        where: { id: userId },
      });

      // If user doesn't exist, create them
      if (!userExists) {
        try {
          console.log('Creating new user with Clerk ID:', userId);
          userExists = await prismadb.user.create({
            data: {
              id: userId,
              email,
              name: name || 'User',
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
          console.log('User created successfully for wishlist update');
        } catch (error) {
          console.error('Error creating user for wishlist update:', error);
          return new NextResponse(JSON.stringify({ error: 'Failed to create user' }), { status: 500 });
        }
      }

      const productExists = await prismadb.product.findUnique({
        where: { id: productId.toString() },
      });

      if (!productExists) {
        console.error('Product does not exist.');
        return new NextResponse(JSON.stringify({ error: 'Product does not exist.' }), { status: 404 });
      }

      const updatedUser = await prismadb.user.update({
        where: { id: userId },
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

        const userExists = await prismadb.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            return new NextResponse('User not found', { status: 404 });
        }

        await prismadb.user.update({
            where: { id: userId },
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
