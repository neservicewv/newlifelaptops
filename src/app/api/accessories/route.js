import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const accessories = await prisma.accessory.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ accessories });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { sku, title, category, ...rest } = body;
    if (!sku || !title || !category) {
      return NextResponse.json({ error: 'SKU, title, and category are required' }, { status: 400 });
    }
    const accessory = await prisma.accessory.create({ data: { sku, title, category, ...rest } });
    return NextResponse.json({ accessory }, { status: 201 });
  } catch (err) {
    if (err.code === 'P2002') return NextResponse.json({ error: 'SKU already exists' }, { status: 409 });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
