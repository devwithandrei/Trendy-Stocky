import { NextResponse } from "next/server";
import { getStoreId } from "@/lib/utils";

interface CustomerDetails {
  name: string;
  email?: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface CreatePaymentIntentPayload {
  productIds: string[];
  sizes: (string | null)[];
  colors: (string | null)[];
  quantities: number[];
  customerDetails: CustomerDetails;
}

export async function POST(
  req: Request
) {
  try {
    const body = await req.json() as CreatePaymentIntentPayload;
    const { productIds, sizes, colors, quantities, customerDetails } = body;

    // Input validation
    if (!productIds?.length) {
      return new NextResponse("Product ids are required", { status: 400 });
    }

    if (!quantities?.length || quantities.some(q => q < 1)) {
      return new NextResponse("Valid quantities are required", { status: 400 });
    }

    if (!customerDetails?.name || !customerDetails?.phone) {
      return new NextResponse("Customer details are required", { status: 400 });
    }

    // Get store ID
    const storeId = getStoreId();

    // Create order and payment intent in CMS dashboard
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/${storeId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: productIds.map((id, index) => ({
          productId: id,
          quantity: quantities[index],
          sizeId: sizes[index] || undefined,
          colorId: colors[index] || undefined
        })),
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email || '',
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          country: customerDetails.country,
          postalCode: customerDetails.postalCode
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create order');
    }

    const orderData = await response.json();
    const { clientSecret, orderId } = orderData;

    if (!clientSecret || !orderId) {
      throw new Error('Invalid response from server: missing clientSecret or orderId');
    }

    return NextResponse.json({ 
      clientSecret,
      orderId
    });
  } catch (error) {
    console.error('[PAYMENT_INTENT_ERROR]', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal error', 
      { status: 500 }
    );
  }
}
