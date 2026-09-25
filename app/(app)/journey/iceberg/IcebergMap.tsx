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
  orangeDeep: "#c4530f",
  navy: "#012868",
  border: "#12305e",
  stepLine: "#6f93bf",
  waterline: "#ffffff",
};

// ── Iceberg shape ──
// Below the water: one wedge per chapter, running from the waterline to the bottom point.
// Each chapter's steps are stacked inside its wedge, first step at the top.
// Above the water: a big lumpy tip with no steps ("what people see of a leader").
const DEPTH = 6;
const TIP_H = 2.45;
const R_TOP = 2.6;
const FOV = 30;
const WATER_FRAC = 0.3;  // waterline sits 30% down the frame at the default zoom
const ANCHOR_Y = -1.8;   // zoom keeps this height steady on screen

type V3 = [number, number, number];
type Cell = { poly: V3[]; center: V3 };
type Shape = { cells: Cell[]; borders: V3[][]; rows: V3[][]; waterRing: V3[]; tip: V3[][]; orangeTris: Set<number> };

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

// Upper steps get shorter bands because the berg is widest there.
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
  const bAng = Array.from({ length: K }, (_, k) => (k / K) * TAU + (rnd() - 0.5) * 0.12);
  const mAng = bAng.map((a, k) => {
    const next = k + 1 < K ? bAng[k + 1] : bAng[0] + TAU;
    return (a + next) / 2 + (rnd() - 0.5) * 0.1;
  });
  const rightAng = (k: number) => (k + 1 < K ? bAng[k + 1] : bAng[0] + TAU);
  const bandsOf = (k: number) => Array.from({ length: sizes[k] + 1 }, (_, m) => bandT(m / sizes[k]));

  // Border k runs between chapter k-1 and chapter k. It carries the band edges of both.
  const borderTs = bAng.map((_, k) => {
    const set = new Map<string, number>();
    for (const t of [...bandsOf(k), ...bandsOf((k + K - 1) % K)]) set.set(t.toFixed(6), t);
    return [...set.values()].sort((x, y) => x - y);
  });
  const borders = borderTs.map((ts, k) => ts.map(t => surface(bAng[k], t)));

  const same = (p: V3, q: V3) => Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) + Math.abs(p[2] - q[2]) < 1e-6;
  const cells: Cell[] = [];
  const rows: V3[][] = [];
  for (let k = 0; k < K; k++) {
    const kr = (k + 1) % K;
    const aL = bAng[k];
    const aR = rightAng(k);
    const bands = bandsOf(k);
    for (let m = 0; m < sizes[k]; m++) {
      const t0 = bands[m];
      const t1 = bands[m + 1];
      const raw: V3[] = [
        surface(aL, t0), surface(mAng[k], t0), surface(aR, t0),
        ...borderTs[kr].filter(t => t > t0 + 1e-6 && t < t1 - 1e-6).map(t => surface(aR, t)),
        surface(aR, t1), surface(mAng[k], t1), surface(aL, t1),
        ...borderTs[k].filter(t => t > t0 + 1e-6 && t < t1 - 1e-6).reverse().map(t => surface(aL, t)),
      ];
      const poly = raw.filter((p, i) => !same(p, raw[(i + raw.length - 1) % raw.length]));
      const c = surface(mAng[k], (t0 + t1) / 2);
      const ref = inner(c);
      const center: V3 = [c[0] + (c[0] - ref[0]) * 0.04, c[1], c[2] + (c[2] - ref[2]) * 0.04];
      cells.push({ poly, center });
      if (m > 0) rows.push([surface(aL, t0), surface(mAng[k], t0), surface(aR, t0)]);
    }
  }

  // Waterline ring, shared by the body and the tip.
  const waterAng: number[] = [];
  const waterRing: V3[] = [];
  for (let k = 0; k < K; k++) {
    waterAng.push(bAng[k], mAng[k]);
    waterRing.push(surface(bAng[k], 0), surface(mAng[k], 0));
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

  // A few warm facets on the tip, like the reference.
  const orangeTris = new Set<number>();
  const perRing = Q * 2;
  for (const ring of [1, 2, 2, 3]) orangeTris.add(ring * perRing + Math.floor(rnd() * perRing));

  return { cells, borders, rows, waterRing, tip, orangeTris };
}

