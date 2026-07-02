'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function AccessoryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAcc = useCallback(async () => {
    const res = await fetch(`/api/accessories/${id}`);
    const data = await res.json();
    if (data.accessory) {
      const a = data.accessory;
      setForm({ ...a, costPrice: a.costPrice?.toString() ?? '0', salePrice: a.salePrice?.toString() ?? '' });
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { if (id) fetchAcc(); }, [id, fetchAcc]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const { id: _id, createdAt, updatedAt, devices, ...data } = form;
      const res = await fetch(`/api/accessories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          costPrice: parseFloat(data.costPrice) || 0,
          salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
          quantity: parseInt(data.quantity) || 0,
          minStock: parseInt(data.minStock) || 1,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSuccess('Saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this accessory?')) return;
    await fetch(`/api/accessories/${id}`, { method: 'DELETE' });
    router.push('/inventory/accessories');
  }

  if (loading) return <div className="inv-empty"><i className="fas fa-spinner fa-spin"></i><p>Loading...</p></div>;
  if (!form) return <div className="inv-empty"><p>Not found.</p></div>;

  return (
    <div>
      <div className="inv-page-header">
        <div>
          <h1 className="inv-page-title">{form.title}</h1>
          <p className="inv-page-subtitle">SKU: {form.sku}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/inventory/accessories" className="inv-btn inv-btn-secondary"><i className="fas fa-arrow-left"></i> Back</Link>
          <button onClick={handleDelete} className="inv-btn inv-btn-danger"><i className="fas fa-trash"></i> Delete</button>
        </div>
      </div>

      {error && <div className="inv-alert inv-alert-error">{error}</div>}
      {success && <div className="inv-alert inv-alert-success"><i className="fas fa-check"></i> {success}</div>}

      <form onSubmit={handleSave}>
        <div className="inv-card">
          <div className="inv-card-title">Details</div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group"><label className="inv-form-label">SKU</label><input className="inv-form-input" value={form.sku||''} onChange={e=>set('sku',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Category</label>
              <select className="inv-form-select" value={form.category||''} onChange={e=>set('category',e.target.value)}>
                <option>Cable</option><option>Charger</option><option>Battery</option><option>RAM</option><option>SSD/HDD</option><option>Keyboard</option><option>Screen</option><option>Mouse</option><option>Bag/Case</option><option>Other</option>
              </select>
            </div>
          </div>
          <div className="inv-form-group"><label className="inv-form-label">Title</label><input className="inv-form-input" value={form.title||''} onChange={e=>set('title',e.target.value)} /></div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group"><label className="inv-form-label">Brand</label><input className="inv-form-input" value={form.brand||''} onChange={e=>set('brand',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Compatible With</label><input className="inv-form-input" value={form.compatible||''} onChange={e=>set('compatible',e.target.value)} /></div>
          </div>
        </div>
        <div className="inv-card">
          <div className="inv-card-title">Stock &amp; Pricing</div>
          <div className="inv-form-grid-3">
            <div className="inv-form-group"><label className="inv-form-label">Quantity</label><input className="inv-form-input" type="number" min="0" value={form.quantity??''} onChange={e=>set('quantity',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Min Stock</label><input className="inv-form-input" type="number" min="0" value={form.minStock??''} onChange={e=>set('minStock',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Cost ($)</label><input className="inv-form-input" type="number" step="0.01" value={form.costPrice||''} onChange={e=>set('costPrice',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Sale Price ($)</label><input className="inv-form-input" type="number" step="0.01" value={form.salePrice||''} onChange={e=>set('salePrice',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Location</label><input className="inv-form-input" value={form.location||''} onChange={e=>set('location',e.target.value)} /></div>
          </div>
          <div className="inv-form-group"><label className="inv-form-label">Notes</label><textarea className="inv-form-textarea" value={form.notes||''} onChange={e=>set('notes',e.target.value)} /></div>
        </div>
        <button type="submit" className="inv-btn inv-btn-primary" disabled={saving}>
          {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
