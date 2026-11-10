import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme';

// RootNavigator reads this flag after sign-in to decide whether to open the profile builder.
export const OPEN_BUILDER_KEY = 'setu_open_builder';

export default function OnboardingSuccessScreen({ route }: any) {
  const { signIn } = useAuth();
  const { session, basics, languages, photoUri } = route.params;
  const [busy, setBusy] = useState<'home' | 'builder' | null>(null);
  const [error, setError] = useState('');

  // The account is created here: save the profile on the phone, then sign in with the typed name.
  // (Mock only. The real backend would store this profile and return the user.)
  const finish = async (openBuilder: boolean) => {
    setBusy(openBuilder ? 'builder' : 'home');
    setError('');
    try {
      await AsyncStorage.setItem('setu_profile', JSON.stringify({ ...basics, languages, photoUri }));
      // Must be written BEFORE signIn: signing in swaps the navigator to the signed-in stack.
      if (openBuilder) await AsyncStorage.setItem(OPEN_BUILDER_KEY, '1');
      else await AsyncStorage.removeItem(OPEN_BUILDER_KEY);
      await signIn({ ...session, user: { ...session.user, name: basics.name } });
    } catch {
      setError("Couldn't finish sign-in. Try again.");
      setBusy(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.circle}><Ionicons name="checkmark" size={40} color="#fff" /></View>
        <Text style={styles.title}>Your Sambandh{'\n'}profile is ready!</Text>
        <Text style={styles.sub}>You can now explore Sambandh. Add more about yourself whenever you're ready.</Text>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </View>
      <Button title="Go to Home" loading={busy === 'home'} disabled={busy !== null} onPress={() => finish(false)} />
      <Button
        title="Build my profile"
        variant="outline"
        loading={busy === 'builder'}
        disabled={busy !== null}
        onPress={() => finish(true)}
        style={{ marginTop: spacing.md }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  circle: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 34, color: colors.text, textAlign: 'center', marginTop: spacing.xl },
  sub: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.muted, textAlign: 'center', marginTop: spacing.md },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, textAlign: 'center', marginTop: spacing.md },
});