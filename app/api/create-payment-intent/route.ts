import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import prismadb from '@/lib/prismadb';
import { stripe } from '@/lib/stripe';

interface CartItem {
  id: string;
  quantity: number;
  price: string | number;
  selectedSize?: {
    id: string;
    name: string;
  };
  selectedColor?: {
    id: string;
    name: string;
  };
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Login required" }, { status: 401 });
    }

    const { amount, items, customerInfo }: { 
      amount: number; 
      items: CartItem[]; 
      customerInfo: CustomerInfo; 
    } = await request.json();

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

    // Prepare variations metadata for the webhook
    const variations = items.reduce((acc: Record<string, { sizeId?: string; colorId?: string }>, item: CartItem) => {
      if (item.selectedSize || item.selectedColor) {
        acc[item.id] = {
          sizeId: item.selectedSize?.id,
          colorId: item.selectedColor?.id
        };
      }
      return acc;
    }, {});

    console.log("Creating payment intent with:", {
      userId,
      storeId: firstProduct.storeId,
      amount,
      customerInfo,
      items: items.length
    });

    // Create Stripe payment intent with order details in metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: userId,
        storeId: firstProduct.storeId,
        // Only store minimal item information
        items: JSON.stringify(items.map((item: CartItem) => ({
          id: item.id,
          quantity: item.quantity,
          sizeId: item.selectedSize?.id,
          colorId: item.selectedColor?.id
        }))),
        // Only store essential customer info
        customerEmail: customerInfo.email,
        orderId: '' // Will be updated after order creation
      }
    });

    console.log("Payment intent created:", paymentIntent.id);

    // Create order first
    const order = await prismadb.order.create({
      data: {
        userId,
        storeId: firstProduct.storeId,
        amount: Math.round(amount / 100),
        status: "PENDING",
        isPaid: false,
        paymentIntentId: paymentIntent.id,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        country: customerInfo.country,
        postalCode: customerInfo.postalCode,
        orderItems: {
          create: items.map((item: CartItem) => ({
            productId: item.id,
            quantity: item.quantity,
            sizeId: variations[item.id]?.sizeId,
            colorId: variations[item.id]?.colorId,
            price: Math.round(Number(item.price))
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    console.log("Pending order created:", order.id);

    // Update payment intent with orderId
    await stripe.paymentIntents.update(paymentIntent.id, {
      metadata: {
        orderId: order.id
      }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order.id
    });
  } catch (error: any) {
    console.error("PAYMENT_INTENT_ERROR", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
