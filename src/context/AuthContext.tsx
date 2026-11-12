import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearToken, devLogin, getMe, getToken, saveToken, USE_MOCK, User } from '../services/api';

const USER_KEY = 'setu_user'; // the signed-in user (id, name and avatar) is stored here
const PENDING_AVATAR_KEY = 'setu_pending_avatar'; // photo picked before the user object exists
type Session = { token: string; user: User };

type AuthState = {
  user: User | null;
  loading: boolean; // true while checking for a stored session on app start
  signIn: (session?: Session) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  updateAvatar: (pickedUri: string) => Promise<string>; // returns the permanent path it saved
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

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

  // With a session (from the OTP screen) or without one (Google / Apple use the dev login, which is Aanya)
  const signIn = async (session?: Session) => {
    // only treat the argument as a session if it really has a token
    const s = session && typeof session.token === 'string' ? session : await devLogin();
    await saveToken(s.token);

    // If a photo was picked before sign-in, attach it to the user now
    const pending = await AsyncStorage.getItem(PENDING_AVATAR_KEY);
    const nextUser = (pending ? { ...s.user, avatar: pending } : s.user) as User;
    if (pending) await AsyncStorage.removeItem(PENDING_AVATAR_KEY);

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
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

  const signOut = async () => {
    await clearToken();
    await AsyncStorage.multiRemove([USER_KEY, PENDING_AVATAR_KEY, 'setu_profile', 'setu_builder_answers', 'profileBuilder:v1', 'setu_open_builder']);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, updateName, updateAvatar, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}