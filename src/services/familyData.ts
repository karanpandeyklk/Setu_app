import { delay } from './mockData';

export type Status = 'active' | 'pending';
export type Member = { id: string; relation: string; status: Status };

export const RELATIONS = ['Mother', 'Father', 'Elder Sister', 'Younger Sister', 'Elder Brother', 'Younger Brother', 'Other'];

// Fictional mock data, matching the Figma list. Replace with real endpoints when the backend has them.
let members: Member[] = [
  { id: 'f1', relation: 'Mother', status: 'active' },
  { id: 'f2', relation: 'Father', status: 'active' },
  { id: 'f3', relation: 'Elder Sister', status: 'pending' },
];

export async function getMembers(): Promise<Member[]> {
  await delay(400);
  return [...members];
}

export async function addMember(relation: string): Promise<void> {
  await delay(400);
  members = [...members, { id: `f${Date.now()}`, relation, status: 'pending' }];
}

export async function removeMember(id: string): Promise<void> {
  await delay(400);
  members = members.filter((m) => m.id !== id);
}

export async function resendInvite(id: string): Promise<void> {
  await delay(400); // a real backend would send the invitation again
}