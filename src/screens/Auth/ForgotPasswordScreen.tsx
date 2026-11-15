import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';
import Button from '../../components/Button';
import { colors, fonts, spacing } from '../../theme';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isPhone = (v: string) => /^\d{10}$/.test(v.replace(/[\s+-]|^91/g, ''));

export default function ForgotPasswordScreen({ navigation }: any) {
  const [id, setId] = useState('');
  const [sent, setSent] = useState(false);
  const valid = isEmail(id) || isPhone(id);

  const submit = () => {
    // TODO: ask your backend to send a reset link (email) or code (phone)
    setSent(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>

          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.sub}>Enter your email or phone number and we'll help you reset it.</Text>

          <Text style={styles.label}>Email or phone number</Text>
          <AppInput
            value={id}
            onChangeText={(t) => { setId(t); setSent(false); }}
            placeholder="name@example.com or 10-digit number"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />

          {sent && <Text style={styles.success}>If an account exists, we've sent reset instructions.</Text>}

          <Button title="Send reset link" disabled={!valid} onPress={submit} />

          <Pressable onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={styles.backText}>Back to log in</Text>
          </Pressable>
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
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: spacing.xs, lineHeight: 20 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  success: { fontFamily: fonts.semibold, fontSize: 13, color: '#16A34A', marginVertical: spacing.md },
  backLink: { alignItems: 'center', paddingVertical: spacing.lg },
  backText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary },
});