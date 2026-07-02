import Sidebar from '@/components/Sidebar';
import './inventory.css';

export const metadata = {
  title: 'NLL Inventory',
};

export default function InventoryLayout({ children }) {
  return (
    <>
      {/* Font Awesome for icons */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />
      <div className="inv-shell">
        <Sidebar />
        <main className="inv-main">{children}</main>
      </div>
    </>
  );
}
