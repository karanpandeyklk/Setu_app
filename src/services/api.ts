import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildStages, Connection, delay, NotificationItem, PausedConnection, Person, ReceivedRequest, SentRequest, store } from './mockData';

// Flip USE_MOCK to false when Baharath's backend is ready.
export const USE_MOCK = true;
// Put the real address in a .env file (EXPO_PUBLIC_API_URL=https://...) and keep .env out of Git.
export const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://REPLACE-WITH-STAGING-URL';

// ---------- Session token ----------
const TOKEN_KEY = 'setu_session_token';
export const saveToken = (t: string) => AsyncStorage.setItem(TOKEN_KEY, t);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const clearToken = () => AsyncStorage.removeItem(TOKEN_KEY);

export type ApiError = { error: { code: string; message: string; details?: unknown } };

const TIMEOUT_MS = 15000;

// One place for every call. Contract: errors look like { error: { code, message, details } }.
// A call that takes longer than 15 seconds is cancelled and throws, so screens show their error state.
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw body as ApiError;
    return body as T;
  } finally {
    clearTimeout(timer);
  }
}

// ---------- Auth (v0 contract: POST /auth/dev-login, GET /me) ----------
export type User = { id: string; name: string; avatar?: string };

// Used by the Google and Apple buttons. Always signs in as the seeded user Aanya.
export async function devLogin(): Promise<{ token: string; user: User }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return { token: 'mock-token', user: { id: 'u_aanya', name: 'Aanya' } };
  }
  return request('/auth/dev-login', { method: 'POST' });
}

export async function getMe(): Promise<User> {
  if (USE_MOCK) return { id: 'u_aanya', name: 'Aanya' };
  return request('/me');
}

// ---------- OTP (demo) ----------
// A real SMS needs a backend and an SMS provider. In mock mode the code is generated here
// and shown on screen. The real endpoints below are NOT in the v0 contract: confirm them with Baharath.
let demoOtp = '';

export async function sendOtp(phone: string): Promise<{ demoCode?: string }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    demoOtp = String(Math.floor(100000 + Math.random() * 900000));
    return { demoCode: demoOtp };
  }
  const r = await request<{ ok: boolean; demoCode?: string }>('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
  return { demoCode: r.demoCode }; // only present on staging when DEMO_OTP=true
}

// Returns the session on success, or null for a wrong code
export async function verifyOtp(phone: string, code: string): Promise<{ token: string; user: User } | null> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    // a new phone user has no name yet, so the app asks for it
    return code === demoOtp ? { token: 'mock-token', user: { id: `u_${phone}`, name: '' } } : null;
  }
  try {
    return await request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, code }) });
  } catch {
    return null;
  }
}

// ---------- Home (GET /home) ----------
export type AttentionItem = { id: string; icon: string; title: string; description: string; target: 'requests' | 'active' };
export type HomeData = {
  userName: string;
  unreadNotifications: number;
  attention: AttentionItem[];
  currentConnection: Connection | null;
  stages: ReturnType<typeof buildStages>;
};

export async function getHome(): Promise<HomeData> {
  if (!USE_MOCK) return request('/home');
  await delay();
  const n = store.received.length;
  const attention: AttentionItem[] = [];
  if (n > 0) {
    attention.push({
      id: 'a1', icon: 'heart-outline',
      title: `${n} new interest request${n > 1 ? 's' : ''}`,
      description: 'People would like to connect with you', target: 'requests',
    });
  }
  if (store.active.length > 0) {
    attention.push({
      id: 'a2', icon: 'shield-checkmark-outline',
      title: 'Connection consent pending',
      description: 'Review what you share with your match', target: 'active',
    });
  }
  const current = store.active[0] ?? null;
  return {
    userName: '', // the app shows the signed-in user's own name
    unreadNotifications: await getUnreadCount(),
    attention,
    currentConnection: current,
    stages: buildStages(current?.stage ?? 'connect'),
  };
}

// ---------- Connections ----------
export async function getReceived(): Promise<ReceivedRequest[]> {
  if (!USE_MOCK) return request('/requests?box=received');
  await delay();
  return [...store.received];
}
export async function getSent(): Promise<SentRequest[]> {
  if (!USE_MOCK) return request('/requests?box=sent');
  await delay();
  return [...store.sent];
}
export async function getActive(): Promise<Connection[]> {
  if (!USE_MOCK) return request('/connections?status=active');
  await delay();
  return [...store.active];
}
export async function getPaused(): Promise<PausedConnection[]> {
  if (!USE_MOCK) return request('/connections?status=paused'); // not in the v0 contract: confirm with Bharrath
  await delay();
  return [...store.paused];
}
export async function getClosed(): Promise<Person[]> {
  if (!USE_MOCK) return request('/connections?status=closed'); // not in the v0 contract: confirm with Bharrath
  await delay();
  return [...store.closed];
}
export async function pauseConnection(id: string): Promise<void> {
  if (!USE_MOCK) return request(`/connections/${id}/pause`, { method: 'POST' });
  await delay(300);
  const c = store.active.find((x) => x.id === id);
  if (!c) return;
  store.active = store.active.filter((x) => x.id !== id);
  store.paused.push({ ...c, pausedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) });
}
export async function resumeConnection(id: string): Promise<void> {
  if (!USE_MOCK) return request(`/connections/${id}/resume`, { method: 'POST' });
  await delay(300);
  const c = store.paused.find((x) => x.id === id);
  if (!c) return;
  store.paused = store.paused.filter((x) => x.id !== id);
  const { pausedOn, ...rest } = c;
  store.active.push(rest);
}

