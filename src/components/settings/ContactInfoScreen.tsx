import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Row, S, SettingsScreenLayout } from './SettingsUI';

type Action = { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void };

export default function ContactInfoScreen({ title, subtitle, label, icon, value, verified, actions, onBack }: {
  title: string; subtitle: string; label: string; icon: keyof typeof Ionicons.glyphMap;
  value: string; verified?: boolean; actions: Action[]; onBack: () => void;
}) {
  return (
    <SettingsScreenLayout title={title} subtitle={subtitle} bg="#F7F8FC" onBack={onBack}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Text style={styles.label}>{label}</Text>
        <Card>
          <View style={styles.current}>
            <View style={styles.iconWrap}><Ionicons name={icon} size={16} color={S.primary} /></View>
            <Text style={styles.value} numberOfLines={1}>{value}</Text>
            {verified && <View style={styles.pill}><Text style={styles.pillText}>Verified</Text></View>}
          </View>
        </Card>

        <Card style={{ marginTop: 16 }}>
          {actions.map((a, i) => (
            <Row key={a.title} icon={a.icon} title={a.title} subtitle={a.subtitle} onPress={a.onPress} last={i === actions.length - 1} />
          ))}
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '700', color: S.text, marginTop: 16, marginBottom: 8 },
  current: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  iconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: S.primarySoft, alignItems: 'center', justifyContent: 'center' },
  value: { flex: 1, fontSize: 14, fontWeight: '600', color: S.text },
  pill: { backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  pillText: { fontSize: 11, fontWeight: '600', color: '#16A34A' },
});