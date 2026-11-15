import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { useAuth } from '../../context/AuthContext';

export default function DeleteAccountScreen({ navigation }: any) {
  const auth = useAuth() as any;
  const logout = auth.signOut ?? auth.logout ?? auth.signout;
  const [text, setText] = useState('');
  const ok = text.trim().toUpperCase() === 'DELETE';

  const confirm = async () => {
    // TODO: call your backend to delete the account first
    await logout?.();
  };

  return (
    <SettingsScreenLayout
      title="Delete Account"
      subtitle="This action cannot be undone."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <View style={styles.warn}>
          <Ionicons name="warning" size={20} color={S.danger} />
          <Text style={styles.warnText}>
            Deleting your account permanently removes your profile, connections, chats and Setu Journey progress.
          </Text>
        </View>

        <Text style={styles.label}>Type DELETE to confirm</Text>
        <AppInput value={text} onChangeText={setText} autoCapitalize="characters" placeholder="DELETE" />

        <Pressable style={[styles.btn, !ok && styles.btnOff]} disabled={!ok} onPress={confirm}>
          <Text style={styles.btnText}>Delete my account</Text>
        </Pressable>
        <Pressable style={styles.cancel} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Keep my account</Text>
        </Pressable>
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  warn: { flexDirection: 'row', gap: 10, backgroundColor: S.dangerSoft, borderRadius: 16, padding: 14 },
  warnText: { flex: 1, fontSize: 13, color: '#7F1D1D', lineHeight: 19 },
  label: { fontSize: 13, fontWeight: '600', color: S.text, marginTop: 22, marginBottom: 8 },
  btn: { marginTop: 24, height: 52, borderRadius: 26, backgroundColor: S.danger, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: '#F3B4B4' },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  cancel: { marginTop: 12, alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontSize: 14, fontWeight: '600', color: S.primary },
});