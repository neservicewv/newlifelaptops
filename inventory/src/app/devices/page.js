'use client';
import { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, RefreshCw } from 'lucide-react';
import StatusBadge from '@/components/StatusBadge';
import ConditionBadge from '@/components/ConditionBadge';
import Modal from '@/components/Modal';

const STATUSES   = ['Available','Listed on eBay','Listed on Facebook','Sold','Shipped','Returned'];
const CONDITIONS = ['Excellent','Good','Fair','Parts Only'];
const BRANDS     = ['Apple','Dell','HP','Lenovo','Microsoft','Asus','Acer','Toshiba','Samsung','Other'];

const EMPTY = {
  sku:'', title:'', brand:'Apple', model:'', serialNumber:'',
  processor:'', ram:'', storage:'', display:'', battery:'', os:'', color:'',
  condition:'Good', conditionNotes:'', costPrice:'', salePrice:'',
  status:'Available', location:'', notes:'', ebayListingId:'', ebaySku:'',
};

function Field({ label, name, value, onChange, type='text', options, required, full }) {
  return (
    <div className={`form-group${full ? ' full' : ''}`}>
      <label>{label}{required && ' *'}</label>
      {options ? (
        <select name={name} value={value} onChange={onChange}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} required={required} />
      )}
    </div>
  );
}

function DeviceForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY);
  const set = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-5">
      <div className="form-grid">
        <Field label="SKU" name="sku" value={form.sku} onChange={set} required />
        <Field label="Status" name="status" value={form.status} onChange={set} options={STATUSES} />
        <Field label="Title / Description" name="title" value={form.title} onChange={set} required full />
        <Field label="Brand" name="brand" value={form.brand} onChange={set} options={BRANDS} />
        <Field label="Model" name="model" value={form.model} onChange={set} required />
        <Field label="Serial Number" name="serialNumber" value={form.serialNumber} onChange={set} />
        <Field label="Processor" name="processor" value={form.processor} onChange={set} />
        <Field label="RAM" name="ram" value={form.ram} onChange={set} />
        <Field label="Storage" name="storage" value={form.storage} onChange={set} />
        <Field label="Display" name="display" value={form.display} onChange={set} />
        <Field label="Battery Health" name="battery" value={form.battery} onChange={set} />
        <Field label="Operating System" name="os" value={form.os} onChange={set} />
        <Field label="Color" name="color" value={form.color} onChange={set} />
        <Field label="Condition" name="condition" value={form.condition} onChange={set} options={CONDITIONS} />
        <Field label="Cost Price ($)" name="costPrice" value={form.costPrice} onChange={set} type="number" />
        <Field label="Sale Price ($)" name="salePrice" value={form.salePrice} onChange={set} type="number" />
        <Field label="Location / Bin" name="location" value={form.location} onChange={set} />
        <Field label="eBay Listing ID" name="ebayListingId" value={form.ebayListingId} onChange={set} />
        <Field label="eBay SKU" name="ebaySku" value={form.ebaySku} onChange={set} />
        <div className="form-group full"><label>Condition Notes</label>
          <textarea name="conditionNotes" value={form.conditionNotes} onChange={set} rows={2} /></div>
        <div className="form-group full"><label>Internal Notes</label>
          <textarea name="notes" value={form.notes} onChange={set} rows={2} /></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? <RefreshCw size={14} className="animate-spin" /> : null}
          {saving ? 'Saving...' : 'Save Device'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [filter, setFilter]   = useState('All');
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState(null);
  const [saving, setSaving]   = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch('/api/devices').then(r => r.json()).then(d => { setDevices(d); setLoading(false); });
  };
  useEffect(load, []);

  const filtered = devices.filter(d => {
    const mf = filter === 'All' || d.status === filter;
    const ms = !search || [d.title, d.sku, d.brand, d.model, d.serialNumber]
      .some(v => v?.toLowerCase().includes(search.toLowerCase()));
    return mf && ms;
  });

  const save = async (form) => {
    setSaving(true);
    const isEdit = modal?.id;
    await fetch(isEdit ? `/api/devices/${modal.id}` : '/api/devices', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false); setModal(null); load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this device?')) return;
    await fetch(`/api/devices/${id}`, { method: 'DELETE' });
    load();
  };

  const counts = ['All', ...STATUSES].reduce((acc, s) => ({
    ...acc, [s]: s === 'All' ? devices.length : devices.filter(d => d.status === s).length
  }), {});

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#e6f1ff] font-mono uppercase tracking-wide">Devices</h1>
          <p className="text-[#8892b0] text-sm mt-1">{devices.length} total items in inventory</p>
        </div>
        <button className="btn-primary" onClick={() => setModal('add')}><Plus size={16} /> Add Device</button>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {Object.entries(counts).map(([s, n]) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filter === s
                ? 'bg-[rgba(0,168,255,0.15)] text-[#00a8ff] border-[rgba(0,168,255,0.4)]'
                : 'text-[#8892b0] border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,168,255,0.25)]'
            }`}>
            {s} <span className="opacity-60">({n})</span>
          </button>
        ))}
      </div>

      <div className="relative mb-5 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8892b0]" />
        <input type="text" placeholder="Search by title, SKU, brand, serial..." value={search}
          onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '36px' }} />
      </div>

      <div className="card overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-[#8892b0] flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin" /> Loading...
          </div>
        ) : (
          <table>
            <thead><tr>
              <th>SKU</th><th>Title</th><th>Brand</th><th>Condition</th>
              <th>Status</th><th>Cost</th><th>Sale Price</th><th>eBay ID</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td className="font-mono text-xs text-[#8892b0]">{d.sku}</td>
                  <td><div className="font-semibold text-[#e6f1ff] max-w-[200px] truncate">{d.title}</div>
                    <div className="text-xs text-[#8892b0]">{d.model}</div></td>
                  <td className="text-[#ccd6f6]">{d.brand}</td>
                  <td><ConditionBadge condition={d.condition} /></td>
                  <td><StatusBadge status={d.status} /></td>
                  <td className="font-mono text-[#8892b0]">${Number(d.costPrice).toFixed(2)}</td>
                  <td className="font-mono font-bold text-[#00a8ff]">${d.salePrice ? Number(d.salePrice).toFixed(2) : '—'}</td>
                  <td className="font-mono text-xs text-[#8892b0]">{d.ebayListingId || '—'}</td>
                  <td><div className="flex gap-2">
                    <button onClick={() => setModal(d)} className="p-1.5 rounded-lg hover:bg-white/10 text-[#8892b0] hover:text-[#00a8ff] transition"><Edit2 size={14} /></button>
                    <button onClick={() => remove(d.id)} className="p-1.5 rounded-lg hover:bg-red-900/30 text-[#8892b0] hover:text-red-400 transition"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={9} className="text-center py-12 text-[#8892b0]">
                  {devices.length ? 'No devices match your filter.' : 'No devices yet. Click "Add Device" to start.'}
                </td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Add New Device' : `Edit — ${modal.title}`} onClose={() => setModal(null)} wide>
          <DeviceForm initial={modal === 'add' ? null : modal} onSave={save} onCancel={() => setModal(null)} saving={saving} />
        </Modal>
      )}
    </div>
  );
}
