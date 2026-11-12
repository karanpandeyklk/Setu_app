import AsyncStorage from '@react-native-async-storage/async-storage';
import { Profile } from './profileData';

const KEY = 'setu_profile';

// Saved at the end of onboarding and by Edit Profile (mock only: the real backend would store this)
export type SavedProfile = {
  name?: string; dob?: string; gender?: string; languages?: string[]; photoUri?: string;
  bio?: string; height?: string; education?: string; profession?: string; location?: string;
};

export async function getMyProfile(): Promise<SavedProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SavedProfile) : null;
  } catch {
    return null;
  }
}

// Merge the changed fields into what is already saved
export async function saveMyProfile(patch: Partial<SavedProfile>): Promise<void> {
  const current = (await getMyProfile()) ?? {};
  await AsyncStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }));
}

// "12/05/1998" -> age in years
export function ageFromDob(dob?: string): number | null {
  if (!dob || dob.length !== 10) return null;
  const [d, m, y] = dob.split('/').map(Number);
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now < new Date(now.getFullYear(), m - 1, d)) age -= 1;
  return age >= 0 ? age : null;
}

// For "View My Profile" when the user signed up with a phone number
export async function buildOwnProfile(fallbackName: string): Promise<Profile> {
  const p = await getMyProfile();
  const none = 'Not added yet';
  const name = p?.name || fallbackName;
  return {
    name,
    age: ageFromDob(p?.dob) ?? 0,
    gender: p?.gender || none,
    height: p?.height || none,
    education: p?.education || none,
    profession: p?.profession || none,
    location: p?.location || none,
    bio: p?.bio || '',
    about: [
      { title: 'Personal Details', rows: [
        { icon: 'person-outline', label: 'Name', value: name },
        { icon: 'transgender-outline', label: 'Gender', value: p?.gender || none },
        { icon: 'location-outline', label: 'City', value: p?.location || none },
        { icon: 'resize-outline', label: 'Height', value: p?.height || none },
        { icon: 'language-outline', label: 'Languages', value: p?.languages?.join(', ') || none },
      ] },
      { title: 'Education & Career', rows: [
        { icon: 'school-outline', label: 'Education', value: p?.education || none },
        { icon: 'briefcase-outline', label: 'Profession', value: p?.profession || none },
      ] },
    ],
    lifestyle: [],
    family: [],
  };
}