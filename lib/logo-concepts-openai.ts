import OpenAI from "openai";
import { sanitizeSvg } from "@/lib/sanitize-svg";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type LogoConceptId = "wordmark" | "icon_lockup" | "lettermark" | "abstract";

export interface LogoSvgConcept {
  id: LogoConceptId;
  label: string;
  svg: string;
}

/** Maps each concept slot to a fixed Design Movement (Phase 3 — Creative Director). */
export const CONCEPT_MOVEMENT: Record<
  LogoConceptId,
  { movement: string; oneLiner: string }
> = {
  wordmark: {
    movement: "Swiss Minimalist",
    oneLiner:
      "Geometric precision, generous negative space, clean sans-serif typography — grid-aware, restrained, no decoration for its own sake.",
  },
  icon_lockup: {
    movement: "Modern Luxury",
    oneLiner:
      "High contrast, elegant serif-leaning typography, sophisticated thin-line secondary forms — quiet confidence, not loud gloss.",
  },
  lettermark: {
    movement: "Tech-Geometric",
    oneLiner:
      "Bold, futuristic structure — thick consistent strokes, clear digital geometry, modular rhythm (no skeuomorphic metaphors).",
  },
  abstract: {
    movement: "Organic Minimalist",
    oneLiner:
      "Soft, flowing contours — natural proportions, calm balance, breathing room; suggest life without literal nature clipart.",
  },
};

/**
 * Inner “safe” content box for wordmark text (before 20% viewBox margin).
 * Wider glyphs for long names; tuned to reduce horizontal clipping.
 */
export function computeWordmarkInnerWidth(charCount: number): number {
  const base = Math.max(120, charCount * 17 + 56);
  return Math.min(560, base);
}

export function computeWordmarkInnerHeight(): number {
  return 72;
}

/**
 * Expand inner content dimensions so the final viewBox includes ~20% padding
 * on each axis (content should sit in the central ~80% × 80% — the “safety zone”).
 */
export function viewBoxWithSafetyPadding(innerW: number, innerH: number): { w: number; h: number } {
  const w = Math.ceil(innerW / 0.8);
  const h = Math.ceil(innerH / 0.8);
  return { w, h };
}

const LOGO_SYSTEM = `You are a senior creative director and identity designer. You design original BRAND MARKS — not clipart, not generic app icons, not stock pictograms.

Your job: generate exactly 4 distinct logo concepts as clean, valid SVG. Each concept is locked to ONE of four named Design Movements (see mapping below). The four must differ in STRUCTURE and DESIGN LANGUAGE — not four cosmetic tweaks of the same idea.

## Design Movement → concept id (STRICT)
1) id "wordmark" — SWISS MINIMALIST: Geometric precision, heavy negative space, clean sans-serif wordmark. Typography-led; optional tiny geometric accent integrated into a letterform (not a separate cute icon).
2) id "icon_lockup" — MODERN LUXURY: Horizontal lockup — refined wordmark + a thin-line or ultra-light companion mark to the LEFT. High contrast; serif or high-end hybrid typography feel; sophistication over playfulness.
3) id "lettermark" — TECH-GEOMETRIC: Initials / monogram only — bold, modular, futuristic geometry; thick CONSISTENT stroke weights; grid-like structure; digital-native (no organic blobs here).
4) id "abstract" — ORGANIC MINIMALIST: Abstract brand mark — soft curves, natural proportions, calm balance; minimal nodes; readable at small sizes. No literal trees, leaves, houses, or stock symbols.

## Anti-clipart / anti-generic icon rules (MANDATORY)
- Do NOT output generic “iconography” (lightbulbs, rockets, globes, chat bubbles, shields, stars-as-default, etc.) unless the brand description explicitly demands that metaphor — and even then, abstract it into a MARK, not an illustration.
- Prefer intentional stroke weight systems, clear kerning rhythm, and negative-space decisions over filling the canvas with symbols.
- Every shape should look like it could belong to ONE brand system — consistent corner language, stroke caps, and spacing.

## Safety zone (MANDATORY — prevents edge clipping)
- The final SVG must use a viewBox that includes ~20% EMPTY BUFFER on all sides around the entire mark (padding inside the viewBox). Practically: all geometry and text must sit within the central ~80% × ~80% of the viewBox, centered. No element may touch or bleed to viewBox edges.
- Do not crop strokes, serifs, or descenders at the viewBox boundary.

## Wordmark width / text cutoff (MANDATORY)
- For any <text> wordmark or lockup containing the full brand name: use text-anchor="start" or "middle" consistently; set x/y so the full string is visible.
- The USER message may include REQUIRED minimum viewBox width for the brand name — you MUST use at least that width for any SVG that contains the full brand name as text (or scale text down to fit inside the inner 80% safe area with buffer).

## Visual / technical
- Use ONLY the hex colors provided in the user message for fills and strokes. No other colors.
- Keep paths tractable: rects, circles, paths with few commands — target ≤ ~45 elements per SVG.
- No embedded raster images, filters, script, foreignObject, or animation.

## Output
- Output ONLY valid JSON — no markdown, no backticks.

JSON shape:
{
  "concepts": [
    { "id": "wordmark", "label": "Short label (include movement name)", "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"...\\">...</svg>" },
    { "id": "icon_lockup", "label": "...", "svg": "..." },
    { "id": "lettermark", "label": "...", "svg": "..." },
    { "id": "abstract", "label": "...", "svg": "..." }
  ]
}`;

