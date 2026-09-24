// Layout engine for the journey "walk in the park" map.
// Pure functions (no React) so the geometry can be tested on its own.

export type Pt = { x: number; y: number };
export type Box = { l: number; t: number; r: number; b: number };

export type Dims = {
  mobile: boolean;
  sw: number; sh: number;   // stone size
  lw: number; lh: number;   // title label size below the stone
  signW: number; signH: number;
  m: number;                // side margin for the trail centre line
  uw: number;               // usable width between margins
};

export function getDims(W: number): Dims {
  const mobile = W < 640;
  const sw = mobile ? 84 : 96;
  const sh = mobile ? 64 : 72;
  const lw = mobile ? 106 : 140;
  const lh = 30;
  const signW = mobile ? 140 : 170;
  const signH = 44;
  const m = lw / 2 + 6;
  return { mobile, sw, sh, lw, lh, signW, signH, m, uw: W - 2 * m };
}

// The trail, as control points: fx is 0..1 across the usable width, yu is a
// vertical unit that gets stretched until exactly 60 stones fit.
type CP = { fx: number; yu: number; tag?: string };
type Route = {
  cps: CP[];
  pond: { fx: number; yu: number };
  riverYu: number;
  camp: { fx: number; yu: number };
  mountain: (X: (fx: number) => number, d: Dims, W: number) => { leftX: number; rightX: number };
};

// Narrow screens: mostly up-and-down, with the mountain as a climb up the middle
const NARROW: Route = {
  cps: [
    { fx: 0.5, yu: 0 },
    // Meadow
    { fx: 0.3, yu: 110 }, { fx: 0.12, yu: 260 }, { fx: 0.3, yu: 400 }, { fx: 0.7, yu: 470 }, { fx: 0.92, yu: 600 },
    // Around the pond
    { fx: 0.9, yu: 780 }, { fx: 0.66, yu: 930 }, { fx: 0.35, yu: 990 }, { fx: 0.1, yu: 1080 },
    // Over the river
    { fx: 0.15, yu: 1250 }, { fx: 0.2, yu: 1420 }, { fx: 0.45, yu: 1520 }, { fx: 0.8, yu: 1560 }, { fx: 0.95, yu: 1700 },
    // Through the forest
    { fx: 0.8, yu: 1860 }, { fx: 0.5, yu: 1940 }, { fx: 0.2, yu: 2000 }, { fx: 0, yu: 2150 },
    // Down along the foot of the mountain, then up to the summit and down the other side
    { fx: 0, yu: 2400 }, { fx: 0, yu: 2640 }, { fx: 0.22, yu: 2760, tag: "base" }, { fx: 0.5, yu: 2680 },
    { fx: 0.5, yu: 2400 }, { fx: 0.5, yu: 2130, tag: "summit" },
    { fx: 0.8, yu: 2210 }, { fx: 1, yu: 2380 }, { fx: 1, yu: 2660 }, { fx: 0.9, yu: 2880 },
    // Campfire bend and the home stretch
    { fx: 0.6, yu: 3000 }, { fx: 0.3, yu: 3060 }, { fx: 0.1, yu: 3220 }, { fx: 0.3, yu: 3380 },
    { fx: 0.65, yu: 3440 }, { fx: 0.88, yu: 3580 }, { fx: 0.65, yu: 3720 }, { fx: 0.5, yu: 3900 },
  ],
  pond: { fx: 0.3, yu: 790 },
  riverYu: 1335,
  camp: { fx: 0.62, yu: 3215 },
  mountain: (X, d, W) => ({ leftX: X(0) + d.lw / 2 + 14, rightX: W + 40 }),
};

