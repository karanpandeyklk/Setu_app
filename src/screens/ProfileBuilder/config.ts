// src/screens/ProfileBuilder/config.ts
// One entry per step. Add or reorder steps here; the screen renders from this list.

export type TileOption = { label: string; emoji: string; color: string };
export type Group = { id: string; title: string; options: string[]; allowOther?: boolean };

export type Step =
  | { id: string; kind: 'tiles'; title: string; subtitle: string; options: TileOption[] }
  | { id: string; kind: 'radio'; title: string; subtitle?: string; options: string[]; allowOther?: boolean }
  | { id: string; kind: 'chips'; title: string; subtitle: string; options: string[]; max: number }
  | { id: string; kind: 'groups'; title: string; subtitle?: string; groups: Group[] }
  | { id: string; kind: 'about'; title: string; subtitle: string; prompts: string[]; maxLength: number };

export const STEPS: Step[] = [
  {
    id: 'interests',
    kind: 'tiles',
    title: 'What do you enjoy?',
    subtitle: 'Choose the things you genuinely enjoy. There are no right answers.',
    options: [
      { label: 'Reading', emoji: '📚', color: '#8B6B4A' },
      { label: 'Music', emoji: '🎵', color: '#5B4B8A' },
      { label: 'Movies', emoji: '🎬', color: '#7A3E48' },
      { label: 'Travel', emoji: '✈️', color: '#2F6FED' },
      { label: 'Cooking', emoji: '🍳', color: '#B26A2C' },
      { label: 'Photography', emoji: '📷', color: '#3F7F6E' },
      { label: 'Art', emoji: '🎨', color: '#A8527A' },
      { label: 'Fitness', emoji: '🏋️', color: '#4A6B8A' },
      { label: 'Nature', emoji: '🌿', color: '#4B8A55' },
    ],
  },
  {
    id: 'lifestyle',
    kind: 'radio',
    title: 'How would you describe your lifestyle?',
    allowOther: true,
    options: [
      'Quiet & relaxed',
      'Social & outgoing',
      'Balanced',
      'Career-focused',
      'Family-oriented',
      'Creative',
      'Health & fitness focused',
      'Travel-oriented',
      'Spiritual',
    ],
  },
  {
    id: 'values',
    kind: 'chips',
    title: 'What matters to you in a relationship?',
    subtitle: 'Choose up to 5',
    max: 5,
    options: [
      'Trust', 'Respect', 'Communication', 'Emotional support', 'Family connection',
      'Independence', 'Shared responsibilities', 'Personal growth', 'Honesty',
      'Financial responsibility', 'Quality time', 'Personal space', 'Stability', 'Understanding',
    ],
  },
  {
    id: 'partnership',
    kind: 'radio',
    title: 'What type of partnership are you hoping to build?',
    allowOther: true,
    options: [
      'A strong friendship',
      'Emotional companionship',
      'A supportive partnership',
      'A family-oriented relationship',
      'Growing together',
      'Sharing life experiences',
    ],
  },
  {
    id: 'lifestylePrefs',
    kind: 'groups',
    title: 'Lifestyle preferences',
    groups: [
      {
        id: 'livingPref',
        title: 'Where would you ideally like to live?',
        options: ['Prefer my current city', 'Open to relocation', 'Specific cities', 'Anywhere', "I'd like to discuss this"],
      },
      {
        id: 'careerGrowth',
        title: 'How important is career growth to you?',
        options: ['Very important', 'Important', 'Flexible', 'Not a priority'],
      },
    ],
  },
  {
    id: 'about',
    kind: 'about',
    title: 'Tell people a little about yourself',
    subtitle: 'What would you like people to know about you?',
    maxLength: 500,
    prompts: [
      "Something I'm passionate about...",
      'My ideal weekend...',
      'Something I value deeply...',
      "Something I'd love to experience with a partner...",
    ],
  },
];