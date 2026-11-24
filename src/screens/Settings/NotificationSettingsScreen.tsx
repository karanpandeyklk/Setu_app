import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Row, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const FREQUENCY = ['Instant', 'Daily digest', 'Weekly summary'];

export default function NotificationSettingsScreen({ navigation }: any) {
  const [connections, setConnections] = useState(true);
  const [messages, setMessages] = useState(true);
  const [journey, setJourney] = useState(true);
  const [profile, setProfile] = useState(true);
  const [security, setSecurity] = useState(true);
  const [family, setFamily] = useState(false);
  const [freqIdx, setFreqIdx] = useState(0);

  return (
    <SettingsScreenLayout
      title="Notifications"
      subtitle="Choose what updates you want to receive."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Card>
          <Row
            icon="heart"
            title="Connection updates"
            subtitle="New matches, requests and activity"
            tint="#EF4444"
            tintBg="#FDE2E2"
            toggle={{ value: connections, onChange: setConnections }}
          />
          <Row
            icon="chatbubble"
            title="Messages"
            subtitle="New messages and chat activity"
            toggle={{ value: messages, onChange: setMessages }}
          />
          <Row
            icon="star"
            title="Setu Journey updates"
            subtitle="Milestones and guided steps"
            tint="#7C3AED"
            tintBg="#EDE9FE"
            toggle={{ value: journey, onChange: setJourney }}
          />
          <Row
            icon="person"
            title="Profile updates"
            subtitle="Views, interests and profile activity"
            tint="#0D9488"
            tintBg="#CCFBF1"
            toggle={{ value: profile, onChange: setProfile }}
          />
          <Row
            icon="shield-checkmark"
            title="Verification & security"
            subtitle="Security alerts and verification updates"
            tint="#16A34A"
            tintBg="#DCFCE7"
            toggle={{ value: security, onChange: setSecurity }}
          />
          <Row
            icon="people"
            title="Family updates"
            subtitle="Updates related to family involvement"
            tint="#F59E0B"
            tintBg="#FEF3C7"
            toggle={{ value: family, onChange: setFamily }}
            last
          />
        </Card>

        <Card style={{ marginTop: 16 }}>
          <Row
            icon="notifications"
            title="Notification frequency"
            subtitle={`Choose how often you receive notifications · ${FREQUENCY[freqIdx]}`}
            onPress={() => setFreqIdx((freqIdx + 1) % FREQUENCY.length)}
            last
          />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}