// Wide screens: long sweeps side to side that dip and rise, and the mountain
// crossed from one side to the other over the summit
const WIDE: Route = {
  cps: [
    { fx: 0.5, yu: 0 },
    // Meadow
    { fx: 0.2, yu: 90 }, { fx: 0.04, yu: 220 }, { fx: 0.3, yu: 330 }, { fx: 0.6, yu: 290 }, { fx: 0.85, yu: 380 }, { fx: 1, yu: 520 },
    // Past the pond
    { fx: 0.8, yu: 690 }, { fx: 0.5, yu: 810 }, { fx: 0.2, yu: 780 }, { fx: 0.02, yu: 900 },
    // Over the river
    { fx: 0.1, yu: 1100 }, { fx: 0.4, yu: 1170 }, { fx: 0.7, yu: 1120 }, { fx: 0.97, yu: 1230 },
    // Through the forest
    { fx: 0.8, yu: 1370 }, { fx: 0.5, yu: 1430 }, { fx: 0.2, yu: 1390 }, { fx: 0.02, yu: 1520 },
    // Over the mountain
    { fx: 0.08, yu: 1760 }, { fx: 0.25, yu: 1880, tag: "base" }, { fx: 0.4, yu: 1720 }, { fx: 0.52, yu: 1590, tag: "summit" },
    { fx: 0.64, yu: 1720 }, { fx: 0.8, yu: 1880 }, { fx: 0.98, yu: 1800 },
    // Campfire and the home stretch
    { fx: 0.95, yu: 2000 }, { fx: 0.7, yu: 2100 }, { fx: 0.4, yu: 2060 }, { fx: 0.08, yu: 2150 },
    { fx: 0.05, yu: 2310 }, { fx: 0.3, yu: 2430 }, { fx: 0.6, yu: 2390 }, { fx: 0.9, yu: 2490 },
    { fx: 0.98, yu: 2620 }, { fx: 0.7, yu: 2730 }, { fx: 0.4, yu: 2690 }, { fx: 0.1, yu: 2780 },
    { fx: 0.05, yu: 2930 }, { fx: 0.35, yu: 3030 }, { fx: 0.65, yu: 2990 }, { fx: 0.92, yu: 3090 },
    { fx: 0.75, yu: 3230 }, { fx: 0.5, yu: 3320 },
  ],
  pond: { fx: 0.36, yu: 580 },
  riverYu: 1000,
  camp: { fx: 0.55, yu: 2250 },
  mountain: (X) => ({ leftX: X(0.08), rightX: X(0.96) }),
};

export type Scene = {
  pond: { cx: number; cy: number; rx: number; ry: number };
  river: { y: number; half: number };
  bridge: { x: number; y: number; angle: number; len: number };
  mountain: { peak: Pt; baseY: number; leftX: number; rightX: number };
  camp: { x: number; y: number };
};

export type Layout = {
  dims: Dims;
  stones: Pt[];
  boxes: Box[];
  signs: (Pt | null)[];      // top-left of each chapter sign
  trail: Pt[];               // polyline samples up to just past the last stone
  scene: Scene;
  height: number;
};

const overlap = (a: Box, b: Box, pad: number) =>
  a.l < b.r + pad && b.l < a.r + pad && a.t < b.b + pad && b.t < a.b + pad;

function sampleTrail(cps: Pt[]): { pts: Pt[]; cpIndex: number[] } {
  const pts: Pt[] = [];
  const cpIndex: number[] = [0];
  for (let i = 0; i < cps.length - 1; i++) {
    const p0 = cps[i - 1] ?? cps[i], p1 = cps[i], p2 = cps[i + 1], p3 = cps[i + 2] ?? p2;
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const n = Math.max(4, Math.ceil(len / 2));
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
    cpIndex.push(pts.length);
  }
  pts.push(cps[cps.length - 1]);
  return { pts, cpIndex };
}

