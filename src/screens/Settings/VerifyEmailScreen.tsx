import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import BottomButton from '../../components/settings/BottomButton';
import OtpBoxes from '../../components/settings/OtpBoxes';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { settingsFonts } from '../../theme';

const WAIT = 30;

export default function VerifyEmailScreen({ navigation, route }: any) {
  const email: string = route.params?.email ?? '';
  const mode: string = route.params?.mode ?? 'change';

  const [code, setCode] = useState('');
  const [left, setLeft] = useState(WAIT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const resend = () => {
    // TODO: ask your backend to send a new code
    setCode('');
    setError('');
    setLeft(WAIT);
  };

  const verify = async () => {
    setError('');
    setBusy(true);
    try {
      // TODO: send { email, code } to your backend. It must check the code and save the new email.
      // If the code is wrong, throw so the message below shows.
      navigation.replace('EmailUpdated', { mode });
    } catch (e: any) {
      setError(e?.message ?? 'Incorrect code. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <SettingsScreenLayout
      inline
      title="Verify Email Address"
      subtitle={`Enter the 6-digit code sent to\n${email}`}
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <OtpBoxes value={code} onChange={(v) => { setCode(v); setError(''); }} />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.resendRow}>
          Didn't receive the code?{' '}
          {left > 0 ? (
            <Text style={styles.resendBold}>Resend <Text style={styles.timer}>({mm}:{ss})</Text></Text>
          ) : (
            <Text style={[styles.resendBold, { color: S.primary }]} onPress={resend}>Resend</Text>
          )}
        </Text>

        <BottomButton inline title={busy ? 'Verifying…' : 'Verify'} disabled={code.length < 6 || busy} onPress={verify} />
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  error: { fontFamily: settingsFonts.regular, fontSize: 12, color: S.danger, textAlign: 'center', marginTop: 14 },
  resendRow: { fontFamily: settingsFonts.regular, fontSize: 11.5, color: S.muted, textAlign: 'center', marginTop: 20 },
  resendBold: { fontFamily: settingsFonts.bold, color: S.text },
  timer: { fontFamily: settingsFonts.regular, color: S.muted },
});