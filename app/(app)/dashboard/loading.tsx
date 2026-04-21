export default function DashboardLoading() {
  const navy = "oklch(22% 0.10 260)";
  const navyHeader = "oklch(30% 0.12 260)";
  const shimmer = "oklch(35% 0.10 260)";
  const cardBg = "oklch(97% 0.005 80)";
  const skeletonLight = "oklch(92% 0.006 80)";
  const skeletonMid = "oklch(88% 0.008 80)";

  return (
    <div style={{ background: cardBg, minHeight: "calc(100dvh - 80px)" }}>
      {/* ── HEADER SKELETON ── */}
      <div style={{ background: navyHeader, paddingTop: "1.75rem", borderBottom: `1px solid ${navy}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 clamp(1rem, 4vw, 2rem)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", paddingBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>
              <div style={{ width: 64, height: 64, borderRadius: 8, background: shimmer, flexShrink: 0 }} />
              <div style={{ paddingTop: "0.25rem" }}>
                <div style={{ width: 100, height: 10, borderRadius: 4, background: shimmer, marginBottom: 10 }} />
                <div style={{ width: 200, height: 22, borderRadius: 4, background: shimmer }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.875rem", alignItems: "center" }}>
              <div style={{ width: 80, height: 32, borderRadius: 4, background: shimmer }} />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: shimmer }} />
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: shimmer }} />
            </div>
          </div>
          {/* Tab bar skeleton */}
          <div style={{ paddingBottom: "1.75rem", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "inline-flex", background: "oklch(18% 0.09 260)", borderRadius: 100, padding: "5px", gap: "2px" }}>
              {[110, 80, 120].map((w, i) => (
                <div key={i} style={{ width: w, height: 34, borderRadius: 100, background: i === 0 ? "oklch(65% 0.15 45)" : shimmer }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT SKELETON ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(1.5rem, 4vw, 3rem) clamp(1rem, 4vw, 2rem)" }}>

        {/* Assessment tiles skeleton — 2×4 grid */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ width: 160, height: 14, borderRadius: 4, background: skeletonMid, marginBottom: "1.25rem" }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ background: "white", borderRadius: 12, padding: "1.25rem", minHeight: 140, display: "flex", flexDirection: "column", gap: "0.75rem", boxShadow: "0 1px 4px oklch(0% 0 0 / 0.06)" }}>
                <div style={{ width: "60%", height: 12, borderRadius: 3, background: skeletonLight }} />
                <div style={{ flex: 1, borderRadius: 8, background: skeletonLight }} />
              </div>
            ))}
          </div>
        </div>

        {/* Resource cards skeleton */}
        <div>
          <div style={{ width: 140, height: 14, borderRadius: 4, background: skeletonMid, marginBottom: "1.25rem" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: skeletonMid, borderRadius: 8, overflow: "hidden" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ background: "white", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ width: "40%", height: 13, borderRadius: 3, background: skeletonLight, marginBottom: 8 }} />
                  <div style={{ width: "65%", height: 10, borderRadius: 3, background: skeletonLight }} />
                </div>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: skeletonLight, flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        [data-shimmer] { animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
