import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

function Row({ icon, bg, color, title, sub, onPress }: { icon: any; bg: string; color: string; title: string; sub: string; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      <View style={[styles.circle, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
    </Pressable>
  );
}

export default function ReportSafetyScreen({ navigation }: any) {
  return (
    <SettingsScreenLayout
      title="Report & Safety"
      subtitle="Help keep Sambandh Setu safe for everyone."
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <View style={{ paddingTop: 16, gap: 12 }}>
        <Row icon="person" bg="#EFE9FF" color="#7C5CE0" title="Report a user" sub="Report someone for behaviour that concerns you." onPress={() => navigation.navigate('ReportReason', { kind: 'user' })} />
        <Row icon="flag" bg="#FFEBDD" color="#F97316" title="Report content" sub="Report a message, photo, profile information, or other content." onPress={() => navigation.navigate('ReportReason', { kind: 'content' })} />

        <Text style={styles.section}>SAFETY</Text>
        <Row icon="ban" bg="#FDE7E7" color="#DC2626" title="Block someone" sub="Prevent a user from contacting or interacting with you." onPress={() => navigation.navigate('BlockedUsers')} />

        <View style={styles.urgent}>
          <Ionicons name="shield-checkmark" size={20} color={S.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.urgentTitle}>Need urgent help?</Text>
            <Text style={styles.urgentText}>If you feel unsafe or threatened, prioritize your personal safety and contact appropriate local emergency support.</Text>
          </View>
        </View>
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#fff', shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: '700', color: S.text },
  sub: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  section: { fontSize: 11, fontWeight: '600', color: '#64748B', letterSpacing: 0.5, marginTop: 8 },
  urgent: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#EAF1FF', borderWidth: 1, borderColor: '#DBE7FF', marginTop: 4 },
  urgentTitle: { fontSize: 13, fontWeight: '700', color: S.primary },
  urgentText: { fontSize: 11.5, lineHeight: 17, color: '#475569', marginTop: 4 },
});