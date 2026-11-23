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

export type BasicPrefs = {
  ageMin: number; ageMax: number; height: string; locationPref: string; cities: string[];
  education: string; profession: string; workMode: string; maritalStatus: string;
};
export type LifestylePrefs = { food: string; smoking: string; drinking: string; fitness: string; travel: string; hobbies: string[] };
export type FamilyPrefs = { familyType: string; caste: string; familyLocation: string; familyValues: string; familyInvolvement: string };
export type Preferences = { basic: BasicPrefs; lifestyle: LifestylePrefs; family: FamilyPrefs };
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
};

const SECTIONS: PrefSection[] = ['basic', 'lifestyle', 'family'];
const keyFor = (userId: string) => `setu_preferences:${userId}`;

// Mock mode keeps the answers on the phone. Real mode uses GET and PATCH /me/preferences/{section} from the contract.
export async function getPreferences(userId: string): Promise<Preferences> {
  let saved: Partial<Preferences> = {};
  if (USE_MOCK) {
    try {
      const raw = await AsyncStorage.getItem(keyFor(userId));
      saved = raw ? JSON.parse(raw) : {};
    } catch { /* use the defaults */ }
  } else {
    const [basic, lifestyle, family] = await Promise.all(
      SECTIONS.map((s) => request<any>(`/me/preferences/${s}`).catch(() => ({})))
    );
    saved = { basic, lifestyle, family };
  }
  return {
    basic: { ...DEFAULTS.basic, ...(saved.basic ?? {}) },
    lifestyle: { ...DEFAULTS.lifestyle, ...(saved.lifestyle ?? {}) },
    family: { ...DEFAULTS.family, ...(saved.family ?? {}) },
  };
}

export async function savePreferences<S extends PrefSection>(userId: string, section: S, values: Preferences[S]): Promise<void> {
  if (USE_MOCK) {
    let saved: any = {};
    try {
      const raw = await AsyncStorage.getItem(keyFor(userId));
      saved = raw ? JSON.parse(raw) : {};
    } catch { /* start fresh */ }
    saved[section] = values;
    await AsyncStorage.setItem(keyFor(userId), JSON.stringify(saved));
    return;
  }
  await request(`/me/preferences/${section}`, { method: 'PATCH', body: JSON.stringify(values) });
}