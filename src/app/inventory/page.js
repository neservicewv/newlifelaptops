import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const metadata = { title: 'Dashboard – NLL Inventory' };
export const dynamic = 'force-dynamic';

function statusClass(s) {
  const m = { Available: 'available', Sold: 'sold', Listed: 'listed', Hold: 'hold', 'Needs Repair': 'repair' };
  return m[s] || 'available';
}

export default async function DashboardPage() {
  const [total, available, sold, repair, totalAcc, recentDevices, revenue, lowStock] =
    await Promise.all([
      prisma.device.count(),
      prisma.device.count({ where: { status: 'Available' } }),
      prisma.device.count({ where: { status: 'Sold' } }),
      prisma.device.count({ where: { status: { in: ['Needs Repair', 'Repair'] } } }),
      prisma.accessory.count(),
      prisma.device.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, sku: true, title: true, brand: true, status: true, salePrice: true, condition: true, createdAt: true },
      }),
      prisma.device.aggregate({
        where: {
          status: 'Sold',
          soldDate: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
        _sum: { soldPrice: true },
      }),
      prisma.accessory.findMany({
        where: { quantity: { lte: 2 } },
        select: { id: true, title: true, quantity: true },
      }),
    ]);

  const monthlyRevenue = revenue._sum.soldPrice ?? 0;

  return (
    <div>
      <div className="inv-page-header">
        <div>
          <h1 className="inv-page-title">Dashboard</h1>
          <p className="inv-page-subtitle">Inventory overview</p>
        </div>
        <Link href="/inventory/devices/new" className="inv-btn inv-btn-primary">
          <i className="fas fa-plus"></i> Add Device
        </Link>
      </div>

      <div className="inv-stats-grid">
        <div className="inv-stat-card"><div className="inv-stat-label">Total Devices</div><div className="inv-stat-value">{total}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Available</div><div className="inv-stat-value green">{available}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Sold</div><div className="inv-stat-value">{sold}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">In Repair</div><div className="inv-stat-value yellow">{repair}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Accessories</div><div className="inv-stat-value">{totalAcc}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Revenue This Month</div><div className="inv-stat-value green" style={{fontSize:'1.2rem'}}>${monthlyRevenue.toFixed(2)}</div></div>
      </div>

      {lowStock.length > 0 && (
        <div className="inv-alert inv-alert-error">
          <i className="fas fa-triangle-exclamation"></i>
          {lowStock.length} accessor{lowStock.length === 1 ? 'y' : 'ies'} low on stock.{' '}
          <Link href="/inventory/accessories" style={{ color: 'inherit', textDecoration: 'underline' }}>View</Link>
        </div>
      )}

      <div className="inv-card">
        <div className="inv-card-title">Recent Devices</div>
        {recentDevices.length === 0 ? (
          <div className="inv-empty">
            <i className="fas fa-laptop"></i>
            <p>No devices yet.{' '}
              <Link href="/inventory/devices/new" style={{ color: '#00a8ff' }}>Add your first device.</Link>
            </p>
          </div>
        ) : (
          <table className="inv-table">
            <thead>
              <tr>
                <th>SKU</th><th>Device</th><th>Condition</th><th>Status</th><th>Price</th><th>Added</th><th></th>
              </tr>
            </thead>
            <tbody>
              {recentDevices.map(d => (
                <tr key={d.id}>
                  <td style={{ fontFamily: 'monospace', color: '#8892b0', fontSize: '0.78rem' }}>{d.sku}</td>
                  <td><strong style={{ color: '#e6f1ff' }}>{d.title}</strong></td>
                  <td style={{ color: '#8892b0', fontSize: '0.8rem' }}>{d.condition}</td>
                  <td><span className={`inv-badge ${statusClass(d.status)}`}>{d.status}</span></td>
                  <td style={{ color: '#00a8ff', fontWeight: 600 }}>{d.salePrice ? `$${d.salePrice.toFixed(2)}` : '—'}</td>
                  <td style={{ color: '#8892b0', fontSize: '0.78rem' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td><Link href={`/inventory/devices/${d.id}`} className="inv-btn inv-btn-secondary inv-btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
