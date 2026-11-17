import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import AppInput from '../../components/AppInput';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function ChangeEmailScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const showError = email.length > 0 && !valid;

  const submit = () => {
    // TODO: call your backend to send a verification link to this address
    setSent(true);
  };

  return (
    <SettingsScreenLayout
      title="Email Address"
      subtitle="We'll send a verification link to your new email."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <Text style={styles.label}>New email address</Text>
        <AppInput
          value={email}
          onChangeText={(t) => { setEmail(t); setSent(false); }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="name@example.com"
        />
        {showError && <Text style={styles.error}>Enter a valid email address</Text>}

        <Pressable style={[styles.btn, !valid && styles.btnOff]} disabled={!valid} onPress={submit}>
          <Text style={styles.btnText}>Send verification link</Text>
        </Pressable>

        {sent && <Text style={styles.success}>Link sent. Check your inbox to confirm the change.</Text>}
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: S.text, marginTop: 18, marginBottom: 8 },
  error: { fontSize: 12, color: S.danger, marginTop: 6 },
  btn: { marginTop: 24, height: 52, borderRadius: 26, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: '#CBD5E1' },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  success: { fontSize: 13, color: '#16A34A', fontWeight: '600', marginTop: 16 },
});