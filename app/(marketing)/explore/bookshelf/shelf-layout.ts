import type { ExploreShelf } from "@/lib/explore-topics";
import { DECOR_CELLS } from "./covers";

/**
 * Deterministic per-shelf arrangement.
 *
 * Chris's brief: books vary in size/height, some standing, some in a small
 * pile, and no two shelves may look copy-pasted. The carcass stays identical
 * across all 8 shelves (that's what makes the room read as one room) — the
 * variation lives entirely in what sits ON the boards, driven by a PRNG seeded
 * from the topic key. Same topic ⇒ same arrangement on every reload.
 */

/* ---- carcass geometry (shared with Scene.tsx) ---- */
export const SHELF_H = 5.5;
export const SHELF_D = 1.15;
export const BOARD_T = 0.11;
/** Y of each board's top surface, in shelf-local space (origin = shelf floor). */
export const ROW_Y = [0.12, 1.86, 3.6];
/** Books sit forward of the backboard so light catches the covers. */
const Z_BOOK = 0.16;

const BASE_H = 1.28;

/**
 * Shelf width is responsive, not fixed. The camera sits at the centre of the
 * room and cannot dolly back past itself, so on a portrait phone a 7.6-wide
 * shelf simply cannot be framed — the fix is a narrower shelf, not a wider FOV.
 */
export interface RoomProfile {
  /** overall carcass width */
  shelfW: number;
  /** orbit radius (centre → shelf) */
  radius: number;
  fov: number;
}

export const ROOM_WIDE: RoomProfile = { shelfW: 7.6, radius: 11, fov: 45 };
export const ROOM_NARROW: RoomProfile = { shelfW: 3.9, radius: 10, fov: 55 };

export function pickProfile(aspect: number): RoomProfile {
  return aspect < 0.95 ? ROOM_NARROW : ROOM_WIDE;
}

export interface BookInstance {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  cell: number;
  /** index into shelf.items, or null for decorative geometry (not clickable) */
  resourceIndex: number | null;
}

/* ---- PRNG ---- */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type SlotKind = "upright" | "leaner" | "pile" | "bookend";

interface Slot {
  kind: SlotKind;
  width: number;
  /** built once x is known */
  emit: (x: number, out: BookInstance[]) => void;
}

