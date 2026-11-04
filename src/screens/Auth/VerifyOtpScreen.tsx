import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import Keypad from '../../components/Keypad';
import OtpInput from '../../components/OtpInput';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme';

const RESEND_SECONDS = 30;

export default function VerifyOtpScreen({ navigation, route }: any) {
  const phone: string = route.params?.phone ?? '';
  const masked = `+91 xxxxx xx${phone.slice(-3)}`;
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const verify = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn(); // dev mode: any 6-digit code is accepted
    } catch {
      setError('Could not sign in. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Back" style={styles.back}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>

      <Text style={styles.title}>Verify your number</Text>
      <Text style={styles.sub}>We've sent a 6-digit code to</Text>
      <Text style={styles.phone}>{masked}</Text>

      <View style={{ marginTop: spacing.xl }}><OtpInput value={code} /></View>
      {!!error && <Text style={styles.error}>{error}</Text>}

      <Text style={styles.resend}>
        Didn't receive the code?{' '}
        {seconds > 0 ? (
          <Text style={styles.bold}>Resend <Text style={styles.timer}>({mm}:{ss})</Text></Text>
        ) : (
          <Text style={[styles.bold, { color: colors.primary }]} onPress={() => setSeconds(RESEND_SECONDS)} accessibilityRole="button">Resend</Text>
        )}
      </Text>

      <View style={{ flex: 1 }} />
      <Keypad onDigit={(d) => setCode((c) => (c.length < 6 ? c + d : c))} onDelete={() => setCode((c) => c.slice(0, -1))} />
      <Button title="Continue" arrow loading={loading} disabled={code.length !== 6} onPress={verify} style={{ marginTop: spacing.lg }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  back: { width: 44, height: 44, justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 24, textAlign: 'center', color: colors.text, marginTop: spacing.lg },
  sub: { fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', color: colors.muted, marginTop: spacing.sm },
  phone: { fontFamily: fonts.semibold, fontSize: 15, textAlign: 'center', color: colors.text, marginTop: 2 },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, textAlign: 'center', marginTop: spacing.md },
  resend: { fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', color: colors.muted, marginTop: spacing.lg },
  bold: { fontFamily: fonts.bold, color: colors.text },
  timer: { fontFamily: fonts.regular, color: colors.muted },
});
