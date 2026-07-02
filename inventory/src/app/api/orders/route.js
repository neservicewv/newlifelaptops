import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const orders = await prisma.ebayOrder.findMany({
    orderBy: { saleDate: 'desc' },
    include: { device: true },
  });
  return NextResponse.json(orders);
}
