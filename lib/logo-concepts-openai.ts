import OpenAI from "openai";
import { sanitizeSvg } from "@/lib/sanitize-svg";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export type LogoConceptId = "wordmark" | "icon_lockup" | "lettermark" | "abstract";

export interface LogoSvgConcept {
  id: LogoConceptId;
  label: string;
  svg: string;
}

const LOGO_SYSTEM = `You are an expert identity designer. Generate exactly 4 distinct logo concepts as clean, valid SVG markup.

Rules:
- Output ONLY valid JSON — no markdown, no backticks.
- Each concept must be visually different in STRUCTURE (not four variations of the same idea).
- Concept A (id: "wordmark"): The brand name as styled text using a heading-style treatment; integrate a small geometric symbol into or beside a letter (accent that doubles as an icon, or one letter replaced by a simple shape).
- Concept B (id: "icon_lockup"): A simple geometric icon relevant to the business, placed to the LEFT of the brand name text in the same SVG (horizontal lockup).
- Concept C (id: "lettermark"): Stylized first letter or initials with geometric treatment — NOT a letter inside a plain circle. Use negative space, overlapping shapes, or angular cuts.
- Concept D (id: "abstract"): A simple abstract geometric mark suggesting the brand idea (overlapping shapes, nodes, house outline for real estate, etc.) — may include tiny text or no text; keep readable at small sizes.

Visual rules:
- Use ONLY the hex colors provided in the user message for fills and strokes. No other colors.
- Keep paths simple: basic shapes (rect, circle, polygon, path with few commands), max ~40 elements total per SVG.
- Each SVG must use viewBox="0 0 200 60" for lockup-style layouts OR viewBox="0 0 48 48" for icon-first — prefer viewBox="0 0 200 60" for A and B, "0 0 48 48" or "0 0 64 64" for C and D if icon-heavy, but ALL must scale cleanly when displayed at 200px width and 48px height.
- No embedded raster images, no filters, no script, no foreignObject, no animation.
- Text in SVG: use <text> with font-family sans-serif or system-ui as fallback; keep copy short (brand name).

JSON shape:
{
  "concepts": [
    { "id": "wordmark", "label": "Short label", "svg": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" ...>...</svg>" },
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
  const colorBlock = `Use ONLY these colors:
- primary: ${palette.primary}
- secondary: ${palette.secondary}
- accent: ${palette.accent}
- background: ${palette.background}
- text: ${palette.text}`;

  const user = `Brand name: ${brandName}
Description: ${brandDescription}

${colorBlock}

Generate 4 distinct logo concepts as clean SVG code. Each must be visually different in structure. Use only the brand's color palette. Keep shapes simple and geometric — no complex illustrations. The SVG must render at both 48×48 (icon) and 200×60 (lockup) cleanly when scaled with CSS.`;

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
