import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'NLL Inventory System',
  description: 'New Life Laptops — Inventory & eBay Order Management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#07071a] text-[#ccd6f6] min-h-screen">
        <Sidebar />
        <main className="ml-60 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
