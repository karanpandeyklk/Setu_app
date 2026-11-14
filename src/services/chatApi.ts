import { BASE_URL, getActive, getToken, request, USE_MOCK } from './api';
import { delay } from './mockData';

// ---------- Setu Guide (app -> POST /guide/chat on OUR backend, never the AI service) ----------
export type Intent = 'conversation_ideas' | 'help_me_understand' | 'next_steps' | 'privacy_safety';
export type GuideReply = {
  intent?: Intent; reply: string; questions?: string[]; topic?: string; chips?: string[];
  sources?: string[]; safety?: string | null; fallback_used?: boolean;
};

export const QUICK_ACTIONS: { intent: Intent; label: string }[] = [
  { intent: 'conversation_ideas', label: 'Conversation ideas' },
  { intent: 'help_me_understand', label: 'Help me understand' },
  { intent: 'next_steps', label: 'Tips for next steps' },
  { intent: 'privacy_safety', label: 'Privacy & safety' },
];

const FALLBACK: GuideReply = {
  reply: "I'm taking longer than usual to answer. Please try again in a moment.",
  fallback_used: true,
};

// Shown when there is no active connection to ask about. The backend needs a connectionId.
const NO_CONNECTION: GuideReply = {
  reply: 'Setu Guide works with your active connection. Connect with someone first, and I can help from there.',
};

let warmedUp = false; // the first call can take about a minute on the free staging service

