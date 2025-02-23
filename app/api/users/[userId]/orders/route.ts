import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "../../../../../lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Ensure the authenticated user is only accessing their own orders
    if (userId !== params.userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const orders = await prismadb.order.findMany({
      where: {
        userId: params.userId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
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
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Format orders with proper data
    const formattedOrders = orders.map((order: any) => {
      const formattedOrderItems = order.orderItems.map((item: any) => {
        // Find selected size and color if they exist
        const selectedSize = item.product.productSizes.find((ps: { sizeId: string }) => 
          ps.sizeId === item.sizeId
        )?.size;

        const selectedColor = item.product.productColors.find((pc: { colorId: string }) => 
          pc.colorId === item.colorId
        )?.color;

        return {
          ...item,
          product: {
            ...item.product,
            selectedSize,
            selectedColor
          }
        };
      });

      return {
        ...order,
        orderItems: formattedOrderItems,
        formattedTotal: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(Number(order.amount))
      };
    });

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
