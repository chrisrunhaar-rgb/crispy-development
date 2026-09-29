// Positional vs influential leadership, drawn as two figure groups.
// Shared by the module page and the slideshow.

const navy = "oklch(22% 0.10 260)";
const orange = "oklch(65% 0.15 45)";
const charcoal = "oklch(27% 0.005 260)";
const lightGray = "oklch(88% 0.008 80)";

// Head-and-shoulders figure. (x, y) is the top of the head; s scales it (height 52 * s).
function Person({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g fill={fill}>
      <circle cx={x} cy={y + 10 * s} r={10 * s} />
      <path d={`M ${x - 18 * s} ${y + 52 * s} Q ${x - 18 * s} ${y + 24 * s} ${x} ${y + 24 * s} Q ${x + 18 * s} ${y + 24 * s} ${x + 18 * s} ${y + 52 * s} Z`} />
    </g>
  );
}

export function PositionalFigure({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 220" width="100%" aria-hidden="true" style={{ display: "block", ...style }}>
      <Person x={150} y={12} s={2.1} fill={orange} />
      <rect x={40} y={132} width={220} height={3} rx={1.5} fill={lightGray} />
      {[50, 100, 150, 200, 250].map(x => (
        <Person key={x} x={x} y={152} s={1} fill={charcoal} />
      ))}
    </svg>
  );
}

export function InfluentialFigure({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 300 220" width="100%" aria-hidden="true" style={{ display: "block", ...style }}>
      {[60, 120, 180, 240].map(x => (
        <Person key={x} x={x} y={12} s={1.5} fill={orange} />
      ))}
      <rect x={24} y={92} width={252} height={9} rx={4.5} fill={navy} />
      <g stroke={charcoal} strokeWidth={6} strokeLinecap="round">
        <line x1={131} y1={164} x2={120} y2={104} />
        <line x1={169} y1={164} x2={180} y2={104} />
      </g>
      <Person x={150} y={122} s={1.35} fill={charcoal} />
    </svg>
  );
}
