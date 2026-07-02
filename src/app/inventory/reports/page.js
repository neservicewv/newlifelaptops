import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Reports – NLL Inventory' };
export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const [total, available, sold, totalCost, totalRevenue, byCondition, byStatus, lowStockAcc] =
    await Promise.all([
      prisma.device.count(),
      prisma.device.count({ where: { status: 'Available' } }),
      prisma.device.count({ where: { status: 'Sold' } }),
      prisma.device.aggregate({ _sum: { costPrice: true } }),
      prisma.device.aggregate({ where: { status: 'Sold' }, _sum: { soldPrice: true } }),
      prisma.device.groupBy({ by: ['condition'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      prisma.device.groupBy({ by: ['status'], _count: { id: true }, orderBy: { _count: { id: 'desc' } } }),
      prisma.accessory.findMany({ where: { quantity: { lte: 2 } }, select: { title: true, sku: true, quantity: true, minStock: true } }),
    ]);

  const cost = totalCost._sum.costPrice ?? 0;
  const revenue = totalRevenue._sum.soldPrice ?? 0;
  const profit = revenue - (sold > 0 && total > 0 ? cost * (sold / total) : 0);

  return (
    <div>
      <div className="inv-page-header">
        <div>
          <h1 className="inv-page-title">Reports</h1>
          <p className="inv-page-subtitle">Sales and inventory summary</p>
        </div>
      </div>

      <div className="inv-stats-grid">
        <div className="inv-stat-card"><div className="inv-stat-label">Total Revenue</div><div className="inv-stat-value green" style={{fontSize:'1.2rem'}}>${revenue.toFixed(2)}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Total Cost Basis</div><div className="inv-stat-value" style={{fontSize:'1.2rem'}}>${cost.toFixed(2)}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Est. Profit</div><div className={`inv-stat-value ${profit >= 0 ? 'green' : 'red'}`} style={{fontSize:'1.2rem'}}>${profit.toFixed(2)}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Units Sold</div><div className="inv-stat-value">{sold}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Available</div><div className="inv-stat-value green">{available}</div></div>
        <div className="inv-stat-card"><div className="inv-stat-label">Total Devices</div><div className="inv-stat-value">{total}</div></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div className="inv-card">
          <div className="inv-card-title">Devices by Status</div>
          <table className="inv-table">
            <thead><tr><th>Status</th><th>Count</th></tr></thead>
            <tbody>
              {byStatus.map(r => (
                <tr key={r.status}><td>{r.status}</td><td style={{color:'#00a8ff',fontWeight:600}}>{r._count.id}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="inv-card">
          <div className="inv-card-title">Devices by Condition</div>
          <table className="inv-table">
            <thead><tr><th>Condition</th><th>Count</th></tr></thead>
            <tbody>
              {byCondition.map(r => (
                <tr key={r.condition}><td>{r.condition}</td><td style={{color:'#00a8ff',fontWeight:600}}>{r._count.id}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {lowStockAcc.length > 0 && (
        <div className="inv-card">
          <div className="inv-card-title">Low Stock Accessories</div>
          <table className="inv-table">
            <thead><tr><th>SKU</th><th>Title</th><th>Qty</th><th>Min</th></tr></thead>
            <tbody>
              {lowStockAcc.map(a => (
                <tr key={a.sku}>
                  <td style={{fontFamily:'monospace',color:'#8892b0',fontSize:'0.78rem'}}>{a.sku}</td>
                  <td>{a.title}</td>
                  <td style={{color:'#ffbb00',fontWeight:600}}>{a.quantity}</td>
                  <td style={{color:'#8892b0'}}>{a.minStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
