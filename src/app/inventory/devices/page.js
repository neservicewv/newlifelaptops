'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function statusClass(s) {
  const m = { Available: 'available', Sold: 'sold', Listed: 'listed', Hold: 'hold', 'Needs Repair': 'repair' };
  return m[s] || 'available';
}

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetch('/api/devices')
      .then(r => r.json())
      .then(d => { setDevices(d.devices || []); setLoading(false); });
  }, []);

  const filtered = devices.filter(d => {
    const q = search.toLowerCase();
    const matchQ = !q || d.title.toLowerCase().includes(q) || d.brand.toLowerCase().includes(q) || d.sku.toLowerCase().includes(q) || (d.model || '').toLowerCase().includes(q);
    const matchS = statusFilter === 'all' || d.status === statusFilter;
    return matchQ && matchS;
  });

  return (
    <div>
      <div className="inv-page-header">
        <div>
          <h1 className="inv-page-title">Devices</h1>
          <p className="inv-page-subtitle">{devices.length} device{devices.length !== 1 ? 's' : ''} in inventory</p>
        </div>
        <Link href="/inventory/devices/new" className="inv-btn inv-btn-primary">
          <i className="fas fa-plus"></i> Add Device
        </Link>
      </div>

      <div className="inv-toolbar">
        <div className="inv-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, brand, SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="inv-form-select"
          style={{ width: 'auto', minWidth: '150px' }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Needs Repair">Needs Repair</option>
          <option value="Hold">Hold</option>
          <option value="Listed">Listed</option>
        </select>
      </div>

      {loading ? (
        <div className="inv-empty"><i className="fas fa-spinner fa-spin"></i><p>Loading...</p></div>
      ) : filtered.length === 0 ? (
        <div className="inv-empty">
          <i className="fas fa-laptop"></i>
          <p>{devices.length === 0 ? 'No devices yet.' : 'No devices match your search.'}</p>
          {devices.length === 0 && (
            <Link href="/inventory/devices/new" className="inv-btn inv-btn-primary" style={{ marginTop: '16px' }}>
              Add First Device
            </Link>
          )}
        </div>
      ) : (
        <div className="inv-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="inv-table">
            <thead>
              <tr>
                <th>SKU</th><th>Device</th><th>Brand</th><th>Condition</th>
                <th>Status</th><th>Cost</th><th>Price</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'monospace', color: '#8892b0', fontSize: '0.78rem' }}>{d.sku}</td>
                  <td><strong style={{ color: '#e6f1ff' }}>{d.title}</strong></td>
                  <td style={{ color: '#8892b0' }}>{d.brand}</td>
                  <td style={{ color: '#8892b0', fontSize: '0.8rem' }}>{d.condition}</td>
                  <td><span className={`inv-badge ${statusClass(d.status)}`}>{d.status}</span></td>
                  <td style={{ color: '#8892b0' }}>{d.costPrice ? `$${d.costPrice.toFixed(2)}` : '—'}</td>
                  <td style={{ color: '#00a8ff', fontWeight: 600 }}>{d.salePrice ? `$${d.salePrice.toFixed(2)}` : '—'}</td>
                  <td>
                    <Link href={`/inventory/devices/${d.id}`} className="inv-btn inv-btn-secondary inv-btn-sm">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
