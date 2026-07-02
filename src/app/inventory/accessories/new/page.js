'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const empty = {
  sku: '', title: '', brand: '', category: 'Cable',
  compatible: '', condition: 'Good',
  costPrice: '', salePrice: '', quantity: '1', minStock: '1',
  status: 'In Stock', location: '', notes: '',
};

export default function NewAccessoryPage() {
  const router = useRouter();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.sku || !form.title || !form.category) {
      setError('SKU, title, and category are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/accessories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          costPrice: parseFloat(form.costPrice) || 0,
          salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
          quantity: parseInt(form.quantity) || 1,
          minStock: parseInt(form.minStock) || 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      router.push('/inventory/accessories');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="inv-page-header">
        <div><h1 className="inv-page-title">Add Accessory</h1></div>
        <Link href="/inventory/accessories" className="inv-btn inv-btn-secondary"><i className="fas fa-arrow-left"></i> Back</Link>
      </div>

      {error && <div className="inv-alert inv-alert-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="inv-card">
          <div className="inv-card-title">Details</div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group"><label className="inv-form-label">SKU *</label><input className="inv-form-input" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="ACC-001" required /></div>
            <div className="inv-form-group">
              <label className="inv-form-label">Category *</label>
              <select className="inv-form-select" value={form.category} onChange={e => set('category', e.target.value)}>
                <option>Cable</option><option>Charger</option><option>Battery</option><option>RAM</option><option>SSD/HDD</option><option>Keyboard</option><option>Screen</option><option>Mouse</option><option>Bag/Case</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="inv-form-group"><label className="inv-form-label">Title *</label><input className="inv-form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="USB-C Charger 65W" required /></div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group"><label className="inv-form-label">Brand</label><input className="inv-form-input" value={form.brand} onChange={e => set('brand', e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Compatible With</label><input className="inv-form-input" value={form.compatible} onChange={e => set('compatible', e.target.value)} placeholder="Dell, HP, Universal..." /></div>
          </div>
        </div>

        <div className="inv-card">
          <div className="inv-card-title">Stock &amp; Pricing</div>
          <div className="inv-form-grid-3">
            <div className="inv-form-group"><label className="inv-form-label">Quantity</label><input className="inv-form-input" type="number" min="0" value={form.quantity} onChange={e => set('quantity', e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Min Stock Alert</label><input className="inv-form-input" type="number" min="0" value={form.minStock} onChange={e => set('minStock', e.target.value)} /></div>
            <div className="inv-form-group">
              <label className="inv-form-label">Status</label>
              <select className="inv-form-select" value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
            <div className="inv-form-group"><label className="inv-form-label">Cost ($)</label><input className="inv-form-input" type="number" step="0.01" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Sale Price ($)</label><input className="inv-form-input" type="number" step="0.01" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Location</label><input className="inv-form-input" value={form.location} onChange={e => set('location', e.target.value)} /></div>
          </div>
          <div className="inv-form-group"><label className="inv-form-label">Notes</label><textarea className="inv-form-textarea" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" className="inv-btn inv-btn-primary" disabled={loading}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Accessory</>}
          </button>
          <Link href="/inventory/accessories" className="inv-btn inv-btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
