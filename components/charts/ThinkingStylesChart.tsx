export function ThinkingStylesChart({
  result,
}: {
  result: { conceptual: number; holistic: number; intuitive: number };
}) {
  const styles = [
    { label: 'Conceptual', value: result.conceptual, color: '#3B82F6' },
    { label: 'Holistic', value: result.holistic, color: '#F59E0B' },
    { label: 'Intuitive', value: result.intuitive, color: '#EC4899' },
  ];

  const total = styles.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex flex-col gap-3 w-full">
      {styles.map((style) => {
        const percentage = (style.value / total) * 100;
        return (
          <div key={style.label} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-charcoal-700">{style.label}</span>
              <span className="font-bold" style={{ color: style.color }}>
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: style.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
