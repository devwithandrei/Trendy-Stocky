import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const orders = await prismadb.order.findMany({
      where: {
        userId: clerkUserId,
        OR: [
          { status: "PAID" },
          { status: "SHIPPED" },
          { status: "DELIVERED" },
          { AND: [
            { status: "CANCELLED" },
            { paymentIntentId: { not: null } }
          ]}
        ]
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true
              }
            },
            size: true,
            color: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// Update order status (only accessible by store owner)
export async function PATCH(
  req: Request,
) {
  try {
    const { userId: clerkUserId } = await auth();
    const body = await req.json();
    const { orderId, status } = body;

    if (!clerkUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!orderId) {
      return new NextResponse("Order ID is required", { status: 400 });
    }

    if (!status || !["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(status)) {
      return new NextResponse("Invalid status", { status: 400 });
    }

    // Verify the order belongs to this user
    const order = await prismadb.order.findUnique({
      where: {
        id: orderId,
        userId: clerkUserId,
      }
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const updatedOrder = await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('[ORDER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
