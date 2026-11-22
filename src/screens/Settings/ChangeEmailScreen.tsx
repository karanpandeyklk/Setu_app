import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S } from '../../components/settings/SettingsUI';
import TitleBar from '../../components/settings/TitleBar';
import VerificationNote from '../../components/settings/VerificationNote';
import { settingsFonts } from '../../theme';

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const noOutline: any = Platform.OS === 'web' ? { outlineStyle: 'none', outlineWidth: 0 } : {};

export default function ChangeEmailScreen({ navigation, route }: any) {
  const adding = route.params?.mode === 'add';
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);

  const valid = EMAIL_OK.test(email.trim());
  const showError = email.length > 0 && !valid;

  const next = () => {
    navigation.navigate('VerifyEmail', { email: email.trim(), mode: route.params?.mode ?? 'change' });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <TitleBar
          title={adding ? 'Add a Secondary Email' : 'Change Email Address'}
          subtitle="We'll send a verification code to your new email address."
          onBack={() => navigation.goBack()}
        />

        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 26, paddingBottom: 32 }}>
          <Text style={styles.label}>{adding ? 'Secondary Email Address' : 'New Email Address'}</Text>

          {/* the whole box (icon + text) gets the blue border when focused */}
          <View style={[styles.field, focused && styles.fieldOn, showError && styles.fieldError]}>
            <View style={styles.iconTile}>
              <Ionicons name="mail" size={18} color={S.primary} />
            </View>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="newemail@example.com"
              placeholderTextColor="#94A3B8"
              accessibilityLabel="Email address"
              style={[styles.input, noOutline]}
            />
          </View>
          {showError && <Text style={styles.error}>Enter a valid email address</Text>}

          <VerificationNote channel="email" />

          <ActionButton title="Continue" disabled={!valid} onPress={next} style={{ marginTop: 24 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  wrap: { flex: 1, paddingHorizontal: 20 },
  label: { fontFamily: settingsFonts.bold, fontSize: 13, color: S.text, marginBottom: 10 },
  field: {
    flexDirection: 'row', alignItems: 'center', minHeight: 56, borderRadius: 14, borderWidth: 1.5, borderColor: '#E3E8F0',
    backgroundColor: '#fff', paddingHorizontal: 8,
    shadowColor: '#0F172A', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  fieldOn: { borderColor: S.primary },
  fieldError: { borderColor: S.danger },
  iconTile: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#E9F1FE', alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, marginLeft: 12, fontFamily: settingsFonts.regular, fontSize: 14, color: S.text, minHeight: 44 },
  error: { fontFamily: settingsFonts.regular, fontSize: 12, color: S.danger, marginTop: 6 },
});