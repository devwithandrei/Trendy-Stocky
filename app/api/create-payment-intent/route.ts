import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getAuth } from "@clerk/nextjs/server";
import prismadb from '@/lib/prismadb';

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {});

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    const { amount, items, customerInfo } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Validate stock availability
    for (const item of items) {
      const product = await prismadb.product.findUnique({
        where: { id: item.id },
        include: {
          productSizes: true,
          productColors: true
        }
      });

      if (!product) {
        return NextResponse.json({ error: `Product ${item.id} not found` }, { status: 404 });
      }

      // Check total product stock
      if (!product.stock || product.stock < item.quantity) {
        return NextResponse.json({
          error: `Insufficient stock for product ${product.name}`
        }, { status: 400 });
      }
    }

    // Get storeId from the first product
    const firstProduct = await prismadb.product.findUnique({
      where: { id: items[0].id },
      select: { storeId: true }
    });

    if (!firstProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Create order in database
    const order = await prismadb.order.create({
      data: {
        userId: userId || 'guest',
        storeId: firstProduct.storeId,
        amount: amount / 100, // Convert cents to dollars for DB
        status: 'PENDING',
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        country: customerInfo.country,
        postalCode: customerInfo.postalCode,
        orderItems: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            sizeId: item.selectedSize?.id,
            colorId: item.selectedColor?.id,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    // Prepare variations metadata for the webhook
    const variations = items.reduce((acc: any, item: any) => {
      if (item.selectedSize || item.selectedColor) {
        acc[item.id] = {
          sizeId: item.selectedSize?.id,
          colorId: item.selectedColor?.id
        };
      }
      return acc;
    }, {});

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card', 'link'],
      payment_method_options: {
        card: {
          setup_future_usage: 'off_session'
        }
      },
      metadata: {
        orderId: order.id,
        userId: userId || 'guest',
        variations: JSON.stringify(variations)
      }
    });

    // Update order with payment intent ID
    await prismadb.order.update({
      where: { id: order.id },
      data: { paymentIntentId: paymentIntent.id }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error("PAYMENT_INTENT_ERROR", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
