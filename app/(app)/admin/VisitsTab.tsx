type Row = { label: string; views: number; visitors?: number };

export type VisitStats = {
  totals: {
    views_today: number; visitors_today: number;
    views_7: number; visitors_7: number;
    views_prev7: number; visitors_prev7: number;
    views_period: number; visitors_period: number;
    members_views: number;
    first_seen: string | null;
  };
  daily: { day: string; views: number; visitors: number }[];
  pages: Row[];
  entries: Row[];
  referrers: Row[];
  campaigns: Row[];
  countries: Row[];
  cities: Row[];
  devices: Row[];
  browsers: Row[];
  languages: Row[];
  hours: { hour: number; views: number }[];
};

const NAVY = "oklch(30% 0.12 260)";
const ORANGE = "oklch(65% 0.15 45)";
const MUTED = "oklch(52% 0.008 260)";
const BORDER = "oklch(90% 0.005 260)";

const heading: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontWeight: 700,
  fontSize: "0.72rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: MUTED,
  marginBottom: "1rem",
};

const card: React.CSSProperties = {
  background: "white",
  border: `1px solid ${BORDER}`,
  padding: "1.25rem 1.5rem",
};

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const langNames = new Intl.DisplayNames(["en"], { type: "language" });

function countryName(code: string) {
  if (!code || code === "??") return "Unknown";
  try { return regionNames.of(code) ?? code; } catch { return code; }
}

function langName(code: string) {
  if (!code || code === "unknown") return "Unknown";
  try { return langNames.of(code) ?? code; } catch { return code; }
}

