/**
 * Strip dangerous patterns from AI-generated SVG before rendering or storing.
 * Not a full XML sanitizer — blocks common XSS vectors in inline SVG.
 */
export function sanitizeSvg(svg: string): string {
  if (!svg || typeof svg !== "string") return "";
  let out = svg;
  // Remove script and event handlers
  out = out.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  out = out.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
  out = out.replace(/\s+on\w+\s*=\s*[^\s>]+/gi, "");
  out = out.replace(/javascript:/gi, "");
  out = out.replace(/<foreignObject\b/gi, "<g data-removed-foreignObject ");
  return out.trim();
}
