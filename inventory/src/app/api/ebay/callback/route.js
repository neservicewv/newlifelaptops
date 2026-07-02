import { NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/ebay';
import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) return NextResponse.redirect(new URL('/settings?error=ebay_denied', req.url));
  if (!code)  return NextResponse.redirect(new URL('/settings?error=no_code', req.url));

  try {
    const tokens = await exchangeCodeForTokens(code);
    const apiBase = (process.env.EBAY_ENV||'sandbox') === 'production'
      ? 'https://api.ebay.com' : 'https://api.sandbox.ebay.com';
    const userRes  = await fetch(`${apiBase}/commerce/identity/v1/user/`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const userData = await userRes.json().catch(()=>({}));
    const username = userData.userId || 'Unknown';

    await prisma.ebayAccount.upsert({
      where: { id: 'default' },
      create: { id:'default', username, accessToken:tokens.access_token, refreshToken:tokens.refresh_token, expiresAt:new Date(Date.now()+tokens.expires_in*1000) },
      update: {             username, accessToken:tokens.access_token, refreshToken:tokens.refresh_token, expiresAt:new Date(Date.now()+tokens.expires_in*1000) },
    });
    return NextResponse.redirect(new URL('/settings?connected=1', req.url));
  } catch (err) {
    console.error('eBay callback error:', err);
    return NextResponse.redirect(new URL('/settings?error=token_exchange', req.url));
  }
}
