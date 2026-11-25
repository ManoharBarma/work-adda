const ALLOWED_DATA_IMAGE_PREFIX = /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/;

export function sanitizeImageUrl(
  input?: string | null,
  maxLength = 300_000
): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > maxLength) return null;

  if (ALLOWED_DATA_IMAGE_PREFIX.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function sanitizeWorkPhotos(
  inputs: FormDataEntryValue[],
  maxCount = 3
): string[] {
  const valid: string[] = [];
  for (const item of inputs) {
    if (typeof item !== "string") continue;
    const clean = sanitizeImageUrl(item);
    if (clean) {
      valid.push(clean);
      if (valid.length >= maxCount) break;
    }
  }
  return valid;
}
