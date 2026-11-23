import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPreferences, Preferences, PrefSection, savePreferences } from '../../services/preferencesStore';

// Back to the Preferences tab of "View My Profile"
export const exitToProfile = (navigation: any) => navigation.navigate('ProfileDetail', { mode: 'own', tab: 'Preferences' });

export function usePrefSection<S extends PrefSection>(section: S) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [values, setValues] = useState<Preferences[S] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<'next' | 'exit' | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    getPreferences(userId)
      .then((p) => { if (alive) setValues(p[section]); })
      .catch(() => { if (alive) setError("Couldn't load your preferences. Go back and try again."); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [userId, section]);

  const set = useCallback(<K extends keyof Preferences[S]>(key: K, value: Preferences[S][K]) => {
    setValues((prev) => (prev ? { ...prev, [key]: value } : prev));
  }, []);

  // saves this page, then runs `after` (go to the next page, or leave)
  const save = async (kind: 'next' | 'exit', after: () => void) => {
    if (!values) return;
    setBusy(kind);
    setError('');
    try {
      await savePreferences(userId, section, values);
      setBusy(null);
      after();
    } catch {
      setBusy(null);
      setError("Couldn't save your preferences. Try again.");
    }
  };

  return { values, set, busy, error, loading, save };
}