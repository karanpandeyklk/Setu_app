import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MATCH_PREFERENCES, SECTIONS } from '../../services/profileSections';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import { acceptRequest, declineRequest, sendInterest, skipPerson, toggleBookmark } from '../../services/api';
import { getMatchProfile, MatchProfile, Source } from '../../services/matchData';
import { store } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

const TABS = ['Overview', 'About', 'Lifestyle', 'Family', 'Preferences'] as const;
type Tab = (typeof TABS)[number];

const Rows = ({ rows }: { rows: { label: string; value: string }[] }) => (
  <View>
    {rows.map((r) => (
      <View key={r.label} style={styles.dataRow}>
        <Text style={styles.dataLabel}>{r.label}</Text>
        <Text style={styles.dataValue}>{r.value}</Text>
      </View>
    ))}
  </View>
);

const Section = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <Card style={{ marginBottom: spacing.md }}>
    <View style={styles.sectionHead}>
      <Ionicons name={icon as any} size={18} color={colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </Card>
);

const Quote = ({ text }: { text: string }) => (
  <View style={styles.quote}>
    <Ionicons name="chatbox-ellipses-outline" size={16} color={colors.primary} />
    <Text style={styles.quoteText}>{text}</Text>
  </View>
);

export default function MatchProfileScreen({ navigation, route }: any) {
  const personId: string = route.params?.personId;
  const [data, setData] = useState<{ profile: MatchProfile; source: Source } | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>('Overview');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    getMatchProfile(personId).then(setData).catch(() => setData(null));
  }, [personId]);

  // All hooks are above this line. Early returns come after them.
  if (data === undefined) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colors.primary} /></View>
      </SafeAreaView>
    );
  }
  if (data === null) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader onBack={() => navigation.goBack()} />
        <EmptyState icon="person-outline" title="Profile not found" description="This profile isn't available right now." actionLabel="Go back" onAction={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const { profile: p, source } = data;
  // The Interested / Not Interested bar shows only for people you can still respond to
  const showBar = source === 'received' || source === 'discover';

  const respond = async (interested: boolean) => {
    setBusy(true); setError('');
    try {
      if (source === 'received') await (interested ? acceptRequest(p.id) : declineRequest(p.id));
      else {
        const person = store.discover.find((x) => x.id === p.id);
        if (person) await (interested ? sendInterest(person) : skipPerson(person));
      }
      navigation.goBack();
    } catch {
      setError("Couldn't save your choice. Try again.");
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar: back arrow, centered avatar + name + online dot, menu */}
      <View style={styles.top}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>

        <View style={styles.topCenter}>
          <Avatar size={26} />
          <Text style={styles.topTitle} numberOfLines={1}>{p.name}, {p.age}</Text>
          {p.online && <View style={styles.online} />}
        </View>

        <Pressable onPress={() => setMenuOpen(!menuOpen)} style={styles.more} accessibilityRole="button" accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>
      {menuOpen && (
        <Pressable style={styles.menu} onPress={() => setMenuOpen(false)} accessibilityRole="button" accessibilityLabel="Report profile">
          <Ionicons name="flag-outline" size={18} color={colors.text} />
          <Text style={styles.menuText}>Report profile (coming soon)</Text>
        </Pressable>
      )}

      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => setTab(t)} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <Text style={[styles.tabText, tab === t && { color: colors.primary, fontFamily: fonts.semibold }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: showBar ? 110 : spacing.xxl }}>
        {tab === 'Overview' && (
          <>
            {/* Photo placeholder. Real photos come from the backend. */}
            <View style={styles.photo}><Ionicons name="person" size={90} color={colors.primary} /></View>

            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.row}>
                  <Text style={styles.name}>{p.name}, {p.age}</Text>
                  {p.verified && <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: 6 }} />}
                  {p.online && <View style={[styles.online, { marginLeft: 8 }]} />}
                </View>
                <Text style={styles.muted}>{p.profession} · {p.location}</Text>
              </View>
              <Pressable
                style={styles.bookmark}
                onPress={async () => { try { setSaved(await toggleBookmark(p.id)); } catch {} }}
                accessibilityRole="button"
                accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark'}
              >
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.primary} />
              </Pressable>
            </View>

            <View style={styles.infoRow}>
              {[
                { icon: 'briefcase-outline', t: p.profession, s: `at ${p.company}` },
                { icon: 'school-outline', t: p.education.split(' ')[0], s: p.education },
                { icon: 'location-outline', t: p.location.split(',')[0], s: p.location.split(',')[1]?.trim() ?? '' },
              ].map((i) => (
                <View key={i.icon} style={styles.infoChip}>
                  <Ionicons name={i.icon as any} size={16} color={colors.primary} />
                  <Text style={styles.infoTitle} numberOfLines={1}>{i.t}</Text>
                  <Text style={styles.infoSub} numberOfLines={1}>{i.s}</Text>
                </View>
              ))}
            </View>

            <View style={styles.tagRow}>
              {p.tags.map((t) => <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>)}
            </View>

            <Quote text={p.quote} />

            <Card style={{ marginTop: spacing.lg }}>
              <View style={styles.sectionHead}>
                <Ionicons name="sparkles-outline" size={18} color={colors.primary} />
                <Text style={styles.sectionTitle}>At a glance</Text>
              </View>
              <View style={styles.glance}>
                {p.glance.map((g) => (
                  <View key={g.label} style={styles.glanceItem}>
                    <Ionicons name={g.icon as any} size={18} color={colors.primary} />
                    <View style={{ marginLeft: 8, flex: 1 }}>
                      <Text style={styles.glanceValue}>{g.value}</Text>
                      <Text style={styles.glanceLabel}>{g.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </>
        )}

        {tab === 'About' && (
          <>
            <Section icon="person-outline" title={`About ${p.name}`}><Text style={styles.body}>{p.about}</Text></Section>
            <Section icon="id-card-outline" title="Personal Details"><Rows rows={p.personal} /></Section>
            <Section icon="school-outline" title="Education"><Rows rows={p.educationRows} /></Section>
            <Section icon="briefcase-outline" title="Career"><Rows rows={p.career} /></Section>
          </>
        )}

        {tab === 'Lifestyle' && (
          <>
            <Section icon="leaf-outline" title="Lifestyle & Interests">
              {p.interests.map((i) => (
                <View key={i.label} style={styles.interest}>
                  <View style={[styles.interestIcon, { backgroundColor: `${i.color}22` }]}>
                    <Ionicons name={i.icon as any} size={18} color={i.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.dataValueLeft}>{i.label}</Text>
                    <Text style={styles.muted}>{i.value}</Text>
                  </View>
                </View>
              ))}
            </Section>
            <Section icon="time-outline" title="Daily Routine"><Rows rows={p.routine} /></Section>
            <Section icon="compass-outline" title="Values & Outlook">
              <View style={styles.tagRow}>{p.values.map((v) => <View key={v} style={styles.tag}><Text style={styles.tagText}>{v}</Text></View>)}</View>
            </Section>
          </>
        )}

        {tab === 'Preferences' && (
  <>
    <Text style={[styles.sectionTitle, { marginLeft: 0, marginBottom: spacing.md }]}>{`${p.name}'s Partner Preferences`}</Text>
    {SECTIONS.filter((s) => s.tab === 'preferences').map((s) => (
      <Section key={s.id} icon={s.icon} title={s.title}>
        <Rows rows={s.fields.map((f) => ({ label: f.label, value: MATCH_PREFERENCES[s.id]?.[f.key] ?? 'Not shared' }))} />
      </Section>
    ))}
    <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center', lineHeight: 18, marginTop: spacing.sm }}>
      Partner preferences are only used to suggest better matches.
    </Text>
  </>
)}
      </ScrollView>

      {showBar && (
        <View style={styles.bar}>
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.row}>
            <Button variant="outline" icon="close" title="Not Interested" style={{ flex: 1, marginRight: spacing.md }} disabled={busy} onPress={() => respond(false)} />
<Button icon="heart" title="Interested" style={{ flex: 1 }} loading={busy} onPress={() => respond(true)} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  // top bar
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 52 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  topTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginHorizontal: spacing.sm, flexShrink: 1 },
  online: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  more: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  menu: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', minHeight: 44, backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: spacing.lg, marginRight: spacing.lg, borderWidth: 1, borderColor: colors.border },
  menuText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, marginLeft: spacing.sm },

  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginHorizontal: spacing.lg },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  tabText: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center' },
  photo: { height: 300, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  name: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  bookmark: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  infoRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  infoChip: { flex: 1, backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  infoTitle: { fontFamily: fonts.semibold, fontSize: 12, color: colors.text, marginTop: 4 },
  infoSub: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.muted },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  tag: { backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  tagText: { fontFamily: fonts.medium, fontSize: 12, color: colors.primaryDark },
  quote: { flexDirection: 'row', backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  quoteText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.primaryDark, marginLeft: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, marginLeft: spacing.sm },
  body: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 20, color: colors.text },
  dataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  dataLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, flex: 1 },
  dataValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, flex: 1.4, textAlign: 'right' },
  dataValueLeft: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  glance: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.lg },
  glanceItem: { width: '50%', flexDirection: 'row', alignItems: 'center', paddingRight: spacing.sm },
  glanceValue: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  glanceLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  interest: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  interestIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: colors.bg, padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  error: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, textAlign: 'center', marginBottom: spacing.sm },
});