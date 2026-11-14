import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Row, SectionLabel, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function AIPrivacyScreen({ navigation }: any) {
  const [profileInfo, setProfileInfo] = useState(true);
  const [preferences, setPreferences] = useState(true);
  const [journeyData, setJourneyData] = useState(true);
  const [chatContext, setChatContext] = useState(true);
  const [privateReflections, setPrivateReflections] = useState(false);

  return (
    <SettingsScreenLayout
      title="AI & Privacy"
      subtitle="Control what information Setu Guide can access and use."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <SectionLabel>PERMISSIONS</SectionLabel>
        <Card>
          <Row
            icon="person"
            title="Profile information"
            subtitle="Basic profile details (name, age, location)"
            toggle={{ value: profileInfo, onChange: setProfileInfo }}
          />
          <Row
            icon="options"
            title="Preferences"
            subtitle="Your partner preferences"
            toggle={{ value: preferences, onChange: setPreferences }}
          />
          <Row
            icon="people"
            title="Setu Journey data"
            subtitle="Your journey progress and insights"
            toggle={{ value: journeyData, onChange: setJourneyData }}
          />
          <Row
            icon="chatbubbles"
            title="Chat context"
            subtitle="Your conversations (with permission)"
            toggle={{ value: chatContext, onChange: setChatContext }}
          />
          <Row
            icon="lock-closed"
            title="Private reflections"
            subtitle="Your personal notes and reflections"
            tint="#7C3AED"
            tintBg="#EDE9FE"
            toggle={{ value: privateReflections, onChange: setPrivateReflections }}
            last
          />
        </Card>

        <SectionLabel>DATA & CONTROLS</SectionLabel>
        <Card>
          <Row
            icon="warning"
            title="Sensitive topics"
            subtitle="Manage topics you prefer not to discuss"
            tint="#F59E0B"
            tintBg="#FEF3C7"
            onPress={() => navigation.navigate('SensitiveTopics')}
          />
          <Row
            icon="analytics"
            title="Data usage & privacy"
            subtitle="How your data is used and protected"
            onPress={() => navigation.navigate('DataUsage')}
            last
          />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}