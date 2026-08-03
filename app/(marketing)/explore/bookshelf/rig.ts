import { SHELF_H, type RoomProfile } from "./shelf-layout";

/**
 * Scroll → camera math, shared by the WebGL rig and the DOM HUD so the big
 * topic title and the camera turn are driven by exactly the same number.
 */

export const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);

export const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

export interface RigState {
  /** index of the shelf currently being dwelled on / turned away from */
  index: number;
  /** 0..1 position within this shelf's scroll segment */
  u: number;
  /** eased 0..1 turn toward the NEXT shelf */
  turn: number;
  /** continuous shelf position; yaw = shelfFloat * (2π / N) */
  shelfFloat: number;
  /** 1 at the moment a shelf lands, decaying to 0 — drives the reveal beat */
  reveal: number;
  /** 0 at rest, 1 mid-turn — drives dolly-out and the light sweep */
  motion: number;
}

/** Fraction of a segment spent dwelling before the camera starts to turn. */
const DWELL = 0.34;
const TURN_SPAN = 0.46;

export function rigState(progress: number, count: number): RigState {
  const p = clamp(progress, 0, 1);
  const raw = p * count;
  let index = Math.floor(raw);
  if (index >= count) index = count - 1;
  const u = clamp(raw - index, 0, 1);

  // The final segment never turns — the scroll ends resting on the last shelf
  // instead of spinning back past the first one.
  const isLast = index >= count - 1;
  const turn = isLast ? 0 : smootherstep(clamp((u - DWELL) / TURN_SPAN, 0, 1));

  return {
    index,
    u,
    turn,
    shelfFloat: index + turn,
    reveal: 1 - smoothstep(0, 0.26, u),
    motion: Math.sin(Math.PI * turn),
  };
}

/** Which shelf the HUD should name right now. */
export function activeShelf(state: RigState, count: number): number {
  return state.turn > 0.5 ? Math.min(state.index + 1, count - 1) : state.index;
}

/**
 * How far the camera may creep out from the room's centre toward the active
 * shelf. Derived from the real frustum so a portrait phone gets closer than a
 * wide desktop and both see the whole carcass.
 */
export function framingDolly(profile: RoomProfile, aspect: number): number {
  const vHalf = (profile.fov * Math.PI) / 360;
  const tanV = Math.tan(vHalf);
  const tanH = tanV * Math.max(aspect, 0.28);

  // vertical margin has to clear the engraved end-label plate that floats above
  // the carcass, not just the carcass itself
  const needV = (SHELF_H / 2 + 1.05) / tanV;
  const needH = (profile.shelfW / 2 + 0.3) / tanH;
  const need = Math.max(needV, needH);

  return clamp(profile.radius - need, 0, profile.radius * 0.55);
}
