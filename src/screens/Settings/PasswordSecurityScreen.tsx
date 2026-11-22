import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Row, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function PasswordSecurityScreen({ navigation }: any) {
  const [bio, setBio] = useState(true);
  const [twoFA, setTwoFA] = useState(true);
  const [alerts, setAlerts] = useState(true);

  return (
    <SettingsScreenLayout
      title="Password & Security"
      subtitle="Keep your account safe and secure."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Card>
          <Row icon="lock-closed" title="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
          <Row icon="finger-print" title="Use Biometrics" subtitle="Use fingerprint or face ID to log in" toggle={{ value: bio, onChange: setBio }} />
          <Row icon="shield-checkmark" title="Two-Factor Authentication" subtitle="Add an extra layer of security" tint="#16A34A" tintBg="#DCFCE7" toggle={{ value: twoFA, onChange: setTwoFA }} />
          <Row icon="notifications" title="Login Alerts" subtitle="Get notified about new logins" tint="#F59E0B" tintBg="#FEF3C7" toggle={{ value: alerts, onChange: setAlerts }} />
          <Row icon="phone-portrait" title="Manage Devices" subtitle="View and manage your logged-in devices" onPress={() => navigation.navigate('Devices')} last />
        </Card>
        <Card style={{ marginTop: 20, backgroundColor: '#FEF2F2' }}>
          <Row icon="trash" title="Delete Account" danger onPress={() => navigation.navigate('DeleteAccount')} last />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}