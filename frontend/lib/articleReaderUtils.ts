/**
 * Single source of truth for splitting article text into paragraphs and sentences.
 * Used by ArticleReaderContext (TTS) and ArticleSection (render/highlight).
 */

/**
 * Splits text into paragraphs (by double newline), then each paragraph into sentences
 * (by . ! ?). Returns paragraphs as arrays of sentence strings.
 */
export function splitParagraphsIntoSentences(text: string): string[][] {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((paragraph) => splitIntoSentences(paragraph));
}

/**
 * Splits a single paragraph into sentences. Uses regex on sentence-ending punctuation.
 * Simple approach; may split on abbreviations (e.g. "np.") – can be refined later.
 */
function splitIntoSentences(paragraph: string): string[] {
  if (!paragraph.trim()) return [];
  const parts = paragraph.split(/([.!?]+\s*)/);
  const sentences: string[] = [];
  let current = "";
  for (let i = 0; i < parts.length; i++) {
    current += parts[i];
    if (/[.!?]+\s*$/.test(parts[i] ?? "")) {
      const trimmed = current.trim();
      if (trimmed) sentences.push(trimmed);
      current = "";
    }
  }
  if (current.trim()) sentences.push(current.trim());
  return sentences;
}

/**
 * Flattens paragraphs-of-sentences into a single array (for TTS order).
 */
export function flattenSentences(paragraphsSentences: string[][]): string[] {
  return paragraphsSentences.flat();
}
