'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, Package, DollarSign, BarChart2 } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color = '#00a8ff' }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div className="text-[#8892b0] text-xs uppercase tracking-wide font-semibold mb-0.5">{label}</div>
        <div className="text-2xl font-black font-mono text-[#e6f1ff]">{value}</div>
        {sub && <div className="text-[#8892b0] text-xs mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(setData); }, []);

  if (!data) return (
    <div className="p-8 text-[#8892b0] flex items-center gap-2">
      <BarChart2 size={16} className="animate-pulse" /> Loading...
    </div>
  );

  const profit = (data.totalRevenue || 0) - (data.totalCost || 0);
  const margin = data.totalRevenue > 0 ? ((profit / data.totalRevenue) * 100).toFixed(1) : 0;

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-2xl font-black text-[#e6f1ff] font-mono uppercase tracking-wide mb-2">Reports</h1>
      <p className="text-[#8892b0] text-sm mb-8">Business performance overview</p>

      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        <StatCard icon={Package}    label="Total Devices" value={data.totalDevices ?? '—'} />
        <StatCard icon={TrendingUp} label="Sold"          value={data.soldDevices ?? '—'}  color="#10b981" />
        <StatCard icon={DollarSign} label="Revenue"       value={`$${(data.totalRevenue || 0).toFixed(2)}`} color="#10b981" />
        <StatCard icon={DollarSign} label="Profit"        value={`$${profit.toFixed(2)}`} sub={`${margin}% margin`} color={profit >= 0 ? '#10b981' : '#ef4444'} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card">
          <h2 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wide mb-4">Device Status Breakdown</h2>
          <div className="space-y-3">
            {[
              { label: 'Available',         val: data.availableDevices,  color: '#10b981' },
              { label: 'Listed on eBay',    val: data.listedOnEbay,      color: '#00a8ff' },
              { label: 'Listed on Facebook',val: data.listedOnFacebook,  color: '#3b82f6' },
              { label: 'Sold',              val: data.soldDevices,       color: '#a855f7' },
              { label: 'Shipped',           val: data.shippedDevices,    color: '#f59e0b' },
              { label: 'Returned',          val: data.returnedDevices,   color: '#ef4444' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[#ccd6f6] text-sm">{label}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full"
                      style={{ width: `${data.totalDevices > 0 ? ((val||0)/data.totalDevices*100) : 0}%`, background: color }} />
                  </div>
                  <span className="font-mono text-sm font-bold" style={{ color }}>{val ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wide mb-4">Financials</h2>
          <div className="space-y-4">
            {[
              { label: 'Total Cost (all devices)',  val: `$${(data.totalCost||0).toFixed(2)}`,    color: '#f87171' },
              { label: 'Revenue (sold devices)',     val: `$${(data.totalRevenue||0).toFixed(2)}`, color: '#10b981' },
              { label: 'Profit',                    val: `$${profit.toFixed(2)}`,                  color: profit >= 0 ? '#10b981' : '#ef4444' },
              { label: 'Profit Margin',             val: `${margin}%`,                              color: '#fbbf24' },
            ].map(({ label, val, color }) => (
              <div key={label} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                <span className="text-[#ccd6f6] text-sm">{label}</span>
                <span className="font-mono text-base font-bold" style={{ color }}>{val}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5">
            <h3 className="text-sm font-semibold text-[#8892b0] uppercase tracking-wide mb-3">Accessories</h3>
            <div className="flex items-center justify-between">
              <span className="text-[#ccd6f6] text-sm">Total in Stock</span>
              <span className="font-mono text-lg font-bold text-[#00a8ff]">{data.totalAccessories ?? 0}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[#ccd6f6] text-sm">Low Stock Alerts</span>
              <span className="font-mono text-lg font-bold text-orange-400">{data.lowStockAccessories ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
