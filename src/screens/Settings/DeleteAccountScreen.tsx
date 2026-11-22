import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomButton from '../../components/settings/BottomButton';
import DangerCard from '../../components/settings/DangerCard';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { settingsFonts } from '../../theme';

export default function DeleteAccountScreen({ navigation }: any) {
  const [agreed, setAgreed] = useState(false);

  return (
    <SettingsScreenLayout
      title="Delete Account"
      subtitle="We're sorry to see you go. Please read the following carefully."
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: 120 }}>
        <DangerCard
          warning
          title="This action cannot be undone."
          items={[
            'Your profile, photos and personal information will be permanently deleted.',
            'Your chats and connections will be removed.',
            'You will lose access to your account.',
          ]}
        />

        <Pressable style={styles.check} onPress={() => setAgreed((a) => !a)}>
          <Ionicons
            name={agreed ? 'checkbox' : 'square-outline'}
            size={20}
            color={agreed ? '#DC2626' : '#94A3B8'}
          />
          <Text style={styles.checkText}>I understand that this action is permanent and cannot be undone.</Text>
        </Pressable>
      </ScrollView>

      <BottomButton
        title="Delete Account"
        color="#DC2626"
        offColor="#F58A8A"
        disabled={!agreed}
        onPress={() => navigation.navigate('ConfirmDeletion')}
      />
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  check: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 20, paddingHorizontal: 4 },
  checkText: { flex: 1, fontFamily: settingsFonts.regular, fontSize: 11.5, lineHeight: 17, color: S.muted },
});