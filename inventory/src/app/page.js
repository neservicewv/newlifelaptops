'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Laptop, Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

function StatCard({ icon: Icon, label, value, sub, color = '#00a8ff' }) {
  return (
    <div className="card flex items-start gap-4">
      <div className="p-3 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-[#8892b0] text-xs uppercase tracking-widest font-semibold">{label}</p>
        <p className="text-3xl font-black text-[#e6f1ff] mt-0.5" style={{ fontFamily: 'monospace' }}>{value}</p>
        {sub && <p className="text-[#8892b0] text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const load = () =>
    fetch('/api/dashboard').then(r => r.json()).then(setData).catch(console.error);

  useEffect(() => { load(); }, []);

  const syncEbay = async () => {
    setSyncing(true); setSyncMsg('');
    try {
      const r = await fetch('/api/ebay/sync', { method: 'POST' });
      const d = await r.json();
      setSyncMsg(d.message || d.error || 'Done');
      load();
    } catch { setSyncMsg('Sync failed'); }
    setSyncing(false);
  };

  if (!data) return (
    <div className="p-10 text-[#8892b0] flex items-center gap-3">
      <RefreshCw size={18} className="animate-spin" /> Loading dashboard...
    </div>
  );

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#e6f1ff] font-mono tracking-wide uppercase">Dashboard</h1>
          <p className="text-[#8892b0] text-sm mt-1">New Life Laptops — Inventory Overview</p>
        </div>
        <div className="flex items-center gap-3">
          {syncMsg && (
            <span className="text-sm text-[#00a8ff] bg-[rgba(0,168,255,0.1)] px-3 py-1.5 rounded-lg border border-[rgba(0,168,255,0.2)]">
              {syncMsg}
            </span>
          )}
          <button onClick={syncEbay} disabled={syncing} className="btn-primary">
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync eBay Orders'}
          </button>
        </div>
      </div>

      {data.lowStockAccessories > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-orange-700/40 bg-orange-900/20 flex items-start gap-3">
          <AlertTriangle size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-orange-300 text-sm">{data.lowStockAccessories} accessor{data.lowStockAccessories === 1 ? 'y is' : 'ies are'} low on stock. Check the Accessories page.</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard icon={Laptop}       label="Total Devices"  value={data.totalDevices}    sub={`${data.availableDevices} available`} />
        <StatCard icon={CheckCircle}  label="Listed on eBay" value={data.listedOnEbay}    sub="active listings"  color="#00d4ff" />
        <StatCard icon={ShoppingCart} label="Sold"           value={data.soldDevices}      sub="all time"        color="#a78bfa" />
        <StatCard icon={Package}      label="Accessories"    value={data.totalAccessories} sub={`${data.lowStockAccessories} low stock`} color="#34d399" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={DollarSign}   label="Total Revenue"  value={`$${(data.totalRevenue||0).toFixed(2)}`}  color="#fbbf24" />
        <StatCard icon={TrendingUp}   label="Total Profit"   value={`$${(data.profit||0).toFixed(2)}`}        color="#34d399" />
        <StatCard icon={ShoppingCart} label="eBay Orders"    value={data.totalOrders}     sub={`${data.unmatchedOrders} unmatched`} color="#f87171" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#e6f1ff] uppercase tracking-widest">Recent Devices</h2>
            <Link href="/devices" className="text-xs text-[#00a8ff] hover:underline">View all →</Link>
          </div>
          <table>
            <thead><tr><th>Title</th><th>Status</th><th>Price</th></tr></thead>
            <tbody>
              {(data.recentDevices || []).map(d => (
                <tr key={d.id}>
                  <td className="max-w-[160px] truncate font-medium text-[#ccd6f6]">{d.title}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="text-[#00a8ff] font-mono font-bold">${d.salePrice?.toFixed(2) || '—'}</td>
                </tr>
              ))}
              {!data.recentDevices?.length && <tr><td colSpan={3} className="text-center text-[#8892b0] py-6">No devices yet</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#e6f1ff] uppercase tracking-widest">Recent eBay Orders</h2>
            <Link href="/orders" className="text-xs text-[#00a8ff] hover:underline">View all →</Link>
          </div>
          <table>
            <thead><tr><th>Order ID</th><th>Buyer</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {(data.recentOrders || []).map(o => (
                <tr key={o.id}>
                  <td className="font-mono text-xs text-[#8892b0]">#{o.ebayOrderId?.slice(-8)}</td>
                  <td className="text-[#ccd6f6]">{o.buyerUsername || '—'}</td>
                  <td className="text-[#00a8ff] font-mono font-bold">${o.salePrice?.toFixed(2)}</td>
                  <td><StatusBadge status={o.matched ? 'FULFILLED' : 'PENDING'} /></td>
                </tr>
              ))}
              {!data.recentOrders?.length && <tr><td colSpan={4} className="text-center text-[#8892b0] py-6">No orders — connect eBay in Settings</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