export function buildShelfLayout(
  shelf: ExploreShelf,
  cellFor: Map<string, number>,
  profile: RoomProfile
): BookInstance[] {
  const INNER_W = profile.shelfW - 0.6;
  const rnd = mulberry32(hashString(shelf.key));
  const out: BookInstance[] = [];
  const n = shelf.items.length;

  /* --- per-shelf personality --- */
  const tiltAmount = 0.04 + rnd() * 0.09;
  const pLeaner = 0.14 + rnd() * 0.2;
  const alignment: "spread" | "left" | "cluster" = (["spread", "left", "cluster"] as const)[
    Math.floor(rnd() * 3)
  ];
  const warmPages = rnd() < 0.5;
  const slabCell = warmPages ? DECOR_CELLS.pagesWarm : DECOR_CELLS.pagesLight;

  /* --- distribute items across the 3 rows with seeded, uneven weights --- */
  const weights = [0.7 + rnd() * 0.8, 0.7 + rnd() * 0.8, 0.7 + rnd() * 0.8];
  const wSum = weights[0] + weights[1] + weights[2];
  const counts = weights.map((w) => Math.floor((w / wSum) * n));
  let assigned = counts[0] + counts[1] + counts[2];
  let cursor = 0;
  while (assigned < n) {
    counts[cursor % 3]++;
    assigned++;
    cursor++;
  }

  let itemIndex = 0;

  for (let row = 0; row < 3; row++) {
    const rowY = ROW_Y[row];
    // Nothing on this board may touch the underside of the board above it.
    const ceiling = row < ROW_Y.length - 1 ? ROW_Y[row + 1] - BOARD_T : SHELF_H - BOARD_T;
    const clearance = ceiling - rowY - 0.06;
    const rowItems: number[] = [];
    for (let k = 0; k < counts[row] && itemIndex < n; k++) rowItems.push(itemIndex++);

    const slots: Slot[] = [];
    let leanersThisRow = 0;

    for (const idx of rowItems) {
      const resource = shelf.items[idx];
      const cell = cellFor.get(resource.id) ?? DECOR_CELLS.clothNavy;

      const sizeMul = 0.86 + rnd() * 0.3;
      const aspect = 0.7 + rnd() * 0.08;
      let h = BASE_H * sizeMul;
      let w = h * aspect;
      let d = 0.11 + rnd() * 0.09;

      const wantLeaner = rnd() < pLeaner && leanersThisRow < 2;

      if (wantLeaner) {
        leanersThisRow++;
        const slabCount = 2 + Math.floor(rnd() * 2);
        const slabD = 0.82 + rnd() * 0.12;
        const slabThick: number[] = [];
        for (let s = 0; s < slabCount; s++) slabThick.push(0.11 + rnd() * 0.06);
        const slabYaw = slabThick.map(() => (rnd() - 0.5) * 0.22);
        const pileH = slabThick.reduce((a, b) => a + b, 0);
        const lean = 0.3 + rnd() * 0.14;

        // shrink the display copy so pile + leaning book still clears the board above
        const avail = clearance - pileH;
        const need = h * Math.cos(lean) + d * Math.sin(lean);
        if (need > avail) {
          const k = Math.max(0.5, avail / need);
          h *= k;
          w *= k;
          d *= k;
        }
        const slabW = Math.max(w * 1.18, 1.1);

        slots.push({
          kind: "leaner",
          width: Math.max(slabW, w) + 0.12,
          emit: (x, o) => {
            let y = rowY;
            for (let s = 0; s < slabCount; s++) {
              o.push({
                position: [x + (rnd() - 0.5) * 0.06, y + slabThick[s] / 2, Z_BOOK - 0.05],
                rotation: [0, slabYaw[s], 0],
                scale: [slabW - s * 0.06, slabThick[s], slabD - s * 0.04],
                cell: slabCell,
                resourceIndex: null,
              });
              y += slabThick[s];
            }
            // display copy leaning back on the pile, cover angled up toward the camera
            o.push({
              position: [
                x,
                rowY + pileH + (h / 2) * Math.cos(lean) + (d / 2) * Math.sin(lean),
                Z_BOOK - (h / 2) * Math.sin(lean) * 0.55,
              ],
              rotation: [-lean, (rnd() - 0.5) * 0.12, 0],
              scale: [w, h, d],
              cell,
              resourceIndex: idx,
            });
          },
        });
      } else {
        const tilt = rnd() < 0.45 ? (rnd() - 0.5) * 2 * tiltAmount : 0;
        const yaw = (rnd() - 0.5) * 0.09;
        const zJit = (rnd() - 0.5) * 0.08;
        const need = (w / 2) * Math.abs(Math.sin(tilt)) + h * Math.cos(tilt);
        if (need > clearance) {
          const k = Math.max(0.5, clearance / need);
          h *= k;
          w *= k;
          d *= k;
        }
        slots.push({
          kind: "upright",
          width: w + Math.abs(Math.sin(tilt)) * h * 0.5 + 0.05,
          emit: (x, o) => {
            o.push({
              position: [
                x,
                rowY + (w / 2) * Math.abs(Math.sin(tilt)) + (h / 2) * Math.cos(tilt),
                Z_BOOK + zJit,
              ],
              rotation: [0, yaw, tilt],
              scale: [w, h, d],
              cell,
              resourceIndex: idx,
            });
          },
        });
      }
    }

    /* --- decorative fillers so sparse rows still look furnished --- */
    let used = slots.reduce((a, s) => a + s.width, 0);
    let guard = 0;
    while (used < INNER_W * 0.62 && guard++ < 4) {
      if (rnd() < 0.55) {
        const slabCount = 2 + Math.floor(rnd() * 3);
        const slabW = 0.95 + rnd() * 0.5;
        const slabD = 0.8 + rnd() * 0.14;
        const thick: number[] = [];
        for (let s = 0; s < slabCount; s++) thick.push(0.1 + rnd() * 0.07);
        const yaws = thick.map(() => (rnd() - 0.5) * 0.26);
        slots.push({
          kind: "pile",
          width: slabW + 0.14,
          emit: (x, o) => {
            let y = rowY;
            for (let s = 0; s < slabCount; s++) {
              o.push({
                position: [x + (rnd() - 0.5) * 0.07, y + thick[s] / 2, Z_BOOK - 0.05],
                rotation: [0, yaws[s], 0],
                scale: [slabW - s * 0.05, thick[s], slabD - s * 0.03],
                cell: s % 2 === 0 ? slabCell : DECOR_CELLS.clothNavy,
                resourceIndex: null,
              });
              y += thick[s];
            }
          },
        });
      } else {
        const bh = 0.8 + rnd() * 0.35;
        slots.push({
          kind: "bookend",
          width: 0.28,
          emit: (x, o) => {
            o.push({
              position: [x, rowY + bh / 2, Z_BOOK - 0.03],
              rotation: [0, (rnd() - 0.5) * 0.08, 0],
              scale: [0.18, bh, 0.78],
              cell: DECOR_CELLS.clothDeep,
              resourceIndex: null,
            });
          },
        });
      }
      used = slots.reduce((a, s) => a + s.width, 0);
    }

    if (slots.length === 0) continue;

    /* --- uniform shrink if the row overflows (keeps covers undistorted) --- */
    const minGap = 0.06;
    const needed = used + minGap * (slots.length + 1);
    if (needed > INNER_W) {
      const k = (INNER_W - minGap * (slots.length + 1)) / used;
      const kk = Math.max(0.55, k);
      for (const s of slots) s.width *= kk;
      // scale the emitted geometry to match
      for (const s of slots) {
        const inner = s.emit;
        s.emit = (x, o) => {
          const start = o.length;
          inner(x, o);
          for (let i = start; i < o.length; i++) {
            const b = o[i];
            b.scale = [b.scale[0] * kk, b.scale[1] * kk, b.scale[2]];
            b.position = [b.position[0], rowY + (b.position[1] - rowY) * kk, b.position[2]];
          }
        };
      }
      used *= kk;
    }

    /* --- lay the row out along x according to the shelf's alignment style --- */
    const slack = INNER_W - used;
    const left = -INNER_W / 2;
    let x = left;

    if (alignment === "left") {
      const gap = Math.min(0.22, slack / (slots.length + 1));
      x += gap;
      for (const s of slots) {
        s.emit(x + s.width / 2, out);
        x += s.width + gap;
      }
    } else if (alignment === "cluster" && slots.length >= 3) {
      const split = Math.ceil(slots.length / 2);
      const bigGap = Math.min(1.1, slack * 0.45);
      const gap = (slack - bigGap) / (slots.length + 1);
      x += gap;
      slots.forEach((s, i) => {
        if (i === split) x += bigGap;
        s.emit(x + s.width / 2, out);
        x += s.width + gap;
      });
    } else {
      const gap = slack / (slots.length + 1);
      x += gap;
      for (const s of slots) {
        s.emit(x + s.width / 2, out);
        x += s.width + gap;
      }
    }
  }

  return out;
}
