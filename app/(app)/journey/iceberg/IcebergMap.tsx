"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { PathStep } from "../StonePath";

// Brand colours (oklch in CSS). WebGL needs hex, converted by script, not by eye.
const navy = "oklch(30% 0.12 260)";
const muted = "oklch(48% 0.04 260)";
const text = "oklch(32% 0.06 260)";
const rule = "oklch(84% 0.01 80)";
const orange = "oklch(65% 0.15 45)";
const orangeDeep = "oklch(58% 0.16 45)";
const offWhite = "oklch(97% 0.005 80)";
const HEX = {
  sea: "#002356",        // oklch(27% 0.1 258)
  seaFar: "#0b376a",     // oklch(34% 0.1 255)
  iceTop: "#f5f9fc",     // oklch(98% 0.006 240)
  iceShallow: "#d8e7f2", // oklch(92% 0.022 240)
  iceDeep: "#b4cbdf",    // oklch(83% 0.038 245)
  warm: "#fffbf3",       // oklch(99% 0.012 80)
  orange: "#d86d38",     // oklch(65% 0.15 45)
  orangeDeep: "#c4530f", // oklch(58% 0.16 45)
  navy: "#012868",       // oklch(30% 0.12 260)
  zone: "#516b8b",       // oklch(52% 0.06 255)
  label: "#334868",      // oklch(40% 0.06 258)
  waterline: "#eff7fb",  // oklch(97% 0.01 230)
};

// ── Iceberg shape ──
// The underwater body is a ring grid: 6 rows deep, 10 facets around = 60 steps.
// Step n sits in cell n-1, so the steps spiral down row by row.
const ROWS = 6;
const COLS = 10;
const LEVELS = [
  { y: 0, r: 1.55 },
  { y: -0.85, r: 2.35 },
  { y: -1.8, r: 2.7 },
  { y: -2.8, r: 2.65 },
  { y: -3.75, r: 2.3 },
  { y: -4.6, r: 1.75 },
  { y: -5.3, r: 1.05 },
];
const BOTTOM: V3 = [0.1, -6.1, -0.05];
const TARGET_Y = -2.2;

type V3 = [number, number, number];

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

function buildGrid(): { grid: V3[][]; mid: V3[]; peak: V3 } {
  const rnd = seeded(1139);
  const grid = LEVELS.map((lv, i) =>
    Array.from({ length: COLS }, (_, j): V3 => {
      const a = ((j + (rnd() - 0.5) * (i === 0 ? 0.3 : 0.45)) / COLS) * Math.PI * 2 + i * 0.09;
      const r = lv.r * (1 + (rnd() - 0.5) * 0.18);
      const y = i === 0 ? 0 : lv.y + (rnd() - 0.5) * 0.28;
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    }),
  );
  // Above-water tip: one jagged ring, then a peak. No steps up here.
  const mid = Array.from({ length: COLS }, (_, j): V3 => {
    const a = ((j + 0.5 + (rnd() - 0.5) * 0.5) / COLS) * Math.PI * 2;
    const r = 0.95 * (1 + (rnd() - 0.5) * 0.4);
    return [Math.cos(a) * r + 0.1, 0.55 + rnd() * 0.85, Math.sin(a) * r];
  });
  return { grid, mid, peak: [0.3, 2.15, 0.05] };
}

function cellCorners(grid: V3[][], c: number): [V3, V3, V3, V3] {
  const i = Math.floor(c / COLS);
  const j = c % COLS;
  const j1 = (j + 1) % COLS;
  return [grid[i][j], grid[i][j1], grid[i + 1][j1], grid[i + 1][j]];
}