export async function getDiscover(): Promise<Person[]> {
  if (!USE_MOCK) return request('/discover');
  await delay();
  return [...store.discover];
}

export async function acceptRequest(id: string): Promise<void> {
  if (!USE_MOCK) return request(`/requests/${id}/accept`, { method: 'POST' });
  await delay(300);
  const r = store.received.find((x) => x.id === id);
  store.received = store.received.filter((x) => x.id !== id);
  if (r) store.active.push({ ...r, stage: 'connect' }); // a new connection starts at Connect
}
export async function declineRequest(id: string): Promise<void> {
  if (!USE_MOCK) return request(`/requests/${id}/decline`, { method: 'POST' });
  await delay(300);
  store.received = store.received.filter((x) => x.id !== id);
}
export async function withdrawRequest(id: string): Promise<void> {
  if (!USE_MOCK) return request(`/requests/${id}`, { method: 'DELETE' });
  await delay(300);
  store.sent = store.sent.filter((x) => x.id !== id);
}
export async function sendInterest(person: Person): Promise<void> {
  if (!USE_MOCK) return request('/requests', { method: 'POST', body: JSON.stringify({ toUserId: person.id }) });
  await delay(300);
  store.discover = store.discover.filter((x) => x.id !== person.id);
  store.sent.push({ ...person, status: 'Waiting for response', time: 'Just now' });
}
export async function skipPerson(person: Person): Promise<void> {
  if (USE_MOCK) {
    await delay(200);
    store.discover = store.discover.filter((x) => x.id !== person.id);
  }
}
export async function getBookmarks(): Promise<string[]> {
  if (!USE_MOCK) return request('/bookmarks'); // not in the v0 contract: confirm with Bharrath
  return [...store.bookmarks];
}

export async function toggleBookmark(id: string): Promise<boolean> {
  if (!USE_MOCK) {
    const r = await request<{ bookmarked: boolean }>(`/bookmarks/${id}`, { method: 'POST' });
    return r.bookmarked; // the old version always returned true, so un-bookmarking could never work
  }
  store.bookmarks = store.bookmarks.includes(id) ? store.bookmarks.filter((b) => b !== id) : [...store.bookmarks, id];
  return store.bookmarks.includes(id);
}

// ---------- Notifications (not in the v0 contract: confirm with Bharrath) ----------
// Mock notifications are built from the current requests and connections, so they always match the other screens.
function buildNotifications(): NotificationItem[] {
  const items: Omit<NotificationItem, 'unread'>[] = [
    ...store.received.map((r) => ({
      id: `n_req_${r.id}`, icon: 'heart-outline', title: `${r.name} showed interest in you`,
      body: `${r.profession} · ${r.location}`, time: r.time, target: 'requests' as const,
    })),
    ...store.active.map((c) => ({
      id: `n_act_${c.id}`, icon: 'shield-checkmark-outline', title: 'Connection consent pending',
      body: `Review what you share with ${c.name}`, time: 'Today', target: 'active' as const,
    })),
    { id: 'n_guide', icon: 'sparkles-outline', title: 'A tip from Setu Guide', body: 'Try "Conversation ideas" to start a relaxed chat.', time: 'Yesterday', target: 'guide' as const },
  ];
  return items.map((n) => ({ ...n, unread: !store.readNotifications.includes(n.id) }));
}

export async function getNotifications(): Promise<NotificationItem[]> {
  if (!USE_MOCK) return request('/notifications');
  await delay();
  return buildNotifications();
}
export async function getUnreadCount(): Promise<number> {
  if (!USE_MOCK) return (await request<{ count: number }>('/notifications/unread-count')).count;
  return buildNotifications().filter((n) => n.unread).length;
}
export async function markNotificationRead(id: string): Promise<void> {
  if (!USE_MOCK) return request(`/notifications/${id}/read`, { method: 'POST' });
  if (!store.readNotifications.includes(id)) store.readNotifications.push(id);
}
export async function markAllNotificationsRead(): Promise<void> {
  if (!USE_MOCK) return request('/notifications/read', { method: 'POST' });
  store.readNotifications = buildNotifications().map((n) => n.id);
}