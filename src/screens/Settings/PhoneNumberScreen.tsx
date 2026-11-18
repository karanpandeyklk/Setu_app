import React from 'react';
import ContactInfoScreen from '../../components/settings/ContactInfoScreen';
import { useAuth } from '../../context/AuthContext';

export default function PhoneNumberScreen({ navigation }: any) {
  const { user } = useAuth() as any;
  return (
    <ContactInfoScreen
      title="Phone Number"
      subtitle="Manage your phone number for account security and alerts."
      label="Current Phone Number"
      icon="call"
      value={user?.phone ?? '+91 98765 43210'}
      verified={user?.phoneVerified ?? true} // TODO: use the real verification flag
      onBack={() => navigation.goBack()}
      actions={[
        { icon: 'call', title: 'Change Phone Number', subtitle: 'Update your existing number', onPress: () => navigation.navigate('PhoneChange', { mode: 'change' }) },
        { icon: 'phone-portrait', title: 'Add Another Number', subtitle: 'Add a secondary number (optional)', onPress: () => navigation.navigate('PhoneChange', { mode: 'add' }) },
      ]}
    />
  );
}