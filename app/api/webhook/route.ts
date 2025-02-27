import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

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
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("Warning: STRIPE_WEBHOOK_SECRET not set, skipping signature verification");
      event = JSON.parse(body) as Stripe.Event;
    } else {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    }
  } catch (error: any) {
    console.error("Webhook Error:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  console.log("Webhook received:", event.type);
  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "payment_intent.created") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    try {
      const { userId, storeId, items, customerInfo, variations } = paymentIntent.metadata;
      const parsedItems = JSON.parse(items);
      const parsedCustomerInfo = JSON.parse(customerInfo);
      const parsedVariations = JSON.parse(variations);

      console.log("Creating pending order with:", {
        userId,
        storeId,
        amount: paymentIntent.amount,
        customerInfo: parsedCustomerInfo,
        items: parsedItems
      });

      // Create order in PENDING state
      const newOrder = await prismadb.order.create({
        data: {
          userId,
          storeId,
          amount: Math.round(paymentIntent.amount / 100),
          status: "PENDING",
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

      console.log("Pending order created successfully:", newOrder.id);
      return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("Error creating pending order:", error);
      return new NextResponse("Error creating order", { status: 500 });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    try {
      // Find existing order
      const existingOrder = await findOrderByPaymentIntent(paymentIntent.id);
      if (!existingOrder) {
        console.error("Order not found for payment intent:", paymentIntent.id);
        return new NextResponse("Order not found", { status: 404 });
      }

      console.log("Updating order to paid:", existingOrder.id);

      // Update order to PAID state
      const updatedOrder = await prismadb.order.update({
        where: {
          id: existingOrder.id
        },
        data: {
          status: "PAID",
          isPaid: true
        }
      });

      console.log("Order updated to paid:", updatedOrder.id);

      // Parse items from metadata again
      const { items } = paymentIntent.metadata;
      const parsedItems = JSON.parse(items);

      // Update product stock
      for (const item of parsedItems) {
        await prismadb.product.update({
          where: { id: item.id },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("Error updating order:", error);
      return new NextResponse("Error updating order", { status: 500 });
    }
  }

  // Log webhook event for debugging
  console.log("Webhook event received:", event.type, event.id);

  if (event.type === "payment_intent.payment_failed" || event.type === "payment_intent.canceled") {
    console.log("Payment failed/canceled event received");
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    try {
      const order = await findOrderByPaymentIntent(paymentIntent.id);
      if (!order) {
        console.error("Order not found for payment intent:", paymentIntent.id);
        return new NextResponse("Order not found", { status: 404 });
      }

      console.log("Found order to cancel:", order.id);
      
      // Update order to CANCELLED
      const updatedOrder = await prismadb.order.update({
        where: {
          id: order.id,
        },
        data: {
          status: "CANCELLED",
          isPaid: false,
        },
      });
      
      console.log("Order updated:", updatedOrder);


      return new NextResponse(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("Error updating order:", error);
      return new NextResponse("Error updating order", { status: 500 });
    }
  }

  return new NextResponse(null, { status: 200 });
}
