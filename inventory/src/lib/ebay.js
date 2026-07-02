// eBay API helper — OAuth 2.0 + Fulfillment API
const EBAY_ENV = process.env.EBAY_ENV || 'sandbox';

const URLS = {
  sandbox: {
    auth:  'https://auth.sandbox.ebay.com/oauth2/authorize',
    token: 'https://api.sandbox.ebay.com/identity/v1/oauth2/token',
    api:   'https://api.sandbox.ebay.com',
  },
  production: {
    auth:  'https://auth.ebay.com/oauth2/authorize',
    token: 'https://api.ebay.com/identity/v1/oauth2/token',
    api:   'https://api.ebay.com',
  },
};

const env = URLS[EBAY_ENV] || URLS.sandbox;

const SCOPES = [
  'https://api.ebay.com/oauth/api_scope',
  'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
  'https://api.ebay.com/oauth/api_scope/sell.inventory.readonly',
].join(' ');

export function getAuthorizationUrl(state = '') {
  const params = new URLSearchParams({
    client_id:     process.env.EBAY_CLIENT_ID,
    redirect_uri:  process.env.EBAY_REDIRECT_URI,
    response_type: 'code',
    scope:         SCOPES,
    prompt:        'login',
    state,
  });
  return `${env.auth}?${params.toString()}`;
}

function basicAuth() {
  const creds = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`
  ).toString('base64');
  return `Basic ${creds}`;
}

export async function exchangeCodeForTokens(code) {
  const res = await fetch(env.token, {
    method: 'POST',
    headers: {
      Authorization:  basicAuth(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: process.env.EBAY_REDIRECT_URI,
    }),
  });
  return res.json();
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(env.token, {
    method: 'POST',
    headers: {
      Authorization:  basicAuth(),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
      scope:         SCOPES,
    }),
  });
  return res.json();
}

export async function getValidToken(account) {
  if (!account) throw new Error('No eBay account connected');
  const expiresAt = new Date(account.expiresAt);
  const fiveMin   = 5 * 60 * 1000;
  if (Date.now() < expiresAt.getTime() - fiveMin) {
    return account.accessToken;
  }
  const data = await refreshAccessToken(account.refreshToken);
  if (data.error) throw new Error(`Token refresh failed: ${data.error_description}`);
  return data.access_token;
}

export async function fetchEbayOrders(accessToken, options = {}) {
  const { limit = 50, offset = 0, filter } = options;
  const params = new URLSearchParams({ limit, offset });
  if (filter) params.set('filter', filter);

  const res = await fetch(
    `${env.api}/sell/fulfillment/v1/order?${params}`,
    {
      headers: {
        Authorization:  `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`eBay API error ${res.status}: ${err}`);
  }
  return res.json();
}

export async function fetchEbayOrder(accessToken, orderId) {
  const res = await fetch(`${env.api}/sell/fulfillment/v1/order/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.json();
}

export function parseEbayOrder(order) {
  const lineItems = (order.lineItems || []).map((li) => ({
    sku:          li.sku || null,
    title:        li.title,
    quantity:     li.quantity,
    price:        parseFloat(li.lineItemCost?.value || 0),
    legacyItemId: li.legacyItemId || null,
  }));

  const total = parseFloat(
    order.pricingSummary?.total?.value ||
    order.pricingSummary?.priceSubtotal?.value ||
    0
  );

  const shipping = order.fulfillmentStartInstructions?.[0]?.shippingStep;

  return {
    ebayOrderId:    order.orderId,
    buyerUsername:  order.buyer?.username || null,
    buyerEmail:     order.buyer?.buyerRegistrationAddress?.email || null,
    salePrice:      total,
    shippingCost:   parseFloat(order.pricingSummary?.deliveryCost?.value || 0),
    saleDate:       new Date(order.creationDate),
    shippingStatus: order.orderFulfillmentStatus || 'PENDING',
    trackingNumber: shipping?.trackingNumber || null,
    carrier:        shipping?.shippingCarrierCode || null,
    lineItems,
  };
}
