import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

const findOrderByPaymentIntent = async (paymentIntentId: string) => {
  const order = await prismadb.order.findFirst({
    where: {
      paymentIntentId,
    },
  });
  return order;
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    try {
      // Update order status
      const order = await findOrderByPaymentIntent(paymentIntent.id);
      if (!order) {
        console.error("Order not found for payment intent:", paymentIntent.id);
        return new NextResponse("Order not found", { status: 404 });
      }

      await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "PAID",
          isPaid: true,
        },
      });
    } catch (error) {
      console.error("Error updating order:", error);
      return new NextResponse("Error updating order", { status: 500 });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    try {
      // Update order status to cancelled if payment fails
      const order = await findOrderByPaymentIntent(paymentIntent.id);
      if (!order) {
        console.error("Order not found for payment intent:", paymentIntent.id);
        return new NextResponse("Order not found", { status: 404 });
      }

      await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "CANCELLED",
          isPaid: false,
        },
      });
    } catch (error) {
      console.error("Error updating order:", error);
      return new NextResponse("Error updating order", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
