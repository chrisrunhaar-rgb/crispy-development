"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { PathStep } from "../StonePath";

// Brand colours (oklch in CSS). WebGL needs hex.
const navy = "oklch(30% 0.12 260)";
const muted = "oklch(48% 0.04 260)";
const text = "oklch(32% 0.06 260)";
const rule = "oklch(84% 0.01 80)";
const orange = "oklch(65% 0.15 45)";
const orangeDeep = "oklch(58% 0.16 45)";
const offWhite = "oklch(97% 0.005 80)";
// Ice and sea colours follow the reference drawing: white tip, white-to-blue body, deep navy sea.
const HEX = {
  iceTop: "#f6f9fb",
  iceShallow: "#dbe9f4",
  iceMid: "#a8c8e6",
  iceDeep: "#5f8fc4",
  warm: "#fffbf3",
  orange: "#d86d38",
  orangePale: "#f3dccb",
  navy: "#012868",
  chapter: "#0f3a8c",
  stepLine: "#7897c0",
  waterline: "#ffffff",
};

// ── Iceberg shape ──
// Below the water: one wedge per chapter, running from the waterline to the bottom point.
// Wedge borders wander a little so the chapters don't read as straight stripes.
// Each chapter's modules are stacked inside its wedge, first module at the top.
// Above the water: a big lumpy tip with no modules ("what people see of a leader").
const DEPTH = 6;
const TIP_H = 2.45;
const R_TOP = 2.6;
const FOV = 30;
const WATER_FRAC = 0.3;  // waterline sits 30% down the frame at the default zoom
const ANCHOR_Y = -1.8;   // zoom keeps this height steady on screen
const WIDE = "(min-width: 860px)";
const SHIFT = 0.14;      // on wide screens the berg sits right of centre, leaving the sky for the title

type V3 = [number, number, number];
type Cell = { poly: V3[]; center: V3 };
type Shape = {
  cells: Cell[];
  borders: V3[][];
  rows: V3[][];
  outlines: V3[][][];   // per chapter: the polylines around its wedge
  facing: number[];     // per chapter: the angle to turn the camera to
  waterRing: V3[];
  tip: V3[][];
  orangeTris: Map<number, number>; // tip triangle → how faded (0 = full orange)
};

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const axisX = (t: number) => 0.55 * t * t;
const axisZ = (t: number) => -0.15 * t * t;
const bodyR = (t: number) =>
  R_TOP * (1 + 0.14 * Math.sin(Math.PI * Math.min(t / 0.5, 1))) * Math.pow(Math.max(0, 1 - Math.pow(t, 1.6)), 0.9);

// A point on the underwater surface. Smooth in both angle and depth, so shared edges line up exactly.
function surface(a: number, t: number): V3 {
  const n = 1 + 0.08 * Math.sin(3 * a + 1.1 + 2.3 * t) + 0.05 * Math.sin(5 * a - 0.7 - 4 * t) + 0.035 * Math.sin(8 * a + 2.9 + 6 * t);
  const r = bodyR(t) * n;
  const y = -t * DEPTH + 0.18 * Math.sin(4 * a + 1.7 + 5 * t) * Math.sin(Math.PI * t);
  return [axisX(t) + Math.cos(a) * r, y, axisZ(t) + Math.sin(a) * r];
}

// Upper modules get shorter bands because the berg is widest there.
const bandT = (u: number) => Math.pow(u, 1.3);

// Reference point inside the berg, used to face triangles and push lines outward.
function inner(p: V3): V3 {
  if (p[1] > 0) return [0.1, Math.min(p[1], 1), 0];
  const t = Math.min(0.92, -p[1] / DEPTH);
  return [axisX(t), Math.max(p[1], -DEPTH * 0.85), axisZ(t)];
}

