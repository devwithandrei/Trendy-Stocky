import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

// Add this to prevent caching
export const dynamic = 'force-dynamic';

// Helper function to get or create user
async function getOrCreateUser(userId: string) {
  // First try to find the user
  let user = await prismadb.user.findUnique({
    where: { id: userId },
  });

  // If user doesn't exist, create them
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error('Clerk user not found');
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      throw new Error('No email address found for user');
    }

    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();

    user = await prismadb.user.create({
      data: {
        id: userId,
        email,
        name: name || 'User',
      },
    });
  }

  return user;
}

// Get user's wishlist - optimized to fetch only necessary data
export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get or create user
    await getOrCreateUser(userId);

    // Fetch only the wishlist products with minimal data needed for display
    const wishlistProducts = await prismadb.product.findMany({
      where: {
        wishlistUsers: {
          some: {
            id: userId
          }
        }
      },
      select: {
        id: true,
        name: true,
        price: true,
        images: {
          select: {
            id: true,
            url: true
          },
          take: 1 // Only get the first image for performance
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
    });

    // Transform the data to match the expected format
    const formattedProducts = wishlistProducts.map(product => ({
      ...product,
      price: product.price.toString(),
      images: product.images
    }));

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.log('[WISHLIST_GET]', error.message);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Add product to wishlist - optimized for speed
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const productId = body.productId;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!productId) {
      return new NextResponse(JSON.stringify({ error: 'Product ID is required.' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Get or create user
    await getOrCreateUser(userId);

    // Check if product exists
    const productExists = await prismadb.product.findUnique({
      where: { id: productId.toString() },
      select: { id: true } // Only select ID for performance
    });

    if (!productExists) {
      return new NextResponse(JSON.stringify({ error: 'Product does not exist.' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add product to wishlist
    await prismadb.user.update({
      where: { id: userId },
      data: {
        wishlistProducts: {
          connect: { id: productId.toString() }
        }
      }
    });

    // Return success with minimal data
    return NextResponse.json({ 
      success: true, 
      productId: productId.toString() 
    });
  } catch (error) {
    console.error('[WISHLIST_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Remove product from wishlist - optimized for speed
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

    // Remove product from wishlist without additional checks
    await prismadb.user.update({
      where: { id: userId },
      data: {
        wishlistProducts: {
          disconnect: { id: productId },
        },
      },
    });

    // Return success with minimal data
    return NextResponse.json({ 
      success: true, 
      productId 
    });
  } catch (error) {
    console.error('[WISHLIST_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
