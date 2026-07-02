'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Laptop, Package, BarChart3 } from 'lucide-react';

const links = [
  { href: '/',            label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/devices',     label: 'Devices',     icon: Laptop },
  { href: '/accessories', label: 'Accessories', icon: Package },
  { href: '/reports',     label: 'Reports',     icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[#07071a] border-r border-[rgba(0,168,255,0.12)] flex flex-col z-40">
      <div className="px-6 py-5 border-b border-[rgba(0,168,255,0.12)]">
        <div className="text-[#00a8ff] font-mono font-bold text-sm tracking-widest uppercase">New Life Laptops</div>
        <div className="text-[#8892b0] text-xs mt-0.5 tracking-wider">Inventory System</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-[rgba(0,168,255,0.15)] text-[#00a8ff] border border-[rgba(0,168,255,0.3)]'
                  : 'text-[#8892b0] hover:text-[#ccd6f6] hover:bg-white/5'
              }`}
            >
              <Icon size={17} />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00a8ff]" />}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-[rgba(0,168,255,0.12)] text-xs text-[#8892b0]">
        v0.1 · NLL Inventory
      </div>
    </aside>
  );
}
