'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/inventory',             label: 'Dashboard',   icon: 'fa-gauge' },
  { href: '/inventory/devices',     label: 'Devices',     icon: 'fa-laptop' },
  { href: '/inventory/accessories', label: 'Accessories', icon: 'fa-box' },
  { href: '/inventory/reports',     label: 'Reports',     icon: 'fa-chart-bar' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="inv-sidebar">
      <div className="inv-logo">
        <img src="/images/NLL%20LOGO%20TRANS.png" alt="NLL" />
        <span>Inventory</span>
      </div>
      <nav style={{ flex: 1 }}>
        {links.map(link => {
          const active =
            pathname === link.href ||
            (link.href !== '/inventory' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inv-nav-link${active ? ' active' : ''}`}
            >
              <i className={`fas ${link.icon}`}></i>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="inv-sidebar-footer">
        <a href="/" className="inv-nav-link">
          <i className="fas fa-globe"></i>
          <span>Website</span>
        </a>
      </div>
    </aside>
  );
}
