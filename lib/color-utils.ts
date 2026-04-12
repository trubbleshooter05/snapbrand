/** Hex color helpers for palette validation and WCAG contrast. */

export function normalizeHex(hex: string): string | null {
  const s = hex.trim();
  const m = s.match(/^#?([0-9a-fA-F]{6})$/);
  if (!m) return null;
  return `#${m[1].toUpperCase()}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = normalizeHex(hex);
  if (!h) return null;
  const n = parseInt(h.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

/** Relative luminance 0–1 (sRGB). */
export function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const lin = [rgb.r, rgb.g, rgb.b].map((c) => {
    const x = c / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function contrastRatio(hex1: string, hex2: string): number {
  const L1 = relativeLuminance(hex1);
  const L2 = relativeLuminance(hex2);
  const light = Math.max(L1, L2);
  const dark = Math.min(L1, L2);
  return (light + 0.05) / (dark + 0.05);
}

export function formatContrastLabel(ratio: number): string {
  const r = Math.round(ratio * 10) / 10;
  const level = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "below AA";
  return `${r}:1 (${level} for normal text)`;
}

/** Rough HSL distance 0–1 for duplicate detection (10% rule ≈ 0.1 per channel scale). */
export function hexDistanceHsl(a: string, b: string): number {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  if (!A || !B) return 1;
  const toHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;
    const d = max - min;
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        default:
          h = ((r - g) / d + 4) / 6;
      }
    }
    return { h, s, l };
  };
  const ha = toHsl(A.r, A.g, A.b);
  const hb = toHsl(B.r, B.g, B.b);
  const dh = Math.min(Math.abs(ha.h - hb.h), 1 - Math.abs(ha.h - hb.h));
  return Math.sqrt(dh * dh + (ha.s - hb.s) ** 2 + (ha.l - hb.l) ** 2);
}

const TOO_CLOSE = 0.12;

export function areTooSimilar(hex1: string, hex2: string): boolean {
  return hexDistanceHsl(hex1, hex2) < TOO_CLOSE;
}

/** Nudge hex hue slightly until distinct from `against` (simple hue rotate). */
export function nudgeHue(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = (() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const l = (max + min) / 2;
    const d = max - min;
    let s = 0;
    if (d !== 0) {
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        default:
          h = ((r - g) / d + 4) / 6;
      }
    }
    return { h: h * 360, s, l };
  })();
  let newH = (hsl.h + degrees) % 360;
  if (newH < 0) newH += 360;
  const h = newH / 360;
  const { s, l } = hsl;
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  const out = `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  return normalizeHex(out) ?? hex;
}

/**
 * Ensure 5 palette entries are visually distinct; nudge duplicates in-place on kit.color_palette.
 */
export function dedupePaletteColors(kit: {
  color_palette: {
    primary: { hex: string; name: string; usage: string };
    secondary: { hex: string; name: string; usage: string };
    accent: { hex: string; name: string; usage: string };
    background: { hex: string; name: string; usage: string };
    text: { hex: string; name: string; usage: string };
  };
}): void {
  const roles = ["primary", "secondary", "accent", "background", "text"] as const;
  const palette = kit.color_palette;
  for (let i = 0; i < roles.length; i++) {
    for (let j = i + 1; j < roles.length; j++) {
      const ri = roles[i];
      const rj = roles[j];
      const hi = normalizeHex(palette[ri].hex);
      let hj = normalizeHex(palette[rj].hex);
      if (!hi || !hj) continue;
      if (areTooSimilar(hi, hj)) {
        const nudged = nudgeHue(hj, 22 * (j + 1));
        palette[rj].hex = nudged;
        hj = nudged;
      }
    }
  }
}

export function buildContrastSummary(kit: {
  color_palette: {
    primary: { hex: string };
    secondary: { hex: string };
    accent: { hex: string };
    background: { hex: string };
    text: { hex: string };
  };
}): {
  text_on_background: string;
  primary_on_background: string;
  accent_on_background: string;
  text_on_primary: string;
} {
  const p = kit.color_palette;
  const bg = normalizeHex(p.background.hex) ?? p.background.hex;
  const tx = normalizeHex(p.text.hex) ?? p.text.hex;
  const pr = normalizeHex(p.primary.hex) ?? p.primary.hex;
  const ac = normalizeHex(p.accent.hex) ?? p.accent.hex;
  return {
    text_on_background: formatContrastLabel(contrastRatio(tx, bg)),
    primary_on_background: formatContrastLabel(contrastRatio(pr, bg)),
    accent_on_background: formatContrastLabel(contrastRatio(ac, bg)),
    text_on_primary: formatContrastLabel(contrastRatio(tx, pr)),
  };
}
