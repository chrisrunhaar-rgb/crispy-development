export function PersonalitiesBadge({ result }: { result: { type: string } }) {
  const colors: Record<string, string> = {
    Logistician: '#3B82F6',
    Defender: '#10B981',
    Executive: '#DC2626',
    Consul: '#EC4899',
    Virtuoso: '#F59E0B',
    Adventurer: '#EAB308',
    Entrepreneur: '#06B6D4',
    Entertainer: '#8B5CF6',
    Architect: '#3B82F6',
    Logician: '#06B6D4',
    Commander: '#DC2626',
    Debater: '#F59E0B',
    Advocate: '#10B981',
    Mediator: '#8B5CF6',
    Protagonist: '#EC4899',
    Campaigner: '#EAB308',
  };

  const color = colors[result.type] || '#6B7280';

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-full max-w-sm px-4 py-6 rounded-lg text-center border-2"
        style={{
          borderColor: color,
          backgroundColor: `${color}10`,
        }}
      >
        <div className="text-2xl font-bold" style={{ color }}>
          {result.type}
        </div>
        <div className="text-xs text-charcoal-600 mt-1">16 Personality Type</div>
      </div>
    </div>
  );
}