export function build(W: number, chapterStarts: boolean[], s: number) {
  const d = getDims(W);
  const top = d.sh / 2 + d.signH + 14;
  const X = (fx: number) => d.m + fx * d.uw;
  const Y = (yu: number) => top + yu * s;

  const R = d.mobile ? NARROW : WIDE;
  const TRAIL = R.cps;
  const POND = R.pond, RIVER_YU = R.riverYu, CAMP = R.camp;
  const { pts, cpIndex } = sampleTrail(TRAIL.map(c => ({ x: X(c.fx), y: Y(c.yu) })));
  // Curves overshoot a little at the edges; keep the trail inside the margins
  for (const p of pts) p.x = Math.max(d.m, Math.min(W - d.m, p.x));
  const cpAt = (tag: string) => pts[cpIndex[TRAIL.findIndex(c => c.tag === tag)]];

  // Scenery
  const prx = Math.max(62, Math.min(170, d.uw * 0.26));
  const pond = { cx: X(POND.fx), cy: Y(POND.yu), rx: prx, ry: Math.max(40, prx * 0.52) };
  const river = { y: Y(RIVER_YU), half: d.mobile ? 20 : 24 };
  let bi = pts.findIndex(p => p.y >= river.y);
  if (bi < 1) bi = 1;
  const bp = pts[bi], bq = pts[Math.min(pts.length - 1, bi + 6)], bo = pts[Math.max(0, bi - 6)];
  const bridge = { x: bp.x, y: river.y, angle: Math.atan2(bq.y - bo.y, bq.x - bo.x) * 180 / Math.PI, len: river.half * 2 + 34 };
  const summit = cpAt("summit");
  const mountain = { peak: { x: summit.x, y: summit.y - d.sh / 2 - 14 }, baseY: cpAt("base").y + 20, ...R.mountain(X, d, W) };
  const camp = { x: X(CAMP.fx), y: Y(CAMP.yu) };

  const forbidden: Box[] = [
    { l: -1e4, t: river.y - river.half - 10, r: 1e4, b: river.y + river.half + 10 },
    { l: pond.cx - pond.rx * 0.9, t: pond.cy - pond.ry * 0.85, r: pond.cx + pond.rx * 0.9, b: pond.cy + pond.ry * 0.85 },
    { l: camp.x - 40, t: camp.y - 34, r: camp.x + 70, b: camp.y + 22 },
  ];

  const signLeft = (x: number) => Math.max(4, Math.min(W - d.signW - 4, x - d.sw / 2 - 10));
  const boxFor = (p: Pt, i: number): Box => {
    const half = Math.max(d.sw, d.lw) / 2;
    const b: Box = { l: p.x - half, t: p.y - d.sh / 2, r: p.x + half, b: p.y + d.sh / 2 + 6 + d.lh };
    if (chapterStarts[i]) {
      const sl = signLeft(p.x);
      b.t -= d.signH + 6;
      b.l = Math.min(b.l, sl);
      b.r = Math.max(b.r, sl + d.signW);
    }
    return b;
  };

  const stones: Pt[] = [], boxes: Box[] = [], idx: number[] = [];
  let j = 0;
  for (let i = 0; i < chapterStarts.length; i++) {
    let placed = false;
    while (j < pts.length) {
      const b = boxFor(pts[j], i);
      const ok = b.l >= 2 && b.r <= W - 2
        && !forbidden.some(f => overlap(b, f, 0))
        && !boxes.some(pb => overlap(b, pb, 10));
      if (ok) {
        stones.push(pts[j]); boxes.push(b); idx.push(j); placed = true;
        j++;
        break;
      }
      j++;
    }
    if (!placed) break;
  }

  return { d, pts, stones, boxes, idx, scene: { pond, river, bridge, mountain, camp }, signLeft };
}

