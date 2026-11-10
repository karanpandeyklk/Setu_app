import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearToken, devLogin, getMe, getToken, saveToken, USE_MOCK, User } from '../services/api';

const USER_KEY = 'setu_user'; // the signed-in user (id and name) is stored here
type Session = { token: string; user: User };

type AuthState = {
  user: User | null;
  loading: boolean; // true while checking for a stored session on app start
  signIn: (session?: Session) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

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
            setUser(JSON.parse(stored)); // the same user as before, with the same name
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
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(s.user));
  setUser(s.user);
};

  // Called from the "What's your name?" screen
  const updateName = async (name: string) => {
    if (!user) return;
    const updated = { ...user, name };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(updated);
  };

const signOut = async () => {
  await clearToken();
  await AsyncStorage.multiRemove([USER_KEY, 'setu_profile', 'setu_builder_answers', 'profileBuilder:v1', 'setu_open_builder']);
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, signIn, updateName, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}