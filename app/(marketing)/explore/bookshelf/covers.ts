import type { Resource, Lang } from "@/lib/resources-data";
import type { ExploreShelf } from "@/lib/explore-topics";
import { oklchToCss } from "./palette";

/**
 * Procedural book-cover atlas.
 *
 * Every cover is drawn with canvas2d from module data (title, format, run time,
 * topic hue). No image API, no commissioned art, no external assets — per the
 * approved plan. One 2048×2048 atlas holds all 54 covers plus the decorative
 * slabs, so the GPU sees a single texture upload (~21 MB with mips) instead of
 * 54 separate ones (~85 MB) — that difference is the actual iOS crash risk.
 */

export const ATLAS_SIZE = 2048;
export const ATLAS_GRID = 8; // 8×8 = 64 cells
export const CELL_PX = ATLAS_SIZE / ATLAS_GRID; // 256

/** Covers are 3:4. We draw in a 192×256 virtual space and x-stretch to fill the
 *  square cell, so the texture un-stretches exactly when mapped to a 0.75:1 quad. */
const VW = 192;
const VH = 256;

/** Reserved decorative cells (last row). Never clickable. */
export const DECOR_CELLS = {
  pagesLight: 60,
  pagesWarm: 61,
  clothNavy: 62,
  clothDeep: 63,
} as const;

export const MAX_COVER_CELLS = 60;

/** Left-edge strip of every cell is a flat "page edge" colour. Non-front box
 *  faces collapse to this UV so a book's sides/top read as paper, not a
 *  squashed second copy of the cover. Keep in sync with EDGE_UV in Scene.tsx. */
const EDGE_STRIP_VW = 14;

export interface CoverAtlas {
  canvas: HTMLCanvasElement;
  /** resource.id → atlas cell index */
  cellFor: Map<string, number>;
  /** engraved end-label plates, one per shelf, in shelf order */
  labels: HTMLCanvasElement[];
}

/**
 * uv offset for a cell. CanvasTexture keeps flipY=true, so canvas row 0 (top)
 * lands at the TOP of uv space — hence the row inversion here.
 */
export function cellUvOffset(index: number): [number, number] {
  const col = index % ATLAS_GRID;
  const row = Math.floor(index / ATLAS_GRID);
  return [col / ATLAS_GRID, (ATLAS_GRID - 1 - row) / ATLAS_GRID];
}

/** Flat point inside every cell's page-edge strip. Non-front box faces sample
 *  here so a book's sides and top read as paper, not a squashed second cover. */
export const EDGE_UV: [number, number] = [0.035, 0.5];

/* ------------------------------------------------------------------ */
/* font plumbing                                                       */
/* ------------------------------------------------------------------ */

function cssVarFont(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v.length > 0 ? v : fallback;
}

/** next/font hashes the family name; read the resolved stack off :root. */
export async function ensureFontsReady(): Promise<{ serif: string; sans: string }> {
  const serif = cssVarFont("--font-cormorant", "Georgia, serif");
  const sans = cssVarFont("--font-montserrat", "system-ui, sans-serif");
  try {
    await document.fonts.ready;
    // Explicitly pull the exact weights/styles the atlas draws with — `ready`
    // only resolves fonts already requested by rendered DOM.
    await Promise.all([
      document.fonts.load(`600 26px ${serif}`),
      document.fonts.load(`italic 400 26px ${serif}`),
      document.fonts.load(`700 11px ${sans}`),
      document.fonts.load(`600 11px ${sans}`),
    ]);
  } catch {
    /* font loading is best-effort; fallback stack still renders */
  }
  return { serif, sans };
}

/* ------------------------------------------------------------------ */
/* drawing helpers                                                     */
/* ------------------------------------------------------------------ */

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] | null {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (ctx.measureText(attempt).width <= maxWidth) {
      current = attempt;
    } else {
      if (current) lines.push(current);
      // A single word longer than the line: this size doesn't fit, shrink.
      if (ctx.measureText(word).width > maxWidth) return null;
      current = word;
      if (lines.length >= maxLines) return null;
    }
  }
  if (current) lines.push(current);
  return lines.length <= maxLines ? lines : null;
}

