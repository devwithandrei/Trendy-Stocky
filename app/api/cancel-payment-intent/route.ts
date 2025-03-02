import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { getAuth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

// Add this to prevent caching
export const dynamic = 'force-dynamic';

type PaymentIntent = Stripe.PaymentIntent;

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

    // Get the payment intent to access its metadata
    const paymentIntent: PaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Cancel the payment intent
    await stripe.paymentIntents.cancel(paymentIntentId);

    // Create cancelled order directly (since we're in development and webhook might not be set up)
    const { storeId, items, customerInfo, variations } = paymentIntent.metadata;
    const parsedItems = JSON.parse(items);
    const parsedCustomerInfo = JSON.parse(customerInfo);
    const parsedVariations = JSON.parse(variations);

    console.log("Creating cancelled order with:", {
        userId: clerkUserId,
      storeId,
      amount: paymentIntent.amount,
      customerInfo: parsedCustomerInfo,
      items: parsedItems
    });

    const order = await prismadb.order.create({
      data: {
        userId: clerkUserId,
        storeId,
        amount: Math.round(paymentIntent.amount / 100),
        status: "CANCELLED",
        isPaid: false,
        paymentIntentId: paymentIntent.id,
        customerName: parsedCustomerInfo.name,
        customerEmail: parsedCustomerInfo.email,
        phone: parsedCustomerInfo.phone,
        address: parsedCustomerInfo.address,
        city: parsedCustomerInfo.city,
        country: parsedCustomerInfo.country,
        postalCode: parsedCustomerInfo.postalCode,
        orderItems: {
          create: parsedItems.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            sizeId: parsedVariations[item.id]?.sizeId,
            colorId: parsedVariations[item.id]?.colorId,
            price: Math.round(Number(item.price))
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    console.log("Cancelled order created:", order.id);
    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("[CANCEL_PAYMENT_ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to cancel payment" },
      { status: 500 }
    );
  }
}
