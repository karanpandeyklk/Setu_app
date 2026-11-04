import AsyncStorage from '@react-native-async-storage/async-storage';
import { getActive, request, USE_MOCK } from './api';
import { Answer, QUESTIONS, Question, Sharing } from './journeyData';
import { buildStages, Connection, delay, StageKey, STAGES, store } from './mockData';

const ANSWERS_KEY = 'reflect_answers';
const META_KEY = 'reflect_meta'; // { privacySeen, defaultSharing }

async function connId() {
  const a = await getActive();
  return a[0]?.id ?? null;
}

// GET journey: the one source for Home, Journey and Connections
export async function getJourney(): Promise<{ connection: Connection | null; stages: ReturnType<typeof buildStages> }> {
  if (USE_MOCK) {
    await delay();
    const c = store.active[0] ?? null;
    return { connection: c, stages: c ? buildStages(c.stage) : [] };
  }
  const [c] = await request<Connection[]>('/connections?status=active');
  if (!c) return { connection: null, stages: [] };
  const j = await request<{ stages: ReturnType<typeof buildStages> }>(`/connections/${c.id}/journey`);
  return { connection: c, stages: j.stages };
}

export async function completeStage(stage: StageKey): Promise<void> {
  if (!USE_MOCK) {
    const id = await connId();
    return request(`/connections/${id}/stages/${stage}/complete`, { method: 'POST' });
  }
  await delay(300);
  const c = store.active[0];
  const i = STAGES.indexOf(stage);
  if (c && c.stage === stage && i < STAGES.length - 1) c.stage = STAGES[i + 1];
}

export type ReflectData = {
  questions: Question[];
  answers: Record<string, Answer>;
  privacySeen: boolean;
  defaultSharing: Sharing;
};

export async function loadReflect(): Promise<ReflectData> {
  if (!USE_MOCK) {
    // Adjust the field names to Baharath's final contract
    const id = await connId();
    const [questions, progress] = await Promise.all([
      request<Question[]>(`/connections/${id}/reflect/questions`),
      request<{ answers: Record<string, Answer>; privacySeen: boolean; defaultSharing: Sharing }>(`/connections/${id}/reflect/progress`),
    ]);
    return { questions, ...progress };
  }
  const [a, m] = await Promise.all([AsyncStorage.getItem(ANSWERS_KEY), AsyncStorage.getItem(META_KEY)]);
  const meta = m ? JSON.parse(m) : { privacySeen: false, defaultSharing: 'keep_private' };
  return { questions: QUESTIONS, answers: a ? JSON.parse(a) : {}, ...meta };
}

// Always saved on the phone first, so Save & Exit never loses an answer. Then sent to the server.
export async function saveAnswer(questionId: string, answer: Answer): Promise<void> {
  const raw = await AsyncStorage.getItem(ANSWERS_KEY);
  const all = raw ? JSON.parse(raw) : {};
  all[questionId] = answer;
  await AsyncStorage.setItem(ANSWERS_KEY, JSON.stringify(all));
  if (!USE_MOCK) {
    const id = await connId();
    await request(`/connections/${id}/reflect/answers/${questionId}`, { method: 'PUT', body: JSON.stringify(answer) });
  }
}

export async function savePrivacyChoice(defaultSharing: Sharing): Promise<void> {
  await AsyncStorage.setItem(META_KEY, JSON.stringify({ privacySeen: true, defaultSharing }));
  if (!USE_MOCK) await request('/me/sharing-default', { method: 'PUT', body: JSON.stringify({ sharing: defaultSharing }) });
}