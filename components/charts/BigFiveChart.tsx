export function BigFiveChart({
  result,
}: {
  result: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}) {
  const traits = [
    { label: 'Openness', value: result.openness, color: '#3B82F6' },
    { label: 'Conscientiousness', value: result.conscientiousness, color: '#10B981' },
    { label: 'Extraversion', value: result.extraversion, color: '#F59E0B' },
    { label: 'Agreeableness', value: result.agreeableness, color: '#EC4899' },
    { label: 'Neuroticism', value: result.neuroticism, color: '#8B5CF6' },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {traits.map((trait) => (
        <div key={trait.label} className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-charcoal-700 text-truncate">{trait.label}</span>
            <span className="font-bold ml-2" style={{ color: trait.color }}>
              {trait.value}
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${trait.value}%`,
                backgroundColor: trait.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
