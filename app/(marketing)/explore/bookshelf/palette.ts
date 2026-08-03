/**
 * OKLCH → sRGB.
 *
 * The whole brand system is expressed in OKLCH (`oklch(65% 0.15 <hue>)`), but
 * neither THREE.Color nor canvas2d can parse `oklch()` reliably across the
 * browsers we care about (Safari 15.x is still in the wild). So we convert by
 * hand: Oklch → Oklab → LMS → linear sRGB → gamma-encoded sRGB.
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

function gammaEncode(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Linear-light sRGB (what THREE.Color wants when you use SRGBColorSpace-aware setRGB). */
export function oklchToLinearRGB(L: number, C: number, hDeg: number): RGB {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const bb = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = L - 0.0894841775 * a - 1.291485548 * bb;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

/** Gamma-encoded sRGB in 0..1, clamped into gamut. */
export function oklchToSRGB(L: number, C: number, hDeg: number): RGB {
  const lin = oklchToLinearRGB(L, C, hDeg);
  return {
    r: clamp01(gammaEncode(lin.r)),
    g: clamp01(gammaEncode(lin.g)),
    b: clamp01(gammaEncode(lin.b)),
  };
}

/** `rgb(r g b)` string for canvas2d fills. */
export function oklchToCss(L: number, C: number, hDeg: number, alpha = 1): string {
  const { r, g, b } = oklchToSRGB(L, C, hDeg);
  const to255 = (v: number) => Math.round(v * 255);
  return alpha >= 1
    ? `rgb(${to255(r)}, ${to255(g)}, ${to255(b)})`
    : `rgba(${to255(r)}, ${to255(g)}, ${to255(b)}, ${alpha})`;
}

/** 0xRRGGBB int, for THREE.Color(hex) where the value is treated as sRGB. */
export function oklchToHex(L: number, C: number, hDeg: number): number {
  const { r, g, b } = oklchToSRGB(L, C, hDeg);
  return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255);
}

/* ------------------------------------------------------------------ */
/* Brand constants used by the 3D scene (mirrors app/globals.css @theme) */
/* ------------------------------------------------------------------ */

export const BRAND = {
  navy: { L: 0.3, C: 0.12, h: 260 },
  navyDeep: { L: 0.22, C: 0.1, h: 260 },
  navyMid: { L: 0.38, C: 0.11, h: 260 },
  orange: { L: 0.65, C: 0.15, h: 45 },
  offWhite: { L: 0.97, C: 0.005, h: 80 },
  charcoal: { L: 0.22, C: 0.005, h: 260 },
} as const;

/**
 * Shelf carcass tone. BEAU's spec: navy-tinted timber, NOT literal brown —
 * a sixth hue would break the five-colour system.
 *
 * ⚠️ SINGLE SWAPPABLE CONSTANT. Chris said "wooden shelves"; if he confirms he
 * wants real timber over BEAU's navy-tinted call, change ONLY this object
 * (a warm timber would be roughly { L: 0.40, C: 0.055, h: 62 }) and the whole
 * room re-tones consistently — nothing else references a wood colour.
 */
export const SHELF_TIMBER = { L: 0.335, C: 0.045, h: 268 };
export const SHELF_TIMBER_DARK = { L: 0.245, C: 0.04, h: 266 };

/** Per-topic accent, exactly the existing `oklch(65% 0.15 hue)` system. */
export const accentOklch = (hue: number) => ({ L: 0.65, C: 0.15, h: hue });
