import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const devices = await prisma.device.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ devices });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { sku, title, brand, model, ...rest } = body;
    if (!sku || !title || !brand) {
      return NextResponse.json({ error: 'SKU, title, and brand are required' }, { status: 400 });
    }
    const device = await prisma.device.create({
      data: { sku, title, brand, model: model || brand, ...rest },
    });
    return NextResponse.json({ device }, { status: 201 });
  } catch (err) {
    if (err.code === 'P2002') return NextResponse.json({ error: 'SKU already exists' }, { status: 409 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
