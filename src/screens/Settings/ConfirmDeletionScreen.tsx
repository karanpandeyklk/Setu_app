import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';
import BottomButton from '../../components/settings/BottomButton';
import DangerCard from '../../components/settings/DangerCard';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { settingsFonts } from '../../theme';

export default function ConfirmDeletionScreen({ navigation }: any) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setError('');
    setBusy(true);
    try {
      // TODO: send the password to your backend. It must check the password and delete the account.
      // If the password is wrong, throw an error so the message below shows.
      navigation.reset({ index: 0, routes: [{ name: 'AccountDeleted' }] });
    } catch (e: any) {
      setError(e?.message ?? 'Incorrect password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsScreenLayout
      title="Confirm Deletion"
      subtitle="Please enter your password to confirm."
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}>
        <Text style={styles.label}>Password</Text>
        <View>
          <AppInput
            value={password}
            onChangeText={(t) => { setPassword(t); setError(''); }}
            secureTextEntry={!show}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Enter your password"
            style={{ minHeight: 48, borderRadius: 10, borderWidth: 1, paddingRight: 44, fontFamily: settingsFonts.regular }}
          />
          <Pressable onPress={() => setShow((s) => !s)} hitSlop={10} style={styles.eye} accessibilityLabel={show ? 'Hide password' : 'Show password'}>
            <Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94A3B8" />
          </Pressable>
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={{ marginTop: 18 }}>
          <DangerCard
            warning
            title="This action cannot be undone."
            items={[
              'Your profile, photos and personal information will be permanently deleted.',
              'Your chats and connections will be removed.',
              'You will lose access to your account.',
            ]}
          />
        </View>
      </ScrollView>

      <BottomButton
        title={busy ? 'Deleting…' : 'Delete Account'}
        color="#DC2626"
        offColor="#F58A8A"
        disabled={password.length === 0 || busy}
        onPress={confirm}
      />
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: settingsFonts.semibold, fontSize: 12, color: S.text, marginTop: 14, marginBottom: 8 },
  eye: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  error: { fontFamily: settingsFonts.regular, fontSize: 12, color: S.danger, marginTop: 6 },
});