
/**
 * Converts a string to sentence case (capitalizes the first letter).
 * Preserves the rest of the string as-is to avoid messing up proper nouns.
 * 
 * @param text The string to format
 * @returns The formatted string
 */
export const toSentenceCase = (text: string): string => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
};
