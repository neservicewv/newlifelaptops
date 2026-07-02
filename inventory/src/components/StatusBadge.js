export default function StatusBadge({ status }) {
  const map = {
    'Available':          'bg-green-900/40 text-green-400 border-green-700/40',
    'Listed on eBay':     'bg-blue-900/40 text-blue-300 border-blue-700/40',
    'Listed on Facebook': 'bg-indigo-900/40 text-indigo-300 border-indigo-700/40',
    'Sold':               'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
    'Shipped':            'bg-purple-900/40 text-purple-300 border-purple-700/40',
    'Returned':           'bg-red-900/40 text-red-400 border-red-700/40',
    'In Stock':           'bg-green-900/40 text-green-400 border-green-700/40',
    'Low Stock':          'bg-orange-900/40 text-orange-300 border-orange-700/40',
    'Out of Stock':       'bg-red-900/40 text-red-400 border-red-700/40',
    'FULFILLED':          'bg-green-900/40 text-green-400 border-green-700/40',
    'PENDING':            'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
    'IN_PROGRESS':        'bg-blue-900/40 text-blue-300 border-blue-700/40',
  };
  const cls = map[status] || 'bg-gray-800/40 text-gray-400 border-gray-700/40';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {status}
    </span>
  );
}
