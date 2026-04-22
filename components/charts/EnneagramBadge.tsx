export function EnneagramBadge({ result }: { result: { type: number; wing: number } }) {
  const colors: Record<number, string> = {
    1: '#DC2626',
    2: '#F97316',
    3: '#EAB308',
    4: '#EC4899',
    5: '#3B82F6',
    6: '#06B6D4',
    7: '#10B981',
    8: '#6B7280',
    9: '#8B5CF6',
  };

  const color = colors[result.type] || '#6B7280';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center border-4"
        style={{
          backgroundColor: `${color}15`,
          borderColor: color,
        }}
      >
        <div className="text-center">
          <div className="text-4xl font-extrabold" style={{ color }}>
            {result.type}
          </div>
          <div className="text-xs font-semibold text-charcoal-700">
            w{result.wing}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-charcoal-600">
        <div className="font-semibold">Type {result.type}</div>
        <div className="text-xs">with {result.wing} wing</div>
      </div>
    </div>
  );
}
