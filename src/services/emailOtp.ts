import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, USE_MOCK } from './api';

// Mock mode: the code is made here and shown on screen, because nothing can really send an email.
// Real mode: ASSUMED endpoints, not in the v0 contract. Confirm them with Baharath.
let demoCode = '';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendEmailOtp(email: string): Promise<{ demoCode?: string }> {
  if (USE_MOCK) {
    await wait(500);
    demoCode = String(Math.floor(100000 + Math.random() * 900000));
    return { demoCode };
  }
  const r = await request<{ ok: boolean; demoCode?: string }>('/me/email/send-code', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  return { demoCode: r.demoCode }; // only present on staging
}

export async function verifyEmailOtp(email: string, code: string, mode: 'change' | 'add'): Promise<boolean> {
  if (USE_MOCK) {
    await wait(500);
    if (code !== demoCode) return false;
    await AsyncStorage.setItem(mode === 'add' ? 'setu_email_secondary' : 'setu_email', email); // demo copy
    return true;
  }
  try {
    await request('/me/email/verify', { method: 'POST', body: JSON.stringify({ email, code, mode }) });
    return true;
  } catch {
    return false;
  }
}