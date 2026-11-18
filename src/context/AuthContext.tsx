import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearToken, devLogin, getMe, getToken, saveToken, USE_MOCK, User } from '../services/api';

const USER_KEY = 'setu_user'; // the signed-in user (id, name and avatar) is stored here
const PENDING_AVATAR_KEY = 'setu_pending_avatar'; // photo picked before the user object exists
const ACTIVE_PHONE_KEY = 'setu_active_phone'; // the phone number the current profile data belongs to
// Onboarding + profile data the rest of the app reads. These are kept per phone number across logout.
const PROFILE_KEYS = ['setu_profile', 'setu_builder_answers', 'profileBuilder:v1'];
const archiveKey = (phone: string) => `setu_archive:${phone}`;

type Session = { token: string; user: User };

type AuthState = {
  user: User | null;
  loading: boolean; // true while checking for a stored session on app start
  signIn: (session?: Session) => Promise<void>;
  loginWithPassword: (creds: { identifier: string; password: string }) => Promise<void>;
  // Returning user check: restores the saved profile for this phone. Returns null for a new user.
  restoreProfile: (phone: string) => Promise<{ user?: Partial<User> } | null>;
  updateName: (name: string) => Promise<void>;
  updateAvatar: (pickedUri: string) => Promise<string>; // returns the permanent path it saved
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

// Onboarding is complete when name, date of birth and gender were saved
function isComplete(raw: string | null | undefined): boolean {
  try {
    const p = JSON.parse(raw || '');
    return !!(p?.name && p?.dob && p?.gender);
  } catch {
    return false;
  }
}

// Save the current user's profile data under their phone number, so it survives logout
async function archiveCurrentProfile() {
  const phone = await AsyncStorage.getItem(ACTIVE_PHONE_KEY);
  if (!phone) return;
  const pairs = await AsyncStorage.multiGet([USER_KEY, ...PROFILE_KEYS]);
  const bag: Record<string, string> = {};
  pairs.forEach(([k, v]) => { if (v != null) bag[k] = v; });
  if (isComplete(bag.setu_profile)) await AsyncStorage.setItem(archiveKey(phone), JSON.stringify(bag));
}

// The image picker returns a path in the cache folder, which Android can delete at any time.
// Copy it into the app's permanent folder and use that path instead.
// Run `npx expo install expo-file-system` once if it isn't installed.
async function persistImage(uri: string): Promise<string> {
  if (!uri || !uri.startsWith('file://')) return uri; // remote URLs and data URIs are fine as they are
  try {
    let FS: any;
    try {
      FS = require('expo-file-system/legacy'); // newer Expo SDKs
    } catch {
      FS = require('expo-file-system'); // older Expo SDKs
    }
    const dest = `${FS.documentDirectory}avatar-${Date.now()}.jpg`;
    await FS.copyAsync({ from: uri, to: dest });
    return dest;
  } catch (e) {
    console.log('AVATAR COPY FAILED, keeping original path', e);
    return uri; // still shows now, but may disappear after a restart
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore the stored session when the app starts
  useEffect(() => {
    (async () => {
      try {
        if (await getToken()) {
          const stored = await AsyncStorage.getItem(USER_KEY);
          if (stored) {
            setUser(JSON.parse(stored)); // the same user as before, with the same name and photo
          } else if (!USE_MOCK) {
            setUser(await getMe());
          } else {
            await clearToken(); // old login with no saved user: start fresh
          }
        }
      } catch {
        await clearToken();
        await AsyncStorage.removeItem(USER_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Google / Apple (dev) call signIn() with nothing and get the dev user (Aanya).
  // The OTP screen and password login call it with a real session.
  const signIn = async (session?: Session) => {
    let s: Session;
    if (session === undefined) {
      s = await devLogin();
    } else if (typeof session.token === 'string') {
      s = session;
    } else {
      // Something was passed but it is not a session. Fail loudly instead of silently logging in as Aanya.
      throw new Error('Invalid session');
    }

    await saveToken(s.token);

    // If a photo was picked before sign-in, attach it to the user now
    const pending = await AsyncStorage.getItem(PENDING_AVATAR_KEY);
    const nextUser = (pending ? { ...s.user, avatar: pending } : s.user) as User;
    if (pending) await AsyncStorage.removeItem(PENDING_AVATAR_KEY);

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

  // Called by the OTP screen after the code is correct.
  // Returning user (onboarding already done for this phone): puts their saved profile back and returns it.
  // New user: returns null, and the app goes through onboarding.
  const restoreProfile = async (phone: string) => {
    const active = await AsyncStorage.getItem(ACTIVE_PHONE_KEY);

    // A different person was using this device: save their data under their number and clear it
    if (active && active !== phone) {
      await archiveCurrentProfile();
      await AsyncStorage.multiRemove([...PROFILE_KEYS, 'setu_open_builder']);
    }
    await AsyncStorage.setItem(ACTIVE_PHONE_KEY, phone);

    // Same phone and the data is still here
    if (active === phone && isComplete(await AsyncStorage.getItem('setu_profile'))) return {};

    // Same phone, data saved at the last logout
    const archived = await AsyncStorage.getItem(archiveKey(phone));
    if (!archived) return null;
    try {
      const bag: Record<string, string> = JSON.parse(archived);
      if (!isComplete(bag.setu_profile)) return null;
      const entries = PROFILE_KEYS.filter((k) => bag[k] != null).map((k) => [k, bag[k]] as [string, string]);
      await AsyncStorage.multiSet(entries);
      return { user: bag[USER_KEY] ? JSON.parse(bag[USER_KEY]) : undefined };
    } catch {
      return null;
    }
  };

  // Email or phone + password. Checks the credentials, then signs in with the session it gets back.
  const loginWithPassword = async ({ identifier, password }: { identifier: string; password: string }) => {
    let session: Session;

    // TODO: replace this block with your real API call.
    // It should return { token, user }, or throw when the credentials are wrong.
    // Example:
    // const res = await fetch(`${API_URL}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ identifier, password }),
    // });
    // if (!res.ok) throw new Error('Incorrect email/phone or password');
    // session = await res.json();

    // Temporary test account so you can try the screen without a backend (dev builds only)
    if (__DEV__ && identifier.toLowerCase() === 'test@example.com' && password === 'Test@1234') {
      session = await devLogin();
    } else {
      throw new Error('Incorrect email/phone or password');
    }

    await signIn(session);
  };

  // Called from the "What's your name?" screen
  const updateName = async (name: string) => {
    if (!user) return;
    const updated = { ...user, name };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

  // Called from the photo screens (onboarding and edit profile) with the picker's URI
  const updateAvatar = async (pickedUri: string): Promise<string> => {
    const saved = await persistImage(pickedUri);
    if (!user) {
      // not signed in yet: keep it and apply it in signIn()
      await AsyncStorage.setItem(PENDING_AVATAR_KEY, saved);
      return saved;
    }
    const updated = { ...user, avatar: saved } as User;
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
    return saved;
  };

  // Logout ends the session only. The profile is saved under the phone number first, so the same
  // person is not asked for their details again, and a different person never sees them.
  const signOut = async () => {
    await archiveCurrentProfile();
    await clearToken();
    await AsyncStorage.multiRemove([USER_KEY, PENDING_AVATAR_KEY, ...PROFILE_KEYS, 'setu_open_builder']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, loginWithPassword, restoreProfile, updateName, updateAvatar, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}