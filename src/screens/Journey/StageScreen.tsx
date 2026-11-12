import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { completeStage } from '../../services/journeyApi';
import { STAGES, STAGE_LABELS, StageKey } from '../../services/mockData';
import { REMINDERS, STAGE_PAGE, SUGGESTIONS, TabKey } from '../../services/stageContent';
import { colors, fonts, radius, spacing } from '../../theme';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'guidance', label: 'Guidance' }, { key: 'forYou', label: 'For You' },
  { key: 'activities', label: 'Activities' }, { key: 'resources', label: 'Resources' },
];

// Two simple figures for the "What does this stage mean?" card (the real art is an image from Figma)
const Figure = ({ body }: { body: string }) => (
  <View style={{ alignItems: 'center', marginHorizontal: 18 }}>
    <View style={styles.head} />
    <View style={[styles.body, { backgroundColor: body }]} />
  </View>
);

export default function StageScreen({ navigation, route }: any) {
  const stage: StageKey = route.params.stage;
  const page = STAGE_PAGE[stage];
  const title = `Stage ${STAGES.indexOf(stage) + 1}: ${STAGE_LABELS[stage]}`;

  const [tab, setTab] = useState<TabKey>('guidance');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [note, setNote] = useState('');

  const finish = async () => {
    setBusy(true); setError('');
    try { await completeStage(stage); navigation.navigate('Main'); }
    catch { setError("Couldn't complete this stage. Try again."); }
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar: back, centered title, menu */}
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{title}</Text>
        <Pressable onPress={() => setMenuOpen(!menuOpen)} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>
      {menuOpen && (
        <Pressable style={styles.menu} onPress={() => { setMenuOpen(false); navigation.navigate('Guide'); }} accessibilityRole="button" accessibilityLabel="Ask Setu Guide">
          <Ionicons name="sparkles-outline" size={18} color={colors.text} />
          <Text style={styles.menuText}>Ask Setu Guide</Text>
        </Pressable>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Stage header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}><Ionicons name={page.icon as any} size={26} color={colors.primary} /></View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerText}>{page.intro}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs} accessibilityRole="tablist">
          {TABS.map((t) => {
            const on = tab === t.key;
            return (
              <Pressable key={t.key} style={[styles.tab, on && styles.tabOn]} onPress={() => { setTab(t.key); setNote(''); }} accessibilityRole="tab" accessibilityState={{ selected: on }}>
                <Text style={[styles.tabText, on && { color: colors.primary, fontFamily: fonts.semibold }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {tab === 'guidance' && (
          <View style={styles.meaning}>
            <Text style={styles.meaningTitle}>What does this stage mean?</Text>
            <Text style={styles.meaningText}>{page.meaning}</Text>
            <View style={styles.illustration}>
              <View style={[styles.cloud, { left: 10, width: 54, height: 22 }]} />
              <View style={[styles.cloud, { right: 10, width: 60, height: 26 }]} />
              <Figure body="#F28BA0" />
              <Figure body="#2563EB" />
            </View>
          </View>
        )}

        {/* Suggestions */}
        <View style={styles.sectionRow}>
          <Text style={styles.section}>{tab === 'guidance' ? 'Suggested for you' : TABS.find((t) => t.key === tab)!.label}</Text>
          <Text style={styles.seeAll} onPress={() => setNote('The full list is coming soon.')} accessibilityRole="link">See all →</Text>
        </View>
        {!!note && <Text style={styles.note}>{note}</Text>}

        {SUGGESTIONS[tab].map((item) => (
          <Pressable key={item.title} style={styles.item} onPress={() => setNote('This content is coming soon.')} accessibilityRole="button" accessibilityLabel={`${item.title}. ${item.desc}`}>
            <View style={[styles.itemIcon, item.bg ? { backgroundColor: item.bg } : null]}>
              <Ionicons name={item.icon as any} size={19} color={item.tint ?? colors.primary} />
            </View>
            <View style={{ flex: 1, marginHorizontal: spacing.md }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ))}

        {/* Helpful reminders */}
        {tab === 'guidance' && (
          <View style={styles.reminders}>
            <View style={styles.row}>
              <Ionicons name="shield-checkmark" size={22} color={colors.success} />
              <Text style={styles.remindersTitle}>Helpful Reminders</Text>
            </View>
            {REMINDERS.map((r) => (
              <View key={r} style={styles.reminder}>
                <Ionicons name="checkmark" size={16} color={colors.success} />
                <Text style={styles.reminderText}>{r}</Text>
              </View>
            ))}
          </View>
        )}

        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button title="Mark stage complete" loading={busy} onPress={finish} style={{ marginTop: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 52 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  menu: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', minHeight: 44, backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: spacing.lg, marginRight: spacing.lg, borderWidth: 1, borderColor: colors.border },
  menuText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, marginLeft: spacing.sm },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  row: { flexDirection: 'row', alignItems: 'center' },

  header: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  headerIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#E1ECFD', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  headerText: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.muted, marginTop: 2 },

  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginTop: spacing.lg, marginBottom: spacing.lg },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  tabText: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },

  meaning: { backgroundColor: '#EAF1FF', borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: '#D6E3FA' },
  meaningTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  meaningText: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.muted, marginTop: spacing.sm },
  illustration: { height: 96, marginTop: spacing.md, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center' },
  cloud: { position: 'absolute', bottom: 0, borderRadius: 14, backgroundColor: '#D3E1F8' },
  head: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#F2C9A5' },
  body: { width: 36, height: 44, borderTopLeftRadius: 18, borderTopRightRadius: 18, marginTop: 2 },

  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl, marginBottom: spacing.md },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  seeAll: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary, paddingVertical: 8, paddingLeft: spacing.md },
  note: { fontFamily: fonts.medium, fontSize: 12, color: colors.primaryDark, backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },

  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: spacing.md, minHeight: 64, marginBottom: spacing.md },
  itemIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  itemDesc: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.muted, marginTop: 2 },

  reminders: { backgroundColor: '#E8F6EE', borderRadius: radius.lg, borderWidth: 1, borderColor: '#CBEAD8', padding: spacing.lg, marginTop: spacing.sm },
  remindersTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.text, marginLeft: spacing.sm },
  reminder: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm },
  reminderText: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.muted, marginLeft: spacing.sm },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, textAlign: 'center', marginTop: spacing.lg },
});