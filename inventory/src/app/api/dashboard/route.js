import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const [
    totalDevices, availableDevices, listedOnEbay, listedOnFacebook,
    soldDevices, shippedDevices, returnedDevices, totalAccessories,
    soldData, costData, recentDevices
  ] = await Promise.all([
    prisma.device.count(),
    prisma.device.count({ where: { status: 'Available' } }),
    prisma.device.count({ where: { status: 'Listed on eBay' } }),
    prisma.device.count({ where: { status: 'Listed on Facebook' } }),
    prisma.device.count({ where: { status: 'Sold' } }),
    prisma.device.count({ where: { status: 'Shipped' } }),
    prisma.device.count({ where: { status: 'Returned' } }),
    prisma.accessory.count(),
    prisma.device.aggregate({ where: { soldPrice: { not: null } }, _sum: { soldPrice: true } }),
    prisma.device.aggregate({ _sum: { costPrice: true } }),
    prisma.device.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ]);

  const lowStockResult = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "Accessory" WHERE quantity <= "minStock"`;
  const lowStockAccessories = Number(lowStockResult[0]?.count ?? 0);
  const totalRevenue = soldData._sum.soldPrice || 0;
  const totalCost    = costData._sum.costPrice || 0;

  return NextResponse.json({
    totalDevices, availableDevices, listedOnEbay, listedOnFacebook,
    soldDevices, shippedDevices, returnedDevices, totalAccessories,
    totalRevenue, totalCost, profit: totalRevenue - totalCost,
    lowStockAccessories, recentDevices,
  });
}
