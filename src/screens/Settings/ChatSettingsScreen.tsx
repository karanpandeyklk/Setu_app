import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Row, SectionLabel, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const ALLOW_OPTIONS = ['People matching my preferences', 'Everyone', 'Only my connections'];

export default function ChatSettingsScreen({ navigation }: any) {
  const [allowIdx, setAllowIdx] = useState(0);
  const [readReceipts, setReadReceipts] = useState(true);
  const [typing, setTyping] = useState(true);
  const [saveMedia, setSaveMedia] = useState(false);
  const [filter, setFilter] = useState(true);

  return (
    <SettingsScreenLayout
      title="Chat Settings"
      subtitle="Manage your chat experience and privacy."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <SectionLabel>MESSAGE PREFERENCES</SectionLabel>
        <Card>
          <Row
            icon="chatbubble-ellipses"
            title="Allow messages from"
            subtitle={ALLOW_OPTIONS[allowIdx]}
            onPress={() => setAllowIdx((allowIdx + 1) % ALLOW_OPTIONS.length)}
          />
          <Row
            icon="checkmark-done"
            title="Read receipts"
            subtitle="Let others see when you read messages"
            toggle={{ value: readReceipts, onChange: setReadReceipts }}
          />
          <Row
            icon="ellipsis-horizontal"
            title="Typing indicator"
            subtitle="Show when you are typing"
            toggle={{ value: typing, onChange: setTyping }}
          />
          <Row
            icon="download"
            title="Save media to device"
            subtitle="Images and files shared in chat"
            toggle={{ value: saveMedia, onChange: setSaveMedia }}
            last
          />
        </Card>

        <SectionLabel>CHAT SAFETY</SectionLabel>
        <Card>
          <Row
            icon="shield-checkmark"
            title="Filter inappropriate content"
            subtitle="Automatically filter sensitive content"
            tint="#EF4444"
            tintBg="#FDE2E2"
            toggle={{ value: filter, onChange: setFilter }}
          />
          <Row
            icon="flag"
            title="Report chat"
            subtitle="Report inappropriate messages"
            tint="#EF4444"
            tintBg="#FDE2E2"
            onPress={() => navigation.navigate('ReportChat')}
          />
          <Row
            icon="ban"
            title="Blocked users"
            subtitle="Manage blocked accounts"
            tint="#EF4444"
            tintBg="#FDE2E2"
            onPress={() => navigation.navigate('BlockedUsers')}
            last
          />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}