export function normalizeHeader(header: string) {
  return header
    ?.toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/[ÁÀ]/g, "A")
    .replace(/[ÉÈ]/g, "E")
    .replace(/[ÍÌ]/g, "I")
    .replace(/[ÓÒ]/g, "O")
    .replace(/[ÚÙ]/g, "U");
}
