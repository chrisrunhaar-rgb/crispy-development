export function DISCChart({ result }: { result: { D: number; I: number; S: number; C: number } }) {
  const total = result.D + result.I + result.S + result.C;
  const dPercentage = (result.D / total) * 360;
  const iPercentage = (result.I / total) * 360;
  const sPercentage = (result.S / total) * 360;
  const cPercentage = (result.C / total) * 360;

  const colors = {
    D: '#DC2626', // Red
    I: '#F59E0B', // Amber
    S: '#10B981', // Green
    C: '#3B82F6', // Blue
  };

  const conic = `conic-gradient(
    ${colors.D} 0% ${dPercentage / 360 * 100}%,
    ${colors.I} ${dPercentage / 360 * 100}% ${(dPercentage + iPercentage) / 360 * 100}%,
    ${colors.S} ${(dPercentage + iPercentage) / 360 * 100}% ${(dPercentage + iPercentage + sPercentage) / 360 * 100}%,
    ${colors.C} ${(dPercentage + iPercentage + sPercentage) / 360 * 100}% 100%
  )`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-32 h-32">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: conic,
          }}
        />
        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-navy-900">DISC</div>
            <div className="text-xs text-charcoal-600">Profile</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-xs text-center w-full">
        <div className="flex items-center gap-1 justify-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.D }} />
          <span>D</span>
        </div>
        <div className="flex items-center gap-1 justify-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.I }} />
          <span>I</span>
        </div>
        <div className="flex items-center gap-1 justify-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.S }} />
          <span>S</span>
        </div>
        <div className="flex items-center gap-1 justify-center">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.C }} />
          <span>C</span>
        </div>
      </div>
    </div>
  );
}