// 2D outline of a facet, for the popup drawing.
function facetShape(corners: V3[]): string {
  const cx = corners.reduce((s, p) => s + p[0], 0) / corners.length;
  const cy = corners.reduce((s, p) => s + p[1], 0) / corners.length;
  const cz = corners.reduce((s, p) => s + p[2], 0) / corners.length;
  const ref = inner([cx, cy, cz]);
  const a = Math.atan2(cz - ref[2], cx - ref[0]);
  const ux = -Math.sin(a);
  const uz = Math.cos(a);
  const pts = corners.map(p => [(p[0] - cx) * ux + (p[2] - cz) * uz, -(p[1] - cy)]);
  const w = Math.max(...pts.map(p => Math.abs(p[0])), 1e-3);
  const h = Math.max(...pts.map(p => Math.abs(p[1])), 1e-3);
  const k = Math.min(46 / w, 38 / h);
  return pts.map(p => `${(60 + p[0] * k).toFixed(1)},${(50 + p[1] * k).toFixed(1)}`).join(" ");
}

type Api = {
  select: (cell: number | null) => void;
  zoom: (factor: number) => void;
  setSpin: (on: boolean) => void;
};

type Props = {
  steps: PathStep[];
  completed: number[];
  nextStep: number | null;
  lang: "en" | "id";
};

