// The 13 languages the backend accepts, in this order. "Other" is not an approved value.
export const APPROVED_LANGUAGES = [
  'English', 'Hindi', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu',
  'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu', 'Assamese',
] as const;

export const MIN_LANGUAGES = 1;
export const MAX_LANGUAGES = 5;

// Keeps only approved values (so an old saved "Other" is dropped), in approved order, at most 5
export function sanitizeLanguages(list: unknown): string[] {
  if (!Array.isArray(list)) return [];
  return APPROVED_LANGUAGES.filter((l) => list.includes(l)).slice(0, MAX_LANGUAGES);
}