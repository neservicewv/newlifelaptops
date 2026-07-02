import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(req, { params }) {
  const data = await req.json();
  const accessory = await prisma.accessory.update({
    where: { id: params.id },
    data: {
      sku: data.sku, title: data.title, brand: data.brand || null,
      category: data.category || 'Other', compatible: data.compatible || null,
      condition: data.condition || 'Good',
      costPrice: data.costPrice ? parseFloat(data.costPrice) : 0,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      quantity: parseInt(data.quantity) || 1, minStock: parseInt(data.minStock) || 1,
      status: data.status, location: data.location || null,
      notes: data.notes || null, ebayListingId: data.ebayListingId || null, ebaySku: data.ebaySku || null,
    },
  });
  return NextResponse.json(accessory);
}

export async function DELETE(req, { params }) {
  await prisma.accessory.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
