import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Row, SectionLabel, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function PrivacyVisibilityScreen({ navigation }: any) {
  const [showInDiscover, setShowInDiscover] = useState(true);
  const [requests, setRequests] = useState(true);
  const [online, setOnline] = useState(false);
  const [readStatus, setReadStatus] = useState(false);

  return (
    <SettingsScreenLayout
      title="Privacy & Visibility"
      subtitle="Control who can see your profile and how you appear on Sambandh Setu."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <SectionLabel>PROFILE VISIBILITY</SectionLabel>
        <Card>
          <Row icon="heart" title="Show my profile in Discover" subtitle="Your profile will appear to people matching your preference."
            toggle={{ value: showInDiscover, onChange: setShowInDiscover }} />
          <Row icon="people" title="Who can see my profile?" subtitle="People matching my preferences"
            onPress={() => navigation.navigate('WhoCanFindMe')} />
          <Row icon="person-add" title="Allow connection requests"
            toggle={{ value: requests, onChange: setRequests }} />
          <Row icon="chatbox" title="Show online status"
            toggle={{ value: online, onChange: setOnline }} />
          <Row icon="checkmark-done" title="Show read status"
            toggle={{ value: readStatus, onChange: setReadStatus }} last />
        </Card>

        <SectionLabel>SHARING & ACCESS</SectionLabel>
        <Card>
          <Row icon="person" title="Profile information sharing" subtitle="Control what information is visible"
            onPress={() => navigation.navigate('ProfileSharing')} />
          <Row icon="people" title="Family access" subtitle="Allow trusted family members to view"
            onPress={() => navigation.navigate('FamilyAccess')} last />
        </Card>

        <SectionLabel>SAFETY</SectionLabel>
        <Card>
          <Row icon="ban" title="Blocked Users" subtitle="Manage blocked accounts"
            tint="#EF4444" tintBg="#FDE2E2" onPress={() => navigation.navigate('BlockedUsers')} />
          <Row icon="notifications-outline" title="Report & Safety" subtitle="Report a user or content"
            tint="#7C3AED" tintBg="#F3E8FF" onPress={() => navigation.navigate('ReportSafety')} last />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}