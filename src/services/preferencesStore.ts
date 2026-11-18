import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, USE_MOCK } from './api';

export const AGE_MIN = 18;
export const AGE_MAX = 60;

// heights from 4'6" to 6'6"
const heights: string[] = [];
for (let ft = 4; ft <= 6; ft++) {
  for (let inch = 0; inch < 12; inch++) {
    if (ft === 4 && inch < 6) continue;
    if (ft === 6 && inch > 6) break;
    heights.push(`${ft}'${inch}" or above`);
  }
}
export const HEIGHTS = ['Any', ...heights];

export const LOCATION_OPTIONS = ['Open (India / Abroad)', 'Prefer specific cities', 'Same city only'];
export const CITIES = [
  'Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Pune', 'Delhi NCR', 'Kolkata', 'Ahmedabad',
  'Jaipur', 'Kochi', 'Visakhapatnam', 'Vijayawada', 'Coimbatore', 'Lucknow', 'Chandigarh', 'Indore',
];
export const EDUCATION = ['Any', 'High school or above', 'Diploma or above', 'Graduate or above', 'Post-graduate or above', 'Doctorate'];
export const PROFESSIONS = ['Any', 'Working Professional', 'Business Owner', 'Government Service', 'Self-employed', 'Doctor / Healthcare', 'Student', 'Not working'];
export const WORK_MODES = ['Any', 'On-site', 'Remote', 'Hybrid', 'Prefer not to say'];
export const MARITAL = ['Any', 'Never married', 'Divorced', 'Widowed', 'Awaiting divorce'];

// ---- Values & Outlook (Figma: "Values & Outlook" screen) ----
export const LIFE_GOALS = ['Career growth', 'Family first', 'Travel & experiences', 'Entrepreneurship', 'Higher studies', 'Balanced life', 'Any'];
export const FINANCIAL_OUTLOOKS = ['Financially stable', 'Saver', 'Investor', 'Flexible with money', 'Any'];
export const BELIEFS = ['Any', 'Religious', 'Spiritual', 'Non-religious', 'Respects all faiths'];
export const PERSONALITY_OPTIONS = ['Any', 'Kind, respectful', 'Calm, thoughtful', 'Humorous, easygoing', 'Ambitious, driven', 'Open-minded, independent', 'Family-minded, caring'];
export const EMOTIONAL_MATURITY = ['Very important', 'Important', 'Somewhat important', 'Not a priority'];

// ---- Additional Preferences (Figma: "Additional Preferences" screen) ----
export const LANGUAGES = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Urdu'];
export const WORK_LOCATIONS = ['Open (India / Abroad)', 'India only', 'Abroad only', 'Same city only'];
export const RELOCATION = ['Open', 'Within India only', 'Not open'];
export const PARTNER_LIFESTYLE = ['Supportive', 'Family-oriented', 'Career-focused', 'Adventurous', 'Homely', 'Social'];
export const ANYTHING_ELSE_OPTIONS = ['Not specified', 'No dealbreakers', 'Prefer non-smoker', 'Prefer vegetarian'];

export type BasicPrefs = {
  ageMin: number; ageMax: number; height: string; locationPref: string; cities: string[];
  education: string; profession: string; workMode: string; maritalStatus: string;
};
export type LifestylePrefs = { food: string; smoking: string; drinking: string; fitness: string; travel: string; hobbies: string[] };
export type FamilyPrefs = { familyType: string; caste: string; familyLocation: string; familyValues: string; familyInvolvement: string };
export type ValuesPrefs = {
  lifeGoals: string; financialOutlook: string; beliefs: string; personality: string; emotionalMaturity: string;
};
export type AdditionalPrefs = {
  languages: string[]; workLocation: string; relocation: string; partnerLifestyle: string[]; anythingElse: string;
};
export type Preferences = {
  basic: BasicPrefs; lifestyle: LifestylePrefs; family: FamilyPrefs; values: ValuesPrefs; additional: AdditionalPrefs;
};
export type PrefSection = keyof Preferences;

