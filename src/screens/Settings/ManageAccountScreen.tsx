import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Row, S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function ManageAccountScreen({ navigation }: any) {
  const [requested, setRequested] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [deactivated, setDeactivated] = useState(false);

  return (
    <SettingsScreenLayout
      title="Manage Account"
      subtitle="Download your data or deactivate your account."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <Card>
          <Row
            icon="download"
            title="Download my data"
            subtitle={requested ? "Requested. We'll email you a download link." : 'Get a copy of your profile and activity'}
            onPress={() => setRequested(true)} // TODO: call your backend export endpoint
          />
          <Row
            icon="pause-circle"
            title="Deactivate account"
            subtitle={deactivated ? 'Your profile is hidden until you log in again' : 'Hide your profile. You can come back anytime'}
            tint="#F59E0B"
            tintBg="#FEF3C7"
            onPress={() => setConfirmDeactivate(true)}
          />
          <Row
            icon="trash"
            title="Delete account"
            subtitle="Permanently remove your account and data"
            danger
            onPress={() => navigation.navigate('DeleteAccount')}
            last
          />
        </Card>

        {confirmDeactivate && !deactivated && (
          <View style={styles.confirm}>
            <Text style={styles.confirmTitle}>Deactivate your account?</Text>
            <Text style={styles.confirmText}>Your profile will be hidden from Discover and others won't be able to message you. Logging in again reactivates it.</Text>
            <View style={styles.actions}>
              <Pressable style={styles.cancel} onPress={() => setConfirmDeactivate(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.ok}
                onPress={() => { /* TODO: call backend to deactivate */ setDeactivated(true); setConfirmDeactivate(false); }}
              >
                <Text style={styles.okText}>Deactivate</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  confirm: { marginTop: 20, backgroundColor: '#fff', borderRadius: 20, padding: 16 },
  confirmTitle: { fontSize: 15, fontWeight: '700', color: S.text },
  confirmText: { fontSize: 13, color: S.muted, lineHeight: 19, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancel: { flex: 1, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  cancelText: { fontSize: 14, fontWeight: '600', color: S.text },
  ok: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#F59E0B', alignItems: 'center', justifyContent: 'center' },
  okText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});