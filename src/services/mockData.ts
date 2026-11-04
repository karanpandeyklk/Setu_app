// Fictional mock data only. No real names, phone numbers or birth dates.
export const STAGES = ['connect', 'understand', 'reflect', 'discuss', 'agree', 'family', 'reflect_again', 'decision'] as const;
export type StageKey = (typeof STAGES)[number];
export type StageStatus = 'completed' | 'active' | 'locked';

export const STAGE_LABELS: Record<StageKey, string> = {
  connect: 'Connect', understand: 'Understand', reflect: 'Reflect', discuss: 'Discuss',
  agree: 'Agree', family: 'Family', reflect_again: 'Reflect Again', decision: 'Decision',
};

// One function builds the stage list for Home, Journey and Connections, so they always agree.
export function buildStages(current: StageKey) {
  const idx = STAGES.indexOf(current);
  return STAGES.map((key, i) => ({
    key,
    status: (i < idx ? 'completed' : i === idx ? 'active' : 'locked') as StageStatus,
  }));
}

export type Person = { id: string; name: string; age: number; location: string; profession: string; verified?: boolean; online?: boolean };
export type ReceivedRequest = Person & { time: string };
export type SentRequest = Person & { status: string };
export type Connection = Person & { stage: StageKey };

export const store = {
  received: [
    { id: 'r1', name: 'Karthik', age: 28, location: 'Hyderabad', profession: 'Product Manager', time: '2 days ago' },
    { id: 'r2', name: 'Arjun', age: 30, location: 'Chennai', profession: 'Architect', time: '3 days ago' },
    { id: 'r3', name: 'Varun', age: 29, location: 'Pune', profession: 'Doctor', time: '5 days ago' },
    { id: 'r4', name: 'Siddharth', age: 31, location: 'Mumbai', profession: 'Chartered Accountant', time: '1 week ago' },
  ] as ReceivedRequest[],
  sent: [
    { id: 's1', name: 'Aditya', age: 30, location: 'Pune', profession: 'Engineer', status: 'Waiting for response' },
    { id: 's2', name: 'Sai Kiran', age: 29, location: 'Hyderabad', profession: 'Designer', status: 'Waiting for response' },
  ] as SentRequest[],
  active: [
    { id: 'c_rohan', name: 'Rohan', age: 29, location: 'Bengaluru', profession: 'Software Engineer', verified: true, online: true, stage: 'understand' },
  ] as Connection[],
  discover: [
    { id: 'd1', name: 'Nikhil', age: 28, location: 'Delhi', profession: 'Consultant', verified: true },
    { id: 'd2', name: 'Kabir', age: 30, location: 'Jaipur', profession: 'Lawyer' },
    { id: 'd3', name: 'Dev', age: 27, location: 'Kochi', profession: 'Data Analyst', verified: true },
    { id: 'd4', name: 'Ishaan', age: 29, location: 'Ahmedabad', profession: 'Entrepreneur' },
  ] as Person[],
  bookmarks: [] as string[],
};

export const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms));
