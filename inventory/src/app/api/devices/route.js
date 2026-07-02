import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const where = status && status !== 'All' ? { status } : {};
  const devices = await prisma.device.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { accessories: { include: { accessory: true } } },
  });
  return NextResponse.json(devices);
}

export async function POST(req) {
  const data = await req.json();
  const device = await prisma.device.create({
    data: {
      sku: data.sku, title: data.title,
      brand: data.brand || 'Other', model: data.model || '',
      serialNumber: data.serialNumber || null,
      processor: data.processor || null, ram: data.ram || null,
      storage: data.storage || null, display: data.display || null,
      battery: data.battery || null, os: data.os || null, color: data.color || null,
      condition: data.condition || 'Good', conditionNotes: data.conditionNotes || null,
      costPrice: data.costPrice ? parseFloat(data.costPrice) : 0,
      salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
      status: data.status || 'Available',
      location: data.location || null, notes: data.notes || null,
      ebayListingId: data.ebayListingId || null, ebaySku: data.ebaySku || null,
    },
  });
  return NextResponse.json(device, { status: 201 });
}
