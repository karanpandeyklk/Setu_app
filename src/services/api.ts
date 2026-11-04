import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildStages, Connection, delay, Person, ReceivedRequest, SentRequest, store } from './mockData';

// Flip USE_MOCK to false and set BASE_URL when Baharath's backend is ready.
export const USE_MOCK = true;
export const BASE_URL = 'https://REPLACE-WITH-STAGING-URL'; // lead shares this privately; never commit real URLs or keys

const TOKEN_KEY = 'setu_session_token';
export const saveToken = (t: string) => AsyncStorage.setItem(TOKEN_KEY, t);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const clearToken = () => AsyncStorage.removeItem(TOKEN_KEY);

export type ApiError = { error: { code: string; message: string; details?: unknown } };

// One place for every call. Contract: errors look like { error: { code, message, details } }.
export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw body as ApiError;
  return body as T;
}

// ---- Auth (v0 contract: POST /auth/dev-login, GET /me) ----
export type User = { id: string; name: string; avatar?: string };

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


// ---- Home (GET /home) ----
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
  if (n > 0) attention.push({ id: 'a1', icon: 'heart-outline', title: `${n} new interest request${n > 1 ? 's' : ''}`, description: 'People would like to connect with you', target: 'requests' });
  if (store.active.length > 0) attention.push({ id: 'a2', icon: 'shield-checkmark-outline', title: 'Connection consent pending', description: 'Review what you share with your match', target: 'active' });
  const current = store.active[0] ?? null;
  return {
    userName: 'Aanya',
    unreadNotifications: attention.length,
    attention,
    currentConnection: current,
    stages: buildStages(current?.stage ?? 'connect'),
  };
}

// ---- Connections ----
export async function getReceived(): Promise<ReceivedRequest[]> {
  if (!USE_MOCK) return request('/requests?box=received');
  await delay(); return [...store.received];
}
export async function getSent(): Promise<SentRequest[]> {
  if (!USE_MOCK) return request('/requests?box=sent');
  await delay(); return [...store.sent];
}
export async function getActive(): Promise<Connection[]> {
  if (!USE_MOCK) return request('/connections?status=active');
  await delay(); return [...store.active];
}
export async function getDiscover(): Promise<Person[]> {
  if (!USE_MOCK) return request('/discover');
  await delay(); return [...store.discover];
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
  store.sent.push({ ...person, status: 'Waiting for response' });
}
export async function skipPerson(person: Person): Promise<void> {
  if (USE_MOCK) { await delay(200); store.discover = store.discover.filter((x) => x.id !== person.id); }
}
export async function toggleBookmark(id: string): Promise<boolean> {
  if (!USE_MOCK) { await request(`/bookmarks/${id}`, { method: 'POST' }); return true; }
  store.bookmarks = store.bookmarks.includes(id) ? store.bookmarks.filter((b) => b !== id) : [...store.bookmarks, id];
  return store.bookmarks.includes(id);
}
