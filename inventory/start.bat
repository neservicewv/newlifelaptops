@echo off
echo.
echo  New Life Laptops - Inventory System
echo  ====================================
echo.

IF NOT EXIST node_modules (
  echo  [1/3] Installing packages...
  npm install
  echo.
)

IF NOT EXIST prisma\dev.db (
  echo  [2/3] Setting up database...
  npx prisma migrate dev --name init
  echo.
) ELSE (
  echo  [2/3] Database already exists, skipping setup.
  echo.
)

echo  [3/3] Starting inventory system...
echo.
echo  Open your browser to: http://localhost:3000
echo  Press Ctrl+C to stop.
echo.
npm run dev
