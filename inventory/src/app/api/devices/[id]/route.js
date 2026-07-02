import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
  const device = await prisma.device.findUnique({
    where: { id: params.id },
    include: { accessories: { include: { accessory: true } } },
  });
  if (!device) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(device);
}

export async function PUT(req, { params }) {
  const data = await req.json();
  const device = await prisma.device.update({
    where: { id: params.id },
    data: {
      sku: data.sku, title: data.title,
      brand: data.brand || null, model: data.model || null,
      serialNumber: data.serialNumber || null, processor: data.processor || null,
      ram: data.ram || null, storage: data.storage || null,
      display: data.display || null, battery: data.battery || null,
      os: data.os || null, color: data.color || null,
      condition: data.condition || 'Good', conditionNotes: data.conditionNotes || null,
      costPrice: data.costPrice ? parseFloat(data.costPrice) : 0,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      status: data.status, location: data.location || null, notes: data.notes || null,
      ebayListingId: data.ebayListingId || null, ebaySku: data.ebaySku || null,
      soldPrice: data.soldPrice ? parseFloat(data.soldPrice) : null,
      soldDate: data.soldDate ? new Date(data.soldDate) : null,
      trackingNumber: data.trackingNumber || null,
    },
  });
  return NextResponse.json(device);
}

export async function DELETE(req, { params }) {
  await prisma.device.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
