'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/accessories')
      .then(r => r.json())
      .then(d => { setAccessories(d.accessories || []); setLoading(false); });
  }, []);

  const filtered = accessories.filter(a => {
    const q = search.toLowerCase();
    return !q || a.title.toLowerCase().includes(q) || a.sku.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
  });

  function stockClass(a) {
    if (a.quantity === 0) return 'out-stock';
    if (a.quantity <= a.minStock) return 'low-stock';
    return 'in-stock';
  }
  function stockLabel(a) {
    if (a.quantity === 0) return 'Out of Stock';
    if (a.quantity <= a.minStock) return 'Low Stock';
    return 'In Stock';
  }

  return (
    <div>
      <div className="inv-page-header">
        <div>
          <h1 className="inv-page-title">Accessories</h1>
          <p className="inv-page-subtitle">{accessories.length} item{accessories.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/inventory/accessories/new" className="inv-btn inv-btn-primary">
          <i className="fas fa-plus"></i> Add Accessory
        </Link>
      </div>

      <div className="inv-toolbar">
        <div className="inv-search">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search accessories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="inv-empty"><i className="fas fa-spinner fa-spin"></i><p>Loading...</p></div>
      ) : filtered.length === 0 ? (
        <div className="inv-empty">
          <i className="fas fa-box"></i>
          <p>{accessories.length === 0 ? 'No accessories yet.' : 'No items match.'}</p>
          {accessories.length === 0 && (
            <Link href="/inventory/accessories/new" className="inv-btn inv-btn-primary" style={{ marginTop: '16px' }}>Add First Accessory</Link>
          )}
        </div>
      ) : (
        <div className="inv-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="inv-table">
            <thead>
              <tr><th>SKU</th><th>Title</th><th>Category</th><th>Qty</th><th>Stock</th><th>Price</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontFamily: 'monospace', color: '#8892b0', fontSize: '0.78rem' }}>{a.sku}</td>
                  <td><strong style={{ color: '#e6f1ff' }}>{a.title}</strong></td>
                  <td style={{ color: '#8892b0' }}>{a.category}</td>
                  <td style={{ color: a.quantity <= a.minStock ? '#ffbb00' : '#ccd6f6', fontWeight: 600 }}>{a.quantity}</td>
                  <td><span className={`inv-badge ${stockClass(a)}`}>{stockLabel(a)}</span></td>
                  <td style={{ color: '#00a8ff', fontWeight: 600 }}>{a.salePrice ? `$${a.salePrice.toFixed(2)}` : '—'}</td>
                  <td><Link href={`/inventory/accessories/${a.id}`} className="inv-btn inv-btn-secondary inv-btn-sm">Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
