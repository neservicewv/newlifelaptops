export default function ConditionBadge({ condition }) {
  const map = {
    'Excellent':   'bg-cyan-900/40 text-cyan-300 border-cyan-700/40',
    'Good':        'bg-green-900/40 text-green-400 border-green-700/40',
    'Fair':        'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
    'Parts Only':  'bg-red-900/40 text-red-400 border-red-700/40',
  };
  const cls = map[condition] || 'bg-gray-800/40 text-gray-400 border-gray-700/40';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {condition}
    </span>
  );
}
