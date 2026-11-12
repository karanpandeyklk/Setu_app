import { request, USE_MOCK } from './api';
import { delay, Person, store } from './mockData';

type Row = { label: string; value: string };
type IconRow = { icon: string; label: string; value: string; color?: string };

export type MatchProfile = {
  id: string; name: string; age: number; location: string; profession: string; company: string;
  education: string; online: boolean; verified: boolean;
  tags: string[]; quote: string; glance: IconRow[]; about: string;
  personal: Row[]; educationRows: Row[]; career: Row[];
  interests: IconRow[]; routine: Row[]; values: string[];
  familyBackground: Row[]; religion: Row[]; languages: Row[]; involvement: Row[]; familyQuote: string;
};
export type Source = 'received' | 'sent' | 'discover' | 'active' | 'paused' | 'other';

function findPerson(id: string): { person: Person; source: Source } | null {
  const lists: [Person[], Source][] = [
    [store.received, 'received'], [store.discover, 'discover'], [store.sent, 'sent'],
    [store.active, 'active'], [store.paused, 'paused'], [store.completed, 'other'],
  ];
  for (const [list, source] of lists) {
    const p = list.find((x) => x.id === id);
    if (p) return { person: p, source };
  }
  return null;
}

// pick a value by the person's id, so different people read differently
const pick = <T,>(id: string, arr: T[]): T => arr[[...id].reduce((s, c) => s + c.charCodeAt(0), 0) % arr.length];

function build(p: Person): MatchProfile {
  const city = p.location.split(',')[0];
  const state = p.location.split(',')[1]?.trim() ?? '';
  const food = pick(p.id, ['Vegetarian', 'Non-vegetarian', 'Eggetarian']);
  const company = pick(p.id, ['a leading company', 'a growing startup', 'a global firm']);
  const education = pick(p.id, ['B.Tech (Computer Science)', 'MBA', 'B.Com', 'M.Sc']);
  const hobbies = pick(p.id, ['Reading, cooking, photography', 'Cricket, travel, music', 'Trekking, painting, movies']);
  const quote = `I believe in honest communication, mutual respect and growing together. I'm looking for a partner to build a happy and balanced life with.`;
  return {
    id: p.id, name: p.name, age: p.age, location: p.location, profession: p.profession, company,
    education, online: !!p.online, verified: !!p.verified,
    tags: ['Calm', 'Thoughtful', 'Family-oriented', 'Travel Lover'],
    quote,
    glance: [
      { icon: 'resize-outline', label: 'Height', value: `5'9"` },
      { icon: 'heart-outline', label: 'Marital status', value: 'Never Married' },
      { icon: 'location-outline', label: 'Lives in', value: city },
      { icon: 'airplane-outline', label: 'Relocation', value: 'Open to relocate' },
    ],
    about: `I'm a thoughtful and grounded person who enjoys meaningful conversations and values both personal and professional growth. I like exploring new places and spending quality time with family and friends.`,
    personal: [
      { label: 'Age', value: `${p.age} years` }, { label: 'Gender', value: 'Not specified' },
      { label: 'Height', value: `5'9"` }, { label: 'Location', value: p.location },
      { label: 'Hometown', value: city }, { label: 'Marital Status', value: 'Never Married' },
    ],
    educationRows: [
      { label: 'Highest Education', value: education }, { label: 'Education Type', value: 'Full Time' },
      { label: 'Year of Graduation', value: '2018' },
    ],
    career: [
      { label: 'Profession', value: p.profession }, { label: 'Work Mode', value: 'Hybrid' },
      { label: 'Work Location', value: p.location }, { label: 'Experience', value: '5+ years' },
    ],
    interests: [
      { icon: 'restaurant-outline', label: 'Food', value: `${food}, loves to try new cuisines`, color: '#F59E0B' },
      { icon: 'airplane-outline', label: 'Travel', value: 'Loves to explore places, weekend trips', color: '#0EA5E9' },
      { icon: 'color-palette-outline', label: 'Hobbies', value: hobbies, color: '#F97316' },
      { icon: 'musical-notes-outline', label: 'Music', value: 'Indie, soft rock', color: '#8B5CF6' },
      { icon: 'film-outline', label: 'Movies & Shows', value: 'Drama, comedy, thrillers', color: '#EF4444' },
      { icon: 'fitness-outline', label: 'Fitness', value: 'Gym, running, outdoor sports', color: '#22C55E' },
    ],
    routine: [
      { label: 'Wake up', value: '6:30 AM - 8:30 AM' }, { label: 'Work', value: '9:00 AM - 6:00 PM' },
      { label: 'Evening', value: 'Gym / Reading / Family time' }, { label: 'Weekends', value: 'Travel or meet friends' },
    ],
    values: ['Honesty', 'Respect', 'Open Communication', 'Family-oriented', 'Personal Growth', 'Work-Life Balance', 'Kindness', 'Emotional Maturity'],
    familyBackground: [
      { label: 'Father', value: 'Businessman' }, { label: 'Mother', value: 'Homemaker' },
      { label: 'Family Type', value: 'Nuclear Family' }, { label: 'Siblings', value: 'One younger brother' },
      { label: 'Family Values', value: 'Traditional with modern outlook, respect, togetherness' }, { label: 'Location', value: p.location },
    ],
    religion: [{ label: 'Religion', value: 'Hindu' }, { label: 'Caste', value: state || 'Not specified' }],
    languages: [{ label: 'Known Languages', value: 'English, Hindi' }, { label: 'Comfortable In', value: 'English (Basic)' }],
    involvement: [
      { label: 'Family Involvement', value: 'After mutual understanding' },
      { label: 'Family Meeting', value: 'Open to meeting family when both are comfortable' },
    ],
    familyQuote: 'I believe in giving time to understand each other before involving family.',
  };
}

// GET /profiles/{userId} in the contract. Mock: built from the person's list entry.
export async function getMatchProfile(id: string): Promise<{ profile: MatchProfile; source: Source } | null> {
  if (!USE_MOCK) return { profile: await request<MatchProfile>(`/profiles/${id}`), source: 'other' };
  await delay(400);
  const found = findPerson(id);
  return found ? { profile: build(found.person), source: found.source } : null;
}