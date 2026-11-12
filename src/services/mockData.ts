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

export type Person = {
  id: string; name: string; age: number; location: string; profession: string; verified?: boolean; online?: boolean;
  education?: string; bio?: string; photo?: string; // photo: add an image URL when you have one
};
export type ReceivedRequest = Person & { time: string };
export type SentRequest = Person & { status: string; time?: string };
export type Connection = Person & { stage: StageKey };
export type NotificationItem = {
  id: string; icon: string; title: string; body: string; time: string; unread: boolean;
  target?: 'requests' | 'active' | 'guide'; // where tapping the notification goes
};
export type PausedConnection = Person & { stage: StageKey; pausedOn: string };

export const store = {
  received: [
    { id: 'r1', name: 'Karthik', age: 28, location: 'Hyderabad', profession: 'Product Manager', time: '2 days ago' },
    { id: 'r2', name: 'Arjun', age: 30, location: 'Chennai', profession: 'Architect', time: '3 days ago' },
    { id: 'r3', name: 'Varun', age: 29, location: 'Pune', profession: 'Doctor', time: '5 days ago' },
    { id: 'r4', name: 'Siddharth', age: 31, location: 'Mumbai', profession: 'Chartered Accountant', time: '1 week ago' },
  ] as ReceivedRequest[],
  sent: [
    { id: 's1', name: 'Kamal', age: 26, location: 'Mumbai, Maharashtra', profession: 'Engineer', status: 'Waiting for response', time: '3 days ago', online: true },
    { id: 's2', name: 'Lokesh', age: 27, location: 'Hyderabad, Telangana', profession: 'Designer', status: 'Waiting for response', time: '5 days ago', online: true },
    { id: 's3', name: 'Charan', age: 26, location: 'Bengaluru, Karnataka', profession: 'Analyst', status: 'Waiting for response', time: '1 week ago', online: true },
  ] as SentRequest[],
  active: [
    { id: 'c_rohan', name: 'Rohan', age: 29, location: 'Bengaluru', profession: 'Software Engineer', verified: true, online: true, stage: 'understand' },
  ] as Connection[],
  discover: [
    { id: 'd1', name: 'Nikhil', age: 28, location: 'Delhi, NCR', profession: 'Consultant', verified: true, online: true, education: 'IIT Delhi', bio: 'I value meaningful conversations, family, and personal growth. Looking for a kind and supportive partner.' },
    { id: 'd2', name: 'Kabir', age: 30, location: 'Jaipur, Rajasthan', profession: 'Lawyer', online: true, education: 'NLU Jodhpur', bio: 'Calm, curious and close to my family. I enjoy long walks and honest conversations.' },
    { id: 'd3', name: 'Dev', age: 27, location: 'Kochi, Kerala', profession: 'Data Analyst', verified: true, online: true, education: 'NIT Calicut', bio: 'Weekend cyclist and amateur cook. I am looking for someone to build a warm, balanced life with.' },
    { id: 'd4', name: 'Ishaan', age: 29, location: 'Ahmedabad, Gujarat', profession: 'Entrepreneur', education: 'IIM Ahmedabad', bio: 'Building a business and a life with good values. Family and trust matter most to me.' },
    { id: 'd5', name: 'Aarav', age: 28, location: 'Chennai, Tamil Nadu', profession: 'Architect', online: true, education: 'Anna University', bio: 'I love design, travel and quiet evenings. Hoping to meet someone thoughtful and kind.' },
    { id: 'd6', name: 'Rishi', age: 27, location: 'Lucknow, Uttar Pradesh', profession: 'Software Engineer', online: true, education: 'IIIT Lucknow', bio: 'Easygoing and family-oriented, with a love for music.' },
    { id: 'd7', name: 'Pranav', age: 28, location: 'Bhopal, Madhya Pradesh', profession: 'Teacher', verified: true, online: true, education: 'MA, Barkatullah University', bio: 'Patient, curious and always learning something new.' },
    { id: 'd8', name: 'Vihaan', age: 26, location: 'Kolkata, West Bengal', profession: 'Designer', online: true, education: 'NIFT Kolkata', bio: 'Creative at heart, grounded in family values.' },
    { id: 'd9', name: 'Atharv', age: 29, location: 'Pune, Maharashtra', profession: 'Doctor', online: true, education: 'AIIMS', bio: 'Caring, hardworking and happiest on a mountain trail.' },
  ] as Person[],
  bookmarks: [] as string[],
  readNotifications: [] as string[],
  paused: [
    { id: 'p1', name: 'Neel', age: 27, location: 'Pune, Maharashtra', profession: 'Doctor', online: true, stage: 'connect', pausedOn: '12 Aug 2026' },
    { id: 'p2', name: 'Yash', age: 26, location: 'Delhi, NCR', profession: 'Designer', online: true, stage: 'understand', pausedOn: '05 Aug 2026' },
  ] as PausedConnection[],
  closed: [
    { id: 'x1', name: 'Omkar', age: 30, location: 'Nagpur', profession: 'Engineer' },
    { id: 'x2', name: 'Rahul', age: 29, location: 'Indore', profession: 'Analyst' },
    { id: 'x3', name: 'Sameer', age: 31, location: 'Surat', profession: 'Banker' },
  ] as Person[],
};

// ---- Testing the error states ----
// In mock mode nothing uses the network, so airplane mode does nothing.
// Set `on: true`, save, and every mock call below fails like a dropped connection.
// Set it back to false when you are done.
export const SIMULATE_ERROR = { on: false };

export const delay = (ms = 500) =>
  new Promise<void>((resolve, reject) =>
    setTimeout(() => (SIMULATE_ERROR.on ? reject(new Error('Simulated network error')) : resolve()), ms));