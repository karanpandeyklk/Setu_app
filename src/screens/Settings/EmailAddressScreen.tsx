import React from 'react';
import ContactInfoScreen from '../../components/settings/ContactInfoScreen';
import { useAuth } from '../../context/AuthContext';

export default function EmailAddressScreen({ navigation }: any) {
  const { user } = useAuth() as any;
  return (
    <ContactInfoScreen
      title="Email Address"
      subtitle="Manage your email address for account security and important updates."
      label="Current Email Address"
      icon="mail"
      value={user?.email ?? 'aanya.k@example.com'}
      verified={user?.emailVerified ?? true} // TODO: use the real verification flag
      onBack={() => navigation.goBack()}
      actions={[
        { icon: 'mail', title: 'Change Email Address', subtitle: 'Update your email address', onPress: () => navigation.navigate('EmailChange', { mode: 'change' }) },
        { icon: 'mail-open', title: 'Add a Secondary Email', subtitle: 'Add another email for backup (optional)', onPress: () => navigation.navigate('EmailChange', { mode: 'add' }) },
      ]}
    />
  );
}