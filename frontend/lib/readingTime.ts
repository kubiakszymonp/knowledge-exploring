/** Typical adult reading speed (words per minute) for estimating reading time. */
export const DEFAULT_WORDS_PER_MINUTE = 200;

/**
 * Estimates reading time in minutes for a given text.
 * @param text - Plain text content
 * @param wpm - Words per minute (default: DEFAULT_WORDS_PER_MINUTE)
 * @returns Estimated minutes to read
 */
export function estimateMinutesForText(
  text: string,
  wpm: number = DEFAULT_WORDS_PER_MINUTE
): number {
  if (!text.trim()) return 0;
  const words = text.trim().split(/\s+/).length;
  return words / wpm;
}
