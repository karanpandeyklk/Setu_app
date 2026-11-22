import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import BottomButton from '../../components/settings/BottomButton';
import DangerCard from '../../components/settings/DangerCard';
import { SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { useAuth } from '../../context/AuthContext';

export default function DeactivateAccountScreen({ navigation }: any) {
  const auth = useAuth() as any;
  const logout = auth.signOut ?? auth.logout ?? auth.signout;
  const [busy, setBusy] = useState(false);

  const deactivate = async () => {
    setBusy(true);
    try {
      // TODO: call your backend to deactivate the account first
      await logout?.(); // back to the Welcome screen; logging in again reactivates the account
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsScreenLayout
      title="Deactivate Account"
      subtitle="You can reactivate your account anytime by logging back in."
      bg="#FFFFFF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}>
        <DangerCard
          title="What happens when you deactivate?"
          items={[
            'Your profile will be hidden from others.',
            "You won't appear in search or suggestions.",
            'Your chats will be saved but not visible.',
            'You can reactivate anytime.',
          ]}
        />
      </ScrollView>
      <BottomButton title={busy ? 'Deactivating…' : 'Deactivate Account'} color="#DC2626" disabled={busy} onPress={deactivate} />
    </SettingsScreenLayout>
  );
}