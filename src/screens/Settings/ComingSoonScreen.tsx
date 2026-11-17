import React from 'react';
import { Text } from 'react-native';
import { SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function ComingSoonScreen({ navigation, route }: any) {
  return (
    <SettingsScreenLayout title={route.params?.title ?? route.name} subtitle="This screen is coming soon." onBack={() => navigation.goBack()}>
      <Text style={{ color: '#64748B', marginTop: 12 }}>We're still building this page.</Text>
    </SettingsScreenLayout>
  );
}