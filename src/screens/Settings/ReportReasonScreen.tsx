import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const USER_REASONS = ['Inappropriate behaviour', 'Harassment or unwanted contact', 'Fake or misleading profile', 'Scam or suspicious activity', 'Offensive or abusive content', 'Safety concern', 'Other'];
const CONTENT_REASONS = ['Harassment or abuse', 'Inappropriate content', 'Spam', 'Scam or fraud', 'Misleading information', 'Safety concern', 'Other'];

export default function ReportReasonScreen({ navigation, route }: any) {
  const kind: 'user' | 'content' = route.params?.kind === 'content' ? 'content' : 'user';
  const reasons = kind === 'user' ? USER_REASONS : CONTENT_REASONS;
  const [reason, setReason] = useState(reasons[0]);

  return (
    <SettingsScreenLayout
      title={kind === 'user' ? 'Report a User' : 'Report Content'}
      subtitle={kind === 'user' ? 'Tell us what is happening. Your report is confidential.' : 'Tell us what content you want to report.'}
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <View style={styles.body}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}>
          {/* TODO: show the real reported user / content once the backend provides it */}
          <View style={styles.target}>
  {kind === 'content' ? (
    <View style={styles.thumb}>
      <Ionicons name="image" size={20} color="#fff" />
    </View>
  ) : (
    <View style={styles.avatar}><Ionicons name="person" size={18} color={S.primary} /></View>
  )}
  <View style={{ flex: 1 }}>
    {/* TODO: demo data; replace with the real reported user / content when the backend provides it */}
    <Text style={styles.targetTitle}>{kind === 'user' ? 'User A' : 'Photo'}</Text>
    <Text style={styles.targetSub}>{kind === 'user' ? 'View profile' : 'From User B • Today, 10:30 AM'}</Text>
  </View>
  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
</View>

          <Text style={styles.heading}>{kind === 'user' ? 'Why are you reporting this user?' : 'Why are you reporting this content?'}</Text>
          {reasons.map((r) => {
            const on = r === reason;
            return (
              <Pressable key={r} style={[styles.option, kind === 'user' && styles.optionCard]} onPress={() => setReason(r)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={r}>
                <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.dot} />}</View>
                <Text style={styles.optionText}>{r}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <ActionButton title="Continue" onPress={() => navigation.navigate('ReportDetails', { kind, reason })} style={{ marginBottom: 24 }} />
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  target: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEF2F7' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EAF1FF', alignItems: 'center', justifyContent: 'center' },
  targetTitle: { fontSize: 14, fontWeight: '700', color: S.text },
  targetSub: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  heading: { fontSize: 14, fontWeight: '700', color: S.text, marginTop: 22, marginBottom: 12 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  thumb: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#7FA7C9', alignItems: 'center', justifyContent: 'center' },
  optionCard: { paddingHorizontal: 14, marginBottom: 8, borderRadius: 12, backgroundColor: '#fff' },
  optionText: { fontSize: 13.5, color: S.text },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: S.primary },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: S.primary },
});