export function WheelOfLifeChart({
  result,
}: {
  result: {
    family: number;
    health: number;
    work: number;
    faith: number;
    relationships: number;
    finances: number;
    growth: number;
    community: number;
  };
}) {
  const dimensions = [
    { label: 'Family', value: result.family, color: '#DC2626' },
    { label: 'Health', value: result.health, color: '#F59E0B' },
    { label: 'Work', value: result.work, color: '#10B981' },
    { label: 'Faith', value: result.faith, color: '#8B5CF6' },
    { label: 'Relationships', value: result.relationships, color: '#EC4899' },
    { label: 'Finances', value: result.finances, color: '#14B8A6' },
    { label: 'Growth', value: result.growth, color: '#F97316' },
    { label: 'Community', value: result.community, color: '#6366F1' },
  ];

  const size = 120;
  const center = size / 2;
  const radius = size / 2 - 8;
  const maxValue = 10;

  const points = dimensions
    .map((dim, i) => {
      const angle = (i / dimensions.length) * Math.PI * 2 - Math.PI / 2;
      const r = (dim.value / maxValue) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        ...dim,
      };
    });

  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ') + ' Z';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-28 h-28">
        {/* Grid circles */}
        {[2, 4, 6, 8, 10].map((level) => {
          const r = (level / maxValue) * radius;
          return (
            <circle
              key={level}
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Axes */}
        {dimensions.map((dim, i) => {
          const angle = (i / dimensions.length) * Math.PI * 2 - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#D1D5DB"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Polygon */}
        <path d={pathData} fill="rgba(229, 62, 142, 0.2)" stroke="#E53E8C" strokeWidth="1.5" />

        {/* Points */}
        {points.map((p, i) => (
          <circle key={`point-${i}`} cx={p.x} cy={p.y} r="2" fill={p.color} />
        ))}
      </svg>

      {/* Legend */}
      <div className="text-center text-xs text-charcoal-600 mt-1">
        <div className="font-semibold text-navy-900">Wheel of Life</div>
      </div>
    </div>
  );
}