export function computeLayout(W: number, chapterStarts: boolean[]): Layout {
  const n = chapterStarts.length;
  // Smallest vertical stretch at which every stone fits on the trail
  let lo = 0.3, hi = 4;
  for (let k = 0; k < 22; k++) {
    const mid = (lo + hi) / 2;
    if (build(W, chapterStarts, mid).stones.length >= n) hi = mid; else lo = mid;
  }
  const r = build(W, chapterStarts, hi);
  const lastIdx = r.idx[r.idx.length - 1] ?? 0;
  const trail = r.pts.slice(0, Math.min(r.pts.length, lastIdx + 30));
  const last = r.stones[r.stones.length - 1] ?? { x: W / 2, y: 0 };
  const lastBox = r.boxes[r.boxes.length - 1];
  const height = Math.max(lastBox ? lastBox.b : 0, last.y + r.d.sh / 2 + 70) + 40;
  const signs = r.stones.map((p, i) => chapterStarts[i] ? { x: r.signLeft(p.x), y: p.y - r.d.sh / 2 - r.d.signH - 6 } : null);
  return { dims: r.d, stones: r.stones, boxes: r.boxes, signs, trail, scene: r.scene, height };
}

// Decorations (trees, bushes, flowers) scattered where nothing else is
export type Decor = { kind: "tree" | "pine" | "bush" | "flower" | "tuft" | "rock"; x: number; y: number; s: number; v: number };

export function scatterDecor(L: Layout, W: number, seed = 7): Decor[] {
  let t = seed * 9973 + 12345;
  const rand = () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
  const { pond, river, mountain, camp, bridge } = L.scene;
  const out: Decor[] = [];
  const taken: Box[] = [
    ...L.boxes.map(b => ({ l: b.l - 4, t: b.t - 4, r: b.r + 4, b: b.b + 4 })),
    { l: pond.cx - pond.rx - 14, t: pond.cy - pond.ry - 14, r: pond.cx + pond.rx + 14, b: pond.cy + pond.ry + 34 },
    { l: -1e4, t: river.y - river.half - 8, r: 1e4, b: river.y + river.half + 8 },
    { l: camp.x - 50, t: camp.y - 50, r: camp.x + 90, b: camp.y + 30 },
    { l: bridge.x - 60, t: bridge.y - 50, r: bridge.x + 60, b: bridge.y + 50 },
  ];
  const nearTrail = (x: number, y: number, r: number) => {
    for (let i = 0; i < L.trail.length; i += 4) {
      const p = L.trail[i];
      if (Math.abs(p.x - x) < r && Math.abs(p.y - y) < r) return true;
    }
    return false;
  };
  const inMountain = (x: number, y: number) => {
    const { peak, baseY, leftX, rightX } = mountain;
    if (y > baseY || y < peak.y) return false;
    const f = (y - peak.y) / (baseY - peak.y);
    return x > peak.x - (peak.x - leftX) * f - 10 && x < peak.x + (rightX - peak.x) * f + 10;
  };
  const forestTop = L.scene.river.y + 60, forestBot = mountain.peak.y;

  const tries = Math.round((W * L.height) / 2400);
  for (let k = 0; k < tries; k++) {
    const x = 10 + rand() * (W - 20), y = 10 + rand() * (L.height - 20);
    const inForest = y > forestTop && y < forestBot;
    const roll = rand();
    let kind: Decor["kind"];
    if (inForest) kind = roll < 0.55 ? "pine" : roll < 0.8 ? "tree" : "bush";
    else kind = roll < 0.18 ? "tree" : roll < 0.3 ? "bush" : roll < 0.62 ? "flower" : roll < 0.9 ? "tuft" : "rock";
    const s = 0.8 + rand() * 0.5;
    const r = kind === "tree" || kind === "pine" ? 24 * s : kind === "bush" ? 16 * s : 8;
    const box = { l: x - r, t: y - r * (kind === "pine" ? 1.8 : 1.2), r: x + r, b: y + r * 0.6 };
    if (box.l < 2 || box.r > W - 2) continue;
    if (taken.some(b => overlap(box, b, 0))) continue;
    if (nearTrail(x, y, r + 18)) continue;
    if (inMountain(x, y) && kind !== "pine" && kind !== "rock") continue;
    out.push({ kind, x, y, s, v: rand() });
    if (kind === "tree" || kind === "pine" || kind === "bush") taken.push(box);
  }
  return out.sort((a, b) => a.y - b.y);
}
