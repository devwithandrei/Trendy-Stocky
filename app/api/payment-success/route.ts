import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";

// Add this to prevent caching
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentIntentId } = await req.json();
    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment Intent ID required" }, { status: 400 });
    }

    // Find and update the order - use findUnique with index for better performance
    const order = await prismadb.order.findFirst({
      where: {
        paymentIntentId: paymentIntentId,
      },
      select: {
        id: true
      }
    });

    if (!order) {
      console.error("Order not found for payment intent:", paymentIntentId);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    console.log("Updating order to paid:", order.id);

    // Update order to PAID state
    const updatedOrder = await prismadb.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "PAID",
        isPaid: true,
      },
      include: {
        orderItems: true
      }
    });

    console.log("Order updated to paid:", updatedOrder.id);

    // Update product stock
    for (const item of updatedOrder.orderItems) {
      await prismadb.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    return NextResponse.json({ success: true, orderId: updatedOrder.id });
  } catch (error: any) {
    console.error("[PAYMENT_SUCCESS_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to process payment success" },
      { status: 500 }
    );
  }
}
