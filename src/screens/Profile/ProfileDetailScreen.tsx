import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/mockData';
import { buildOwnProfile, getMyProfile } from '../../services/myProfile';
import { PREFERENCE_SECTIONS, PROFILES, Profile, Section } from '../../services/profileData';
import { colors, fonts, spacing } from '../../theme';

const TABS = ['About', 'Lifestyle', 'Family', 'Preferences'] as const;

// Match profiles: use the detailed mock if we have one (e.g. Rohan), otherwise build a basic
// profile from the person's list entry. Replace with the real API call when the backend is ready.
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

export default function ProfileDetailScreen({ navigation, route }: any) {
  const params = route.params ?? {};
  // Opened from Connections with { personId } = a match. Opened from My Profile = own.
  const mode: 'own' | 'match' = params.mode ?? (params.personId ? 'match' : 'own');
  const editable = mode === 'own';

  const { user } = useAuth();
  const [own, setOwn] = useState<Profile | null>(null);
  const [ownPhoto, setOwnPhoto] = useState<string | undefined>(); // saved profile photo
  const [tab, setTab] = useState<(typeof TABS)[number]>('About');

  // Own profile: the seeded Aanya for the Google demo user, otherwise built from the onboarding data
  useEffect(() => {
    if (mode !== 'own') return;
    getMyProfile().then((p) => setOwnPhoto(p?.photoUri)).catch(() => {});
    if (user?.id === 'u_aanya') setOwn(PROFILES.u_aanya);
    else buildOwnProfile(user?.name ?? '').then(setOwn);
  }, [mode, user?.id, user?.name]);

  const matchId = params.personId ?? params.profileId;
  const profile: Profile | null = mode === 'own' ? own : findMatch(matchId);

  // Same photo as Home and My Profile for your own profile; the person's photo for a match
  const matchPhoto = [...store.active, ...store.received, ...store.sent, ...store.discover].find((x) => x.id === matchId)?.photo;
  const photo = mode === 'own' ? (ownPhoto ?? (user as any)?.avatar) : matchPhoto;

  const edit = (what: string) => () => Alert.alert(what, 'Editing is a stretch goal and is not built yet.');

  // All hooks are above this line. Early returns come after them.
  if (mode === 'own' && !own) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader title="My Profile" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
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

  const renderTab = (sections: Section[]) =>
    sections.length > 0 ? sections.map(renderSection) : (
      <EmptyState
        icon="document-text-outline"
        title={editable ? 'Nothing added yet' : 'Nothing shared yet'}
        description={editable ? 'Answer more questions in the profile builder to fill this in.' : "They haven't shared anything here yet."}
      />
    );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={profile.age ? `${profile.name}, ${profile.age}` : profile.name} onBack={() => navigation.goBack()} />
      <View style={styles.photoRow}>
        <Avatar size={88} uri={photo} label={profile.name} />
      </View>
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <Text style={[styles.tabText, tab === t && { color: colors.primary, fontFamily: fonts.semibold }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {tab === 'About' && (
          <>
            {!!profile.bio && (
              <Card style={{ marginBottom: spacing.md }}>
                <Text style={styles.sectionTitle}>About me</Text>
                <Text style={[styles.muted, { marginTop: spacing.sm, lineHeight: 19 }]}>{profile.bio}</Text>
              </Card>
            )}
            {renderTab(profile.about)}
          </>
        )}
        {tab === 'Lifestyle' && renderTab(profile.lifestyle)}
        {tab === 'Family' && renderTab(profile.family)}
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
  photoRow: { alignItems: 'center', paddingVertical: spacing.md },
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