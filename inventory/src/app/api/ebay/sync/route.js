import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getValidToken, fetchEbayOrders, parseEbayOrder } from '@/lib/ebay';

export async function POST() {
  const account = await prisma.ebayAccount.findUnique({ where: { id: 'default' } });
  if (!account) return NextResponse.json({ error: 'eBay not connected. Go to Settings.' }, { status: 400 });

  let accessToken;
  try {
    accessToken = await getValidToken(account);
    if (accessToken !== account.accessToken) {
      await prisma.ebayAccount.update({ where:{id:'default'}, data:{accessToken, expiresAt:new Date(Date.now()+7200*1000)} });
    }
  } catch {
    return NextResponse.json({ error: 'Token expired. Please reconnect eBay in Settings.' }, { status: 401 });
  }

  const since = new Date(Date.now()-90*24*60*60*1000).toISOString();
  let ebayOrders = [];
  try {
    const res = await fetchEbayOrders(accessToken, { filter:`creationdate:[${since}]`, limit:200 });
    ebayOrders = res.orders || [];
  } catch {
    return NextResponse.json({ error: 'Failed to fetch from eBay API.' }, { status: 502 });
  }

  let created=0, matched=0, skipped=0;

  for (const raw of ebayOrders) {
    const o = parseEbayOrder(raw);
    const existing = await prisma.ebayOrder.findUnique({ where:{ebayOrderId:o.ebayOrderId} });
    if (existing) { skipped++; continue; }

    let deviceId = null;
    for (const item of o.lineItems) {
      if (item.sku) {
        const d = await prisma.device.findFirst({ where:{OR:[{ebaySku:item.sku},{sku:item.sku}]} });
        if (d) { deviceId=d.id; break; }
      }
      if (item.legacyItemId) {
        const d = await prisma.device.findFirst({ where:{ebayListingId:item.legacyItemId} });
        if (d) { deviceId=d.id; break; }
      }
    }

    await prisma.ebayOrder.create({ data:{
      ebayOrderId:o.ebayOrderId, buyerUsername:o.buyerUsername||null, buyerEmail:o.buyerEmail||null,
      salePrice:o.salePrice, shippingCost:o.shippingCost,
      saleDate:o.saleDate?new Date(o.saleDate):new Date(),
      shippingStatus:o.shippingStatus||null, trackingNumber:o.trackingNumber||null,
      carrier:o.carrier||null, lineItems:JSON.stringify(o.lineItems),
      matched:!!deviceId, deviceId,
    }});

    if (deviceId) {
      await prisma.device.update({ where:{id:deviceId}, data:{
        status:'Sold', soldPrice:o.salePrice,
        soldDate:o.saleDate?new Date(o.saleDate):new Date(),
        ebayOrderId:o.ebayOrderId, buyerUsername:o.buyerUsername||null,
        trackingNumber:o.trackingNumber||null, shippingStatus:o.shippingStatus||null,
      }});
      matched++;
    }
    created++;
  }

  return NextResponse.json({
    message:`Sync complete: ${created} new orders (${matched} matched, ${created-matched} unmatched). ${skipped} already saved.`,
    created, matched, unmatched:created-matched, skipped,
  });
}
