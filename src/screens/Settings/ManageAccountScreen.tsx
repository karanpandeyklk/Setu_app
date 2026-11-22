import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Row, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function ManageAccountScreen({ navigation }: any) {
  return (
    <SettingsScreenLayout title="Manage Account" subtitle="Control, download or remove your account and data." bg="#F7F8FC" onBack={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <Card style={styles.gap}>
          <Row icon="download" title="Download Your Data" subtitle="Get a copy of your information" onPress={() => navigation.navigate('DownloadData')} last />
        </Card>
        <Card style={styles.gap}>
          <Row icon="time" title="Deactivate Account" subtitle="Temporarily deactivate your account" onPress={() => navigation.navigate('DeactivateAccount')} last />
        </Card>
        <Card style={styles.gap}>
          <Row icon="trash" title="Delete Account" subtitle="Permanently delete your account" tint="#EF4444" tintBg="#FDE2E2" onPress={() => navigation.navigate('DeleteAccount')} last />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  gap: { marginBottom: 12 },
});