import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import AppInput from '../../components/AppInput';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function ChangePhoneScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [done, setDone] = useState(false);

  const phoneOk = phone.length === 10;
  const otpOk = otp.length === 6;

  const sendOtp = () => {
    // TODO: call your backend to send the OTP to +91{phone}
    setSent(true);
  };
  const verify = () => {
    // TODO: verify the OTP with your backend, then update the user's phone
    setDone(true);
  };

  return (
    <SettingsScreenLayout
      title="Phone Number"
      subtitle="We'll send a code to verify your new number."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <Text style={styles.label}>New mobile number</Text>
        <AppInput
          value={phone}
          onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))}
          keyboardType="number-pad"
          placeholder="Enter 10-digit number"
          editable={!sent}
        />

        {!sent && (
          <Pressable style={[styles.btn, !phoneOk && styles.btnOff]} disabled={!phoneOk} onPress={sendOtp}>
            <Text style={styles.btnText}>Send code</Text>
          </Pressable>
        )}

        {sent && !done && (
          <>
            <Text style={styles.label}>Enter the 6-digit code</Text>
            <AppInput
              value={otp}
              onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              placeholder="······"
            />
            <Pressable style={[styles.btn, !otpOk && styles.btnOff]} disabled={!otpOk} onPress={verify}>
              <Text style={styles.btnText}>Verify and update</Text>
            </Pressable>
            <Pressable style={styles.link} onPress={() => { setSent(false); setOtp(''); }}>
              <Text style={styles.linkText}>Change number</Text>
            </Pressable>
          </>
        )}

        {done && <Text style={styles.success}>Phone number updated.</Text>}
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: S.text, marginTop: 18, marginBottom: 8 },
  btn: { marginTop: 24, height: 52, borderRadius: 26, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: '#CBD5E1' },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  link: { alignItems: 'center', paddingVertical: 14 },
  linkText: { fontSize: 14, fontWeight: '600', color: S.primary },
  success: { fontSize: 14, color: '#16A34A', fontWeight: '600', marginTop: 20 },
});