'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

function statusClass(s) {
  const m = { Available: 'available', Sold: 'sold', Listed: 'listed', Hold: 'hold', 'Needs Repair': 'repair' };
  return m[s] || 'available';
}

export default function DeviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDevice = useCallback(async () => {
    const res = await fetch(`/api/devices/${id}`);
    const data = await res.json();
    if (data.device) {
      const d = data.device;
      setForm({
        ...d,
        costPrice: d.costPrice?.toString() ?? '0',
        salePrice: d.salePrice?.toString() ?? '',
        soldPrice: d.soldPrice?.toString() ?? '',
        soldDate: d.soldDate ? new Date(d.soldDate).toISOString().split('T')[0] : '',
      });
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { if (id) fetchDevice(); }, [id, fetchDevice]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const { id: _id, createdAt, updatedAt, accessories, ...data } = form;
      const res = await fetch(`/api/devices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          costPrice: parseFloat(data.costPrice) || 0,
          salePrice: data.salePrice ? parseFloat(data.salePrice) : null,
          soldPrice: data.soldPrice ? parseFloat(data.soldPrice) : null,
          soldDate: data.soldDate ? new Date(data.soldDate) : null,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Save failed'); }
      setSuccess('Saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this device? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/devices/${id}`, { method: 'DELETE' });
    router.push('/inventory/devices');
  }

  if (loading) return <div className="inv-empty"><i className="fas fa-spinner fa-spin"></i><p>Loading...</p></div>;
  if (!form) return <div className="inv-empty"><i className="fas fa-circle-exclamation"></i><p>Device not found.</p></div>;

  return (
    <div>
      <div className="inv-page-header">
        <div>
          <h1 className="inv-page-title" style={{ fontSize: '1.1rem' }}>{form.title}</h1>
          <p className="inv-page-subtitle">SKU: {form.sku} &nbsp;&middot;&nbsp; <span className={`inv-badge ${statusClass(form.status)}`}>{form.status}</span></p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/inventory/devices" className="inv-btn inv-btn-secondary"><i className="fas fa-arrow-left"></i> Back</Link>
          <button onClick={handleDelete} className="inv-btn inv-btn-danger" disabled={deleting}>
            <i className="fas fa-trash"></i> {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {error && <div className="inv-alert inv-alert-error"><i className="fas fa-circle-exclamation"></i> {error}</div>}
      {success && <div className="inv-alert inv-alert-success"><i className="fas fa-check"></i> {success}</div>}

      <form onSubmit={handleSave}>
        <div className="inv-card">
          <div className="inv-card-title">Basic Info</div>
          <div className="inv-form-grid-3">
            <div className="inv-form-group"><label className="inv-form-label">SKU</label><input className="inv-form-input" value={form.sku||''} onChange={e=>set('sku',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Brand</label><input className="inv-form-input" value={form.brand||''} onChange={e=>set('brand',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Model</label><input className="inv-form-input" value={form.model||''} onChange={e=>set('model',e.target.value)} /></div>
          </div>
          <div className="inv-form-group"><label className="inv-form-label">Title</label><input className="inv-form-input" value={form.title||''} onChange={e=>set('title',e.target.value)} /></div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group"><label className="inv-form-label">Serial Number</label><input className="inv-form-input" value={form.serialNumber||''} onChange={e=>set('serialNumber',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Color</label><input className="inv-form-input" value={form.color||''} onChange={e=>set('color',e.target.value)} /></div>
          </div>
        </div>

        <div className="inv-card">
          <div className="inv-card-title">Specs</div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group"><label className="inv-form-label">Processor</label><input className="inv-form-input" value={form.processor||''} onChange={e=>set('processor',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">RAM</label><input className="inv-form-input" value={form.ram||''} onChange={e=>set('ram',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Storage</label><input className="inv-form-input" value={form.storage||''} onChange={e=>set('storage',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Display</label><input className="inv-form-input" value={form.display||''} onChange={e=>set('display',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Battery</label><input className="inv-form-input" value={form.battery||''} onChange={e=>set('battery',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">OS</label><input className="inv-form-input" value={form.os||''} onChange={e=>set('os',e.target.value)} /></div>
          </div>
        </div>

        <div className="inv-card">
          <div className="inv-card-title">Condition &amp; Status</div>
          <div className="inv-form-grid-2">
            <div className="inv-form-group">
              <label className="inv-form-label">Condition</label>
              <select className="inv-form-select" value={form.condition||''} onChange={e=>set('condition',e.target.value)}>
                <option>Grade A – Excellent</option><option>Grade B – Good</option><option>Grade C – Fair</option>
              </select>
            </div>
            <div className="inv-form-group">
              <label className="inv-form-label">Status</label>
              <select className="inv-form-select" value={form.status||''} onChange={e=>set('status',e.target.value)}>
                <option value="Available">Available</option>
                <option value="Hold">Hold</option>
                <option value="Needs Repair">Needs Repair</option>
                <option value="Listed">Listed</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>
          <div className="inv-form-group"><label className="inv-form-label">Condition Notes</label><textarea className="inv-form-textarea" value={form.conditionNotes||''} onChange={e=>set('conditionNotes',e.target.value)} /></div>
        </div>

        <div className="inv-card">
          <div className="inv-card-title">Pricing &amp; Location</div>
          <div className="inv-form-grid-3">
            <div className="inv-form-group"><label className="inv-form-label">Cost ($)</label><input className="inv-form-input" type="number" step="0.01" value={form.costPrice||''} onChange={e=>set('costPrice',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Sale Price ($)</label><input className="inv-form-input" type="number" step="0.01" value={form.salePrice||''} onChange={e=>set('salePrice',e.target.value)} /></div>
            <div className="inv-form-group"><label className="inv-form-label">Location</label><input className="inv-form-input" value={form.location||''} onChange={e=>set('location',e.target.value)} /></div>
          </div>
          <div className="inv-form-group"><label className="inv-form-label">Notes</label><textarea className="inv-form-textarea" value={form.notes||''} onChange={e=>set('notes',e.target.value)} /></div>
        </div>

        {form.status === 'Sold' && (
          <div className="inv-card">
            <div className="inv-card-title">Sale Details</div>
            <div className="inv-form-grid-3">
              <div className="inv-form-group"><label className="inv-form-label">Sold Price ($)</label><input className="inv-form-input" type="number" step="0.01" value={form.soldPrice||''} onChange={e=>set('soldPrice',e.target.value)} /></div>
              <div className="inv-form-group"><label className="inv-form-label">Sale Date</label><input className="inv-form-input" type="date" value={form.soldDate||''} onChange={e=>set('soldDate',e.target.value)} /></div>
              <div className="inv-form-group"><label className="inv-form-label">Buyer Name</label><input className="inv-form-input" value={form.buyerName||''} onChange={e=>set('buyerName',e.target.value)} /></div>
            </div>
            <div className="inv-form-group"><label className="inv-form-label">Tracking Number</label><input className="inv-form-input" value={form.trackingNumber||''} onChange={e=>set('trackingNumber',e.target.value)} /></div>
          </div>
        )}

        <button type="submit" className="inv-btn inv-btn-primary" disabled={saving}>
          {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
