import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';
import Button from '../../components/Button';
import { colors, fonts, spacing } from '../../theme';
import { useAuth } from '../../context/AuthContext';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => /^\d{10}$/.test(v.replace(/[\s+-]|^91/g, ''));

export default function LoginScreen({ navigation }: any) {
  const auth = useAuth() as any;
  const login = auth.loginWithPassword; // checks the credentials, does not use the dev login

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const idOk = isEmail(id) || isPhone(id);
  const idError = id.length > 0 && !idOk ? 'Enter a valid email or 10-digit phone number' : '';
  const valid = idOk && password.length >= 6;

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      // On success AuthContext sets `user`, and RootNavigator switches to the signed-in app by itself.
      await login({ identifier: id.trim(), password });
    } catch (e: any) {
      setError(e?.message ?? 'Incorrect email/phone or password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.sub}>Log in to continue your Sambandh Setu journey.</Text>

          <Text style={styles.label}>Email or phone number</Text>
          <AppInput
            value={id}
            onChangeText={(t) => { setId(t); setError(''); }}
            placeholder="name@example.com or 10-digit number"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            accessibilityLabel="Email or phone number"
          />
          {!!idError && <Text style={styles.error}>{idError}</Text>}

          <Text style={styles.label}>Password</Text>
          <View>
            <AppInput
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              placeholder="Enter your password"
              secureTextEntry={!show}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ paddingRight: 48 }}
              accessibilityLabel="Password"
            />
            <Pressable onPress={() => setShow((s) => !s)} hitSlop={10} style={styles.eye} accessibilityLabel={show ? 'Hide password' : 'Show password'}>
              <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.muted} />
            </Pressable>
          </View>

          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgot} hitSlop={8}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {!!error && <Text style={[styles.error, { textAlign: 'center', marginBottom: spacing.sm }]}>{error}</Text>}

          <Button title={busy ? 'Logging in…' : 'Log in'} disabled={!valid || busy} onPress={submit} />

          <Pressable onPress={() => navigation.navigate('CreateAccount', { mode: 'login' })} style={styles.otp}>
            <Text style={styles.otpText}>Log in with OTP instead</Text>
          </Pressable>

          <Text style={styles.footer}>
            New here?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('CreateAccount', { mode: 'signup' })}>
              Create account
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  back: { marginTop: spacing.sm, alignSelf: 'flex-start' },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.text, marginTop: spacing.lg },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: spacing.xs },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  error: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: spacing.xs },
  eye: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  forgot: { alignSelf: 'flex-end', marginTop: spacing.md, marginBottom: spacing.lg },
  forgotText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary },
  otp: { alignItems: 'center', paddingVertical: spacing.md },
  otpText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
  footer: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.md },
  link: { fontFamily: fonts.semibold, color: colors.primary },
});