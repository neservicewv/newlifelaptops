import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const accessory = await prisma.accessory.findUnique({ where: { id: params.id } });
    if (!accessory) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ accessory });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const body = await req.json();
    const { id, createdAt, updatedAt, devices, ...data } = body;
    const accessory = await prisma.accessory.update({ where: { id: params.id }, data });
    return NextResponse.json({ accessory });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await prisma.accessory.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
