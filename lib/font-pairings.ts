/**
 * Curated Google Font pairings — GPT selects `id`; we resolve fonts server-side
 * so outputs stay on-brand and off default Playfair+Lato combos.
 */

export interface FontPairing {
  id: string;
  label: string;
  heading_font: string;
  body_font: string;
  heading_weight: string;
  body_weight: string;
}

export const FONT_PAIRINGS = [
  {
    id: "luxury-elegant",
    label: "Luxury / editorial serif + refined sans",
    heading_font: "Cormorant Garamond",
    body_font: "Outfit",
    heading_weight: "600",
    body_weight: "400",
  },
  {
    id: "modern-tech",
    label: "Modern tech — geometric + neutral UI",
    heading_font: "Space Grotesk",
    body_font: "Inter",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "creative-bold",
    label: "Creative / bold display + readable sans",
    heading_font: "Bebas Neue",
    body_font: "Barlow",
    heading_weight: "400",
    body_weight: "400",
  },
  {
    id: "warm-friendly",
    label: "Warm / friendly soft serif + humanist sans",
    heading_font: "Fraunces",
    body_font: "Commissioner",
    heading_weight: "600",
    body_weight: "400",
  },
  {
    id: "clean-minimal",
    label: "Clean minimal geometric sans pair",
    heading_font: "Plus Jakarta Sans",
    body_font: "IBM Plex Sans",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "editorial",
    label: "Editorial classic serif + workhorse sans",
    heading_font: "DM Serif Display",
    body_font: "DM Sans",
    heading_weight: "400",
    body_weight: "400",
  },
  {
    id: "startup",
    label: "Startup — confident rounded + neutral",
    heading_font: "Syne",
    body_font: "Nunito Sans",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "premium-craft",
    label: "Premium craft — readable serif + warm sans",
    heading_font: "Libre Baskerville",
    body_font: "Karla",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "saas-friendly",
    label: "SaaS — approachable grotesk pair",
    heading_font: "Manrope",
    body_font: "Source Sans 3",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "minimal-urban",
    label: "Minimal / urban geometric",
    heading_font: "Urbanist",
    body_font: "Work Sans",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "expressive-serif",
    label: "Expressive serif + calm sans",
    heading_font: "Lora",
    body_font: "Mulish",
    heading_weight: "600",
    body_weight: "400",
  },
  {
    id: "product-ui",
    label: "Product UI — sharp grotesk + legible body",
    heading_font: "Outfit",
    body_font: "DM Sans",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "soft-modern",
    label: "Soft modern — rounded + crisp",
    heading_font: "Figtree",
    body_font: "Inter",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "confident-condensed",
    label: "Confident condensed + airy body",
    heading_font: "Oswald",
    body_font: "Raleway",
    heading_weight: "600",
    body_weight: "400",
  },
  {
    id: "trustworthy-corporate",
    label: "Trustworthy — serif trust + sans clarity",
    heading_font: "Merriweather",
    body_font: "Source Sans 3",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "playful-rounded",
    label: "Playful rounded sans pair",
    heading_font: "Quicksand",
    body_font: "Nunito",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "sleek-dark",
    label: "Sleek dark-mode friendly",
    heading_font: "Sora",
    body_font: "Inter",
    heading_weight: "700",
    body_weight: "400",
  },
  {
    id: "heritage",
    label: "Heritage / established business",
    heading_font: "Libre Baskerville",
    body_font: "Lato",
    heading_weight: "700",
    body_weight: "400",
  },
] as const satisfies readonly FontPairing[];

export type FontPairingId = (typeof FONT_PAIRINGS)[number]["id"];

const byId = new Map<string, FontPairing>(
  FONT_PAIRINGS.map((p) => [p.id, { ...p }] as [string, FontPairing])
);

export function getFontPairingById(id: string | undefined): FontPairing | undefined {
  if (!id) return undefined;
  return byId.get(id);
}

/** Short block for the GPT system prompt. */
export function fontPairingsPromptBlock(): string {
  return FONT_PAIRINGS.map(
    (p) =>
      `- "${p.id}": ${p.label} — heading "${p.heading_font}", body "${p.body_font}" (weights ${p.heading_weight} / ${p.body_weight})`
  ).join("\n");
}

export interface TypographyPartial {
  font_pairing_id?: string;
  heading_font?: string;
  body_font?: string;
  heading_weight?: string;
  body_weight?: string;
}

/** Apply curated fonts when `font_pairing_id` matches; otherwise default to modern-tech. */
export function resolveFontPairing(typography: TypographyPartial): Required<
  Pick<TypographyPartial, "heading_font" | "body_font" | "heading_weight" | "body_weight">
> & { font_pairing_id: string } {
  const chosen = getFontPairingById(typography.font_pairing_id) ?? getFontPairingById("modern-tech")!;
  return {
    font_pairing_id: chosen.id,
    heading_font: chosen.heading_font,
    body_font: chosen.body_font,
    heading_weight: chosen.heading_weight,
    body_weight: chosen.body_weight,
  };
}
