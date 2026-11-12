import { request, USE_MOCK } from './api';
import { delay } from './mockData';

export type NotifType = 'request' | 'stage' | 'message' | 'guide';
export type Notif = { id: string; type: NotifType; title: string; body: string; time: string; read: boolean };

// Fictional mock data. The real endpoints are GET /notifications and POST /notifications/{id}/read.
let items: Notif[] = [
  { id: 'n1', type: 'request', title: 'New interest request', body: 'Karthik, 28 would like to connect with you.', time: '2h ago', read: false },
  { id: 'n2', type: 'message', title: 'New message from Rohan', body: 'That sounds like a lovely plan!', time: '3h ago', read: false },
  { id: 'n3', type: 'stage', title: 'Stage unlocked', body: 'You can now start the next stage of your journey.', time: 'Yesterday', read: true },
  { id: 'n4', type: 'guide', title: 'Tip from Setu Guide', body: 'Try a conversation idea for your next chat.', time: '2 days ago', read: true },
];

export async function getNotifications(): Promise<Notif[]> {
  if (!USE_MOCK) return request('/notifications');
  await delay(400);
  return [...items];
}

export async function markRead(id: string): Promise<void> {
  if (!USE_MOCK) return request(`/notifications/${id}/read`, { method: 'POST' });
  items = items.map((n) => (n.id === id ? { ...n, read: true } : n));
}

export async function markAllRead(): Promise<void> {
  if (!USE_MOCK) {
    const all = await request<Notif[]>('/notifications');
    await Promise.all(all.filter((n) => !n.read).map((n) => request(`/notifications/${n.id}/read`, { method: 'POST' })));
    return;
  }
  items = items.map((n) => ({ ...n, read: true }));
}

// Used by the red dot on the bell
export async function getUnreadCount(): Promise<number> {
  try {
    return (await getNotifications()).filter((n) => !n.read).length;
  } catch {
    return 0;
  }
}