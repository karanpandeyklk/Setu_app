import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Row, S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function SetuGuideSettingsScreen({ navigation }: any) {
  const [enabled, setEnabled] = useState(true);
  const [chatContext, setChatContext] = useState(true);
  const [reflections, setReflections] = useState(false);

  return (
    <SettingsScreenLayout
      title="Setu Guide"
      subtitle="Manage your AI companion and get personalized guidance."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Card>
          <Row
            icon="sparkles"
            title="Setu Guide"
            subtitle="Your personal guidance companion"
            tint="#7C3AED"
            tintBg="#EDE9FE"
            toggle={{ value: enabled, onChange: setEnabled }}
            last
          />
        </Card>

        {/* The rest only matters while the guide is on */}
        <View style={{ opacity: enabled ? 1 : 0.5 }} pointerEvents={enabled ? 'auto' : 'none'}>
          <Card style={{ marginTop: 16 }}>
            <Row
              icon="folder-open"
              title="What Setu Guide can access"
              subtitle="Profile information, preferences, journey data"
              onPress={() => navigation.navigate('AIPrivacy')}
            />
            <Row
              icon="chatbubbles"
              title="Use chat context"
              subtitle="Allow Setu Guide to understand your chats for better guidance"
              tint="#16A34A"
              tintBg="#DCFCE7"
              toggle={{ value: chatContext, onChange: setChatContext }}
            />
            <Row
              icon="lock-closed"
              title="Use private reflections"
              subtitle="Allow Setu Guide to use your reflections for guidance"
              tint="#7C3AED"
              tintBg="#EDE9FE"
              toggle={{ value: reflections, onChange: setReflections }}
            />
            <Row
              icon="time"
              title="AI conversation history"
              subtitle="View or delete your Setu Guide chats"
              onPress={() => navigation.navigate('AIHistory')}
            />
            <Row
              icon="warning"
              title="Sensitive topics"
              subtitle="Manage topics Setu Guide should avoid"
              tint="#F59E0B"
              tintBg="#FEF3C7"
              onPress={() => navigation.navigate('SensitiveTopics')}
              last
            />
          </Card>
        </View>

        <View style={styles.banner}>
          <Ionicons name="shield-checkmark" size={18} color={S.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Your privacy matters</Text>
            <Text style={styles.bannerText}>
              Setu Guide only uses the information you allow. You can change these settings anytime.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row', gap: 10, alignItems: 'flex-start',
    backgroundColor: S.primarySoft, borderRadius: 14, padding: 14, marginTop: 20,
  },
  bannerTitle: { fontSize: 13, fontWeight: '700', color: S.primary },
  bannerText: { fontSize: 12, color: S.muted, marginTop: 2, lineHeight: 17 },
});