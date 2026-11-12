import { request, USE_MOCK } from './api';
import { delay } from './mockData';

// ---------- Chat profile (the "App chat profile page") ----------
// Put this file in src/services/chatProfileApi.ts

export type ChatProfile = {
  id: string;
  name: string;
  age: number;
  role: string;                 // "Software Engineer"
  city: string;                 // "Hyderabad"
  photo?: string;
  online: boolean;
  muted: boolean;
  journey: { stage: string };   // current Setu Journey stage, e.g. "Understand"
  interests: string[];          // shared interests, e.g. ["Travel", "Books", "Music"]
  media: { total: number; thumbs: string[] }; // thumbs: up to 4 image URLs for the preview row
};

const seed = (n: number) => `https://picsum.photos/seed/setu${n}/300/300`;

const MOCK: Record<string, ChatProfile> = {
  ch1: {
    id: 'ch1', name: 'Rohan', age: 27, role: 'Software Engineer', city: 'Hyderabad',
    online: true, muted: false,
    journey: { stage: 'Understand' },
    interests: ['Travel', 'Books', 'Music'],
    media: { total: 12, thumbs: [seed(1), seed(2), seed(3), seed(4)] },
  },
};

const mockFor = (chatId: string): ChatProfile =>
  MOCK[chatId] ?? {
    id: chatId, name: 'Member', age: 28, role: 'Professional', city: 'India',
    online: false, muted: false,
    journey: { stage: 'Understand' },
    interests: ['Travel'],
    media: { total: 0, thumbs: [] },
  };

// GET /chats/:id/profile
export async function getChatProfile(chatId: string): Promise<ChatProfile> {
  if (!USE_MOCK) return request(`/chats/${chatId}/profile`);
  await delay(400);
  return { ...mockFor(chatId) };
}

// PUT /chats/:id/mute   body: { muted: boolean }
export async function setChatMuted(chatId: string, muted: boolean): Promise<void> {
  if (!USE_MOCK) {
    return request(`/chats/${chatId}/mute`, { method: 'PUT', body: JSON.stringify({ muted }) });
  }
  await delay(200);
  if (MOCK[chatId]) MOCK[chatId].muted = muted;
}