export default function IcebergMap({ steps, completed, nextStep, lang }: Props) {
  const isId = lang === "id";
  const wrapRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<Api | null>(null);
  const startRef = useRef<HTMLAnchorElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(true);
  const [failed, setFailed] = useState(false);
  const selectRef = useRef<(cell: number | null) => void>(() => {});

  const doneSet = useMemo(() => new Set(completed), [completed]);
  const chapterNo = useMemo(() => {
    let ch = 0;
    return steps.map(s => (s.chapterStart ? ++ch : ch));
  }, [steps]);
  // Steps per chapter, in order. Falls back to 12 × 5 if the list is empty.
  const sizes = useMemo(() => {
    const out: number[] = [];
    chapterNo.forEach(ch => { out[ch - 1] = (out[ch - 1] ?? 0) + 1; });
    const clean = out.filter(n => n > 0);
    return clean.length ? clean : Array(12).fill(5);
  }, [chapterNo]);
  const shape = useMemo(() => buildShape(sizes), [sizes]);

  const t = isId
    ? {
        chapter: "Bab", step: "Langkah", start: "Mulai langkah ini", review: "Buka lagi",
        done: "Selesai", next: "Langkah berikutnya", close: "Tutup",
        zoomIn: "Perbesar", zoomOut: "Perkecil", pause: "Hentikan putaran", play: "Putar lagi",
        legendDone: "Selesai", legendNext: "Langkah berikutnya", legendZone: "Batas bab",
        failed: "Peta 3D tidak dapat dimuat di perangkat ini.", fallback: "Buka daftar langkah",
        stepsLabel: "Semua langkah",
      }
    : {
        chapter: "Chapter", step: "Step", start: "Start this step", review: "Open again",
        done: "Completed", next: "Next step", close: "Close",
        zoomIn: "Zoom in", zoomOut: "Zoom out", pause: "Stop turning", play: "Turn again",
        legendDone: "Completed", legendNext: "Next step", legendZone: "Chapter border",
        failed: "The 3D map could not load on this device.", fallback: "Open the step list",
        stepsLabel: "All steps",
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

    // Light travels with the camera, so the side facing you stays bright and the edges fall to blue.
    scene.add(new THREE.HemisphereLight(0xffffff, 0x5b7fae, 1.45));
    const sun = new THREE.DirectionalLight(0xffffff, 1.7);
    sun.position.set(4, 5, 3);
    camera.add(sun);
    scene.add(camera);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

    const { cells, borders, rows, waterRing, tip, orangeTris } = shape;
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

    // Step facets: each cell is a shallow pyramid, so every step reads as its own facet.
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
        if (ch % 2 === 0) col.lerp(white, 0.1);
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
    let tri = 0;
    const addTipTri = (a: V3, b: V3, c: V3) => {
      pushTri(tipPos, a, b, c);
      if (orangeTris.has(tri)) col.copy(orangeCol);
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
    const out = (p: V3): V3 => {
      const r = inner(p);
      return [p[0] + (p[0] - r[0]) * 0.015, p[1], p[2] + (p[2] - r[2]) * 0.015];
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
    const edge = (segs: number[], p: V3, q: V3) => segs.push(...out(p), ...out(q));
    const polyline = (segs: number[], pts: V3[], closed = false) => {
      for (let i = 0; i < pts.length - 1; i++) edge(segs, pts[i], pts[i + 1]);
      if (closed && pts.length > 2) edge(segs, pts[pts.length - 1], pts[0]);
    };
    const outline = (segs: number[], c: number) => polyline(segs, cells[c].poly, true);

    const rowSegs: number[] = [];
    rows.forEach(r => polyline(rowSegs, r));
    makeLines(rowSegs, HEX.stepLine, 1.2, 0.75);

    const borderSegs: number[] = [];
    borders.forEach(b => polyline(borderSegs, b));
    makeLines(borderSegs, HEX.border, 2.6, 0.92);

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
    controls.autoRotate = spinWanted;
    if (reduced) setSpinning(false);

    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    let fit = 20;       // camera distance that frames the whole berg
    let fitSpan = 10;   // world height visible at that distance
    let w = 0;
    let h = 0;
    let lastDist = -1;

    // Keeps the berg framed as you zoom: the waterline row moves, and the CSS sea follows it.
    const frame = () => {
      const dist = camera.position.distanceTo(target);
      if (Math.abs(dist - lastDist) < 1e-4 || !w || !h) return;
      lastDist = dist;
      const span = 2 * dist * tanHalf;
      const anchorRow = WATER_FRAC * h + (-ANCHOR_Y / fitSpan) * h;
      const horizon = anchorRow - (-ANCHOR_Y / span) * h;
      camera.setViewOffset(w, h, 0, h / 2 - horizon, w, h);
      camera.updateProjectionMatrix();
      wrap.style.setProperty("--wl", `${horizon.toFixed(1)}px`);
    };

    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    const resume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { controls.autoRotate = spinWanted && selectedCell === null; }, 3500);
    };
    controls.addEventListener("start", () => { clearTimeout(resumeTimer); controls.autoRotate = false; });
    controls.addEventListener("end", resume);

    // ── Sizing ──
    let first = true;
    const resize = () => {
      w = wrap.clientWidth;
      h = wrap.clientHeight;
      if (!w || !h) return;
      const aspect = w / h;
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
      const off = first ? new THREE.Vector3(Math.sin(0.5), 0, Math.cos(0.5)) : camera.position.clone().sub(target).normalize();
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
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.buttons) return;
      const cell = pick(e.clientX, e.clientY);
      if (cell === hovered) return;
      if (hovered !== selectedCell) paint(hovered, false);
      hovered = cell;
      paint(hovered, true);
      canvas.style.cursor = cell === null ? "grab" : "pointer";
    };
    const onLeave = () => {
      if (hovered !== selectedCell) paint(hovered, false);
      hovered = null;
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
          (selLine.geometry as LineSegmentsGeometry).setPositions(segs);
          selLine.visible = true;
          clearTimeout(resumeTimer);
          controls.autoRotate = false;
        } else {
          selLine.visible = false;
          resume();
        }
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
        controls.autoRotate = on && selectedCell === null;
      },
    };

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
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

  const iconBtn: React.CSSProperties = {
    width: 44, height: 44, display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: offWhite, color: navy, border: `1px solid ${rule}`, cursor: "pointer",
    fontFamily: "var(--font-montserrat)", fontSize: "1.2rem", fontWeight: 600, lineHeight: 1, padding: 0,
  };
  const legendItem: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "0.45rem" };

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "1.25rem 1rem 3rem" }}>
      <style>{`
        .ice-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; margin: 0; padding: 0; list-style: none; }
        .ice-sr:focus-within { width: auto; height: auto; clip: auto; overflow: visible; top: 0.75rem; left: 0.75rem; z-index: 3; }
        .ice-sr:focus-within li:not(:focus-within) { display: none; }
        .ice-sr button { font-family: var(--font-montserrat); font-size: 0.78rem; font-weight: 600; color: ${navy}; background: ${offWhite}; border: 1px solid ${rule}; padding: 0.7rem 0.9rem; min-height: 44px; cursor: pointer; }
        .ice-start:hover { background: oklch(24% 0.11 260) !important; }
        .ice-stage {
          --wl: ${WATER_FRAC * 100}%;
          background: linear-gradient(to bottom,
            #dfe4e6 0, #ebedeb var(--wl),
            #eaf3fa var(--wl), #8fb3da calc(var(--wl) + 3px), #3f6aa3 calc(var(--wl) + 10px),
            #1f4478 calc(var(--wl) + 34px), #193a6c calc(var(--wl) + 40%), #102b58 100%);
        }
        .ice-stage::before, .ice-stage::after { content: ""; position: absolute; left: 0; right: 0; pointer-events: none; z-index: 0; }
        .ice-stage::after {
          top: 0; height: max(0px, var(--wl));
          background:
            radial-gradient(ellipse 22% 16% at 18% 30%, oklch(99% 0.015 85 / 0.8), transparent 70%),
            radial-gradient(ellipse 30% 14% at 74% 22%, oklch(99% 0.015 85 / 0.7), transparent 70%),
            radial-gradient(ellipse 18% 10% at 48% 62%, oklch(99% 0.012 85 / 0.55), transparent 70%);
        }
        .ice-stage::before {
          top: var(--wl); bottom: 0;
          background:
            radial-gradient(circle, oklch(90% 0.03 240 / 0.22) 0.8px, transparent 1.4px) 0 0 / 37px 41px,
            radial-gradient(circle, oklch(90% 0.03 240 / 0.14) 0.8px, transparent 1.4px) 17px 23px / 53px 47px;
        }
      `}</style>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: muted, marginBottom: "0.75rem" }}>
        <span style={legendItem}>
          <span aria-hidden="true" style={{ width: 22, height: 0, borderTop: `2px solid ${orange}`, boxShadow: `0 0 6px 1px ${orange}` }} />
          {t.legendDone}
        </span>
        <span style={legendItem}>
          <span aria-hidden="true" style={{ width: 22, height: 0, borderTop: `2px solid ${navy}` }} />
          {t.legendNext}
        </span>
        <span style={legendItem}>
          <span aria-hidden="true" style={{ width: 22, height: 0, borderTop: `3px solid ${HEX.border}` }} />
          {t.legendZone}
        </span>
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

        {/* Keyboard + screen reader access to every step. Hidden until focused. */}
        <ul className="ice-sr" aria-label={t.stepsLabel}>
          {steps.map((s, c) => (
            <li key={s.n}>
              <button type="button" onClick={() => open(c)}>
                {t.step} {s.n}: {s.title}{doneSet.has(s.n) ? ` (${t.done})` : ""}
              </button>
            </li>
          ))}
        </ul>

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

        {step && selected !== null && shape.cells[selected] && (
          <div
            role="dialog"
            aria-labelledby="ice-card-title"
            style={{
              position: "absolute", left: "50%", bottom: 12, transform: "translateX(-50%)",
              width: "min(calc(100% - 24px), 400px)", zIndex: 4,
              background: offWhite, borderTop: `2px solid ${orange}`,
              boxShadow: "0 18px 48px oklch(20% 0.08 260 / 0.35)",
              padding: "1rem 1rem 1.1rem",
              display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", gap: "0.9rem", alignItems: "start",
            }}
          >
            <svg viewBox="0 0 120 100" width="96" height="80" aria-hidden="true" style={{ overflow: "visible" }}>
              <polygon
                points={facetShape(shape.cells[selected].poly)}
                fill={HEX.iceShallow}
                stroke={isDone ? orange : navy}
                strokeWidth={isDone ? 2.5 : 1.5}
                strokeLinejoin="round"
                style={isDone ? { filter: `drop-shadow(0 0 4px ${orange})` } : undefined}
              />
              <text x="60" y="52" textAnchor="middle" dominantBaseline="central" fill={isDone ? orangeDeep : navy}
                style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: 30 }}>
                {step.n}
              </text>
            </svg>
            <div style={{ minWidth: 0, paddingRight: 36 }}>
              <p style={{ fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: orangeDeep, margin: "0 0 0.35rem", lineHeight: 1.4 }}>
                {t.chapter} {chapterNo[selected]}{step.chapter ? ` · ${step.chapter}` : ""}
              </p>
              <h2 id="ice-card-title" style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic", fontWeight: 500, fontSize: "1.45rem", lineHeight: 1.15, color: navy, margin: 0, textWrap: "balance" }}>
                {step.title}
              </h2>
              <p style={{ fontFamily: "var(--font-montserrat)", fontSize: "0.72rem", fontWeight: 600, color: muted, margin: "0.35rem 0 0.8rem" }}>
                {t.step} {step.n}{isDone ? ` · ${t.done}` : isNext ? ` · ${t.next}` : ""}
              </p>
              <Link
                ref={startRef}
                href={`/journey/step/${step.n}`}
                className="ice-start"
                style={{ display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 1.2rem", background: navy, color: offWhite, fontFamily: "var(--font-montserrat)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.04em", textDecoration: "none", transition: "background 0.15s" }}
              >
                {isDone ? t.review : t.start} →
              </Link>
            </div>
            <button type="button" aria-label={t.close} onClick={close}
              style={{ ...iconBtn, position: "absolute", top: 4, right: 4, border: "none", background: "transparent", color: muted, fontSize: "1.4rem" }}>
              ×
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