function drawFormatIcon(
  ctx: CanvasRenderingContext2D,
  format: string,
  x: number,
  y: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const s = size;

  switch (format) {
    case "Assessment": {
      // target + tick
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s * 0.42, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.28, s * 0.52);
      ctx.lineTo(s * 0.45, s * 0.68);
      ctx.lineTo(s * 0.74, s * 0.32);
      ctx.stroke();
      break;
    }
    case "Worksheet": {
      // grid
      ctx.strokeRect(s * 0.12, s * 0.12, s * 0.76, s * 0.76);
      ctx.beginPath();
      ctx.moveTo(s * 0.12, s * 0.5);
      ctx.lineTo(s * 0.88, s * 0.5);
      ctx.moveTo(s * 0.5, s * 0.12);
      ctx.lineTo(s * 0.5, s * 0.88);
      ctx.stroke();
      break;
    }
    case "Article": {
      // page with folded corner
      ctx.beginPath();
      ctx.moveTo(s * 0.16, s * 0.1);
      ctx.lineTo(s * 0.62, s * 0.1);
      ctx.lineTo(s * 0.84, s * 0.32);
      ctx.lineTo(s * 0.84, s * 0.9);
      ctx.lineTo(s * 0.16, s * 0.9);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.62, s * 0.1);
      ctx.lineTo(s * 0.62, s * 0.32);
      ctx.lineTo(s * 0.84, s * 0.32);
      ctx.stroke();
      break;
    }
    default: {
      // Guide — open book
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.26);
      ctx.lineTo(s * 0.5, s * 0.84);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.26);
      ctx.quadraticCurveTo(s * 0.28, s * 0.14, s * 0.1, s * 0.22);
      ctx.lineTo(s * 0.1, s * 0.78);
      ctx.quadraticCurveTo(s * 0.28, s * 0.7, s * 0.5, s * 0.84);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.26);
      ctx.quadraticCurveTo(s * 0.72, s * 0.14, s * 0.9, s * 0.22);
      ctx.lineTo(s * 0.9, s * 0.78);
      ctx.quadraticCurveTo(s * 0.72, s * 0.7, s * 0.5, s * 0.84);
      ctx.stroke();
      break;
    }
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* cover cell                                                          */
/* ------------------------------------------------------------------ */

type Variant = "deep" | "cream" | "accent";

