# New Life Laptops — Inventory System

Local inventory management for tracking refurbished laptops and accessories.

## Quick Start (Windows)

1. Install [Node.js](https://nodejs.org) if you haven't already (LTS version)
2. Download or clone this repo
3. Open a terminal in the `inventory/` folder
4. Double-click **`start.bat`** (or run it from the terminal)
5. Open your browser to **http://localhost:3000**

That's it. The first run installs packages and sets up the database automatically.

## Manual Start

If you prefer to run commands yourself:

```bash
cd inventory
npm install
npx prisma migrate dev --name init
npm run dev
```

Then open http://localhost:3000.

## Features

- **Dashboard** — total devices, sold, revenue, profit, low stock alerts
- **Devices** — add/edit/delete laptops with full specs (processor, RAM, storage, display, battery, OS, serial #, condition, cost, sale price, location, notes)
- **Accessories** — track chargers, cables, RAM, batteries, etc. with quantity and low-stock alerts
- **Reports** — revenue, profit, margin, status breakdown

## Statuses

Devices can be marked: **Available**, **Listed on eBay**, **Listed on Facebook**, **Sold**, **Shipped**, **Returned**

Accessories: **In Stock**, **Low Stock**, **Out of Stock**, **Listed on eBay**, **Sold**

## Data

All data is stored locally in `prisma/dev.db` (a SQLite file on your computer). Nothing is sent anywhere. Back up this file to keep your data safe.

## Tech Stack

- [Next.js 14](https://nextjs.org) — web framework
- [Prisma](https://prisma.io) + SQLite — local database
- [Tailwind CSS](https://tailwindcss.com) — styling
