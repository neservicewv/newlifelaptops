# New Life Laptops — Inventory System

A Next.js 14 inventory management system for tracking refurbished laptops, accessories, and eBay sales.

## Features

- **Devices** — full CRUD with spec fields, SKU, condition, pricing, eBay listing info
- **Accessories & Parts** — inventory with quantity tracking and low-stock alerts
- **eBay Order Sync** — OAuth 2.0, auto-pulls completed orders, matches to inventory by SKU or Listing ID
- **Dashboard** — revenue, profit, status breakdowns, recent activity
- **Reports** — business analytics overview

## Quick Start

### 1. Install dependencies

```bash
cd inventory
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your eBay credentials (see below).

### 3. Set up the database

```bash
npx prisma migrate dev --name init
```

This creates `prisma/dev.db` — a local SQLite file, no server needed.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## eBay Developer Setup

1. Go to [developer.ebay.com](https://developer.ebay.com) and create an app
2. Under **Auth Tokens → OAuth**, register your redirect URI
3. Copy **Client ID** and **Client Secret** to `.env.local`
4. In the app, go to **Settings → Connect eBay Account**

**Required scopes** (requested automatically):
- `https://api.ebay.com/oauth/api_scope`
- `https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly`

## Order Matching Logic

When syncing, each eBay order line item is matched to a device by:
1. eBay SKU → device `ebaySku` field (or `sku` field)
2. eBay Listing ID → device `ebayListingId` field

Matched devices are auto-marked **Sold**. Unmatched orders go to the **Unmatched** tab for manual review.

## Tech Stack

- [Next.js 14](https://nextjs.org) App Router
- [Prisma 5](https://www.prisma.io) + SQLite
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide React](https://lucide.dev)
- eBay OAuth 2.0 + Fulfillment API
