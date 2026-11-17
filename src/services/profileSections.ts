import AsyncStorage from '@react-native-async-storage/async-storage';

export type FieldDef = { key: string; label: string; placeholder: string; icon: string; multiline?: boolean };
export type SectionDef = {
  id: string; tab: 'lifestyle' | 'family' | 'preferences';
  title: string; icon: string; desc: string; fields: FieldDef[];
};
export type SectionValues = Record<string, Record<string, string>>;

export const SECTIONS: SectionDef[] = [
  // ---- Lifestyle tab ----
  { id: 'interests', tab: 'lifestyle', title: 'Lifestyle & Interests', icon: 'leaf-outline', desc: 'Food, travel, hobbies and more', fields: [
    { key: 'food', label: 'Food', placeholder: 'For example Vegetarian', icon: 'restaurant-outline' },
    { key: 'travel', label: 'Travel', placeholder: 'For example Mountains and heritage towns', icon: 'airplane-outline' },
    { key: 'hobbies', label: 'Hobbies', placeholder: 'For example Painting, cooking', icon: 'color-palette-outline' },
    { key: 'music', label: 'Music', placeholder: 'For example Indie, classical', icon: 'musical-notes-outline' },
    { key: 'movies', label: 'Movies & Shows', placeholder: 'For example Drama, documentaries', icon: 'film-outline' },
    { key: 'fitness', label: 'Fitness', placeholder: 'For example Yoga, 4 times a week', icon: 'fitness-outline' },
  ] },
  { id: 'routine', tab: 'lifestyle', title: 'Daily Routine', icon: 'time-outline', desc: 'How your day usually looks', fields: [
    { key: 'wake', label: 'Wake up', placeholder: 'For example 6:30 AM', icon: 'sunny-outline' },
    { key: 'work', label: 'Work', placeholder: 'For example 9:30 AM to 6:00 PM', icon: 'laptop-outline' },
    { key: 'evening', label: 'Evening', placeholder: 'For example Walk, cook, read', icon: 'moon-outline' },
    { key: 'weekends', label: 'Weekends', placeholder: 'For example Family and friends', icon: 'calendar-outline' },
  ] },
  { id: 'values', tab: 'lifestyle', title: 'Values & Outlook', icon: 'compass-outline', desc: 'What matters most to you', fields: [
    { key: 'values', label: 'My values', placeholder: 'For example Honesty, respect, family-oriented', icon: 'heart-outline', multiline: true },
  ] },

  // ---- Family tab ----
  { id: 'familyBackground', tab: 'family', title: 'Family Background', icon: 'home-outline', desc: 'Your family and home', fields: [
    { key: 'father', label: 'Father', placeholder: 'For example Businessman', icon: 'man-outline' },
    { key: 'mother', label: 'Mother', placeholder: 'For example Homemaker', icon: 'woman-outline' },
    { key: 'familyType', label: 'Family type', placeholder: 'For example Nuclear family', icon: 'home-outline' },
    { key: 'siblings', label: 'Siblings', placeholder: 'For example One younger brother', icon: 'people-outline' },
    { key: 'familyValues', label: 'Family values', placeholder: 'For example Traditional with a modern outlook', icon: 'heart-outline', multiline: true },
  ] },
  { id: 'religion', tab: 'family', title: 'Religion & Caste', icon: 'flower-outline', desc: 'Only if you wish to share it', fields: [
    { key: 'religion', label: 'Religion', placeholder: 'For example Hindu', icon: 'flower-outline' },
    { key: 'caste', label: 'Caste', placeholder: 'For example Prefer not to say', icon: 'ribbon-outline' },
  ] },
  { id: 'languages', tab: 'family', title: 'Languages', icon: 'language-outline', desc: 'Languages you speak', fields: [
    { key: 'known', label: 'Known languages', placeholder: 'For example English, Hindi, Telugu', icon: 'language-outline' },
    { key: 'comfortable', label: 'Comfortable in', placeholder: 'For example English', icon: 'chatbubbles-outline' },
  ] },
  { id: 'involvement', tab: 'family', title: 'Family Involvement', icon: 'people-circle-outline', desc: 'When to involve your family', fields: [
    { key: 'involvement', label: 'Family involvement', placeholder: 'For example After mutual understanding', icon: 'people-outline' },
    { key: 'meeting', label: 'Family meeting', placeholder: 'For example Open when both are comfortable', icon: 'calendar-outline', multiline: true },
  ] },

  // ---- Preferences tab (partner preferences) ----
  { id: 'prefBasic', tab: 'preferences', title: 'Basic', icon: 'options-outline', desc: 'Age, height and location', fields: [
    { key: 'age', label: 'Age range', placeholder: 'For example 25 to 30 years', icon: 'calendar-outline' },
    { key: 'height', label: 'Height', placeholder: `For example 5'4" and above`, icon: 'resize-outline' },
    { key: 'location', label: 'Location', placeholder: 'For example Hyderabad, Bengaluru', icon: 'location-outline' },
    { key: 'marital', label: 'Marital status', placeholder: 'For example Never married', icon: 'heart-outline' },
  ] },
  { id: 'prefLifestyle', tab: 'preferences', title: 'Lifestyle', icon: 'cafe-outline', desc: 'Food, habits and interests', fields: [
    { key: 'diet', label: 'Food preference', placeholder: 'For example Vegetarian', icon: 'restaurant-outline' },
    { key: 'habits', label: 'Smoking / drinking', placeholder: 'For example Non-smoker', icon: 'leaf-outline' },
    { key: 'interests', label: 'Interests', placeholder: 'For example Travel, reading', icon: 'color-palette-outline' },
  ] },
  { id: 'prefFamily', tab: 'preferences', title: 'Family', icon: 'home-outline', desc: 'Family type and values', fields: [
    { key: 'type', label: 'Family type', placeholder: 'For example Nuclear or joint', icon: 'home-outline' },
    { key: 'values', label: 'Family values', placeholder: 'For example Traditional with a modern outlook', icon: 'heart-outline', multiline: true },
    { key: 'living', label: 'Living arrangement', placeholder: 'For example Near family', icon: 'location-outline' },
  ] },
  { id: 'prefValues', tab: 'preferences', title: 'Values & Outlook', icon: 'compass-outline', desc: 'What matters most to you', fields: [
    { key: 'outlook', label: 'Values & outlook', placeholder: 'For example Honesty and open communication', icon: 'compass-outline', multiline: true },
  ] },
  { id: 'prefAdditional', tab: 'preferences', title: 'Additional Preferences', icon: 'add-circle-outline', desc: 'Anything else you would like to add', fields: [
    { key: 'notes', label: 'Anything else', placeholder: 'For example Someone kind and supportive', icon: 'add-circle-outline', multiline: true },
  ] },
];