export interface PaletteForLogos {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

export async function generateLogoSvgConcepts(params: {
  brandName: string;
  brandDescription: string;
  palette: PaletteForLogos;
}): Promise<LogoSvgConcept[]> {
  const { brandName, brandDescription, palette } = params;
  const charCount = brandName.length;

  const innerW = computeWordmarkInnerWidth(charCount);
  const innerH = computeWordmarkInnerHeight();
  const { w: vbWFullName, h: vbHText } = viewBoxWithSafetyPadding(innerW, innerH);

  /** Square-ish marks: inner box then pad (lettermark / abstract often ~96–120 inner) */
  const innerSquare = 112;
  const { w: vbSquare, h: vbSquareH } = viewBoxWithSafetyPadding(innerSquare, innerSquare);

  const colorBlock = `Use ONLY these colors:
- primary: ${palette.primary}
- secondary: ${palette.secondary}
- accent: ${palette.accent}
- background: ${palette.background}
- text: ${palette.text}`;

  const movementBlock = Object.entries(CONCEPT_MOVEMENT)
    .map(
      ([id, { movement, oneLiner }]) =>
        `- ${id} → ${movement}: ${oneLiner}`,
    )
    .join("\n");

  const user = `Brand name: ${brandName}
Brand name character count: ${charCount} (use for spacing / kerning decisions)
Description: ${brandDescription}

${colorBlock}

## Design movements (one per concept id)
${movementBlock}

## Required viewBox math (wordmarks & any SVG containing the FULL brand name as text)
- Inner safe content width for full brand name (before 20% safety padding): at least ${innerW}px wide × ${innerH}px tall.
- With ~20% safety padding on all sides, the MINIMUM viewBox for those SVGs is: width ≥ ${vbWFullName}, height ≥ ${vbHText}.
- For lettermark (initials only) and abstract marks (no full name, or initials only): use a square viewBox at least ${vbSquare} × ${vbSquareH} unless the mark is wider — still respect the 20% buffer rule.

## Execution
Generate 4 distinct logo concepts following the movement mapping exactly. Labels should name the movement (e.g. "Swiss Minimalist — …"). Apply anti-clipart rules and keep all artwork inside the central safe zone within the viewBox.`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: LOGO_SYSTEM },
      { role: "user", content: user },
    ],
    temperature: 0.85,
    max_tokens: 12000,
    response_format: { type: "json_object" },
  });

  const raw = res.choices[0]?.message?.content;
  if (!raw) return [];

  let parsed: { concepts?: Array<{ id?: string; label?: string; svg?: string }> };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  const allowed: LogoConceptId[] = ["wordmark", "icon_lockup", "lettermark", "abstract"];
  const out: LogoSvgConcept[] = [];
  for (const c of parsed.concepts ?? []) {
    const id = c.id as LogoConceptId;
    if (!c.svg || !allowed.includes(id)) continue;
    out.push({
      id,
      label: typeof c.label === "string" ? c.label : id,
      svg: sanitizeSvg(c.svg),
    });
  }

  return out.slice(0, 4);
}
