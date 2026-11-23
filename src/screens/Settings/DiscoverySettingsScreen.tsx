import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Row, SectionLabel, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function DiscoverySettingsScreen({ navigation }: any) {
  const [showInDiscover, setShowInDiscover] = useState(true);
  const [suggestions, setSuggestions] = useState(true);
  const [hideProfile, setHideProfile] = useState(false);

  return (
    <SettingsScreenLayout
      title="Discovery Settings"
      subtitle="Manage how you appear and who you can discover."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <SectionLabel>DISCOVERY PREFERENCES</SectionLabel>
        <Card>
          <Row
            icon="heart"
            title="Show my profile in Discover"
            subtitle="Your profile will appear to people matching your preferences"
            toggle={{ value: showInDiscover, onChange: setShowInDiscover }}
          />
          <Row
            icon="people"
            title="People who can find me"
            subtitle="People matching my preferences"
            onPress={() => navigation.navigate('WhoCanFindMe')}
          />
          <Row
            icon="location"
            title="Distance visibility"
            subtitle="Show or hide your exact location"
            onPress={() => navigation.navigate('DistanceVisibility')}
          />
          <Row
            icon="calendar"
            title="Age range visibility"
            subtitle="Follow my preferences"
            onPress={() => navigation.navigate('AgeVisibility')}
          />
          <Row
            icon="sparkles"
            title="Profile suggestions"
            subtitle="Get suggested profiles based on your preferences"
            toggle={{ value: suggestions, onChange: setSuggestions }}
            last
          />
        </Card>

        <SectionLabel>DISCOVERY EXPERIENCE</SectionLabel>
        <Card>
          <Row
            icon="eye-off"
            title="Hide profile temporarily"
            subtitle="Pause your profile from appearing in discovery"
            toggle={{ value: hideProfile, onChange: setHideProfile }}
            last
          />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}