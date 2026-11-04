import { StageKey } from './mockData';

export type Sharing = 'keep_private' | 'share_with_match' | 'share_later';
export type QType = 'single_select' | 'multi_select' | 'rating' | 'free_text';
export type Question = {
  id: string; category: string; text: string; type: QType;
  options?: string[]; max?: number; hint?: string; labels?: [string, string];
};
export type Answer = { value: string | string[] | number | null; other?: string; sharing: Sharing };

export const sharingLabel = (s: Sharing, match: string) =>
  s === 'keep_private' ? 'Keep private' : s === 'share_with_match' ? `Share with ${match}` : 'Share later';

export const STAGE_INFO: Record<StageKey, { icon: string; description: string; meaning: string }> = {
  connect: { icon: 'link-outline', description: 'Say hello and share the basics', meaning: 'This is where you introduce yourselves and get comfortable talking.' },
  understand: { icon: 'search-outline', description: "Learn about each other's lives and values", meaning: 'Spend time learning how the other person lives, thinks and what they care about.' },
  reflect: { icon: 'create-outline', description: 'Think privately about what matters to you', meaning: 'Answer questions on your own. Your answers stay private unless you choose to share them.' },
  discuss: { icon: 'chatbubbles-outline', description: 'Talk through your answers together', meaning: 'Share and compare what you each reflected on, in your own time.' },
  agree: { icon: 'checkmark-done-outline', description: 'Find common ground on key decisions', meaning: 'Work out where you agree and how to handle the differences.' },
  family: { icon: 'home-outline', description: 'Involve the people who matter', meaning: 'Bring families into the conversation when you both feel ready.' },
  reflect_again: { icon: 'refresh-outline', description: 'Pause and check how you feel', meaning: 'Take a step back and think again about everything you have learned.' },
  decision: { icon: 'flag-outline', description: 'Decide your next step together', meaning: 'Decide together whether and how to move forward.' },
};

// Seeded content for the stage tabs (static this week)
export const STAGE_TABS = {
  guidance: [
    { icon: 'chatbubbles-outline', title: 'Conversation Starters', desc: 'Easy questions to begin with' },
    { icon: 'book-outline', title: 'Learn Together', desc: 'Short reads on getting to know each other' },
    { icon: 'sparkles-outline', title: 'Tips from Setu Guide', desc: 'Gentle advice for this stage' },
  ],
  forYou: [
    { icon: 'heart-outline', title: 'Based on your values', desc: 'Topics you both marked as important' },
    { icon: 'time-outline', title: 'Take your time', desc: 'There is no deadline for any stage' },
    { icon: 'shield-checkmark-outline', title: 'Your privacy', desc: 'You control what is shared' },
  ],
  activities: [
    { icon: 'cafe-outline', title: 'Plan a call', desc: 'A relaxed 20-minute conversation' },
    { icon: 'list-outline', title: 'Share three favourites', desc: 'Food, places and music' },
    { icon: 'happy-outline', title: 'Talk about a good week', desc: 'What made it good for you?' },
  ],
  resources: [
    { icon: 'document-text-outline', title: 'A guide to first conversations', desc: '5 min read' },
    { icon: 'document-text-outline', title: 'Listening well', desc: '4 min read' },
    { icon: 'document-text-outline', title: 'Handling differences kindly', desc: '6 min read' },
  ],
};

// 10 seeded questions. The count in the UI always comes from this list.
export const QUESTIONS: Question[] = [
  { id: 'q1', category: 'Lifestyle & Daily Life', type: 'multi_select', max: 3, hint: 'Choose up to 3',
    text: 'Which activities matter most to you on a free weekend?',
    options: ['Time with family', 'Meeting friends', 'Travel or day trips', 'Fitness or sports', 'Reading or learning', 'Rest at home'] },
  { id: 'q2', category: 'Lifestyle & Daily Life', type: 'single_select',
    text: 'How do you like to spend your evenings?',
    options: ['Quiet time at home', 'Cooking and eating together', 'Going out', 'Working on my goals', 'Other'] },
  { id: 'q3', category: 'Values & Outlook', type: 'rating', labels: ['Not important', 'Very important'],
    text: 'How important is it that your partner shares your spiritual or religious practices?' },
  { id: 'q4', category: 'Family & Home', type: 'single_select',
    text: 'Where would you like to live after marriage?',
    options: ['With my family', 'Near my family', 'Independently, in my own city', 'Open to relocating', 'Other'] },
  { id: 'q5', category: 'Family & Home', type: 'multi_select', hint: 'Select all that apply',
    text: 'Which family traditions are important to you?',
    options: ['Festivals together', 'Regular family meals', 'Religious ceremonies', 'Visiting relatives', 'Cultural customs'] },
  { id: 'q6', category: 'Finances', type: 'rating', labels: ['Uncomfortable', 'Very comfortable'],
    text: 'How comfortable are you discussing money openly with a partner?' },
  { id: 'q7', category: 'Career & Goals', type: 'free_text',
    text: 'What are your career goals for the next five years?' },
  { id: 'q8', category: 'Values & Outlook', type: 'single_select',
    text: 'How do you usually handle disagreements?',
    options: ['Talk it through right away', 'Take time, then talk', 'Ask someone I trust for advice', 'Avoid conflict if I can', 'Other'] },
  { id: 'q9', category: 'Family & Home', type: 'rating', labels: ['Not important', 'Very important'],
    text: 'How important is it to you to have children?' },
  { id: 'q10', category: 'Values & Outlook', type: 'free_text',
    text: 'What does a good partnership mean to you?' },
];