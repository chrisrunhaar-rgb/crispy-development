export function MyersBriggsBadge({ result }: { result: { type: string } }) {
  const typeInfo: Record<string, { color: string; role: string }> = {
    ESTJ: { color: '#DC2626', role: 'The Logistician' },
    ESTP: { color: '#F59E0B', role: 'The Entrepreneur' },
    ESFJ: { color: '#EC4899', role: 'The Consul' },
    ESFP: { color: '#EAB308', role: 'The Entertainer' },
    ISTJ: { color: '#3B82F6', role: 'The Logistician' },
    ISTP: { color: '#06B6D4', role: 'The Virtuoso' },
    ISFJ: { color: '#10B981', role: 'The Defender' },
    ISFP: { color: '#8B5CF6', role: 'The Adventurer' },
    ENTJ: { color: '#DC2626', role: 'The Commander' },
    ENTP: { color: '#F59E0B', role: 'The Debater' },
    ENFJ: { color: '#EC4899', role: 'The Protagonist' },
    ENFP: { color: '#EAB308', role: 'The Campaigner' },
    INTJ: { color: '#3B82F6', role: 'The Architect' },
    INTP: { color: '#06B6D4', role: 'The Logician' },
    INFJ: { color: '#10B981', role: 'The Advocate' },
    INFP: { color: '#8B5CF6', role: 'The Mediator' },
  };

  const info = typeInfo[result.type] || { color: '#6B7280', role: 'Type Unknown' };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="w-32 h-20 rounded-lg flex items-center justify-center border-2" style={{ borderColor: info.color, backgroundColor: `${info.color}10` }}>
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-widest" style={{ color: info.color }}>
            {result.type}
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-charcoal-600">
        <div className="font-semibold text-charcoal-700">{info.role}</div>
      </div>
    </div>
  );
}