// 2D outline of a facet, for the popup drawing.
function facetShape(corners: V3[]): string {
  const cx = corners.reduce((s, p) => s + p[0], 0) / corners.length;
  const cy = corners.reduce((s, p) => s + p[1], 0) / corners.length;
  const cz = corners.reduce((s, p) => s + p[2], 0) / corners.length;
  const a = Math.atan2(cz, cx);
  const ux = -Math.sin(a);
  const uz = Math.cos(a);
  const pts = corners.map(p => [(p[0] - cx) * ux + (p[2] - cz) * uz, -(p[1] - cy)]);
  const w = Math.max(...pts.map(p => Math.abs(p[0])));
  const h = Math.max(...pts.map(p => Math.abs(p[1])));
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

  const shape = useMemo(buildGrid, []);
  const doneSet = useMemo(() => new Set(completed), [completed]);
  const chapterNo = useMemo(() => {
    let ch = 0;
    return steps.map(s => (s.chapterStart ? ++ch : ch));
  }, [steps]);

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
    let disposed = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    canvas.setAttribute("aria-hidden", "true");
    wrap.prepend(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 800);
    const target = new THREE.Vector3(0, TARGET_Y, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x7f95b5, 1.9));
    const sun = new THREE.DirectionalLight(0xffffff, 1.7);
    sun.position.set(5, 7, 6);
    scene.add(sun);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x; };

    // Sea: drawn first and never hides the ice, like a cut-away drawing.
    const seaGeo = track(new THREE.CircleGeometry(300, 64));
    seaGeo.rotateX(-Math.PI / 2);
    const seaCols: number[] = [];
    const cNear = new THREE.Color(HEX.sea);
    const cFar = new THREE.Color(HEX.seaFar);
    const seaPos = seaGeo.getAttribute("position");
    for (let k = 0; k < seaPos.count; k++) {
      const c = k === 0 ? cNear : cFar;
      seaCols.push(c.r, c.g, c.b);
    }
    seaGeo.setAttribute("color", new THREE.Float32BufferAttribute(seaCols, 3));
    const sea = new THREE.Mesh(seaGeo, track(new THREE.MeshBasicMaterial({ vertexColors: true, depthWrite: false, side: THREE.DoubleSide })));
    sea.renderOrder = -1;
    scene.add(sea);

    const { grid, mid, peak } = shape;
    const rnd = seeded(77);
    const tmpA = new THREE.Vector3();
    const tmpB = new THREE.Vector3();
    const tmpN = new THREE.Vector3();

    // Adds a triangle facing away from the reference axis point.
    const pushTri = (pos: number[], a: V3, b: V3, c: V3) => {
      tmpA.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      tmpB.set(c[0] - a[0], c[1] - a[1], c[2] - a[2]);
      tmpN.crossVectors(tmpA, tmpB);
      const cy = (a[1] + b[1] + c[1]) / 3;
      const ry = Math.min(0.3, Math.max(-4.6, cy));
      const ox = (a[0] + b[0] + c[0]) / 3;
      const oz = (a[2] + b[2] + c[2]) / 3;
      const out = tmpN.x * ox + tmpN.y * (cy - ry) + tmpN.z * oz;
      if (out < 0) pos.push(...a, ...c, ...b);
      else pos.push(...a, ...b, ...c);
    };

    // Step facets
    const cellCount = ROWS * COLS;
    const tilePos: number[] = [];
    const tileCol: number[] = [];
    const shallow = new THREE.Color(HEX.iceShallow);
    const deep = new THREE.Color(HEX.iceDeep);
    const white = new THREE.Color(HEX.iceTop);
    const col = new THREE.Color();
    for (let c = 0; c < cellCount; c++) {
      const i = Math.floor(c / COLS);
      const j = c % COLS;
      const [a, b, cc, d] = cellCorners(grid, c);
      const tris: [V3, V3, V3][] = (i + j) % 2 ? [[a, b, cc], [a, cc, d]] : [[a, b, d], [b, cc, d]];
      const ch = chapterNo[c] ?? 0;
      for (const [p, q, r] of tris) {
        pushTri(tilePos, p, q, r);
        col.copy(shallow).lerp(deep, i / (ROWS - 1));
        if (ch % 2 === 0) col.lerp(white, 0.14);
        col.multiplyScalar(1 + (rnd() - 0.5) * 0.06);
        for (let k = 0; k < 3; k++) tileCol.push(col.r, col.g, col.b);
      }
    }
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

    // Tip above water + bottom point (not clickable)
    const capPos: number[] = [];
    const capCol: number[] = [];
    const g0 = grid[0];
    for (let j = 0; j < COLS; j++) {
      const j1 = (j + 1) % COLS;
      const jm = (j + COLS - 1) % COLS;
      const tris: [V3, V3, V3][] = [[g0[j], g0[j1], mid[j]], [g0[j], mid[j], mid[jm]], [mid[jm], mid[j], peak]];
      for (const [p, q, r] of tris) {
        pushTri(capPos, p, q, r);
        col.copy(white).multiplyScalar(1 + (rnd() - 0.5) * 0.05);
        for (let k = 0; k < 3; k++) capCol.push(col.r, col.g, col.b);
      }
    }
    const gl = grid[ROWS];
    for (let j = 0; j < COLS; j++) {
      pushTri(capPos, gl[j], gl[(j + 1) % COLS], BOTTOM);
      col.copy(deep).multiplyScalar(0.94 + rnd() * 0.05);
      for (let k = 0; k < 3; k++) capCol.push(col.r, col.g, col.b);
    }
    const capGeo = track(new THREE.BufferGeometry());
    capGeo.setAttribute("position", new THREE.Float32BufferAttribute(capPos, 3));
    capGeo.setAttribute("color", new THREE.Float32BufferAttribute(capCol, 3));
    capGeo.computeVertexNormals();
    const caps = new THREE.Mesh(capGeo, iceMat);
    scene.add(caps);

    // ── Lines ──
    const lineMats: LineMaterial[] = [];
    const out = (p: V3): V3 => [p[0] * 1.012, p[1], p[2] * 1.012];
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
    const outline = (segs: number[], c: number) => {
      const [a, b, cc, d] = cellCorners(grid, c);
      edge(segs, a, b); edge(segs, b, cc); edge(segs, cc, d); edge(segs, d, a);
    };

    const zoneSegs: number[] = [];
    const waterSegs: number[] = [];
    for (let c = 0; c < cellCount; c++) {
      const i = Math.floor(c / COLS);
      const j = c % COLS;
      const j1 = (j + 1) % COLS;
      if (i === 0) edge(waterSegs, grid[0][j], grid[0][j1]);
      const right = i * COLS + j1;
      if (chapterNo[right] !== chapterNo[c]) edge(zoneSegs, grid[i][j1], grid[i + 1][j1]);
      const below = c + COLS;
      if (i === ROWS - 1 || chapterNo[below] !== chapterNo[c]) edge(zoneSegs, grid[i + 1][j], grid[i + 1][j1]);
    }
    makeLines(zoneSegs, HEX.zone, 1.3, 0.85);
    makeLines(waterSegs, HEX.waterline, 2.5, 0.95);

    const doneSegs: number[] = [];
    steps.forEach((s, c) => { if (doneSet.has(s.n) && c < cellCount) outline(doneSegs, c); });
    makeLines(doneSegs, HEX.orange, 8, 0.28); // glow
    makeLines(doneSegs, HEX.orange, 2.4);     // core

    const nextSegs: number[] = [];
    const nextCell = nextStep ? steps.findIndex(s => s.n === nextStep) : -1;
    if (nextCell >= 0 && nextCell < cellCount) outline(nextSegs, nextCell);
    makeLines(nextSegs, HEX.navy, 2.2);

    const selLine = makeLines([], HEX.navy, 3.2);

    // ── Step numbers ──
    const labels = new THREE.Group();
    scene.add(labels);
    const fontFamily = getComputedStyle(document.body).getPropertyValue("--font-montserrat").trim() || "sans-serif";
    const addLabels = () => {
      if (disposed) return;
      steps.forEach((s, c) => {
        if (c >= cellCount) return;
        const cv = document.createElement("canvas");
        cv.width = cv.height = 128;
        const x = cv.getContext("2d");
        if (!x) return;
        x.font = `700 58px ${fontFamily}`;
        x.textAlign = "center";
        x.textBaseline = "middle";
        x.fillStyle = doneSet.has(s.n) ? HEX.orangeDeep : HEX.label;
        x.fillText(String(s.n), 64, 68);
        const tex = track(new THREE.CanvasTexture(cv));
        tex.colorSpace = THREE.SRGBColorSpace;
        const sp = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })));
        const corners = cellCorners(grid, c);
        const cx = corners.reduce((a, p) => a + p[0], 0) / 4;
        const cy = corners.reduce((a, p) => a + p[1], 0) / 4;
        const cz = corners.reduce((a, p) => a + p[2], 0) / 4;
        const len = Math.hypot(cx, cz) || 1;
        sp.position.set(cx + (cx / len) * 0.12, cy, cz + (cz / len) * 0.12);
        sp.scale.set(0.46, 0.46, 1);
        labels.add(sp);
      });
    };
    if (document.fonts?.ready) document.fonts.ready.then(addLabels).catch(addLabels);
    else addLabels();

    // ── Camera + controls ──
    const controls = new OrbitControls(camera, canvas);
    controls.target.copy(target);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 6;
    controls.maxDistance = 26;
    controls.minPolarAngle = 0.95;
    controls.maxPolarAngle = 1.5;
    controls.autoRotateSpeed = 0.6;
    let spinWanted = !reduced;
    let selectedCell: number | null = null;
    controls.autoRotate = spinWanted;
    if (reduced) setSpinning(false);

    const placeCamera = (aspect: number) => {
      const dist = aspect < 0.8 ? 20 : aspect < 1.2 ? 17 : 14.5;
      const polar = 1.28;
      const az = 0.5;
      camera.position.set(
        target.x + dist * Math.sin(polar) * Math.sin(az),
        target.y + dist * Math.cos(polar),
        target.z + dist * Math.sin(polar) * Math.cos(az),
      );
      controls.update();
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
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      lineMats.forEach(m => m.resolution.set(w, h));
      if (first) { placeCamera(w / h); first = false; }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    // ── Colours for hover / selection ──
    const warm = new THREE.Color(HEX.warm);
    const paint = (cell: number | null, on: boolean) => {
      if (cell === null) return;
      for (let v = cell * 6; v < cell * 6 + 6; v++) {
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
      const hit = ray.intersectObjects([tiles, caps], false)[0];
      if (!hit || hit.object !== tiles || hit.faceIndex == null) return null;
      const cell = Math.floor(hit.faceIndex / 2);
      return steps[cell] ? cell : null;
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
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      disposed = true;
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
          <span aria-hidden="true" style={{ width: 22, height: 0, borderTop: "1px solid oklch(52% 0.06 255)" }} />
          {t.legendZone}
        </span>
      </div>

      <div
        ref={wrapRef}
        tabIndex={-1}
        style={{
          position: "relative",
          height: "min(76vh, 720px)",
          minHeight: 440,
          overflow: "hidden",
          border: `1px solid ${rule}`,
          background: "linear-gradient(to bottom, #ddeaf2 0%, #f7f5f1 55%)",
          outline: "none",
        }}
      >
        {failed && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "1.5rem", textAlign: "center" }}>
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

        {step && selected !== null && (
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
                points={facetShape(cellCorners(shape.grid, selected))}
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