function drawCover(
  ctx: CanvasRenderingContext2D,
  resource: Resource,
  hue: number,
  lang: Lang,
  fonts: { serif: string; sans: string },
  variant: Variant,
  seed: number
) {
  const title = lang === "id" && resource.titleId ? resource.titleId : resource.title;

  let bgTop: string;
  let bgBottom: string;
  let ink: string;
  let inkSoft: string;
  let rule: string;
  let edge: string;

  if (variant === "cream") {
    bgTop = oklchToCss(0.955, 0.008, 85);
    bgBottom = oklchToCss(0.9, 0.014, hue);
    ink = oklchToCss(0.24, 0.04, 262);
    inkSoft = oklchToCss(0.46, 0.02, 262);
    rule = oklchToCss(0.65, 0.15, hue);
    edge = oklchToCss(0.88, 0.01, 85);
  } else if (variant === "accent") {
    bgTop = oklchToCss(0.42, 0.11, hue);
    bgBottom = oklchToCss(0.27, 0.08, hue);
    ink = oklchToCss(0.97, 0.006, 85);
    inkSoft = oklchToCss(0.86, 0.02, hue);
    rule = oklchToCss(0.94, 0.02, 85);
    edge = oklchToCss(0.93, 0.01, 85);
  } else {
    bgTop = oklchToCss(0.29, 0.055, (hue + 260 * 3) / 4);
    bgBottom = oklchToCss(0.19, 0.045, 262);
    ink = oklchToCss(0.96, 0.006, 85);
    inkSoft = oklchToCss(0.72, 0.03, hue);
    rule = oklchToCss(0.65, 0.15, hue);
    edge = oklchToCss(0.91, 0.012, 85);
  }

  // background
  const grad = ctx.createLinearGradient(0, 0, VW * 0.35, VH);
  grad.addColorStop(0, bgTop);
  grad.addColorStop(1, bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, VW, VH);

  // page-edge strip on the left (also the UV that non-front box faces sample)
  ctx.fillStyle = edge;
  ctx.fillRect(0, 0, EDGE_STRIP_VW, VH);
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(EDGE_STRIP_VW - 2, 0, 2, VH);

  const padL = EDGE_STRIP_VW + 16;
  const padR = 16;
  const contentW = VW - padL - padR;

  // inset frame
  ctx.strokeStyle = variant === "cream" ? "rgba(27,58,107,0.16)" : "rgba(255,255,255,0.13)";
  ctx.lineWidth = 1;
  ctx.strokeRect(padL - 8, 12, contentW + 16, VH - 24);

  // accent band
  ctx.fillStyle = rule;
  ctx.fillRect(padL, 30, 46, 4);

  // title — auto-fit Cormorant Garamond
  let lines: string[] | null = null;
  let size = 27;
  const maxLines = 5;
  while (size >= 15) {
    ctx.font = `600 ${size}px ${fonts.serif}`;
    lines = wrapLines(ctx, title, contentW, maxLines);
    if (lines && lines.length * size * 1.16 <= 132) break;
    lines = null;
    size -= 1;
  }
  if (!lines) {
    size = 15;
    ctx.font = `600 ${size}px ${fonts.serif}`;
    lines = [title.slice(0, 40)];
  }

  ctx.fillStyle = ink;
  ctx.textBaseline = "alphabetic";
  const lineH = size * 1.16;
  let ty = 62 + size;
  for (const line of lines) {
    ctx.fillText(line, padL, ty);
    ty += lineH;
  }

  // subtle deckle texture — a few faint horizontal strokes, seeded so no two
  // covers share the same noise
  ctx.save();
  ctx.globalAlpha = variant === "cream" ? 0.05 : 0.07;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const yy = 150 + ((seed >> (i * 3)) % 46) + i * 3;
    ctx.beginPath();
    ctx.moveTo(padL, yy);
    ctx.lineTo(padL + ((seed >> i) % contentW), yy);
    ctx.stroke();
  }
  ctx.restore();

  // footer rule + meta
  ctx.strokeStyle = variant === "cream" ? "rgba(27,58,107,0.2)" : "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, VH - 46);
  ctx.lineTo(VW - padR, VH - 46);
  ctx.stroke();

  drawFormatIcon(ctx, resource.format, padL, VH - 36, 20, inkSoft);

  ctx.font = `700 10px ${fonts.sans}`;
  ctx.fillStyle = inkSoft;
  const meta = resource.time.toUpperCase();
  // manual letter-spacing (canvas letterSpacing is not in Safari <17)
  let mx = padL + 28;
  for (const ch of meta) {
    ctx.fillText(ch, mx, VH - 21);
    mx += ctx.measureText(ch).width + 0.9;
  }
}

/* ------------------------------------------------------------------ */
/* decorative cells                                                    */
/* ------------------------------------------------------------------ */

function drawPageEdges(ctx: CanvasRenderingContext2D, warm: boolean) {
  ctx.fillStyle = warm ? oklchToCss(0.87, 0.028, 82) : oklchToCss(0.93, 0.012, 85);
  ctx.fillRect(0, 0, VW, VH);
  ctx.strokeStyle = warm ? "rgba(60,45,30,0.16)" : "rgba(40,50,80,0.13)";
  ctx.lineWidth = 1;
  for (let y = 4; y < VH; y += 5) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(VW, y);
    ctx.stroke();
  }
  // darker top/bottom so a stacked slab reads with depth
  const g = ctx.createLinearGradient(0, 0, 0, VH);
  g.addColorStop(0, "rgba(0,0,0,0.22)");
  g.addColorStop(0.45, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,0.26)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, VW, VH);
}

