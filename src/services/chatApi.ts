import { BASE_URL, getToken, request, USE_MOCK } from './api';
import { delay } from './mockData';

// ---------- Setu Guide (app -> POST /guide/chat on OUR backend, never the AI service) ----------
export type Intent = 'conversation_ideas' | 'help_me_understand' | 'next_steps' | 'privacy_safety';
export type GuideReply = {
  intent?: Intent; reply: string; questions?: string[]; chips?: string[];
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

let warmedUp = false; // the first call can take about a minute on the free staging service

export async function askGuide(p: { intent?: Intent; message?: string; topic?: string }): Promise<GuideReply> {
  if (USE_MOCK) { await delay(1000); return mockGuide(p); }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), warmedUp ? 25000 : 70000);
  try {
    const token = await getToken();
    const res = await fetch(`${BASE_URL}/guide/chat`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      // Stage and IDs come from the server. Ask Baharath if the body also needs the connection id.
      body: JSON.stringify({ intent: p.intent, message: p.message?.slice(0, 500), topic: p.topic?.slice(0, 100) }),
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
      return { intent: p.intent, reply: 'Here are a few relaxed questions for Lifestyle & Daily Routine. Pick one that feels natural.',
        questions: ['What does a perfect weekend look like for you?', 'How do you usually start your mornings?', 'What is one habit you are proud of?'] };
    case 'help_me_understand':
      return { intent: p.intent, reply: 'At the Understand stage, the goal is to learn how each other thinks and lives. There are no right answers. Listen first, then share your own view.' };
    case 'next_steps':
      return { intent: p.intent, reply: 'A good next step is to finish the Reflect questions at your own pace. Then you can decide what to share with Rohan.' };
    case 'privacy_safety':
      return { intent: p.intent, reply: 'Your answers are private by default. Only the answers you choose to share are visible to your match. Setu Guide never sees your private answers.', safety: 'Never share bank details or contact information before you feel safe.' };
    default:
      return { reply: `Thanks for sharing. Could you tell me more about what you'd like help with?`, chips: ['Conversation ideas', 'Tips for next steps'] };
  }
}

// ---------- Chats ----------
export type ChatFilter = 'all' | 'active' | 'new' | 'muted';
export type ChatItem = { id: string; name: string; last: string; time: string; unread: number; online: boolean; muted: boolean; isNew: boolean };
export type Msg = { id: string; mine: boolean; text: string; time: string; status?: 'sending' | 'failed' };

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const chatStore: { chats: ChatItem[]; msgs: Record<string, Msg[]> } = {
  chats: [
    { id: 'ch1', name: 'Rohan', last: 'That sounds like a lovely plan!', time: '9:41 AM', unread: 2, online: true, muted: false, isNew: false },
    { id: 'ch2', name: 'Karthik', last: 'Hi Aanya, nice to connect.', time: 'Yesterday', unread: 1, online: false, muted: false, isNew: true },
    { id: 'ch3', name: 'Arjun', last: 'Take your time, no rush.', time: 'Mon', unread: 0, online: false, muted: true, isNew: false },
  ],
  msgs: {
    ch1: [
      { id: 'a1', mine: false, text: 'Hi Aanya! How was your week?', time: '9:30 AM' },
      { id: 'a2', mine: true, text: 'Busy but good. Weekend plans?', time: '9:35 AM' },
      { id: 'a3', mine: false, text: 'That sounds like a lovely plan!', time: '9:41 AM' },
    ],
    ch2: [{ id: 'b1', mine: false, text: 'Hi Aanya, nice to connect.', time: 'Yesterday' }],
    ch3: [{ id: 'c1', mine: false, text: 'Take your time, no rush.', time: 'Mon' }],
  },
};

export async function getChats(filter: ChatFilter, query: string): Promise<ChatItem[]> {
  if (!USE_MOCK) return request(`/chats?filter=${filter}`);
  await delay(500);
  return chatStore.chats.filter((c) =>
    (filter === 'all' || (filter === 'active' && c.online) || (filter === 'new' && c.isNew) || (filter === 'muted' && c.muted)) &&
    c.name.toLowerCase().includes(query.trim().toLowerCase()));
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
  if (chatId === 'ch1') { // simulated reply so you can see "receive"
    setTimeout(() => {
      chatStore.msgs[chatId].push({ id: `r${Date.now()}`, mine: false, text: 'Thanks for letting me know!', time: nowTime() });
    }, 2500);
  }
  return m;
}

export async function markRead(chatId: string): Promise<void> {
  if (!USE_MOCK) return request(`/chats/${chatId}/read`, { method: 'POST' });
  const c = chatStore.chats.find((x) => x.id === chatId);
  if (c) c.unread = 0;
}