function buildShape(sizes: number[]): Shape {
  const rnd = seeded(1139);
  const K = sizes.length;
  const TAU = Math.PI * 2;
  const base = Array.from({ length: K }, (_, k) => (k / K) * TAU + (rnd() - 0.5) * 0.12);
  const phase = base.map(() => rnd() * TAU);
  const amp = base.map(() => 0.06 + rnd() * 0.05);
  const midOff = base.map(() => (rnd() - 0.5) * 0.1);
  // Border k (between chapter k-1 and k) at depth t. k may be K, which is border 0 one turn on.
  const bA = (k: number, t: number) => {
    const i = k % K;
    return base[i] + (k >= K ? TAU : 0) + amp[i] * Math.sin(5.5 * t + phase[i]);
  };
  const mA = (k: number, t: number) => (bA(k, t) + bA(k + 1, t)) / 2 + midOff[k] + 0.05 * Math.sin(4 * t + phase[k] * 1.7);

  // Band edges per chapter, a little uneven, plus a middle point that sits a bit higher or lower
  // so the lines between modules zig-zag instead of running flat.
  const bands: number[][] = [];
  const mids: number[][] = [];
  for (let k = 0; k < K; k++) {
    const n = sizes[k];
    const b = Array.from({ length: n + 1 }, (_, m) =>
      m === 0 ? 0 : m === n ? 1 : bandT((m + (rnd() - 0.5) * 0.5) / n));
    bands.push(b);
    mids.push(b.map((t, m) => {
      if (m === 0 || m === n) return t;
      const gap = Math.min(t - b[m - 1], b[m + 1] - t);
      return t + (rnd() - 0.5) * gap * 0.6;
    }));
  }

  // Border k carries the band edges of both neighbours, so no cracks appear.
  const borderTs = base.map((_, k) => {
    const set = new Map<string, number>();
    for (const t of [...bands[k], ...bands[(k + K - 1) % K]]) set.set(t.toFixed(6), t);
    return [...set.values()].sort((x, y) => x - y);
  });
  const borderPts = (k: number) => borderTs[k % K].map(t => surface(bA(k, t), t));
  const borders = base.map((_, k) => borderPts(k));

  const same = (p: V3, q: V3) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 1e-6;
  const cells: Cell[] = [];
  const rows: V3[][] = [];
  const outlines: V3[][][] = [];
  for (let k = 0; k < K; k++) {
    const kr = (k + 1) % K;
    const L = (t: number) => surface(bA(k, t), t);
    const R = (t: number) => surface(bA(k + 1, t), t);
    const M = (t: number) => surface(mA(k, t), t);
    for (let m = 0; m < sizes[k]; m++) {
      const t0 = bands[k][m];
      const t1 = bands[k][m + 1];
      const between = (ts: number[]) => ts.filter(t => t > t0 + 1e-6 && t < t1 - 1e-6);
      const raw: V3[] = [
        L(t0), M(mids[k][m]), R(t0),
        ...between(borderTs[kr]).map(R),
        R(t1), M(mids[k][m + 1]), L(t1),
        ...between(borderTs[k]).reverse().map(L),
      ];
      const poly = raw.filter((p, i) => !same(p, raw[(i + raw.length - 1) % raw.length]));
      const tc = (mids[k][m] + mids[k][m + 1]) / 2;
      const c = M(tc);
      const ref = inner(c);
      const center: V3 = [c[0] + (c[0] - ref[0]) * 0.04, c[1], c[2] + (c[2] - ref[2]) * 0.04];
      cells.push({ poly, center });
      if (m > 0) rows.push([L(t0), M(mids[k][m]), R(t0)]);
    }
    outlines.push([borderPts(k), borderPts(k + 1), [L(0), M(0), R(0)]]);
  }
  const facing = base.map((_, k) => mA(k, 0.3));

  // Waterline ring, shared by the body and the tip.
  const waterAng: number[] = [];
  const waterRing: V3[] = [];
  for (let k = 0; k < K; k++) {
    waterAng.push(bA(k, 0), mA(k, 0));
    waterRing.push(surface(bA(k, 0), 0), surface(mA(k, 0), 0));
  }

  // Tip rings, every other ring shifted half a step so the facets are triangles.
  const Q = waterRing.length;
  const levels = [0.26, 0.5, 0.7, 0.87];
  const radii = [0.98, 0.87, 0.68, 0.42];
  const tip: V3[][] = [waterRing];
  levels.forEach((s, li) => {
    const shifted = li % 2 === 0;
    tip.push(Array.from({ length: Q }, (_, q): V3 => {
      const a0 = waterAng[q];
      const a1 = q + 1 < Q ? waterAng[q + 1] : waterAng[0] + TAU;
      const a = (shifted ? (a0 + a1) / 2 : a0) + (rnd() - 0.5) * 0.08;
      const r = R_TOP * radii[li] * (1 + (rnd() - 0.5) * 0.24);
      const y = TIP_H * s * (1 + (rnd() - 0.5) * 0.28);
      return [0.15 * s + Math.cos(a) * r, y, Math.sin(a) * r];
    }));
  });
  tip.push([[0.3, TIP_H + 0.05, -0.12]]);

  // Warm facets all the way round the tip: single triangles and small patches, in full and faded orange.
  const orangeTris = new Map<number, number>();
  const perRing = Q * 2;
  const sectors = 8;
  const span = Math.max(1, Math.floor(Q / sectors));
  for (let s = 0; s < sectors; s++) {
    for (let pick = 0; pick < 2; pick++) {
      const layer = Math.floor(rnd() * levels.length);
      const q = Math.min(Q - 1, s * span + Math.floor(rnd() * span));
      const idx = layer * perRing + q * 2 + (rnd() < 0.5 ? 0 : 1);
      const fade = pick === 0 ? rnd() * 0.35 : 0.3 + rnd() * 0.45;
      orangeTris.set(idx, fade);
      if (rnd() < 0.45) orangeTris.set(idx ^ 1, Math.min(0.85, fade + 0.2));
    }
  }

  return { cells, borders, rows, outlines, facing, waterRing, tip, orangeTris };
}

type Api = {
  select: (cell: number | null) => void;
  chapter: (k: number | null) => void;
  zoom: (factor: number) => void;
  setSpin: (on: boolean) => void;
};

type Props = {
  steps: PathStep[];
  completed: number[];
  nextStep: number | null;
  lang: "en" | "id";
  heading: { eyebrow: string; title: string; intro: string; progress: string; pct: number };
};