// Fictional starting values for the seeded demo user (Aanya). Other users start empty.
const DEMO: SectionValues = {
  interests: { food: 'Vegetarian', travel: 'Mountains and heritage towns', hobbies: 'Painting, cooking', music: 'Indie, classical', movies: 'Drama, documentaries', fitness: 'Yoga, 4 times a week' },
  routine: { wake: '6:30 AM', work: '9:30 AM to 6:00 PM', evening: 'Walk, cook, read', weekends: 'Family and friends' },
  values: { values: 'Honesty, respect, open communication, family-oriented' },
  familyBackground: { father: 'Retired engineer', mother: 'Teacher', familyType: 'Nuclear family', siblings: 'One elder sister', familyValues: 'Close-knit, respectful and open-minded' },
  religion: { religion: 'Hindu', caste: 'Prefer not to say' },
  languages: { known: 'Hindi, English, Marathi', comfortable: 'English' },
  involvement: { involvement: 'After mutual understanding', meeting: 'Open to meeting family when both are comfortable' },
  prefBasic: { age: '28 to 33 years', height: `5'8" and above`, location: 'Mumbai, Pune, Bengaluru', marital: 'Never married' },
  prefLifestyle: { diet: 'Vegetarian or eggetarian', habits: 'Non-smoker, non-drinker', interests: 'Travel, reading, music' },
  prefFamily: { type: 'Nuclear or joint', values: 'Traditional with a modern outlook', living: 'Open to living near family' },
  prefValues: { outlook: 'Honesty, respect and open communication' },
  prefAdditional: { notes: 'Someone kind, supportive and family-oriented.' },
};

// Sample partner preferences shown on another person's profile (mock)
export const MATCH_PREFERENCES: SectionValues = {
  prefBasic: { age: '25 to 30 years', height: `5'4" and above`, location: 'Hyderabad, Bengaluru, Pune', marital: 'Never married' },
  prefLifestyle: { diet: 'Vegetarian or eggetarian', habits: 'Non-smoker, non-drinker', interests: 'Travel, reading, music' },
  prefFamily: { type: 'Nuclear or joint', values: 'Traditional with a modern outlook', living: 'Open to living near family' },
  prefValues: { outlook: 'Honesty, respect and open communication' },
  prefAdditional: { notes: 'Someone kind, supportive and family-oriented.' },
};

// Saved per user on the phone (demo). The real backend will use GET and PATCH /me/preferences/{section}.
const keyFor = (userId: string) => `setu_sections:${userId}`;

export async function getSectionValues(userId: string): Promise<SectionValues> {
  const base = userId === 'u_aanya' ? DEMO : {};
  let saved: SectionValues = {};
  try {
    const raw = await AsyncStorage.getItem(keyFor(userId));
    saved = raw ? JSON.parse(raw) : {};
  } catch { /* use the defaults */ }
  const out: SectionValues = {};
  for (const s of SECTIONS) out[s.id] = { ...(base[s.id] ?? {}), ...(saved[s.id] ?? {}) };
  return out;
}

export async function saveSection(userId: string, sectionId: string, values: Record<string, string>): Promise<void> {
  let saved: SectionValues = {};
  try {
    const raw = await AsyncStorage.getItem(keyFor(userId));
    saved = raw ? JSON.parse(raw) : {};
  } catch { /* start fresh */ }
  saved[sectionId] = values;
  await AsyncStorage.setItem(keyFor(userId), JSON.stringify(saved));
}