import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const accessories = await prisma.accessory.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(accessories);
}

export async function POST(req) {
  const data = await req.json();
  const accessory = await prisma.accessory.create({
    data: {
      sku: data.sku, title: data.title, brand: data.brand || null,
      category: data.category || 'Other', compatible: data.compatible || null,
      condition: data.condition || 'Good',
      costPrice: data.costPrice ? parseFloat(data.costPrice) : 0,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      quantity: parseInt(data.quantity) || 1, minStock: parseInt(data.minStock) || 1,
      status: data.status || 'In Stock', location: data.location || null,
      notes: data.notes || null, ebayListingId: data.ebayListingId || null, ebaySku: data.ebaySku || null,
    },
  });
  return NextResponse.json(accessory, { status: 201 });
}
