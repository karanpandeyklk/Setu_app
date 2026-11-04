import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import { completeStage } from '../../services/journeyApi';
import { STAGE_INFO, STAGE_TABS } from '../../services/journeyData';
import { STAGES, STAGE_LABELS, StageKey } from '../../services/mockData';
import { colors, fonts, spacing } from '../../theme';

const TABS = [
  { key: 'guidance', label: 'Guidance' }, { key: 'forYou', label: 'For You' },
  { key: 'activities', label: 'Activities' }, { key: 'resources', label: 'Resources' },
] as const;

export default function StageScreen({ navigation, route }: any) {
  const stage: StageKey = route.params.stage;
  const [tab, setTab] = useState<(typeof TABS)[number]['key']>('guidance');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const finish = async () => {
    setBusy(true); setError('');
    try { await completeStage(stage); navigation.navigate('Main'); }
    catch { setError("Couldn't complete this stage. Try again."); }
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={`Stage ${STAGES.indexOf(stage) + 1}: ${STAGE_LABELS[stage]}`} onBack={() => navigation.goBack()} />

      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((t) => (
          <Pressable key={t.key} style={[styles.tab, tab === t.key && styles.tabOn]} onPress={() => setTab(t.key)} accessibilityRole="tab" accessibilityState={{ selected: tab === t.key }}>
            <Text style={[styles.tabText, tab === t.key && { color: colors.primary, fontFamily: fonts.semibold }]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {tab === 'guidance' && (
          <Card style={{ marginBottom: spacing.lg }}>
            <Text style={styles.cardTitle}>What does this stage mean?</Text>
            <Text style={styles.body}>{STAGE_INFO[stage].meaning}</Text>
          </Card>
        )}
        <Text style={styles.section}>{tab === 'guidance' ? 'Suggested for you' : TABS.find((t) => t.key === tab)!.label}</Text>
        {STAGE_TABS[tab].map((item) => (
          <Card key={item.title} style={styles.item}>
            <View style={styles.icon}><Ionicons name={item.icon as any} size={20} color={colors.primary} /></View>
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.body}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Card>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button title="Mark stage complete" loading={busy} onPress={finish} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginHorizontal: spacing.lg },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  tabText: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginBottom: spacing.sm },
  body: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, lineHeight: 19 },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginBottom: spacing.md },
  item: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  footer: { padding: spacing.lg },
  error: { color: colors.danger, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', marginBottom: spacing.sm },
});