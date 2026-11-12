import { request, USE_MOCK, User } from './api';

// Put the Web client ID from Google Cloud Console in .env (and keep .env out of Git):
// EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=1234567890-xxxx.apps.googleusercontent.com
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

export type GoogleProfile = { idToken: string; name: string; email?: string; photo?: string };

const unavailable = (message: string) => Object.assign(new Error(message), { code: 'GOOGLE_UNAVAILABLE' });

// Opens the Google account picker and returns the person's profile and ID token.
// Returns null if they close the picker. Throws code 'GOOGLE_UNAVAILABLE' when the native
// module is missing, which is always the case in Expo Go (it needs a development build).
export async function getGoogleProfile(): Promise<GoogleProfile | null> {
  let mod: any;
  try {
    mod = require('@react-native-google-signin/google-signin');
  } catch {
    throw unavailable('Google sign-in is not available in this build (Expo Go cannot run it).');
  }
  const { GoogleSignin, statusCodes } = mod;
  if (!GoogleSignin) throw unavailable('Google sign-in module not found.');
  if (!WEB_CLIENT_ID) throw unavailable('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set.');

  try {
    GoogleSignin.configure({ webClientId: WEB_CLIENT_ID, scopes: ['profile', 'email'] });
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const res = await GoogleSignin.signIn();
    if (res?.type === 'cancelled') return null;
    const data = res?.data ?? res; // newer versions wrap the result in { type, data }
    const idToken: string | undefined = data?.idToken;
    const u = data?.user;
    if (!idToken || !u) throw new Error('Google did not return an ID token.');
    return { idToken, name: u.name || u.givenName || '', email: u.email, photo: u.photo || undefined };
  } catch (e: any) {
    if (e?.code === statusCodes?.SIGN_IN_CANCELLED) return null;
    throw e;
  }
}

// Turns a Google profile into an app session ({ token, user }), the shape AuthContext.signIn expects.
export async function googleLogin(g: GoogleProfile): Promise<{ token: string; user: User }> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    return { token: 'mock-token', user: { id: `g_${g.email ?? g.name}`, name: g.name, avatar: g.photo } };
  }
  // Not in the v0 contract: confirm POST /auth/google (takes { idToken }, returns { token, user }) with Baharath.
  // The server must verify the ID token with Google before trusting it.
  return request('/auth/google', { method: 'POST', body: JSON.stringify({ idToken: g.idToken }) });
}