import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, devLogin, getMe, getToken, saveToken, User } from '../services/api';

type AuthState = {
  user: User | null;
  loading: boolean; // true while checking for a stored session on app start
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({} as AuthState);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore stored session on app start
  useEffect(() => {
    (async () => {
      try {
        if (await getToken()) setUser(await getMe());
      } catch {
        await clearToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async () => {
    const { token, user } = await devLogin(); // OTP / Google / Apple all map to dev login for now
    await saveToken(token);
    setUser(user);
  };
  const signOut = async () => {
    await clearToken();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
