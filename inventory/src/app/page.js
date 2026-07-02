'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Laptop, Package, DollarSign, TrendingUp, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';

function StatCard({ icon: Icon, label, value, sub, color = '#00a8ff' }) {
  return (
    <div className="card flex items-start gap-4">
      <div className="p-3 rounded-xl" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="text-[#8892b0] text-xs uppercase tracking-widest font-semibold">{label}</p>
        <p className="text-3xl font-black text-[#e6f1ff] mt-0.5 font-mono">{value}</p>
        {sub && <p className="text-[#8892b0] text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData).catch(console.error);
  }, []);

  if (!data) return (
    <div className="p-10 text-[#8892b0] flex items-center gap-3">
      <RefreshCw size={18} className="animate-spin" /> Loading...
    </div>
  );

  return (
    <div className="p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#e6f1ff] font-mono tracking-wide uppercase">Dashboard</h1>
        <p className="text-[#8892b0] text-sm mt-1">New Life Laptops — Inventory Overview</p>
      </div>

      {data.lowStockAccessories > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-orange-700/40 bg-orange-900/20 flex items-start gap-3">
          <AlertTriangle size={18} className="text-orange-400 mt-0.5 flex-shrink-0" />
          <p className="text-orange-300 text-sm">
            {data.lowStockAccessories} accessor{data.lowStockAccessories === 1 ? 'y is' : 'ies are'} low on stock.
            <Link href="/accessories" className="underline ml-1">Check Accessories →</Link>
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Laptop}       label="Total Devices"  value={data.totalDevices}     sub={`${data.availableDevices} available`} />
        <StatCard icon={CheckCircle}  label="Sold"           value={data.soldDevices}       sub="all time"         color="#a78bfa" />
        <StatCard icon={Package}      label="Accessories"    value={data.totalAccessories}  sub={`${data.lowStockAccessories} low stock`} color="#34d399" />
        <StatCard icon={DollarSign}   label="Total Revenue"  value={`$${(data.totalRevenue||0).toFixed(2)}`} color="#fbbf24" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        <StatCard icon={DollarSign}   label="Total Cost"     value={`$${(data.totalCost||0).toFixed(2)}`}    color="#f87171" />
        <StatCard icon={TrendingUp}   label="Profit"         value={`$${(data.profit||0).toFixed(2)}`}       color="#34d399" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-[#e6f1ff] uppercase tracking-widest">Recent Devices</h2>
            <Link href="/devices" className="text-xs text-[#00a8ff] hover:underline">View all →</Link>
          </div>
          <table>
            <thead><tr><th>Title</th><th>Condition</th><th>Status</th><th>Price</th></tr></thead>
            <tbody>
              {(data.recentDevices || []).map(d => (
                <tr key={d.id}>
                  <td className="max-w-[140px] truncate font-medium text-[#ccd6f6]">{d.title}</td>
                  <td className="text-[#8892b0] text-xs">{d.condition}</td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="text-[#00a8ff] font-mono font-bold">${d.salePrice?.toFixed(2) || '—'}</td>
                </tr>
              ))}
              {!data.recentDevices?.length && (
                <tr><td colSpan={4} className="text-center text-[#8892b0] py-6">No devices yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2 className="text-sm font-bold text-[#e6f1ff] uppercase tracking-widest mb-4">Inventory Status</h2>
          <div className="space-y-3">
            {[
              { label: 'Available',           val: data.availableDevices,   color: '#10b981' },
              { label: 'Listed on eBay',       val: data.listedOnEbay,       color: '#00a8ff' },
              { label: 'Listed on Facebook',   val: data.listedOnFacebook,   color: '#3b82f6' },
              { label: 'Sold',                 val: data.soldDevices,        color: '#a855f7' },
              { label: 'Shipped',              val: data.shippedDevices,     color: '#f59e0b' },
              { label: 'Returned',             val: data.returnedDevices,    color: '#ef4444' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[#ccd6f6] text-sm">{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${data.totalDevices > 0 ? ((val||0)/data.totalDevices*100) : 0}%`, background: color }} />
                  </div>
                  <span className="font-mono text-sm font-bold w-6 text-right" style={{ color }}>{val ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
