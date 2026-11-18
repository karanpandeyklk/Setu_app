import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';
import BottomButton from '../../components/settings/BottomButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { settingsFonts } from '../../theme';

export default function ChangeEmailScreen({ navigation, route }: any) {
  const adding = route.params?.mode === 'add';
  const [email, setEmail] = useState('');

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const showError = email.length > 0 && !valid;

  const next = () => {
    // TODO: ask your backend to email a 6-digit code to this address
    navigation.navigate('VerifyEmail', { email: email.trim(), mode: route.params?.mode ?? 'change' });
  };

  return (
    <SettingsScreenLayout
      inline
      title={adding ? 'Add a Secondary Email' : 'Change Email Address'}
      subtitle="We'll send a verification code to your new email address."
      bg="#FFFFFF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <Text style={styles.label}>{adding ? 'Secondary Email Address' : 'New Email Address'}</Text>
        <View>
          <AppInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="newemail@example.com"
            style={{ minHeight: 52, borderRadius: 12, borderWidth: 1, paddingLeft: 58, fontFamily: settingsFonts.regular }}
          />
          <View style={styles.icon} pointerEvents="none">
            <Ionicons name="mail" size={16} color={S.primary} />
          </View>
        </View>
        {showError && <Text style={styles.error}>Enter a valid email address</Text>}

        <View style={styles.info}>
          <Ionicons name="shield-checkmark" size={16} color={S.primary} />
          <Text style={styles.infoText}>You will receive a 6-digit verification code via email.</Text>
        </View>

        <BottomButton inline title="Continue" disabled={!valid} onPress={next} />
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: settingsFonts.semibold, fontSize: 12, color: S.text, marginTop: 20, marginBottom: 8 },
  icon: {
    position: 'absolute', left: 10, top: 10, width: 32, height: 32, borderRadius: 8,
    backgroundColor: S.primarySoft, alignItems: 'center', justifyContent: 'center',
  },
  error: { fontFamily: settingsFonts.regular, fontSize: 12, color: S.danger, marginTop: 6 },
  info: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16,
    backgroundColor: '#EEF4FF', borderWidth: 1, borderColor: '#DCE8FF', borderRadius: 12, padding: 14,
  },
  infoText: { flex: 1, fontFamily: settingsFonts.regular, fontSize: 11.5, lineHeight: 17, color: S.muted },
});