function drawCloth(ctx: CanvasRenderingContext2D, deep: boolean) {
  ctx.fillStyle = deep ? oklchToCss(0.19, 0.045, 262) : oklchToCss(0.3, 0.075, 262);
  ctx.fillRect(0, 0, VW, VH);
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  for (let y = 3; y < VH; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(VW, y);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(0, 0, 6, VH);
}

/* ------------------------------------------------------------------ */
/* engraved end-label plate                                            */
/* ------------------------------------------------------------------ */

const LABEL_W = 640;
const LABEL_H = 160;

function buildLabelCanvas(label: string, hue: number, fonts: { sans: string }): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = LABEL_W;
  c.height = LABEL_H;
  const ctx = c.getContext("2d");
  if (!ctx) return c;

  const plate = ctx.createLinearGradient(0, 0, 0, LABEL_H);
  plate.addColorStop(0, oklchToCss(0.28, 0.05, 264));
  plate.addColorStop(1, oklchToCss(0.19, 0.045, 262));
  ctx.fillStyle = plate;
  ctx.fillRect(0, 0, LABEL_W, LABEL_H);

  ctx.strokeStyle = oklchToCss(0.65, 0.15, hue, 0.55);
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, LABEL_W - 24, LABEL_H - 24);

  // auto-fit, letterspaced, uppercase
  const text = label.toUpperCase();
  let size = 54;
  const track = () => size * 0.13;
  const measure = () => {
    ctx.font = `700 ${size}px ${fonts.sans}`;
    let w = 0;
    for (const ch of text) w += ctx.measureText(ch).width + track();
    return w - track();
  };
  while (size > 18 && measure() > LABEL_W - 88) size -= 2;

  const total = measure();
  const x = (LABEL_W - total) / 2;
  const y = LABEL_H / 2 + size * 0.35;

  // engraved: dark cut above, light catch below
  for (const pass of [
    { dx: 0, dy: -2, color: "rgba(0,0,0,0.6)" },
    { dx: 0, dy: 2, color: oklchToCss(0.65, 0.15, hue, 0.35) },
    { dx: 0, dy: 0, color: oklchToCss(0.9, 0.03, hue) },
  ]) {
    let px = x;
    ctx.fillStyle = pass.color;
    for (const ch of text) {
      ctx.fillText(ch, px + pass.dx, y + pass.dy);
      px += ctx.measureText(ch).width + track();
    }
  }

  return c;
}

/* ------------------------------------------------------------------ */
/* atlas builder                                                       */
/* ------------------------------------------------------------------ */

export async function buildCoverAtlas(shelves: ExploreShelf[], lang: Lang): Promise<CoverAtlas> {
  const fonts = await ensureFontsReady();

  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_SIZE;
  canvas.height = ATLAS_SIZE;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("canvas2d unavailable");

  ctx.fillStyle = oklchToCss(0.22, 0.1, 260);
  ctx.fillRect(0, 0, ATLAS_SIZE, ATLAS_SIZE);

  const cellFor = new Map<string, number>();
  let cell = 0;

  const drawInCell = (index: number, fn: (c: CanvasRenderingContext2D) => void) => {
    const cx = (index % ATLAS_GRID) * CELL_PX;
    const cy = Math.floor(index / ATLAS_GRID) * CELL_PX;
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx, cy, CELL_PX, CELL_PX);
    ctx.clip();
    ctx.translate(cx, cy);
    // stretch the 192-wide virtual cover across the square cell; it un-stretches
    // when sampled onto a 0.75:1 book quad
    ctx.scale(CELL_PX / VW, CELL_PX / VH);
    fn(ctx);
    ctx.restore();
  };

  const variants: Variant[] = ["deep", "cream", "deep", "accent", "deep", "cream"];

  for (const shelf of shelves) {
    for (const resource of shelf.items) {
      if (cell >= MAX_COVER_CELLS) break;
      const seed = hashString(resource.id + shelf.key);
      const variant = variants[seed % variants.length];
      const idx = cell++;
      drawInCell(idx, (c) => drawCover(c, resource, shelf.hue, lang, fonts, variant, seed));
      cellFor.set(resource.id, idx);
    }
  }

  drawInCell(DECOR_CELLS.pagesLight, (c) => drawPageEdges(c, false));
  drawInCell(DECOR_CELLS.pagesWarm, (c) => drawPageEdges(c, true));
  drawInCell(DECOR_CELLS.clothNavy, (c) => drawCloth(c, false));
  drawInCell(DECOR_CELLS.clothDeep, (c) => drawCloth(c, true));

  const labels = shelves.map((s) =>
    buildLabelCanvas(lang === "id" ? s.labelId : s.label, s.hue, fonts)
  );

  return { canvas, cellFor, labels };
}