export default function IcebergMap({ steps, completed, nextStep, lang, heading }: Props) {
  const isId = lang === "id";
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const startRef = useRef<HTMLAnchorElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [chapter, setChapter] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(true);
  const [failed, setFailed] = useState(false);
  const selectRef = useRef<(cell: number | null) => void>(() => {});
  const hoverRef = useRef<(cell: number | null, x: number, y: number) => void>(() => {});

  const doneSet = useMemo(() => new Set(completed), [completed]);
  // Chapter number and position inside the chapter for every module, e.g. 11 and 3 → "11.3".
  const { chapterNo, localNo } = useMemo(() => {
    let ch = 0;
    let local = 0;
    const c: number[] = [];
    const l: number[] = [];
    steps.forEach(s => {
      if (s.chapterStart) { ch++; local = 0; }
      local++;
      c.push(ch);
      l.push(local);
    });
    return { chapterNo: c, localNo: l };
  }, [steps]);
  const chapters = useMemo(() => {
    const out: { title: string; count: number; done: number }[] = [];
    steps.forEach((s, i) => {
      const k = chapterNo[i] - 1;
      if (k < 0) return;
      out[k] ??= { title: s.chapter ?? "", count: 0, done: 0 };
      out[k].count++;
      if (doneSet.has(s.n)) out[k].done++;
    });
    return out.filter(Boolean);
  }, [steps, chapterNo, doneSet]);
  // Modules per chapter, in order. Falls back to 12 × 5 if the list is empty.
  const sizes = useMemo(() => (chapters.length ? chapters.map(c => c.count) : Array(12).fill(5)), [chapters]);
  const shape = useMemo(() => buildShape(sizes), [sizes]);
  const code = (i: number) => `${chapterNo[i]}.${localNo[i]}`;

  const t = isId
    ? {
        chapter: "Bab", chapters: "Bab", start: "Mulai", review: "Buka lagi",
        done: "Selesai", next: "Berikutnya", close: "Tutup",
        zoomIn: "Perbesar", zoomOut: "Perkecil", pause: "Hentikan putaran", play: "Putar lagi",
        legendDone: "Selesai", legendNext: "Berikutnya",
        chapterHint: "Pilih bab untuk melihatnya di gunung es.",
        failed: "Peta 3D tidak dapat dimuat di perangkat ini.", fallback: "Buka daftar",
        modulesLabel: "Semua modul",
      }
    : {
        chapter: "Chapter", chapters: "Chapters", start: "Start", review: "Open again",
        done: "Completed", next: "Up next", close: "Close",
        zoomIn: "Zoom in", zoomOut: "Zoom out", pause: "Stop turning", play: "Turn again",
        legendDone: "Completed", legendNext: "Up next",
        chapterHint: "Pick a chapter to see it on the iceberg.",
        failed: "The 3D map could not load on this device.", fallback: "Open the list",
        modulesLabel: "All modules",
      };

  const open = (cell: number | null) => {
    if (cell !== null && !steps[cell]) return;
    if (cell !== null && typeof document !== "undefined") {
      const active = document.activeElement as HTMLElement | null;
      if (active && active !== document.body) returnFocusRef.current = active;
    }
    setSelected(cell);
    apiRef.current?.select(cell);
  };
  selectRef.current = open;

  const pickChapter = (k: number) => {
    const next = chapter === k ? null : k;
    setChapter(next);
    apiRef.current?.chapter(next);
  };

  // Hover label: text through state (changes rarely), position straight on the element (changes every move).
  hoverRef.current = (cell, x, y) => {
    setHover(cell);
    const el = tipRef.current;
    if (el && cell !== null) el.style.transform = `translate(${Math.round(x + 14)}px, ${Math.round(y + 16)}px)`;
  };

  // ── Three.js scene ──
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFailed(true);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.matchMedia(WIDE);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "relative";
    canvas.style.zIndex = "1";
    canvas.setAttribute("aria-hidden", "true");
    wrap.prepend(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 800);
    const target = new THREE.Vector3(0, 0, 0);

    // Light travels with the camera from the front left: the side facing you is bright,
    // the far right side falls into a deeper blue shadow.
    scene.add(new THREE.HemisphereLight(0xffffff, 0x2d4f80, 0.75));
    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(-3, 3.5, 5);
    camera.add(sun);
    scene.add(camera);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

    const { cells, borders, rows, outlines, facing, waterRing, tip, orangeTris } = shape;
    const rnd = seeded(77);
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const tmpN = new THREE.Vector3();

    // Adds a triangle facing away from the inside of the berg.
    const pushTri = (pos: number[], a: V3, b: V3, c: V3) => {
      tmpA.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      tmpB.set(c[0] - a[0], c[1] - a[1], c[2] - a[2]);
      tmpN.crossVectors(tmpA, tmpB);
      const m: V3 = [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3];
      const r = inner(m);
      const out = tmpN.x * (m[0] - r[0]) + tmpN.y * (m[1] - r[1]) + tmpN.z * (m[2] - r[2]);
      if (out < 0) pos.push(...a, ...c, ...b);
      else pos.push(...a, ...b, ...c);
    };

    // Module facets: each cell is a shallow pyramid, so every module reads as its own facet.
    const cellCount = cells.length;
    const tilePos: number[] = [];
    const tileCol: number[] = [];
    const faceToCell: number[] = [];
    const cellVerts: [number, number][] = [];
    const white = new THREE.Color(HEX.iceTop);
    const shallow = new THREE.Color(HEX.iceShallow);
    const midBlue = new THREE.Color(HEX.iceMid);
    const deep = new THREE.Color(HEX.iceDeep);
    const col = new THREE.Color();
    const depthColour = (y: number) => {
      const d = Math.min(1, Math.max(0, -y / DEPTH));
      if (d < 0.45) col.copy(shallow).lerp(midBlue, d / 0.45);
      else col.copy(midBlue).lerp(deep, (d - 0.45) / 0.55);
      return col;
    };
    cells.forEach((cell, c) => {
      const start = tilePos.length / 3;
      const ch = chapterNo[c] ?? 0;
      const { poly, center } = cell;
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i];
        const q = poly[(i + 1) % poly.length];
        pushTri(tilePos, p, q, center);
        depthColour((p[1] + q[1] + center[1]) / 3);
        if (ch % 2 === 0) col.lerp(white, 0.08);
        col.multiplyScalar(1 + (rnd() - 0.5) * 0.07);
        for (let k = 0; k < 3; k++) tileCol.push(col.r, col.g, col.b);
        faceToCell.push(c);
      }
      cellVerts.push([start, tilePos.length / 3]);
    });
    const tileGeo = track(new THREE.BufferGeometry());
    tileGeo.setAttribute("position", new THREE.Float32BufferAttribute(tilePos, 3));
    const baseCol = new Float32Array(tileCol);
    const colorAttr = new THREE.Float32BufferAttribute(tileCol, 3);
    tileGeo.setAttribute("color", colorAttr);
    tileGeo.computeVertexNormals();
    const iceMat = track(new THREE.MeshLambertMaterial({
      vertexColors: true, flatShading: true, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    }));
    const tiles = new THREE.Mesh(tileGeo, iceMat);
    scene.add(tiles);

    // Tip above water (not clickable)
    const tipPos: number[] = [];
    const tipCol: number[] = [];
    const orangeCol = new THREE.Color(HEX.orange);
    const paleCol = new THREE.Color(HEX.orangePale);
    let tri = 0;
    const addTipTri = (a: V3, b: V3, c: V3) => {
      pushTri(tipPos, a, b, c);
      const fade = orangeTris.get(tri);
      if (fade !== undefined) col.copy(orangeCol).lerp(paleCol, fade);
      else col.copy(white).lerp(shallow, rnd() * 0.35);
      col.multiplyScalar(1 + (rnd() - 0.5) * 0.04);
      for (let k = 0; k < 3; k++) tipCol.push(col.r, col.g, col.b);
      tri++;
    };
    for (let li = 1; li < tip.length - 1; li++) {
      const A = tip[li - 1];
      const B = tip[li];
      const Q = A.length;
      for (let q = 0; q < Q; q++) {
        const q1 = (q + 1) % Q;
        if (li % 2 === 1) { addTipTri(A[q], A[q1], B[q]); addTipTri(B[q], A[q1], B[q1]); }
        else { addTipTri(B[q], B[q1], A[q]); addTipTri(A[q], B[q1], A[q1]); }
      }
    }
    const top = tip[tip.length - 2];
    const peak = tip[tip.length - 1][0];
    for (let q = 0; q < top.length; q++) addTipTri(top[q], top[(q + 1) % top.length], peak);
    const tipGeo = track(new THREE.BufferGeometry());
    tipGeo.setAttribute("position", new THREE.Float32BufferAttribute(tipPos, 3));
    tipGeo.setAttribute("color", new THREE.Float32BufferAttribute(tipCol, 3));
    tipGeo.computeVertexNormals();
    const tipMesh = new THREE.Mesh(tipGeo, iceMat);
    scene.add(tipMesh);

    // ── Lines ──
    const lineMats: LineMaterial[] = [];
    const out = (p: V3, push = 0.015): V3 => {
      const r = inner(p);
      return [p[0] + (p[0] - r[0]) * push, p[1], p[2] + (p[2] - r[2]) * push];
    };
    const makeLines = (segs: number[], color: string, width: number, opacity = 1) => {
      const geo = track(new LineSegmentsGeometry());
      geo.setPositions(segs.length ? segs : [0, 0, 0, 0, 0, 0]);
      const mat = track(new LineMaterial({ color: new THREE.Color(color).getHex(), linewidth: width, transparent: opacity < 1, opacity, depthWrite: false }));
      lineMats.push(mat);
      const line = new LineSegments2(geo, mat);
      line.visible = segs.length > 0;
      scene.add(line);
      return line;
    };
    const edge = (segs: number[], p: V3, q: V3, push?: number) => segs.push(...out(p, push), ...out(q, push));
    const polyline = (segs: number[], pts: V3[], closed = false, push?: number) => {
      for (let i = 0; i < pts.length - 1; i++) edge(segs, pts[i], pts[i + 1], push);
      if (closed && pts.length > 2) edge(segs, pts[pts.length - 1], pts[0], push);
    };
    const outline = (segs: number[], c: number) => polyline(segs, cells[c].poly, true);
    const setLine = (line: LineSegments2, segs: number[]) => {
      (line.geometry as LineSegmentsGeometry).setPositions(segs.length ? segs : [0, 0, 0, 0, 0, 0]);
      line.visible = segs.length > 0;
    };

    // Every module edge is a soft thin line. A chapter only gets its bold outline when picked.
    const thinSegs: number[] = [];
    rows.forEach(r => polyline(thinSegs, r));
    borders.forEach(b => polyline(thinSegs, b));
    makeLines(thinSegs, HEX.stepLine, 1.2, 0.7);

    const waterSegs: number[] = [];
    polyline(waterSegs, waterRing, true);
    makeLines(waterSegs, HEX.waterline, 2.5, 0.95);

    const doneSegs: number[] = [];
    steps.forEach((s, c) => { if (doneSet.has(s.n) && c < cellCount) outline(doneSegs, c); });
    makeLines(doneSegs, HEX.orange, 8, 0.3); // glow
    makeLines(doneSegs, HEX.orange, 2.4);    // core

    const nextSegs: number[] = [];
    const nextCell = nextStep ? steps.findIndex(s => s.n === nextStep) : -1;
    if (nextCell >= 0 && nextCell < cellCount) outline(nextSegs, nextCell);
    makeLines(nextSegs, HEX.navy, 2.4);

    // Picked chapter: one solid navy line, same as the "up next" outline, lifted clear of the ice.
    const chapterLine = makeLines([], HEX.navy, 3.2);
    const selLine = makeLines([], HEX.navy, 3.2);

    // ── Camera + controls ──
    // The camera stays level with the water and only circles around. Zoom changes distance only.
    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(target);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotateSpeed = 0.5;
    canvas.style.touchAction = "pan-y"; // vertical swipes still scroll the page
    let spinWanted = !reduced;
    let selectedCell: number | null = null;
    let selectedChapter: number | null = null;
    let turnTo: number | null = null;
    const idle = () => selectedCell === null && selectedChapter === null;
    controls.autoRotate = spinWanted;
    if (reduced) setSpinning(false);

    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    let fit = 20;       // camera distance that frames the whole berg
    let fitSpan = 10;   // world height visible at that distance
    let w = 0;
    let h = 0;
    let shiftX = 0;
    let lastDist = -1;

    // Keeps the berg framed as you zoom: the waterline row moves, and the CSS sea follows it.
    const frame = () => {
      const dist = camera.position.distanceTo(target);
      if (Math.abs(dist - lastDist) < 1e-4 || !w || !h) return;
      lastDist = dist;
      const span = 2 * dist * tanHalf;
      const anchorRow = WATER_FRAC * h + (-ANCHOR_Y / fitSpan) * h;
      const horizon = anchorRow - (-ANCHOR_Y / span) * h;
      camera.setViewOffset(w, h, -shiftX, h / 2 - horizon, w, h);
      camera.updateProjectionMatrix();
      wrap.style.setProperty("--wl", `${horizon.toFixed(1)}px`);
    };

    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    const resume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { controls.autoRotate = spinWanted && idle(); }, 3500);
    };
    controls.addEventListener("start", () => { clearTimeout(resumeTimer); controls.autoRotate = false; turnTo = null; });
    controls.addEventListener("end", resume);

    // ── Sizing ──
    let first = true;
    const resize = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      if (!w || !h) return;
      const aspect = w / h;
      shiftX = wide.matches ? w * SHIFT : 0;
      renderer.setSize(w, h, false);
      camera.aspect = aspect;
      lineMats.forEach(m => m.resolution.set(w, h));
      // Fit the tip above the line and the body below it, with room for the near side when it turns.
      const need = Math.max((TIP_H + 0.5) / WATER_FRAC, (DEPTH + 0.6) / (1 - WATER_FRAC), 8 / aspect) * 1.1;
      const ratio = first ? 1 : camera.position.distanceTo(target) / fit;
      fitSpan = need;
      fit = need / (2 * tanHalf);
      controls.minDistance = fit * 0.45;
      controls.maxDistance = fit * 1.25;
      const off = first ? new THREE.Vector3(Math.cos(1.07), 0, Math.sin(1.07)) : camera.position.clone().sub(target).normalize();
      camera.position.copy(target).addScaledVector(off, fit * ratio);
      first = false;
      lastDist = -1;
      controls.update();
      frame();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // ── Colours for hover / selection ──
    const warm = new THREE.Color(HEX.warm);
    const paint = (cell: number | null, on: boolean) => {
      if (cell === null || !cellVerts[cell]) return;
      const [a, b] = cellVerts[cell];
      for (let v = a; v < b; v++) {
        if (on) colorAttr.setXYZ(v, warm.r, warm.g, warm.b);
        else colorAttr.setXYZ(v, baseCol[v * 3], baseCol[v * 3 + 1], baseCol[v * 3 + 2]);
      }
      colorAttr.needsUpdate = true;
    };
    let hovered: number | null = null;

    // ── Picking ──
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (clientX: number, clientY: number): number | null => {
      const rect = canvas.getBoundingClientRect();
      ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects([tiles, tipMesh], false)[0];
      if (!hit || hit.object !== tiles || hit.faceIndex == null) return null;
      const cell = faceToCell[hit.faceIndex];
      return cell !== undefined && steps[cell] ? cell : null;
    };

    let down: { x: number; y: number; t: number } | null = null;
    const onDown = (e: PointerEvent) => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; };
    const onUp = (e: PointerEvent) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const quick = performance.now() - down.t < 700;
      down = null;
      if (moved > 7 || !quick) return;
      selectRef.current(pick(e.clientX, e.clientY));
    };
    const onLeave = () => {
      if (hovered !== selectedCell) paint(hovered, false);
      hovered = null;
      hoverRef.current(null, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.buttons) {
        if (hovered !== null) onLeave();
        return;
      }
      const cell = pick(e.clientX, e.clientY);
      const rect = wrap.getBoundingClientRect();
      hoverRef.current(cell, e.clientX - rect.left, e.clientY - rect.top);
      if (cell === hovered) return;
      if (hovered !== selectedCell) paint(hovered, false);
      hovered = cell;
      paint(hovered, true);
      canvas.style.cursor = cell === null ? "grab" : "pointer";
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.style.cursor = "grab";

    apiRef.current = {
      select: cell => {
        if (selectedCell !== null && selectedCell !== hovered) paint(selectedCell, false);
        selectedCell = cell;
        if (cell !== null) {
          paint(cell, true);
          const segs: number[] = [];
          outline(segs, cell);
          setLine(selLine, segs);
          clearTimeout(resumeTimer);
          controls.autoRotate = false;
        } else {
          setLine(selLine, []);
          if (idle()) resume();
        }
      },
      chapter: k => {
        selectedChapter = k;
        const segs: number[] = [];
        if (k !== null && outlines[k]) {
          outlines[k].forEach(p => polyline(segs, p, false, 0.04));
          clearTimeout(resumeTimer);
          controls.autoRotate = false;
          turnTo = facing[k];
        } else if (idle()) {
          resume();
        }
        setLine(chapterLine, segs);
      },
      zoom: factor => {
        const off = camera.position.clone().sub(controls.target);
        off.setLength(THREE.MathUtils.clamp(off.length() * factor, controls.minDistance, controls.maxDistance));
        camera.position.copy(controls.target).add(off);
        controls.update();
      },
      setSpin: on => {
        spinWanted = on;
        clearTimeout(resumeTimer);
        controls.autoRotate = on && idle();
      },
    };

    // Smoothly turn the berg so the picked chapter faces the viewer.
    const turn = () => {
      if (turnTo === null) return;
      const dx = camera.position.x - target.x;
      const dz = camera.position.z - target.z;
      const dist = Math.hypot(dx, dz);
      const now = Math.atan2(dz, dx);
      let diff = turnTo - now;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const done = Math.abs(diff) < 0.002 || reduced;
      const a = done ? turnTo : now + diff * 0.08;
      camera.position.set(target.x + Math.cos(a) * dist, camera.position.y, target.z + Math.sin(a) * dist);
      if (done) turnTo = null;
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      turn();
      controls.update();
      frame();
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeTimer);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      controls.dispose();
      disposables.forEach(d => d.dispose());
      renderer.dispose();
      canvas.remove();
      apiRef.current = null;
    };
  }, [shape, steps, doneSet, nextStep, chapterNo]);

  // Escape closes, focus moves into the card on open and back on close.
  useEffect(() => {
    if (selected === null) return;
    startRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const close = () => {
    open(null);
    const back = returnFocusRef.current;
    returnFocusRef.current = null;
    if (back && document.contains(back)) back.focus({ preventScroll: true });
    else wrapRef.current?.focus({ preventScroll: true });
  };

  const step = selected !== null ? steps[selected] : null;
  const isDone = step ? doneSet.has(step.n) : false;
  const isNext = step ? step.n === nextStep : false;
  const hoverStep = hover !== null && hover !== selected ? steps[hover] : null;

  const iconBtn: React.CSSProperties = {
    width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: offWhite, color: navy, border: `1px solid ${rule}`, cursor: "pointer",
    fontFamily: "var(--font-montserrat)", fontSize: "1.2rem", fontWeight: 600, lineHeight: 1, padding: 0,
  };
  const legendItem: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.45rem" };

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "1.25rem 1rem 3rem" }}>
      <style>{`
        .ice-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; margin: 0; padding: 0; list-style: none; }
        .ice-sr:focus-within { width: auto; height: auto; clip: auto; overflow: visible; top: 0.75rem; left: 0.75rem; z-index: 3; }
        .ice-sr:focus-within li:not(:focus-within) { display: none; }
        .ice-sr button { font-family: var(--font-montserrat); font-size: 0.78rem; font-weight: 600; color: ${navy}; background: ${offWhite}; border: 1px solid ${rule}; padding: 0.7rem 0.9rem; min-height: 44px; cursor: pointer; }
        .ice-start:hover { background: oklch(24% 0.11 260) !important; }
        .ice-layout { display: grid; gap: 1rem; }
        .ice-chapters { display: flex; gap: 0.4rem; overflow-x: auto; margin: 0; padding: 0 0 0.25rem; list-style: none; scrollbar-width: thin; }
        .ice-chapters button {
          display: flex; align-items: baseline; gap: 0.55rem; width: 100%; min-height: 44px; padding: 0.55rem 0.75rem;
          background: ${offWhite}; border: 1px solid ${rule}; border-left: 3px solid transparent; cursor: pointer; text-align: left;
          font-family: var(--font-montserrat); color: ${text}; white-space: nowrap; transition: background 0.15s, border-color 0.15s;
        }
        .ice-chapters button:hover { background: oklch(94% 0.012 250); }
        .ice-chapters button[aria-pressed="true"] { background: oklch(93% 0.025 255); border-left-color: ${navy}; color: ${navy}; }
        .ice-chapters .no { font-weight: 700; font-size: 0.7rem; color: ${orangeDeep}; min-width: 1.3rem; }
        .ice-chapters .ti { font-weight: 600; font-size: 0.8rem; line-height: 1.35; }
        .ice-chapters .ct { margin-left: auto; font-size: 0.68rem; font-weight: 600; color: ${muted}; padding-left: 0.5rem; }
        .ice-head { margin: 0 0 1rem; }
        .ice-head h1 { font-family: var(--font-cormorant); font-style: italic; font-weight: 500; font-size: clamp(1.9rem, 4.5vw, 2.6rem); line-height: 1.05; color: ${navy}; margin: 0; text-wrap: balance; }
        .ice-head p.intro { font-family: var(--font-montserrat); font-size: 0.84rem; line-height: 1.6; color: ${text}; margin: 0.6rem 0 0; }
        @media ${WIDE} {
          .ice-layout { grid-template-columns: 270px minmax(0, 1fr); align-items: start; }
          .ice-chapters { flex-direction: column; overflow-x: visible; max-height: min(78vh, 740px); overflow-y: auto; }
          .ice-chapters button { white-space: normal; }
          .ice-head { position: absolute; top: 1.1rem; left: 1.25rem; z-index: 2; max-width: min(36%, 340px); margin: 0; pointer-events: none; }
          .ice-head h1 { font-size: clamp(1.7rem, 2.6vw, 2.3rem); }
          .ice-head p.intro { font-size: 0.78rem; line-height: 1.55; }
          .ice-prog { position: absolute; top: 1.1rem; right: 1.25rem; z-index: 2; width: min(30%, 240px); margin: 0; pointer-events: none; }
        }
        .ice-prog { margin: 0 0 1rem; max-width: 420px; }
        .ice-stage {
          --wl: ${WATER_FRAC * 100}%;
          background: linear-gradient(to bottom,
            #dfe4e6 0, #ebedeb var(--wl),
            #eaf3fa var(--wl), #8fb3da calc(var(--wl) + 3px), #3f6aa3 calc(var(--wl) + 10px),
            #1f4478 calc(var(--wl) + 34px), #193a6c calc(var(--wl) + 40%), #0e2752 100%);
        }
        .ice-stage::after {
          content: ""; position: absolute; left: 0; right: 0; top: 0; height: max(0px, var(--wl)); pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse 22% 16% at 18% 30%, oklch(99% 0.015 85 / 0.8), transparent 70%),
            radial-gradient(ellipse 30% 14% at 74% 22%, oklch(99% 0.015 85 / 0.7), transparent 70%),
            radial-gradient(ellipse 18% 10% at 48% 62%, oklch(99% 0.012 85 / 0.55), transparent 70%);
        }
      `}</style>

      <div className="ice-layout">
        <nav aria-label={t.chapters}>
          <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: muted, margin: "0 0 0.6rem", lineHeight: 1.5 }}>
            {t.chapterHint}
          </p>
          <ul className="ice-chapters">
            {chapters.map((c, k) => (
              <li key={k}>
                <button type="button" aria-pressed={chapter === k} onClick={() => pickChapter(k)}>
                  <span className="no">{k + 1}</span>
                  <span className="ti">{c.title}</span>
                  <span className="ct">{c.done}/{c.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: muted, marginBottom: "0.75rem" }}>
            <span style={legendItem}>
              <span aria-hidden="true" style={{ width: 22, height: 0, borderTop: `2px solid ${orange}`, boxShadow: `0 0 6px 1px ${orange}` }} />
              {t.legendDone}
            </span>
            <span style={legendItem}>
              <span aria-hidden="true" style={{ width: 22, height: 0, borderTop: `2px solid ${navy}` }} />
              {t.legendNext}
            </span>
          </div>

          <div style={{ position: "relative" }}>
            {/* Title sits in the sky on wide screens, above the map on phones. */}
            <header className="ice-head">
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.64rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "0 0 0.4rem" }}>
                {heading.eyebrow}
              </p>
              <h1>{heading.title}</h1>
              <p className="intro">{heading.intro}</p>
            </header>

            <div className="ice-prog">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: text, marginBottom: "0.4rem" }}>
                <span>{heading.progress}</span>
                <span>{heading.pct}%</span>
              </div>
              <div style={{ height: 6, background: rule, overflow: "hidden" }}>
                <div style={{ width: `${heading.pct}%`, height: "100%", background: "oklch(55% 0.14 150)" }} />
              </div>
            </div>

            <div
              ref={wrapRef}
              tabIndex={-1}
              className="ice-stage"
              style={{
                position: "relative",
                height: "min(78vh, 740px)",
                minHeight: 460,
                overflow: "hidden",
                border: `1px solid ${rule}`,
                outline: "none",
              }}
            >
              {failed && (
                <div style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1.5rem", textAlign: "center", background: offWhite }}>
                  <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.9rem", color: text, margin: 0 }}>{t.failed}</p>
                  <Link href="/journey" style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", color: navy }}>{t.fallback}</Link>
                </div>
              )}

              {/* Keyboard + screen reader access to every module. Hidden until focused. */}
              <ul className="ice-sr" aria-label={t.modulesLabel}>
                {steps.map((s, c) => (
                  <li key={s.n}>
                    <button type="button" onClick={() => open(c)}>
                      {t.chapter} {code(c)}: {s.title}{doneSet.has(s.n) ? ` (${t.done})` : ""}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Hover label */}
              <div
                ref={tipRef}
                aria-hidden="true"
                style={{
                  position: "absolute", left: 0, top: 0, zIndex: 3, pointerEvents: "none",
                  display: hoverStep ? "block" : "none", maxWidth: 260,
                  background: offWhite, borderLeft: `2px solid ${orange}`,
                  boxShadow: "0 8px 24px oklch(20% 0.08 260 / 0.3)", padding: "0.45rem 0.7rem",
                }}
              >
                {hoverStep && hover !== null && (
                  <>
                    <span style={{ display: "block", fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: orangeDeep }}>
                      {t.chapter} {code(hover)}
                    </span>
                    <span style={{ display: "block", fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "1.1rem", lineHeight: 1.2, color: navy }}>
                      {hoverStep.title}
                    </span>
                  </>
                )}
              </div>

              {!failed && (
                <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", gap: 6, zIndex: 2 }}>
                  <button type="button" aria-label={t.zoomIn} title={t.zoomIn} style={iconBtn} onClick={() => apiRef.current?.zoom(0.8)}>+</button>
                  <button type="button" aria-label={t.zoomOut} title={t.zoomOut} style={iconBtn} onClick={() => apiRef.current?.zoom(1.25)}>−</button>
                  <button
                    type="button"
                    aria-label={spinning ? t.pause : t.play}
                    title={spinning ? t.pause : t.play}
                    aria-pressed={!spinning}
                    style={{ ...iconBtn, fontSize: "0.8rem" }}
                    onClick={() => { const on = !spinning; setSpinning(on); apiRef.current?.setSpin(on); }}
                  >
                    {spinning ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" fill="currentColor" /><rect x="8.5" y="1" width="3.5" height="12" fill="currentColor" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 1 L12 7 L3 13 Z" fill="currentColor" /></svg>
                    )}
                  </button>
                </div>
              )}

              {step && selected !== null && (
                <div
                  role="dialog"
                  aria-labelledby="ice-card-title"
                  style={{
                    position: "absolute", left: 12, bottom: 12,
                    width: "min(calc(100% - 24px), 380px)", zIndex: 4,
                    background: offWhite, borderTop: `2px solid ${orange}`,
                    boxShadow: "0 18px 48px oklch(20% 0.08 260 / 0.35)",
                    padding: "1rem 3rem 1.1rem 1.1rem",
                  }}
                >
                  <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "0 0 0.35rem", lineHeight: 1.4 }}>
                    {t.chapter} {code(selected)}{step.chapter ? ` · ${step.chapter}` : ""}
                  </p>
                  <h2 id="ice-card-title" style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "1.5rem", lineHeight: 1.15, color: navy, margin: 0, textWrap: "balance" }}>
                    {step.title}
                  </h2>
                  {(isDone || isNext) && (
                    <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: muted, margin: "0.35rem 0 0" }}>
                      {isDone ? t.done : t.next}
                    </p>
                  )}
                  <Link
                    ref={startRef}
                    href={`/journey/step/${step.n}`}
                    className="ice-start"
                    style={{ display: "inline-flex", alignItems: "center", minHeight: 44, marginTop: "0.8rem", padding: "0 1.2rem", background: navy, color: offWhite, fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.04em", textDecoration: "none", transition: "background 0.15s" }}
                  >
                    {isDone ? t.review : t.start} →
                  </Link>
                  <button type="button" aria-label={t.close} onClick={close}
                    style={{ ...iconBtn, position: "absolute", top: 4, right: 4, border: "none", background: "transparent", color: muted, fontSize: "1.4rem" }}>
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
