import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import OtpBoxes from '../../components/settings/OtpBoxes';
import { S } from '../../components/settings/SettingsUI';
import TitleBar from '../../components/settings/TitleBar';
import { sendEmailOtp, verifyEmailOtp } from '../../services/emailOtp';
import { settingsFonts } from '../../theme';

const WAIT = 30;
const MAX_ATTEMPTS = 5;

export default function VerifyEmailScreen({ navigation, route }: any) {
  const email: string = route.params?.email ?? '';
  const mode: 'change' | 'add' = route.params?.mode === 'add' ? 'add' : 'change';

  const [code, setCode] = useState('');
  const [left, setLeft] = useState(WAIT);
  const [attempts, setAttempts] = useState(0);
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [demoCode, setDemoCode] = useState<string | undefined>();

  const locked = attempts >= MAX_ATTEMPTS;

  // send the first code when the screen opens
  useEffect(() => {
    let alive = true;
    sendEmailOtp(email)
      .then((r) => { if (alive) setDemoCode(r.demoCode); })
      .catch(() => { if (alive) setError("Couldn't send the code. Tap Resend to try again."); });
    return () => { alive = false; };
  }, [email]);

  // resend countdown
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const resend = async () => {
    if (sending) return;
    setSending(true);
    setError('');
    setCode('');
    setAttempts(0);
    try {
      const r = await sendEmailOtp(email);
      setDemoCode(r.demoCode);
      setLeft(WAIT);
    } catch {
      setError("Couldn't send a new code. Try again.");
    }
    setSending(false);
  };

  const verify = async () => {
    if (code.length < 6 || locked || busy) return;
    setError('');
    setBusy(true);
    try {
      const ok = await verifyEmailOtp(email, code, mode);
      if (ok) {
        setBusy(false);
        navigation.replace('EmailUpdated', { mode });
        return;
      }
      const used = attempts + 1;
      setAttempts(used);
      setCode('');
      setError(
        used >= MAX_ATTEMPTS
          ? 'Too many wrong tries. Please request a new code.'
          : `Incorrect code. ${MAX_ATTEMPTS - used} ${MAX_ATTEMPTS - used === 1 ? 'try' : 'tries'} left.`
      );
    } catch {
      setError('Could not verify. Check your connection and try again.');
    }
    setBusy(false);
  };

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.wrap}>
          <TitleBar
            title="Verify Email Address"
            subtitle={<>Enter the 6-digit code sent to{'\n'}<Text style={styles.email}>{email}</Text></>}
            onBack={() => navigation.goBack()}
          />

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
            {/* Demo mode only: nothing can really send an email without a backend */}
            {!!demoCode && (
              <View style={styles.demo}>
                <Ionicons name="information-circle-outline" size={16} color={S.primary} />
                <Text style={styles.demoText}>Demo mode: your code is <Text style={styles.demoCode}>{demoCode}</Text></Text>
              </View>
            )}

            <View style={styles.boxes}>
              <OtpBoxes value={code} onChange={(v) => { setCode(v); setError(''); }} />
            </View>

            {!!error && <Text style={styles.error}>{error}</Text>}

            <Text style={styles.resendRow}>
              Didn't receive the code?{' '}
              {left > 0 && !locked ? (
                <Text style={styles.resendBold}>Resend <Text style={styles.timer}>({mm}:{ss})</Text></Text>
              ) : (
                <Text style={[styles.resendBold, { color: S.primary }]} onPress={resend} accessibilityRole="button">
                  {sending ? 'Sending...' : 'Resend'}
                </Text>
              )}
            </Text>

            <ActionButton title="Verify" loading={busy} disabled={code.length < 6 || locked} onPress={verify} style={{ marginTop: 40 }} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFD' },
  wrap: { flex: 1, paddingHorizontal: 20 },
  email: { fontFamily: settingsFonts.semibold, color: S.text },
  demo: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: '#EEF3FD', borderRadius: 999, paddingHorizontal: 12, minHeight: 34, marginTop: 16 },
  demoText: { fontFamily: settingsFonts.regular, fontSize: 12, color: S.muted },
  demoCode: { fontFamily: settingsFonts.bold, letterSpacing: 2, color: S.text },
  boxes: { paddingHorizontal: 12 }, // narrows the row so the boxes sit closer together, as in the Figma
  error: { fontFamily: settingsFonts.regular, fontSize: 12.5, color: S.danger, textAlign: 'center', marginTop: 14 },
  resendRow: { fontFamily: settingsFonts.regular, fontSize: 12, color: S.muted, textAlign: 'center', marginTop: 30 },
  resendBold: { fontFamily: settingsFonts.bold, color: S.text },
  timer: { fontFamily: settingsFonts.regular, color: S.muted },
});