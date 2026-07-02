'use client';
import { useEffect, useState } from 'react';
import { Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const load = () => {
    setLoading(true);
    fetch('/api/orders').then(r=>r.json()).then(d=>{setOrders(d);setLoading(false);});
  };
  useEffect(load,[]);

  const sync = async () => {
    setSyncing(true); setSyncMsg('');
    const r = await fetch('/api/ebay/sync',{method:'POST'});
    const d = await r.json();
    setSyncMsg(d.message||d.error||'Done');
    setSyncing(false); load();
  };

  const unmatched = orders.filter(o=>!o.matched).length;
  const filtered  = orders.filter(o=>{
    const mf = filter==='All'||(filter==='Matched'?o.matched:!o.matched);
    const ms = !search||[o.ebayOrderId,o.buyerUsername,o.device?.title]
      .some(v=>v?.toLowerCase().includes(search.toLowerCase()));
    return mf&&ms;
  });

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#e6f1ff] font-mono uppercase tracking-wide">eBay Orders</h1>
          <p className="text-[#8892b0] text-sm mt-1">{orders.length} orders · {unmatched} unmatched</p>
        </div>
        <div className="flex items-center gap-3">
          {syncMsg&&<span className="text-sm text-[#8892b0]">{syncMsg}</span>}
          <button className="btn-primary" onClick={sync} disabled={syncing}>
            <RefreshCw size={16} className={syncing?'animate-spin':''}/>
            {syncing?'Syncing...':'Sync eBay Orders'}
          </button>
        </div>
      </div>

      {unmatched>0&&(
        <div className="mb-5 p-3 rounded-xl border border-orange-700/40 bg-orange-900/20 flex items-center gap-3">
          <AlertCircle size={16} className="text-orange-400"/>
          <span className="text-orange-300 text-sm">{unmatched} order{unmatched>1?'s':''} not matched to inventory. Review below.</span>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {['All','Matched','Unmatched'].map(t=>(
          <button key={t} onClick={()=>setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter===t?'bg-[rgba(0,168,255,0.15)] text-[#00a8ff] border-[rgba(0,168,255,0.4)]'
                        :'text-[#8892b0] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,168,255,0.25)]'
            }`}>
            {t}{t==='Unmatched'&&unmatched>0&&<span className="ml-1 bg-orange-500/80 text-white rounded-full px-1.5 text-[10px]">{unmatched}</span>}
          </button>
        ))}
      </div>

      <div className="relative mb-5 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8892b0]"/>
        <input type="text" placeholder="Search order ID, buyer, device..." value={search}
          onChange={e=>setSearch(e.target.value)} style={{paddingLeft:'36px'}}/>
      </div>

      <div className="card overflow-x-auto">
        {loading?(
          <div className="py-16 text-center text-[#8892b0] flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin"/> Loading...
          </div>
        ):(
          <table>
            <thead><tr>
              <th>eBay Order ID</th><th>Buyer</th><th>Device</th><th>Sale Price</th>
              <th>Sale Date</th><th>Shipping</th><th>Tracking</th><th>Match</th>
            </tr></thead>
            <tbody>
              {filtered.map(o=>(
                <tr key={o.id}>
                  <td><div className="flex items-center gap-2">
                    {o.matched?<CheckCircle size={14} className="text-green-400"/>:<AlertCircle size={14} className="text-orange-400"/>}
                    <span className="font-mono text-xs text-[#8892b0]">{o.ebayOrderId}</span>
                  </div></td>
                  <td className="text-[#ccd6f6]">{o.buyerUsername||'—'}</td>
                  <td>{o.device?(
                    <div><div className="font-semibold text-[#e6f1ff] text-sm">{o.device.title}</div>
                      <div className="text-xs text-[#8892b0] font-mono">{o.device.sku}</div></div>
                  ):<span className="text-orange-400 text-sm">Not matched</span>}</td>
                  <td className="font-mono text-[#00a8ff] font-bold">${Number(o.salePrice).toFixed(2)}</td>
                  <td className="text-[#8892b0] text-sm">{o.saleDate?new Date(o.saleDate).toLocaleDateString():'—'}</td>
                  <td><span className={`text-xs px-2 py-0.5 rounded-full border ${
                    o.shippingStatus==='SHIPPED'?'text-green-400 border-green-700/40 bg-green-900/20'
                                                :'text-[#8892b0] border-[rgba(255,255,255,0.08)]'
                  }`}>{o.shippingStatus||'Pending'}</span></td>
                  <td className="font-mono text-xs text-[#8892b0]">{o.trackingNumber||'—'}</td>
                  <td>{o.matched
                    ?<span className="text-green-400 text-xs flex items-center gap-1"><CheckCircle size={12}/> Matched</span>
                    :<span className="text-orange-400 text-xs flex items-center gap-1"><AlertCircle size={12}/> Unmatched</span>}
                  </td>
                </tr>
              ))}
              {!filtered.length&&(
                <tr><td colSpan={8} className="text-center py-12 text-[#8892b0]">
                  {orders.length?'No orders match.':'No orders yet — click Sync eBay Orders.'}
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
