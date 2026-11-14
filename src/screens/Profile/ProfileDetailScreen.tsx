import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/mockData';
import { buildOwnProfile } from '../../services/myProfile';
import { PROFILES, Profile, Section } from '../../services/profileData';
import { getSectionValues, MATCH_PREFERENCES, SECTIONS, SectionDef, SectionValues } from '../../services/profileSections';
import { colors, fonts, spacing } from '../../theme';

const TABS = ['About', 'Lifestyle', 'Family', 'Preferences'] as const;
type Tab = (typeof TABS)[number];

// Another person's profile: the detailed mock if there is one (for example Rohan), otherwise basics from their list entry
function findMatch(id?: string): Profile | null {
  if (!id) return null;
  if (PROFILES[id]) return PROFILES[id];
  const p = [...store.active, ...store.received, ...store.sent, ...store.discover].find((x) => x.id === id);
  if (!p) return null;
  return {
    name: p.name, age: p.age, gender: '', height: '', education: '', profession: p.profession, location: p.location, bio: '',
    about: [{ title: 'Basics', rows: [
      { icon: 'location-outline', label: 'City', value: p.location },
      { icon: 'briefcase-outline', label: 'Profession', value: p.profession },
    ] }],
    lifestyle: [], family: [],
  };
}

const Row = ({ icon, label, value, empty }: { icon: string; label: string; value?: string; empty: string }) => (
  <View style={styles.row}>
    <Ionicons name={icon as any} size={20} color={colors.primary} />
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, !value && styles.empty]}>{value || empty}</Text>
  </View>
);

export default function ProfileDetailScreen({ navigation, route }: any) {
  const params = route.params ?? {};
  const mode: 'own' | 'match' = params.mode ?? (params.personId ? 'match' : 'own');
  const editable = mode === 'own';

  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [own, setOwn] = useState<Profile | null>(null);
  const [values, setValues] = useState<SectionValues>({});
  const [tab, setTab] = useState<Tab>(TABS.includes(params.tab) ? params.tab : 'About');

  // reload when the screen comes back into view, so edits show straight away
  useFocusEffect(useCallback(() => {
    if (!editable) return;
    (async () => {
      setOwn(userId === 'u_aanya' ? PROFILES.u_aanya : await buildOwnProfile(user?.name ?? ''));
      setValues(await getSectionValues(userId));
    })();
  }, [editable, userId, user?.name]));

  const profile: Profile | null = editable ? own : findMatch(params.personId ?? params.profileId);

  // all hooks are above this line
  if (editable && !own) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="My Profile" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>
      </SafeAreaView>
    );
  }
  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="Profile" onBack={() => navigation.goBack()} />
        <EmptyState icon="person-outline" title="Profile not found" description="This profile isn't available right now." actionLabel="Go back" onAction={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const emptyText = editable ? 'Not added yet' : 'Not shared';
  const editSection = (id: string) => navigation.navigate('EditSection', { sectionId: id });

  // read-only rows from the profile data (About, and Lifestyle / Family of another person)
  const renderSection = (s: Section, onEdit?: () => void) => (
    <Card key={s.title} style={{ marginBottom: spacing.md }}>
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>{s.title}</Text>
        {onEdit && (
          <Pressable onPress={onEdit} style={styles.pencil} accessibilityRole="button" accessibilityLabel={`Edit ${s.title}`}>
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
          </Pressable>
        )}
      </View>
      {s.rows.map((r) => <Row key={r.label} icon={r.icon} label={r.label} value={r.value} empty={emptyText} />)}
    </Card>
  );

  // editable cards for Lifestyle and Family on your own profile
  const renderDef = (d: SectionDef, vals: Record<string, string>) => (
    <Card key={d.id} style={{ marginBottom: spacing.md }}>
      <View style={styles.sectionHead}>
        <Ionicons name={d.icon as any} size={18} color={colors.primary} style={{ marginRight: 8 }} />
        <Text style={[styles.sectionTitle, { flex: 1 }]}>{d.title}</Text>
        {editable && (
          <Pressable onPress={() => editSection(d.id)} style={styles.pencil} accessibilityRole="button" accessibilityLabel={`Edit ${d.title}`}>
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
          </Pressable>
        )}
      </View>
      {d.fields.map((f) => <Row key={f.key} icon={f.icon} label={f.label} value={vals[f.key]} empty={emptyText} />)}
    </Card>
  );

  const defsFor = (t: SectionDef['tab']) => SECTIONS.filter((s) => s.tab === t);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={profile.age ? `${profile.name}, ${profile.age}` : profile.name} onBack={() => navigation.goBack()} />
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <Text style={[styles.tabText, tab === t && { color: colors.primary, fontFamily: fonts.semibold }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xxl }}>
        {tab === 'About' && (
          <>
            {!!profile.bio && (
              <Card style={{ marginBottom: spacing.md }}>
                <Text style={styles.sectionTitle}>About me</Text>
                <Text style={[styles.body, { marginTop: spacing.sm }]}>{profile.bio}</Text>
              </Card>
            )}
            {profile.about.map((s) => renderSection(s, editable ? () => navigation.navigate('EditProfile') : undefined))}
          </>
        )}

        {tab === 'Lifestyle' && (
          editable
            ? defsFor('lifestyle').map((d) => renderDef(d, values[d.id] ?? {}))
            : profile.lifestyle.length > 0
              ? profile.lifestyle.map((s) => renderSection(s))
              : <EmptyState icon="document-text-outline" title="Nothing shared yet" description="They haven't shared anything here yet." />
        )}

        {tab === 'Family' && (
          editable
            ? defsFor('family').map((d) => renderDef(d, values[d.id] ?? {}))
            : profile.family.length > 0
              ? profile.family.map((s) => renderSection(s))
              : <EmptyState icon="document-text-outline" title="Nothing shared yet" description="They haven't shared anything here yet." />
        )}

        {tab === 'Preferences' && (
          <>
            <Text style={styles.sectionTitle}>{editable ? 'My Partner Preferences' : `${profile.name}'s Partner Preferences`}</Text>
            {editable ? (
              <Card style={{ paddingVertical: 0, marginTop: spacing.md }}>
                {defsFor('preferences').map((d, i) => {
                  const filled = d.fields.filter((f) => values[d.id]?.[f.key]).length;
                  return (
                    <Pressable key={d.id} style={[styles.prefRow, i > 0 && styles.prefBorder]} onPress={() => editSection(d.id)} accessibilityRole="button" accessibilityLabel={`${d.title}. ${d.desc}`}>
                      <View style={styles.prefIcon}><Ionicons name={d.icon as any} size={20} color={colors.primary} /></View>
                      <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                        <Text style={styles.prefTitle}>{d.title}</Text>
                        <Text style={styles.prefDesc}>{filled > 0 ? `${filled} of ${d.fields.length} added` : d.desc}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                    </Pressable>
                  );
                })}
              </Card>
            ) : (
              <View style={{ marginTop: spacing.md }}>
                {defsFor('preferences').map((d) => renderDef(d, MATCH_PREFERENCES[d.id] ?? {}))}
              </View>
            )}
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
  body: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  label: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginLeft: spacing.md, width: 100 },
  value: { flex: 1, fontFamily: fonts.medium, fontSize: 14, color: colors.text, textAlign: 'right' },
  empty: { fontFamily: fonts.regular, color: colors.muted, fontStyle: 'italic' },
  prefRow: { flexDirection: 'row', alignItems: 'center', minHeight: 68 },
  prefBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  prefIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  prefTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  prefDesc: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 2 },
  disclaimer: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: spacing.lg, lineHeight: 18 },
});