function shortDate(day: string) {
  return new Date(day).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

function change(now: number, prev: number) {
  if (!prev) return null;
  const pct = Math.round(((now - prev) / prev) * 100);
  return { pct, up: pct >= 0 };
}

function Big({ label, value, sub, delta }: { label: string; value: number; sub?: string; delta?: { pct: number; up: boolean } | null }) {
  return (
    <div style={card}>
      <div style={{ ...heading, marginBottom: "0.5rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "2rem", fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>
        {value.toLocaleString("en")}
      </div>
      <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.78rem", color: MUTED, marginTop: "0.35rem" }}>
        {sub}
        {delta && (
          <div style={{ fontWeight: 700, marginTop: "0.25rem", color: delta.up ? "oklch(52% 0.13 150)" : "oklch(55% 0.18 25)" }}>
            {delta.up ? "▲" : "▼"} {Math.abs(delta.pct)}% vs the 7 days before
          </div>
        )}
      </div>
    </div>
  );
}

function BarList({ title, rows, format, empty = "No data yet" }: { title: string; rows: Row[]; format?: (s: string) => string; empty?: string }) {
  const max = Math.max(1, ...rows.map(r => r.visitors ?? r.views));
  return (
    <div style={card}>
      <div style={heading}>{title}</div>
      {rows.length === 0 ? (
        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.85rem", color: "oklch(62% 0.008 260)" }}>{empty}</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.65rem", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <span style={{ width: "4rem", textAlign: "right" }}>Visitors</span>
            <span style={{ width: "4rem", textAlign: "right" }}>Views</span>
          </div>
          {rows.map(r => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "1rem", fontFamily: "var(--font-montserrat)", fontSize: "0.82rem" }}>
              <div style={{ flex: 1, position: "relative", minWidth: 0, padding: "0.3rem 0.5rem" }}>
                <div style={{ position: "absolute", inset: 0, width: `${((r.visitors ?? r.views) / max) * 100}%`, background: "oklch(65% 0.15 45 / 0.14)" }} />
                <span style={{ position: "relative", color: NAVY, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={r.label}>
                  {format ? format(r.label) : r.label}
                </span>
              </div>
              <span style={{ width: "4rem", textAlign: "right", fontWeight: 700, color: NAVY }}>{(r.visitors ?? 0).toLocaleString("en")}</span>
              <span style={{ width: "4rem", textAlign: "right", color: MUTED }}>{r.views.toLocaleString("en")}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VisitsTab({ stats, error }: { stats: VisitStats | null; error?: string | null }) {
  if (!stats) {
    return (
      <div style={card}>
        <div style={heading}>Visits</div>
        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: MUTED }}>
          Could not load visit numbers{error ? `: ${error}` : "."}
        </div>
      </div>
    );
  }

  const t = stats.totals;
  const dailyMax = Math.max(1, ...stats.daily.map(d => d.views));
  const hourMap = new Map(stats.hours.map(h => [h.hour, h.views]));
  const hourMax = Math.max(1, ...stats.hours.map(h => h.views));
  const busiest = stats.hours.length ? stats.hours.reduce((a, b) => (b.views > a.views ? b : a)) : null;
  const memberPct = t.views_period ? Math.round((t.members_views / t.views_period) * 100) : 0;
  const pagesPerVisitor = t.visitors_period ? Math.round((t.views_period / t.visitors_period) * 10) / 10 : 0;
  const since = t.first_seen
    ? new Date(t.first_seen).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kuala_Lumpur" })
    : null;
  const pad = (h: number) => `${String(h).padStart(2, "0")}:00`;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <div>
        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "1.25rem", fontWeight: 800, color: NAVY }}>Website visits</div>
        <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.82rem", color: MUTED, marginTop: "0.35rem", maxWidth: "48rem", lineHeight: 1.5 }}>
          Our own anonymous counter, no cookies. {since ? `Counting since ${since}.` : "Counting starts with the first visit."} Bots and your own admin browser are left out.
          A visitor means one device on one day, so someone who comes back on three different days counts three times. All times are Malaysia time.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        <Big label="Today" value={t.visitors_today} sub={`visitors · ${t.views_today.toLocaleString("en")} page views`} />
        <Big label="Last 7 days" value={t.visitors_7} sub={`visitors · ${t.views_7.toLocaleString("en")} page views`} delta={change(t.visitors_7, t.visitors_prev7)} />
        <Big label="Last 30 days" value={t.visitors_period} sub={`visitors · ${t.views_period.toLocaleString("en")} page views`} />
        <Big label="Pages per visitor" value={pagesPerVisitor} sub={`${memberPct}% of views by logged-in members`} />
      </div>

      <div style={card}>
        <div style={heading}>Last 30 days, day by day</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "160px" }}>
          {stats.daily.map(d => (
            <div key={d.day} title={`${shortDate(d.day)}: ${d.visitors} visitors, ${d.views} page views`}
              style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ height: `${(d.views / dailyMax) * 100}%`, minHeight: d.views ? 2 : 0, background: "oklch(30% 0.12 260 / 0.18)", position: "relative" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: d.views ? `${(d.visitors / d.views) * 100}%` : 0, background: ORANGE }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: MUTED, marginTop: "0.5rem" }}>
          <span>{stats.daily[0] ? shortDate(stats.daily[0].day) : ""}</span>
          <span>
            <span style={{ display: "inline-block", width: 10, height: 10, background: ORANGE, marginRight: 4, verticalAlign: "middle" }} />visitors
            <span style={{ display: "inline-block", width: 10, height: 10, background: "oklch(30% 0.12 260 / 0.18)", margin: "0 4px 0 12px", verticalAlign: "middle" }} />page views
          </span>
          <span>Today</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1rem" }}>
        <BarList title="Most viewed pages" rows={stats.pages} />
        <BarList title="Where people land first" rows={stats.entries} />
        <BarList title="Where visitors come from" rows={stats.referrers} empty="No visits from outside links yet" />
        <BarList title="Campaign links (UTM)" rows={stats.campaigns} empty="No visits from tagged campaign links yet" />
        <BarList title="Countries" rows={stats.countries} format={countryName} />
        <BarList title="Cities" rows={stats.cities} />
        <BarList title="Devices" rows={stats.devices} format={s => s.charAt(0).toUpperCase() + s.slice(1)} />
        <BarList title="Browsers" rows={stats.browsers} />
        <BarList title="Browser language" rows={stats.languages} format={langName} />
        <div style={card}>
          <div style={heading}>Time of day (Malaysia time)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "110px" }}>
            {Array.from({ length: 24 }, (_, h) => {
              const v = hourMap.get(h) ?? 0;
              return <div key={h} title={`${pad(h)}: ${v} page views`} style={{ flex: 1, height: `${(v / hourMax) * 100}%`, minHeight: v ? 2 : 0, background: busiest?.hour === h ? ORANGE : "oklch(30% 0.12 260 / 0.25)" }} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-montserrat)", fontSize: "0.7rem", color: MUTED, marginTop: "0.5rem" }}>
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
          {busiest && (
            <div style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.8rem", color: NAVY, marginTop: "0.75rem" }}>
              Busiest hour: <strong>{pad(busiest.hour)} to {pad((busiest.hour + 1) % 24)}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
