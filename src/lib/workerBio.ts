const RATE_PREFIX_REGEX = /^Starting Rate:\s*(.+?)(?:\r?\n\r?\n|\r?\n|$)/i;

export function parseWorkerBio(rawBio?: string | null): {
  visitingCharge: string | null;
  cleanBio: string;
} {
  if (!rawBio) {
    return { visitingCharge: null, cleanBio: "" };
  }

  const trimmed = rawBio.trim();
  const match = trimmed.match(RATE_PREFIX_REGEX);
  if (!match) {
    return { visitingCharge: null, cleanBio: trimmed };
  }

  const visitingCharge = match[1].trim() || null;
  const cleanBio = trimmed.slice(match[0].length).trim();
  return { visitingCharge, cleanBio };
}

export function composeWorkerBio(
  rawBio?: string | null,
  visitingCharge?: string | null
): string | null {
  const { cleanBio } = parseWorkerBio(rawBio);
  const cleanRate = visitingCharge?.replace(/[\r\n]+/g, " ").trim().slice(0, 50) || "";

  if (!cleanRate && !cleanBio) return null;
  if (!cleanRate) return cleanBio;
  if (!cleanBio) return `Starting Rate: ${cleanRate}`;
  return `Starting Rate: ${cleanRate}\n\n${cleanBio}`;
}
