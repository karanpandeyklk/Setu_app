import { StageKey } from './mockData';

export type TabKey = 'guidance' | 'forYou' | 'activities' | 'resources';

// One-line description of each stage in the Journey list
export const STAGE_LIST: Record<StageKey, { icon: string; text: string }> = {
  connect: { icon: 'link-outline', text: 'Connection established' },
  understand: { icon: 'bulb-outline', text: "Learn about each other's values, lifestyle..." },
  reflect: { icon: 'create-outline', text: 'Take time for your personal thoughts' },
  discuss: { icon: 'chatbubble-outline', text: 'Have meaningful conversations on important topics.' },
  agree: { icon: 'checkmark-done-outline', text: 'Explore alignment and shared vision.' },
  family: { icon: 'people-outline', text: 'Decide together when to involve family.' },
  reflect_again: { icon: 'refresh-outline', text: 'Revisit your thoughts after family stage.' },
  decision: { icon: 'flag-outline', text: 'Make your decision, at your own pace.' },
};

// Header block and "What does this stage mean?" text on each stage page
export const STAGE_PAGE: Record<StageKey, { icon: string; intro: string; meaning: string }> = {
  connect: { icon: 'link-outline', intro: 'Say hello and begin getting comfortable with each other.', meaning: 'This is where you introduce yourselves and start talking. There is no pressure to share everything at once.' },
  understand: { icon: 'bulb-outline', intro: "Learn more about each other's values, lifestyle and perspectives.", meaning: 'This is a time to get to know each other beyond the basics. You can explore daily life, work, interests, family values and future aspirations.' },
  reflect: { icon: 'create-outline', intro: 'Take time to think about what matters to you.', meaning: 'Answer questions on your own. Your answers stay private unless you choose to share them.' },
  discuss: { icon: 'chatbubble-outline', intro: 'Talk through important topics together, at your own pace.', meaning: 'Share and compare what you each reflected on. Start with the topics you both feel comfortable with.' },
  agree: { icon: 'checkmark-done-outline', intro: 'Explore where your views and plans align.', meaning: 'Work out where you agree and how you would handle the differences, together.' },
  family: { icon: 'people-outline', intro: 'Decide together when and how to involve your families.', meaning: 'Bring families into the conversation only when you both feel ready.' },
  reflect_again: { icon: 'refresh-outline', intro: 'Revisit your thoughts after the family stage.', meaning: 'Take a step back and think again about everything you have learned.' },
  decision: { icon: 'flag-outline', intro: 'Make your decision together, at your own pace.', meaning: 'Decide together whether and how to move forward. There is no rush.' },
};

export type Suggestion = { icon: string; title: string; desc: string; tint?: string; bg?: string };

// Static seeded content this week (the plan says to use seeded content for these tabs)
export const SUGGESTIONS: Record<TabKey, Suggestion[]> = {
  guidance: [
    { icon: 'chatbubble-ellipses-outline', title: 'Conversation Starters', desc: 'Thoughtful questions to get to know each other better.' },
    { icon: 'pencil', title: 'Learn Together', desc: 'Short guides on important topics like lifestyle, goals and expectations.' },
    { icon: 'sparkles-outline', title: 'Tips from Setu Guide', desc: 'Expert-backed insights for meaningful conversations.', tint: '#7C3AED', bg: '#EDE9FE' },
  ],
  forYou: [
    { icon: 'heart-outline', title: 'Based on your values', desc: 'Topics you both marked as important.' },
    { icon: 'time-outline', title: 'Take your time', desc: 'There is no deadline for any stage.' },
    { icon: 'shield-checkmark-outline', title: 'Your privacy', desc: 'You control what is shared.' },
  ],
  activities: [
    { icon: 'cafe-outline', title: 'Plan a call', desc: 'A relaxed 20-minute conversation.' },
    { icon: 'list-outline', title: 'Share three favourites', desc: 'Food, places and music.' },
    { icon: 'happy-outline', title: 'Talk about a good week', desc: 'What made it good for you?' },
  ],
  resources: [
    { icon: 'document-text-outline', title: 'A guide to first conversations', desc: '5 min read' },
    { icon: 'document-text-outline', title: 'Listening well', desc: '4 min read' },
    { icon: 'document-text-outline', title: 'Handling differences kindly', desc: '6 min read' },
  ],
};

export const REMINDERS = [
  'Be yourself and take your time.',
  "You can skip any topic that you're not ready for.",
  'Setu Guide suggests topics, but you decide what to discuss.',
];