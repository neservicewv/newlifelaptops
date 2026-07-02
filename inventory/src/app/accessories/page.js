'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, AlertTriangle, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import Modal from '@/components/Modal';

const CATEGORIES = ['Charger','Power Cord','Cable','Dock','Battery','RAM','Storage','Screen','Keyboard','Other Parts'];
const CONDITIONS = ['New','Excellent','Good','Fair','For Parts'];
const STATUSES   = ['In Stock','Low Stock','Out of Stock','Listed on eBay','Sold'];

const EMPTY = {
  sku:'', title:'', brand:'', category:'Charger', compatible:'',
  condition:'Good', costPrice:'', salePrice:'', quantity:'1', minStock:'1',
  status:'In Stock', location:'', notes:'', ebayListingId:'', ebaySku:'',
};

export default function AccessoriesPage() {
  const [items, setItems]     = useState([]);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/accessories').then(r => r.json()).then(d => { setItems(d); setLoading(false); });
  };
  useEffect(load, []);

  const openAdd  = () => { setForm({...EMPTY}); setModal('add'); };
  const openEdit = (a)  => { setForm({...a}); setModal(a); };
  const set = e => setForm(p => ({...p, [e.target.name]: e.target.value}));

  const save = async () => {
    setSaving(true);
    const isEdit = modal?.id;
    await fetch(isEdit ? `/api/accessories/${modal.id}` : '/api/accessories', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false); setModal(null); load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this accessory?')) return;
    await fetch(`/api/accessories/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = items.filter(a => {
    const mf = filter === 'All' || a.category === filter;
    const ms = !search || [a.title, a.sku, a.brand, a.compatible]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });
  const lowStock = items.filter(a => a.quantity <= a.minStock);

  const F = ({ label, name, type='text', options, full }) => (
    <div className={`form-group${full?' full':''}`}>
      <label>{label}</label>
      {options
        ? <select name={name} value={form[name]} onChange={set}>{options.map(o=><option key={o}>{o}</option>)}</select>
        : <input type={type} name={name} value={form[name]||''} onChange={set} />}
    </div>
  );

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#e6f1ff] font-mono uppercase tracking-wide">Accessories & Parts</h1>
          <p className="text-[#8892b0] text-sm mt-1">{items.length} items · {lowStock.length} low stock</p>
        </div>
        <button className="btn-primary" onClick={openAdd}><Plus size={16}/> Add Accessory</button>
      </div>

      {lowStock.length > 0 && (
        <div className="mb-5 p-3 rounded-xl border border-orange-700/40 bg-orange-900/20 flex items-center gap-3">
          <AlertTriangle size={16} className="text-orange-400" />
          <span className="text-orange-300 text-sm">Low stock: {lowStock.map(a=>`${a.title} (${a.quantity})`).join(' · ')}</span>
        </div>
      )}

      <div className="flex gap-2 flex-wrap mb-4">
        {['All',...CATEGORIES].map(c=>(
          <button key={c} onClick={()=>setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter===c ? 'bg-[rgba(0,168,255,0.15)] text-[#00a8ff] border-[rgba(0,168,255,0.4)]'
                         : 'text-[#8892b0] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,168,255,0.25)]'
            }`}>{c}</button>
        ))}
      </div>

      <div className="relative mb-5 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8892b0]" />
        <input type="text" placeholder="Search accessories..." value={search}
          onChange={e=>setSearch(e.target.value)} style={{paddingLeft:'36px'}} />
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-[#8892b0] flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin" /> Loading...
          </div>
        ) : (
          <table>
            <thead><tr>
              <th>SKU</th><th>Title</th><th>Category</th><th>Condition</th>
              <th>Qty</th><th>Min</th><th>Status</th><th>Cost</th><th>Price</th><th>Location</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} className={a.quantity<=a.minStock?'bg-orange-900/5':''}>
                  <td className="font-mono text-xs text-[#8892b0]">{a.sku}</td>
                  <td><div className="font-semibold text-[#e6f1ff]">{a.title}</div>
                    {a.brand&&<div className="text-xs text-[#8892b0]">{a.brand}</div>}
                    {a.compatible&&<div className="text-xs text-[#00a8ff]/70">For: {a.compatible}</div>}
                  </td>
                  <td><span className="px-2 py-0.5 rounded-full text-xs bg-[rgba(0,168,255,0.1)] text-[#00a8ff] border border-[rgba(0,168,255,0.2)]">{a.category}</span></td>
                  <td className="text-[#ccd6f6] text-sm">{a.condition}</td>
                  <td><span className={`font-mono font-bold text-lg ${a.quantity<=a.minStock?'text-orange-400':'text-[#e6f1ff]'}`}>{a.quantity}</span>
                    {a.quantity<=a.minStock&&<AlertTriangle size={12} className="inline ml-1 text-orange-400" />}
                  </td>
                  <td className="text-[#8892b0] font-mono">{a.minStock}</td>
                  <td><StatusBadge status={a.status}/></td>
                  <td className="font-mono text-[#8892b0]">${Number(a.costPrice).toFixed(2)}</td>
                  <td className="font-mono text-[#00a8ff] font-bold">${a.salePrice?Number(a.salePrice).toFixed(2):'—'}</td>
                  <td className="text-[#8892b0] text-sm">{a.location||'—'}</td>
                  <td><div className="flex gap-2">
                    <button onClick={()=>openEdit(a)} className="p-1.5 rounded-lg hover:bg-white/10 text-[#8892b0] hover:text-[#00a8ff] transition"><Edit2 size={14}/></button>
                    <button onClick={()=>remove(a.id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-[#8892b0] hover:text-red-400 transition"><Trash2 size={14}/></button>
                  </div></td>
                </tr>
              ))}
              {!filtered.length&&(
                <tr><td colSpan={11} className="text-center py-12 text-[#8892b0]">
                  {items.length?'No items match your filter.':'No accessories yet.'}
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal==='add'?'Add Accessory / Part':`Edit — ${modal.title||'Accessory'}`} onClose={()=>setModal(null)} wide>
          <div className="form-grid">
            {[['SKU','sku'],['Title','title','',true],['Brand','brand']].map(([l,n,,full])=>(
              <div key={n} className={`form-group${full?' full':''}`}><label>{l}</label>
                <input name={n} value={form[n]||''} onChange={set}/></div>
            ))}
            <div className="form-group"><label>Category</label>
              <select name="category" value={form.category} onChange={set}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label>Condition</label>
              <select name="condition" value={form.condition} onChange={set}>{CONDITIONS.map(c=><option key={c}>{c}</option>)}</select></div>
            <div className="form-group"><label>Status</label>
              <select name="status" value={form.status} onChange={set}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>
            <div className="form-group"><label>Compatible With</label><input name="compatible" value={form.compatible||''} onChange={set}/></div>
            <div className="form-group"><label>Quantity</label><input type="number" name="quantity" value={form.quantity} onChange={set}/></div>
            <div className="form-group"><label>Min Stock Alert</label><input type="number" name="minStock" value={form.minStock} onChange={set}/></div>
            <div className="form-group"><label>Cost Price ($)</label><input type="number" name="costPrice" value={form.costPrice||''} onChange={set}/></div>
            <div className="form-group"><label>Sale Price ($)</label><input type="number" name="salePrice" value={form.salePrice||''} onChange={set}/></div>
            <div className="form-group"><label>Location</label><input name="location" value={form.location||''} onChange={set}/></div>
            <div className="form-group"><label>eBay Listing ID</label><input name="ebayListingId" value={form.ebayListingId||''} onChange={set}/></div>
            <div className="form-group full"><label>Notes</label><textarea rows={2} name="notes" value={form.notes||''} onChange={set}/></div>
          </div>
          <div className="flex gap-3 pt-4">
            <button className="btn-primary" disabled={saving} onClick={save}>{saving?'Saving...':'Save'}</button>
            <button className="btn-secondary" onClick={()=>setModal(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
