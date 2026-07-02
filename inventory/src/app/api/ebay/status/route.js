import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const account = await prisma.ebayAccount.findUnique({ where: { id: 'default' } });
  if (!account) return NextResponse.json({ connected: false });
  return NextResponse.json({ connected: true, username: account.username, expiresAt: account.expiresAt });
}

export async function DELETE() {
  await prisma.ebayAccount.deleteMany({ where: { id: 'default' } });
  return NextResponse.json({ success: true });
}
