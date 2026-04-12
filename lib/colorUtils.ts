/**
 * System-level color & contrast rules for brand output.
 * WCAG AA minimum 4.5:1 for normal text on dynamic backgrounds.
 */

export const READABLE_LIGHT_TEXT = "#FFFFFF";
export const READABLE_DARK_TEXT = "#0A0A0F";
export const ENFORCED_LIGHT_BG = "#F8F8F8";
export const ENFORCED_DARK_TEXT = "#0A0A0F";

/** Safe fallback when AI palette fails contrast checks. */
export const SAFE_BRAND_PALETTE = {
  primary: "#4F46E5",
  secondary: "#06B6D4",
  accent: "#F59E0B",
  background: "#F8F8F8",
  text: "#0A0A0F",
} as const;

const AA_NORMAL = 4.5;
const LIGHT_BG_LUM_THRESHOLD = 0.55;
const DARK_TEXT_LUM_MAX = 0.35;

function parseRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.trim().match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function normalizeHexInput(hex: string): string | null {
  const m = hex.trim().match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  return `#${m[1].toUpperCase()}`;
}

/** WCAG relative luminance 0–1 (sRGB). */
export function getLuminance(hex: string): number {
  const rgb = parseRgb(hex);
  if (!rgb) return 0;
  const lin = [rgb.r, rgb.g, rgb.b].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const L1 = getLuminance(hex1);
  const L2 = getLuminance(hex2);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

export function isLightColor(hex: string): boolean {
  const n = normalizeHexInput(hex);
  if (!n) return true;
  return getLuminance(n) >= LIGHT_BG_LUM_THRESHOLD;
}

/**
 * Readable text on `backgroundHex`: only white or near-black, WCAG-AA when possible.
 */
export function getReadableTextColor(backgroundHex: string): typeof READABLE_LIGHT_TEXT | typeof READABLE_DARK_TEXT {
  const bg = normalizeHexInput(backgroundHex) ?? "#808080";
  const cw = getContrastRatio(bg, READABLE_LIGHT_TEXT);
  const cd = getContrastRatio(bg, READABLE_DARK_TEXT);
  if (cw >= AA_NORMAL && cd < AA_NORMAL) return READABLE_LIGHT_TEXT;
  if (cd >= AA_NORMAL && cw < AA_NORMAL) return READABLE_DARK_TEXT;
  if (cw >= AA_NORMAL && cd >= AA_NORMAL) {
    return isLightColor(bg) ? READABLE_DARK_TEXT : READABLE_LIGHT_TEXT;
  }
  return cw >= cd ? READABLE_LIGHT_TEXT : READABLE_DARK_TEXT;
}

/** Default page canvas behind translucent UI panels (SnapBrand shell). */
export const PANEL_UNDERLAY_HEX = "#0A0A0F";

function blendRgbOverHex(
  r: number,
  g: number,
  b: number,
  alpha: number,
  underHex: string,
): string {
  const u = parseRgb(underHex);
  if (!u) return underHex;
  const a = Math.min(1, Math.max(0, alpha));
  const mix = (x: number, y: number) => Math.round(x * a + y * (1 - a));
  const R = mix(r, u.r);
  const G = mix(g, u.g);
  const B = mix(b, u.b);
  return `#${[R, G, B]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

/**
 * Turn a panel `background` (hex or `rgba(...)`) into a solid hex for contrast math.
 * Translucent panels are alpha-blended over {@link PANEL_UNDERLAY_HEX}.
 */
export function resolvePanelBackgroundHex(
  background: string,
  underlayHex: string = PANEL_UNDERLAY_HEX,
): string {
  const trimmed = background.trim();
  const hex = normalizeHexInput(trimmed);
  if (hex) return hex;
  const m = trimmed.match(
    /rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/,
  );
  if (m) {
    const r = Math.min(255, Math.max(0, parseInt(m[1], 10)));
    const g = Math.min(255, Math.max(0, parseInt(m[2], 10)));
    const b = Math.min(255, Math.max(0, parseInt(m[3], 10)));
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    return blendRgbOverHex(r, g, b, a, underlayHex);
  }
  return underlayHex;
}

/** Readable text on arbitrary panel backgrounds including translucent `rgba`. */
export function getReadableTextColorAny(background: string): typeof READABLE_LIGHT_TEXT | typeof READABLE_DARK_TEXT {
  return getReadableTextColor(resolvePanelBackgroundHex(background));
}

/**
 * Use a brand color as foreground on a panel only if contrast is sufficient; otherwise readable neutral.
 */
export function getBrandColorOnPanel(
  brandHex: string,
  panelBackground: string,
  minRatio = 3,
): string {
  const panel = resolvePanelBackgroundHex(panelBackground);
  const b = normalizeHexInput(brandHex) ?? brandHex;
  if (getContrastRatio(panel, b) >= minRatio) return b;
  return getReadableTextColor(panel);
}

/** Darken a hex toward black (for hover states). */
export function darkenHex(hex: string, amount = 0.12): string {
  const rgb = parseRgb(hex);
  if (!rgb) return hex;
  const f = (c: number) => Math.max(0, Math.round(c * (1 - amount)));
  return `#${[f(rgb.r), f(rgb.g), f(rgb.b)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("")}`.toUpperCase();
}

type PaletteRow = { hex: string; name: string; usage: string };

export type KitColorPalette = {
  primary: PaletteRow;
  secondary: PaletteRow;
  accent: PaletteRow;
  background: PaletteRow;
  text: PaletteRow;
};

function assignSafe(p: KitColorPalette): void {
  p.primary.hex = SAFE_BRAND_PALETTE.primary;
  p.secondary.hex = SAFE_BRAND_PALETTE.secondary;
  p.accent.hex = SAFE_BRAND_PALETTE.accent;
  p.background.hex = SAFE_BRAND_PALETTE.background;
  p.text.hex = SAFE_BRAND_PALETTE.text;
}

/**
 * Clamp AI “light” / “dark” roles, then verify WCAG. If still broken, apply {@link SAFE_BRAND_PALETTE}.
 */
export function normalizeAndEnforcePalette(p: KitColorPalette): void {
  const roles = ["primary", "secondary", "accent", "background", "text"] as const;
  for (const r of roles) {
    const n = normalizeHexInput(p[r].hex);
    if (n) p[r].hex = n;
  }

  if (getLuminance(p.background.hex) < LIGHT_BG_LUM_THRESHOLD) {
    p.background.hex = ENFORCED_LIGHT_BG;
  }
  if (getLuminance(p.text.hex) > DARK_TEXT_LUM_MAX) {
    p.text.hex = ENFORCED_DARK_TEXT;
  }

  if (!paletteMeetsMinimumContrast(p)) {
    assignSafe(p);
  }
}

export function paletteMeetsMinimumContrast(p: KitColorPalette): boolean {
  const bg = p.background.hex;
  const tx = p.text.hex;
  const pr = p.primary.hex;
  const ac = p.accent.hex;

  if (getContrastRatio(tx, bg) < AA_NORMAL) return false;
  if (getContrastRatio(pr, getReadableTextColor(pr)) < AA_NORMAL) return false;
  if (getContrastRatio(ac, getReadableTextColor(ac)) < AA_NORMAL) return false;
  return true;
}
