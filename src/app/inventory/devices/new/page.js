'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const empty = {
  sku: '', title: '', brand: '', model: '', serialNumber: '',
  processor: '', ram: '', storage: '', display: '', battery: '', os: '',
  color: '', condition: 'Grade B – Good', conditionNotes: '',
  costPrice: '', salePrice: '', status: 'Available', location: '', notes: '',
};

export default function NewDevicePage() {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.sku || !form.title || !form.brand) {
      setError('SKU, title, and brand are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          model: form.model || form.brand,
          costPrice: parseFloat(form.costPrice) || 0,
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create device');
      router.push(`/inventory/devices/${data.device.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="inv-page-header">
        <div>
          <h1 className="inv-page-title">Add Device</h1>
          <p className="inv-page-subtitle">Add a new device to inventory</p>
        </div>
        <Link href="/inventory/devices" className="inv-btn inv-btn-secondary">
          <i className="fas fa-arrow-left"></i> Back
        </Link>
      </div>

      {error && <div className="inv-alert inv-alert-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="inv-card">
          <div className="inv-card-title">Basic Info</div>
          <div className="inv-form-grid-3">
            <div className="inv-form-group">
              <label className="inv-form-label">SKU *</label>
              <input className="inv-form-input" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="NLL-001" required />
            </div>
            <div className="inv-form-group">
              <label className="inv-form-label">Brand *</label>
              <input className="inv-form-input" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Dell, HP, Lenovo..." required />
            </div>
            <div className="inv-form-group">
              <label className="inv-form-label">Model</label>
              <input className="inv-form-input" value={form.model} onChange={e => set('model', e.target.value)} placeholder="Latitude E7470" />
            </div>
          </div>
          <div className="inv-form-group">
            <label className="inv-form-label">Title / Display Name *</label>
            <input className="inv-form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Dell Latitude E7470 – Core i5 8GB 256GB SSD" required />
          </div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group">
              <label className="inv-form-label">Serial Number</label>
              <input className="inv-form-input" value={form.serialNumber} onChange={e => set('serialNumber', e.target.value)} />
            </div>
            <div className="inv-form-group">
              <label className="inv-form-label">Color</label>
              <input className="inv-form-input" value={form.color} onChange={e => set('color', e.target.value)} placeholder="Black, Silver..." />
            </div>
          </div>
        </div>

        <div className="inv-card">
          <div className="inv-card-title">Specs</div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group"><label className="inv-form-label">Processor</label><input className="inv-form-input" value={form.processor} onChange={e => set('processor', e.target.value)} placeholder="Intel Core i5-6300U" /></div>
            <div className="inv-form-group"><label className="inv-form-label">RAM</label><input className="inv-form-input" value={form.ram} onChange={e => set('ram', e.target.value)} placeholder="8GB DDR4" /></div>
            <div className="inv-form-group"><label className="inv-form-label">Storage</label><input className="inv-form-input" value={form.storage} onChange={e => set('storage', e.target.value)} placeholder="256GB SSD" /></div>
            <div className="inv-form-group"><label className="inv-form-label">Display</label><input className="inv-form-input" value={form.display} onChange={e => set('display', e.target.value)} placeholder='14" FHD IPS' /></div>
            <div className="inv-form-group"><label className="inv-form-label">Battery</label><input className="inv-form-input" value={form.battery} onChange={e => set('battery', e.target.value)} placeholder="Holds 80%+ charge" /></div>
            <div className="inv-form-group"><label className="inv-form-label">OS</label><input className="inv-form-input" value={form.os} onChange={e => set('os', e.target.value)} placeholder="Windows 11 Pro" /></div>
          </div>
        </div>

        <div className="inv-card">
          <div className="inv-card-title">Condition &amp; Status</div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group">
              <label className="inv-form-label">Condition *</label>
              <select className="inv-form-select" value={form.condition} onChange={e => set('condition', e.target.value)}>
                <option>Grade A – Excellent</option>
                <option>Grade B – Good</option>
                <option>Grade C – Fair</option>
              </select>
            </div>
            <div className="inv-form-group">
              <label className="inv-form-label">Status</label>
              <select className="inv-form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="Available">Available</option>
                <option value="Hold">Hold</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Listed">Listed</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>
          <div className="inv-form-group">
            <label className="inv-form-label">Condition Notes</label>
            <textarea className="inv-form-textarea" value={form.conditionNotes} onChange={e => set('conditionNotes', e.target.value)} placeholder="Small scratch on lid, no cracks..." />
          </div>
        </div>

        <div className="inv-card">
          <div className="inv-card-title">Pricing &amp; Location</div>
          <div className="inv-form-grid-3">
            <div className="inv-form-group"><label className="inv-form-label">Cost Price ($)</label><input className="inv-form-input" type="number" step="0.01" min="0" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0.00" /></div>
            <div className="inv-form-group"><label className="inv-form-label">Sale Price ($)</label><input className="inv-form-input" type="number" step="0.01" min="0" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="0.00" /></div>
            <div className="inv-form-group"><label className="inv-form-label">Location</label><input className="inv-form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Shelf A, Bin 3..." /></div>
          </div>
          <div className="inv-form-group">
            <label className="inv-form-label">Notes</label>
            <textarea className="inv-form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="inv-btn inv-btn-primary" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Device</>}
          </button>
          <Link href="/inventory/devices" className="inv-btn inv-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