// Starting values are the ones shown in the Figma
export const DEFAULTS: Preferences = {
  basic: {
    ageMin: 26, ageMax: 32, height: `5'5" or above`, locationPref: 'Open (India / Abroad)', cities: [],
    education: 'Graduate or above', profession: 'Working Professional', workMode: 'Any', maritalStatus: 'Never married',
  },
  lifestyle: { food: 'Any', smoking: 'No', drinking: 'Occasionally', fitness: 'Active lifestyle', travel: 'Loves travel', hobbies: ['Any'] },
  family: {
    familyType: 'Nuclear Family', caste: 'Any', familyLocation: 'Open (India / Abroad)',
    familyValues: 'Traditional with modern outlook', familyInvolvement: 'After mutual understanding',
  },
  values: {
    lifeGoals: 'Career growth', financialOutlook: 'Financially stable', beliefs: 'Any',
    personality: 'Kind, respectful', emotionalMaturity: 'Important',
  },
  additional: {
    languages: ['English', 'Telugu'], workLocation: 'Open (India / Abroad)', relocation: 'Open',
    partnerLifestyle: ['Supportive', 'Family-oriented'], anythingElse: 'Not specified',
  },
};

export const SECTIONS: PrefSection[] = ['basic', 'lifestyle', 'family', 'values', 'additional'];
const keyFor = (userId: string) => `setu_preferences:${userId}`;

async function readLocal(userId: string): Promise<Partial<Preferences>> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {}; // use the defaults
  }
}

// Mock mode keeps the answers on the phone. Real mode uses GET and PATCH /me/preferences/{section} from the contract.
// If a section endpoint doesn't exist yet (404 etc.), that section falls back to DEFAULTS.
export async function getPreferences(userId: string): Promise<Preferences> {
  let saved: Partial<Preferences> = {};
  if (USE_MOCK) {
    saved = await readLocal(userId);
  } else {
    const results = await Promise.all(
      SECTIONS.map((s) => request<any>(`/me/preferences/${s}`).catch(() => ({})))
    );
    saved = Object.fromEntries(SECTIONS.map((s, i) => [s, results[i]])) as Partial<Preferences>;
  }
  // Merge saved values over defaults, section by section
  return Object.fromEntries(
    SECTIONS.map((s) => [s, { ...DEFAULTS[s], ...(saved[s] ?? {}) }])
  ) as Preferences;
}

export async function savePreferences<S extends PrefSection>(userId: string, section: S, values: Preferences[S]): Promise<void> {
  if (USE_MOCK) {
    const saved: any = await readLocal(userId);
    saved[section] = values;
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(saved));
    return;
  }
  await request(`/me/preferences/${section}`, { method: 'PATCH', body: JSON.stringify(values) });
}

// ---- Review Preferences screen ----
export type ReviewRow = { label: string; value: string; section: PrefSection };

const lower = (xs: string[]) => xs.map((x, i) => (i === 0 ? x : x.toLowerCase()));
const list = (xs: string[]) => (xs.length ? lower(xs).join(', ') : 'Any');

// One row per line in the Figma "Review Preferences" screen. `section` tells the pencil icon which editor to open.
export function getReviewRows(p: Preferences): ReviewRow[] {
  const { basic: b, lifestyle: l, family: f, values: v, additional: a } = p;
  return [
    { label: 'Age Range', value: `${b.ageMin} – ${b.ageMax} years`, section: 'basic' },
    { label: 'Height', value: b.height, section: 'basic' },
    { label: 'Location', value: b.locationPref === 'Prefer specific cities' && b.cities.length ? b.cities.join(', ') : b.locationPref, section: 'basic' },
    { label: 'Education', value: b.education, section: 'basic' },
    { label: 'Profession', value: b.profession, section: 'basic' },
    { label: 'Marital Status', value: b.maritalStatus, section: 'basic' },
    { label: 'Lifestyle', value: [l.fitness, l.travel].join(', '), section: 'lifestyle' },
    { label: 'Family', value: `${f.familyType}, ${f.caste === 'Any' ? 'any caste' : f.caste}`, section: 'family' },
    { label: 'Values', value: list([v.lifeGoals, v.personality]), section: 'values' },
    { label: 'Additional', value: list([...a.languages, `${a.relocation.toLowerCase()} to relocate`]), section: 'additional' },
  ];
}