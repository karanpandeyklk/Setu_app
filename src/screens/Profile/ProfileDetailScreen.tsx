import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../../components/Card';
import ScreenHeader from '../../components/ScreenHeader';
import { PREFERENCE_SECTIONS, PROFILES, Section } from '../../services/profileData';
import { colors, fonts, spacing } from '../../theme';

const TABS = ['About', 'Lifestyle', 'Family', 'Preferences'] as const;

export default function ProfileDetailScreen({ navigation, route }: any) {
  const mode: 'own' | 'match' = route.params?.mode ?? 'own';
  const profile = PROFILES[route.params?.profileId ?? 'u_aanya'];
  const [tab, setTab] = useState<(typeof TABS)[number]>('About');
  const editable = mode === 'own';
  const edit = (what: string) => () => Alert.alert(what, 'Editing is a stretch goal and is not built yet.');

  const renderSection = (s: Section) => (
    <Card key={s.title} style={{ marginBottom: spacing.md }}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{s.title}</Text>
        {editable && (
          <Pressable onPress={edit(s.title)} style={styles.pencil} accessibilityRole="button" accessibilityLabel={`Edit ${s.title}`}>
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
          </Pressable>
        )}
      </View>
      {s.rows.map((r) => (
        <View key={r.label} style={styles.row}>
          <Ionicons name={r.icon as any} size={20} color={colors.primary} />
          <Text style={styles.label}>{r.label}</Text>
          <Text style={styles.value}>{r.value}</Text>
        </View>
      ))}
    </Card>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={`${profile.name}, ${profile.age}`} onBack={() => navigation.goBack()} />
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <Text style={[styles.tabText, tab === t && { color: colors.primary, fontFamily: fonts.semibold }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {tab === 'About' && profile.about.map(renderSection)}
        {tab === 'Lifestyle' && profile.lifestyle.map(renderSection)}
        {tab === 'Family' && profile.family.map(renderSection)}
        {tab === 'Preferences' && (
          <>
            <Text style={styles.sectionTitle}>{editable ? 'My Partner Preferences' : `${profile.name}'s Partner Preferences`}</Text>
            <Card style={{ paddingVertical: 0, marginTop: spacing.md }}>
              {PREFERENCE_SECTIONS.map((p, i) => (
                <Pressable key={p.title} style={[styles.prefRow, i > 0 && styles.prefBorder]} onPress={edit(p.title)} accessibilityRole="button" accessibilityLabel={`${p.title}. ${p.desc}`}>
                  <View style={styles.prefIcon}><Ionicons name={p.icon as any} size={20} color={colors.primary} /></View>
                  <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                    <Text style={styles.prefTitle}>{p.title}</Text>
                    <Text style={styles.muted}>{p.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
              ))}
            </Card>
            <Text style={styles.disclaimer}>Partner preferences are only used to suggest better matches. You control who can see them.</Text>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginHorizontal: spacing.lg },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  tabText: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  pencil: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -10 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginLeft: spacing.md, width: 92 },
  value: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.text, textAlign: 'right' },
  prefRow: { flexDirection: 'row', alignItems: 'center', minHeight: 68 },
  prefBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  prefIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  prefTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  disclaimer: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 },
});