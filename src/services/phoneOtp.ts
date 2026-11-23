import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, USE_MOCK } from './api';

// Mock mode: the code is made here and shown on screen, because nothing can really send an SMS.
// Real mode: UNCONFIRMED endpoints (/me/phone/send-code, /me/phone/verify), not in the v0 contract.
// Verify paths, payloads, responses and the wrong-code error name against the backend contract
// before setting USE_MOCK=false.
const WRONG_CODE_ERROR = 'INVALID_CODE'; // UNCONFIRMED: replace with the backend's real error code
let demoCode = '';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function sendPhoneOtp(phone: string): Promise<{ demoCode?: string }> {
  if (USE_MOCK) {
    await wait(500);
    demoCode = String(Math.floor(100000 + Math.random() * 900000));
    return { demoCode };
  }
  const r = await request<{ ok: boolean; demoCode?: string }>('/me/phone/send-code', {
    method: 'POST',
    body: JSON.stringify({ phone }),
  });
  return { demoCode: r.demoCode }; // only present on staging
}

export async function verifyPhoneOtp(phone: string, code: string): Promise<boolean> {
  if (USE_MOCK) {
    await wait(500);
    if (code !== demoCode) return false;
    await AsyncStorage.setItem('setu_phone', phone); // demo copy
    return true;
  }
  try {
    await request('/me/phone/verify', { method: 'POST', body: JSON.stringify({ phone, code }) });
    return true;
  } catch (e: any) {
    if (e?.error?.code === WRONG_CODE_ERROR) return false; // wrong code: screen counts an attempt
    throw e; // network, timeout, 404 or 500: screen shows a connection error
  }
}