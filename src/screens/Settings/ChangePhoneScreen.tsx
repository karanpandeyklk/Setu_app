import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function ChangePhoneScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const phoneOk = phone.length === 10;

  const onContinue = () => {
    // TODO: real SMS send once the backend phone OTP endpoints are confirmed
    navigation.navigate('VerifyPhone', { phone });
  };

  return (
    <SettingsScreenLayout
      title="Change Phone Number"
      subtitle="We'll send a verification code to your new number."
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <View style={styles.body}>
        <View>
          <Text style={styles.label}>New Phone Number</Text>
          <Pressable
            style={[styles.inputRow, focused && styles.inputRowFocused]}
            onPress={() => inputRef.current?.focus()}
          >
            <Text style={styles.flag}>🇮🇳</Text>
            <Text style={styles.code}>+91</Text>
            <Ionicons name="chevron-down" size={14} color="#64748B" />
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="number-pad"
              placeholder="Enter phone number"
              placeholderTextColor="#94A3B8"
              accessibilityLabel="New phone number"
            />
          </Pressable>

          <View style={styles.info}>
            <Ionicons name="shield-checkmark" size={16} color={S.primary} />
            <Text style={styles.infoText}>You will receive a 6-digit verification code via SMS.</Text>
          </View>
        </View>

        <Pressable
          style={[styles.btn, !phoneOk && styles.btnOff]}
          disabled={!phoneOk}
          onPress={onContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue"
        >
          <Text style={styles.btnText}>Continue</Text>
        </Pressable>
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, justifyContent: 'space-between', paddingTop: 16, paddingBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: S.text, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6, height: 52, paddingHorizontal: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff',
  },
  inputRowFocused: { borderColor: S.primary },
  flag: { fontSize: 18 },
  code: { fontSize: 14, fontWeight: '600', color: S.text, marginLeft: 2 },
  input: { flex: 1, fontSize: 14, color: S.text, marginLeft: 8, outlineStyle: 'none' } as any,
  info: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16, padding: 14,
    borderRadius: 14, backgroundColor: '#EAF1FF', borderWidth: 1, borderColor: '#DBE7FF',
  },
  infoText: { flex: 1, fontSize: 12, color: '#475569' },
  btn: { height: 52, borderRadius: 26, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: '#CBD5E1' },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});