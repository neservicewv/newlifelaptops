import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const device = await prisma.device.findUnique({ where: { id: params.id } });
    if (!device) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ device });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    // Strip non-schema fields
    const { id, createdAt, updatedAt, accessories, ...data } = body;
    const device = await prisma.device.update({ where: { id: params.id }, data });
    return NextResponse.json({ device });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.device.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
