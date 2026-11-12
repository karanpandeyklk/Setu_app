import { getActive, request, USE_MOCK } from './api';
import { loadReflect } from './journeyApi';
import { Answer, Question } from './journeyData';
import { delay } from './mockData';

export type ResultsData = {
  questions: Question[];
  mine: Record<string, Answer>;
  theirs: Record<string, Answer>; // only the answers the match chose to share
  matchName: string;
  matchAnswered: number; // how many questions the match has finished, shared or not
};

// Fictional mock. Rohan shared 6 answers and kept 4 private (q3, q5, q8, q10).
// Private answers are simply absent from this object: the real backend must also leave them
// out in the query, and the screen never hides anything itself.
const MOCK_MATCH_SHARED: Record<string, Answer> = {
  q1: { value: ['Time with family', 'Travel or day trips'], sharing: 'share_with_match' },
  q2: { value: 'Quiet time at home', sharing: 'share_with_match' },
  q4: { value: 'With my family', sharing: 'share_with_match' },
  q6: { value: 4, sharing: 'share_with_match' },
  q7: { value: 'I want to grow into a leadership role while keeping a healthy balance with family.', sharing: 'share_with_match' },
  q9: { value: 3, sharing: 'share_with_match' },
};

export async function getReflectResults(): Promise<ResultsData> {
  const base = await loadReflect(); // the questions and my own answers
  const c = (await getActive())[0];

  if (USE_MOCK) {
    await delay(400);
    return {
      questions: base.questions, mine: base.answers, theirs: MOCK_MATCH_SHARED,
      matchName: c?.name ?? 'Rohan', matchAnswered: base.questions.length,
    };
  }

  if (!c) throw new Error('no active connection');
  // ASSUMED endpoint, not in the v0 contract: confirm the path and fields with Baharath.
  // It must return only the answers the match shared.
  const r = await request<{ answers: Record<string, Answer>; answeredCount: number }>(`/connections/${c.id}/reflect/match-answers`);
  return { questions: base.questions, mine: base.answers, theirs: r.answers, matchName: c.name, matchAnswered: r.answeredCount };
}