export async function askGuide(p: {
  connectionId?: string; intent?: Intent; message?: string; topic?: string;
}): Promise<GuideReply> {
  if (USE_MOCK) { await delay(1000); return mockGuide(p); }

  // connectionId lets the backend check that this user belongs to the connection and read the
  // current Journey stage itself. Use the one passed in, otherwise the active connection.
  let connectionId = p.connectionId;
  if (!connectionId) {
    try { connectionId = (await getActive())[0]?.id; } catch { /* handled below */ }
  }
  if (!connectionId) return NO_CONNECTION;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), warmedUp ? 25000 : 70000);
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/guide/chat`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      // The stage and user id come from the server, not from the app.
      body: JSON.stringify({
        connectionId,
        intent: p.intent,
        message: p.message?.slice(0, 500),
        topic: p.topic?.slice(0, 100),
      }),
    });
    if (!res.ok) return FALLBACK;
    warmedUp = true;
    return (await res.json()) as GuideReply;
  } catch {
    return FALLBACK; // slow or down: friendly bubble, never an error screen
  } finally {
    clearTimeout(timer);
  }
}

function mockGuide(p: { intent?: Intent; message?: string }): GuideReply {
  switch (p.intent) {
    case 'conversation_ideas':
      return {
        intent: p.intent,
        reply: 'Of course! Here are some questions you can explore. You can choose the ones that feel right for your conversation. 😊',
        topic: 'Lifestyle & Daily Routine',
        questions: [
          'What does a typical day look like for you?',
          'How do you like to spend your weekends?',
          'What kind of work environment do you prefer?',
          'How do you maintain work-life balance?',
          'Are there any hobbies or interests that are important to you?',
          'What does a relaxing evening look like for you?',
          'How do you usually plan your week?',
          'What is one habit you are proud of?',
        ],
      };
    case 'help_me_understand':
      return {
        intent: p.intent,
        reply: 'Happy to help. Tell me what you would like to understand better and I will explain it simply.',
      };
    case 'next_steps':
      return {
        intent: p.intent,
        reply: 'A good next step is to keep the conversation relaxed and share a little more about yourself.',
      };
    case 'privacy_safety':
      return {
        intent: p.intent,
        reply: 'Keep personal details like your address and finances private until you feel comfortable and have built trust.',
      };
    default:
      return { reply: 'Thanks for your message. How can I help with your conversation?' };
  }
}

// ---------- Chats ----------
export type ChatFilter = 'all' | 'active' | 'new' | 'muted';
export type ChatItem = {
  id: string; name: string; last: string;
  time: string;        // display text, used when the server sends no lastAt
  lastAt?: string;     // ISO timestamp of the last message, e.g. "2026-11-10T09:41:00Z". The app formats it.
  lastMine?: boolean;  // the last message was sent by me: the list shows "You:" and a tick
  lastRead?: boolean;  // the other person has read it: the tick turns blue
  unread: number; online: boolean; muted: boolean; isNew: boolean;
  photo?: string;
};
export type Msg = { id: string; mine: boolean; text: string; time: string; status?: 'sending' | 'failed' };

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// "9:41 AM" today, "Yesterday", a weekday within the last week, otherwise "24 Sep".
// Uses the phone's own timezone and language.
export function formatChatTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const now = new Date();
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((day(now) - day(d)) / 86400000);
  if (days <= 0) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (days === 1) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

// mock helper: a timestamp N days ago at a given time
const at = (daysAgo: number, h: number, m: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

const chatStore: { chats: ChatItem[]; msgs: Record<string, Msg[]> } = {
  chats: [
    { id: 'ch1', name: 'Rohan', last: 'That sounds like a lovely plan!', time: '', lastAt: at(0, 9, 41), unread: 2, online: true, muted: false, isNew: false },
    { id: 'ch2', name: 'Karthik', last: 'Hi, nice to connect.', time: '', lastAt: at(1, 18, 5), unread: 1, online: false, muted: false, isNew: true },
    { id: 'ch3', name: 'Arjun', last: 'Take your time, no rush.', time: '', lastAt: at(3, 20, 15), unread: 0, online: false, muted: true, isNew: false },
    { id: 'ch4', name: 'Varun', last: 'Yes, that works for me.', time: '', lastAt: at(47, 11, 30), lastMine: true, lastRead: true, unread: 0, online: false, muted: false, isNew: false },
  ],
  msgs: {
    ch1: [
      { id: 'a1', mine: false, text: 'Hi! How was your week?', time: '9:30 AM' },
      { id: 'a2', mine: true, text: 'Busy but good. Weekend plans?', time: '9:35 AM' },
      { id: 'a3', mine: false, text: 'That sounds like a lovely plan!', time: '9:41 AM' },
    ],
    ch2: [{ id: 'b1', mine: false, text: 'Hi, nice to connect.', time: 'Yesterday' }],
    ch3: [{ id: 'c1', mine: false, text: 'Take your time, no rush.', time: 'Mon' }],
    ch4: [
      { id: 'd1', mine: false, text: 'Would Sunday work for a call?', time: '11:20 AM' },
      { id: 'd2', mine: true, text: 'Yes, that works for me.', time: '11:30 AM' },
    ],
  },
};

export async function getChats(filter: ChatFilter, query: string): Promise<ChatItem[]> {
  // the real backend now receives the search text too (before, search only worked in mock mode)
  if (!USE_MOCK) return request(`/chats?filter=${filter}&q=${encodeURIComponent(query.trim())}`);
  await delay(500);
  return chatStore.chats
    .filter((c) =>
      (filter === 'all' || (filter === 'active' && c.online) || (filter === 'new' && c.isNew) || (filter === 'muted' && c.muted)) &&
      c.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (b.lastAt ?? '').localeCompare(a.lastAt ?? '')) // newest first
    .map((c) => ({ ...c, time: c.lastAt ? formatChatTime(c.lastAt) : c.time }));
}

export async function getMessages(chatId: string): Promise<Msg[]> {
  if (!USE_MOCK) return request(`/chats/${chatId}/messages`); // cursor paging can be added later
  await delay(300);
  return [...(chatStore.msgs[chatId] ?? [])];
}

export async function sendMessage(chatId: string, text: string): Promise<Msg> {
  if (!USE_MOCK) return request(`/chats/${chatId}/messages`, { method: 'POST', body: JSON.stringify({ text }) });
  await delay(400);
  const m: Msg = { id: `m${Date.now()}`, mine: true, text, time: nowTime() };
  chatStore.msgs[chatId] = [...(chatStore.msgs[chatId] ?? []), m];
  // keep the chat list in step with the thread
  const c = chatStore.chats.find((x) => x.id === chatId);
  if (c) { c.last = text; c.lastAt = new Date().toISOString(); c.lastMine = true; c.lastRead = false; }
  if (chatId === 'ch1') { // simulated reply so you can see "receive"
    setTimeout(() => {
      const reply = 'Thanks for letting me know!';
      chatStore.msgs[chatId].push({ id: `r${Date.now()}`, mine: false, text: reply, time: nowTime() });
      const chat = chatStore.chats.find((x) => x.id === chatId);
      if (chat) { chat.last = reply; chat.lastAt = new Date().toISOString(); chat.lastMine = false; }
    }, 2500);
  }
  return m;
}

export async function markRead(chatId: string): Promise<void> {
  if (!USE_MOCK) return request(`/chats/${chatId}/read`, { method: 'POST' });
  const c = chatStore.chats.find((x) => x.id === chatId);
  if (c) c.unread = 0;
}