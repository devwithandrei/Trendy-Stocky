import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { type, data } = body;

    if (!type) {
      return new NextResponse("Type is required", { status: 400 });
    }

    if (!data) {
      return new NextResponse("Data is required", { status: 400 });
    }

    if (type === 'product.created') {
      const { id, name, price, categoryId, brandId, descriptionId, storeId, stock, isArchived, isFeatured } = data;

      await prismadb.product.create({
        data: {
          id,
          name,
          price,
          categoryId,
          brandId,
          descriptionId,
          storeId,
          stock,
          isArchived,
          isFeatured,
        },
      });
    } else if (type === 'product.updated') {
      const { id, name, price, categoryId, brandId, descriptionId, storeId, stock, isArchived, isFeatured } = data;

      await prismadb.product.update({
        where: { id },
        data: {
          name,
          price,
          categoryId,
          brandId,
          descriptionId,
          storeId,
          stock,
          isArchived,
          isFeatured,
        },
      });
    } else if (type === 'product.deleted') {
      const { id } = data;

      await prismadb.product.delete({
        where: { id },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('[PRODUCTS_WEBHOOK]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
