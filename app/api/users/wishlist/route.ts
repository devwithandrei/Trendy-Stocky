import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Get user's wishlist
export async function GET(
  req: Request,
) {
    try {
      const { userId, user } = auth(); // Get user object

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const decodedUserId = decodeURIComponent(userId);
    console.log('Decoded User ID (GET):', decodedUserId);

    // Check if user exists and create if not
    let existingUser = await prismadb.user.findFirst({ // Use findFirst instead of findUnique
      where: { id: decodedUserId },
      include: {
        wishlistProducts: {
          include: {
            images: true,
            category: true,
            brand: true,
          }
        }
      },
    }); // Remove extra curly brace

    console.log('User object (GET):', existingUser);

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(existingUser.wishlistProducts);
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
      const { userId, user } = auth(); // Get user object
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

      // Check if user exists and create if not
      let userExists = await prismadb.user.findFirst({ // Use findFirst instead of findUnique
        where: { id: decodedUserId },
      });

      if (!userExists) {
        await prismadb.user.create({
          data: {
            id: decodedUserId,
            email: user?.emailAddresses[0]?.emailAddress || '', // Get email from Clerk
            name: user?.firstName || '',
          },
        });
      }

      console.log('User exists (POST):', userExists);

      if (!userExists) {
        console.error('User does not exist.');
        return new NextResponse(JSON.stringify({ error: 'User does not exist.' }), { status: 404 });
      }

      // Check if the product exists
      const productExists = await prismadb.product.findUnique({
        where: { id: productId.toString() },
      });

      if (!productExists) {
        console.error('Product does not exist.');
        return new NextResponse(JSON.stringify({ error: 'Product does not exist.' }), { status: 404 });
      }

      const updatedUser = await prismadb.user.update({ // Rename variable
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
        const { userId, user } = auth(); // Get user object
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get('productId');

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (!productId) {
            return new NextResponse('Product ID is required.', { status: 400 });
        }

        const decodedUserId = decodeURIComponent(userId);

        // Check if user exists
        const userExists = await prismadb.user.findUnique({
            where: { id: decodedUserId },
        });

        if (!userExists) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Remove product from wishlist
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
