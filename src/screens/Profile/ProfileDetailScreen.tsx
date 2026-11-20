import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FloatingNav from '../../navigation/FloatingNav';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { store } from '../../services/mockData';
import { buildOwnProfile } from '../../services/myProfile';
import { PROFILES, Profile, Section } from '../../services/profileData';
import { getSectionValues, MATCH_PREFERENCES, SECTIONS, SectionDef, SectionValues } from '../../services/profileSections';
import { colors, fonts, radius, spacing } from '../../theme';

const TABS = ['About', 'Lifestyle', 'Family', 'Preferences'] as const;
type Tab = (typeof TABS)[number];
const SOFT_BORDER = '#D6E4FC';

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

// Card title icons for the read-only sections
const TITLE_ICONS: Record<string, string> = {
  'personal details': 'person-outline',
  'education & career': 'school-outline',
  'about me': 'person-outline',
  basics: 'person-outline',
};

// Interest rows on the Lifestyle tab: icon and colour picked by section title
const INTEREST_STYLE: { match: string; icon: string; color: string }[] = [
  { match: 'food', icon: 'fast-food-outline', color: '#F59E0B' },
  { match: 'travel', icon: 'airplane-outline', color: '#3B82F6' },
  { match: 'hobb', icon: 'sparkles-outline', color: '#A855F7' },
  { match: 'music', icon: 'musical-notes-outline', color: '#0EA5E9' },
  { match: 'movie', icon: 'film-outline', color: '#EF4444' },
  { match: 'fitness', icon: 'barbell-outline', color: '#A855F7' },
];
const interestLook = (title: string, fallbackIcon: string) => {
  const m = INTEREST_STYLE.find((x) => title.toLowerCase().includes(x.match));
  return { icon: m?.icon ?? fallbackIcon, color: m?.color ?? colors.primary };
};
const isRoutine = (t: string) => t.toLowerCase().includes('routine');
const isValues = (t: string) => t.toLowerCase().includes('values');
const summarize = (vals: (string | undefined)[]) => vals.filter(Boolean).join(', ');

// Preferences row colours
const PREF_COLOR: Record<string, string> = { basic: '#2563EB', lifestyle: '#3B82F6', family: '#F97316', values: '#A855F7', additional: '#2563EB' };
const prefColor = (t: string) => PREF_COLOR[Object.keys(PREF_COLOR).find((k) => t.toLowerCase().includes(k)) ?? 'basic'];

// About tab order: About Me, Personal Details, Education & Career, then anything else
const ORDER = ['about me', 'personal details', 'education & career'];
const rank = (t: string) => {
  const i = ORDER.indexOf(t.toLowerCase());
  return i === -1 ? ORDER.length : i;
};

// Label on the left, value on the right of it. "(Optional)" in a label is shown small.
const Row = ({ label, value, empty, divider, right }: { label: string; value?: string; empty: string; divider?: boolean; right?: boolean }) => {
  const m = label.match(/^(.*?)\s*\((optional)\)$/i);
  return (
    <View style={[styles.row, divider && styles.rowLine]}>
      <Text style={styles.label}>
        {m ? m[1] : label}
        {m && <Text style={styles.optional}> (Optional)</Text>}
      </Text>
      <Text style={[styles.value, right && { textAlign: 'right' }, !value && styles.empty]}>{value || empty}</Text>
    </View>
  );
};

// Card shell: icon + title on the left, pencil (or pencil + "Edit") on the right
const CardShell = ({ icon, title, onEdit, textEdit, children }: {
  icon: string; title: string; onEdit?: () => void; textEdit?: boolean; children: React.ReactNode;
}) => (
  <View style={styles.card}>
    <View style={styles.sectionHead}>
      <Ionicons name={icon as any} size={18} color={colors.text} />
      <Text style={styles.sectionTitle}>{title}</Text>
      {onEdit && (
        <Pressable onPress={onEdit} style={textEdit ? styles.editText : styles.pencil} accessibilityRole="button" accessibilityLabel={`Edit ${title}`}>
          {textEdit ? (
            <>
              <Ionicons name="pencil-outline" size={15} color={colors.primary} />
              <Text style={styles.editLabel}>Edit</Text>
            </>
          ) : (
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
          )}
        </Pressable>
      )}
    </View>
    {children}
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
  const [menuOpen, setMenuOpen] = useState(false);

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
// Basic, Lifestyle and Family now open the new preference pages. Values & Outlook and Additional keep the old form.
const PREF_PAGES: Record<string, string> = { prefBasic: 'PreferencesBasic', prefLifestyle: 'PreferencesLifestyle', prefFamily: 'PreferencesFamily' };
const editSection = (id: string) =>
  PREF_PAGES[id] ? navigation.navigate(PREF_PAGES[id]) : navigation.navigate('EditSection', { sectionId: id });
  const defsFor = (t: SectionDef['tab']) => SECTIONS.filter((s) => s.tab === t);

  // read-only rows from the profile data (About, and Lifestyle / Family of another person)
  const renderSection = (s: Section, onEdit?: () => void) => (
    <CardShell key={s.title} icon={TITLE_ICONS[s.title.toLowerCase()] ?? 'person-outline'} title={s.title} onEdit={onEdit}>
      {s.rows.map((r) => <Row key={r.label} label={r.label} value={r.value} empty={emptyText} />)}
    </CardShell>
  );

  // cards built from section definitions (Family on your own profile, Preferences of another person)
  const renderDef = (d: SectionDef, vals: Record<string, string>) => (
    <CardShell key={d.id} icon={d.icon} title={d.title} textEdit={d.tab === 'family'} onEdit={editable ? () => editSection(d.id) : undefined}>
          {d.fields.filter((f) => f.key !== 'note').map((f, i) => <Row key={f.key} label={f.label} value={vals[f.key]} empty={emptyText} divider={d.tab === 'family' && i > 0} />)}/>)}
    </CardShell>
  );

  // About tab
  const aboutSections = [...profile.about]
    .filter((s) => s.title.toLowerCase() !== 'about me') // the About Me card replaces any duplicate
    .sort((a, b) => rank(a.title) - rank(b.title));

  // Lifestyle tab
  type Interest = { key: string; title: string; sub: string; icon: string; color: string; onPress?: () => void };
  const lifestyleDefs = defsFor('lifestyle');
   const interestsDef = lifestyleDefs.find((d) => d.id === 'interests');
  const interests: Interest[] = editable
    ? (interestsDef?.fields ?? []).map((f) => ({
        key: f.key, title: f.label,
        sub: values.interests?.[f.key] || 'Add details',
        ...interestLook(f.label, f.icon),
              onPress: () => {
                 const flow: Record<string, string> = { food: 'FoodHabits', travel: 'Travel', hobbies: 'Hobbies', music: 'Music', movies: 'Entertainment', fitness: 'Fitness' };
          return flow[f.key] ? navigation.navigate(flow[f.key]) : editSection('interests');
        },
      }))
    : profile.lifestyle
        .filter((s) => !isRoutine(s.title) && !isValues(s.title))
        .flatMap((s) => s.rows.map((r) => ({
          key: s.title + r.label, title: r.label,
          sub: r.value || 'Not shared',
          ...interestLook(r.label, r.icon),
        })));
  const routineDef = lifestyleDefs.find((d) => isRoutine(d.title));
  const routineSection = profile.lifestyle.find((s) => isRoutine(s.title));
  const valuesDef = lifestyleDefs.find((d) => isValues(d.title));
  const valuesSection = profile.lifestyle.find((s) => isValues(s.title));

  const chipSource = editable
    ? valuesDef?.fields.map((f) => values[valuesDef.id]?.[f.key])
    : valuesSection?.rows.map((r) => r.value);
  const valueChips = (chipSource ?? []).filter(Boolean).join(',').split(/[,\n]/).map((x) => x.trim()).filter(Boolean);

  const hasRoutine = editable ? !!routineDef : !!routineSection;
  const hasValues = editable ? !!valuesDef : valueChips.length > 0;

  // Family tab
    const familyNote: string | undefined = editable ? values.familyBackground?.note : (profile as any).familyNote;
  const familyDefs = defsFor('family').filter((d) => d.id === 'familyBackground' || d.id === 'involvement');
  const familyNoteBox = !!familyNote && (
    <View style={styles.note}>
      <View style={styles.noteIcon}><Ionicons name="home-outline" size={18} color={colors.primary} /></View>
      <Text style={styles.noteText}>{familyNote}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header: back, name, kebab menu */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.hBtn} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={styles.hTitle}>{profile.age ? `${profile.name}, ${profile.age}` : profile.name}</Text>
        <Pressable onPress={() => setMenuOpen((o) => !o)} hitSlop={10} style={styles.hBtn} accessibilityRole="button" accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>
      {menuOpen && (
        <View style={styles.menu}>
          {editable ? (
            <Pressable style={styles.menuItem} onPress={() => { setMenuOpen(false); navigation.navigate('EditProfile'); }}>
              <Text style={styles.menuText}>Edit profile</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
              {/* TODO: navigate to your report / block screen */}
              <Text style={styles.menuText}>Report or block</Text>
            </Pressable>
          )}
        </View>
      )}

      {/* Tabs */}
      <View style={styles.tabs} accessibilityRole="tablist">
        {TABS.map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabOn]} onPress={() => { setTab(t); setMenuOpen(false); }} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <Text style={[styles.tabText, tab === t && { color: colors.primary, fontFamily: fonts.semibold }]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* ABOUT */}
        {tab === 'About' && (
          <>
            {(profile.bio || editable) && (
              <CardShell icon="person-outline" title="About Me" onEdit={editable ? () => navigation.navigate('EditProfile') : undefined}>
                <Text style={[styles.body, !profile.bio && styles.empty]}>
                  {profile.bio || 'Add a short bio so people can get to know you'}
                </Text>
              </CardShell>
            )}
            {aboutSections.map((s) => renderSection(s, editable ? () => navigation.navigate('EditProfile') : undefined))}
          </>
        )}

        {/* LIFESTYLE */}
        {tab === 'Lifestyle' && (
          interests.length === 0 && !hasRoutine && !hasValues ? (
            <EmptyState icon="document-text-outline" title="Nothing shared yet" description="They haven't shared anything here yet." />
          ) : (
            <>
              {interests.length > 0 && (
                <CardShell
                  icon="bag-handle-outline"
                  title="Lifestyle & Interests"
                  onEdit={editable && lifestyleDefs[0] ? () => editSection(lifestyleDefs[0].id) : undefined}
                >
                  {interests.map((it) => (
                    <Pressable key={it.key} onPress={it.onPress} disabled={!it.onPress} style={styles.interest} accessibilityRole={it.onPress ? 'button' : 'text'} accessibilityLabel={`${it.title}. ${it.sub}`}>
                      <View style={[styles.interestIcon, { backgroundColor: it.color + '1A' }]}>
                        <Ionicons name={it.icon as any} size={18} color={it.color} />
                      </View>
                      <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                        <Text style={styles.interestTitle}>{it.title}</Text>
                        <Text style={styles.interestSub} numberOfLines={1}>{it.sub}</Text>
                      </View>
                      {it.onPress && <Ionicons name="chevron-forward" size={16} color={colors.muted} />}
                    </Pressable>
                  ))}
                </CardShell>
              )}

              {editable && routineDef && (
                <CardShell icon="time-outline" title={routineDef.title} onEdit={() => navigation.navigate('DailyRoutine')}>
                  {routineDef.fields.map((f) => <Row key={f.key} label={f.label} value={values[routineDef.id]?.[f.key]} empty={emptyText} right />)}
                </CardShell>
              )}
              {!editable && routineSection && (
                <CardShell icon="time-outline" title={routineSection.title}>
                  {routineSection.rows.map((r) => <Row key={r.label} label={r.label} value={r.value} empty={emptyText} right />)}
                </CardShell>
              )}

              {hasValues && (
                <CardShell icon="sparkles-outline" title={valuesDef?.title ?? 'Values & Outlook'} onEdit={editable && valuesDef ? () => editSection(valuesDef.id) : undefined}>
                  {valueChips.length > 0 ? (
                    <View style={styles.chips}>
                      {valueChips.map((v) => <View key={v} style={styles.chip}><Text style={styles.chipText}>{v}</Text></View>)}
                    </View>
                  ) : (
                    <Text style={[styles.body, styles.empty]}>{emptyText}</Text>
                  )}
                </CardShell>
              )}
            </>
          )
        )}

        {/* FAMILY */}
        {tab === 'Family' && (
          editable ? (
              familyDefs.map((d, i) => (
              <React.Fragment key={d.id}>
                {renderDef(d, values[d.id] ?? {})}
                {i === 0 && familyNoteBox}
              </React.Fragment>
            ))
          ) : profile.family.length > 0 ? (
            profile.family.map((s, i) => (
              <React.Fragment key={s.title}>
                {renderSection(s)}
                {i === 0 && familyNoteBox}
              </React.Fragment>
            ))
          ) : (
            <EmptyState icon="document-text-outline" title="Nothing shared yet" description="They haven't shared anything here yet." />
          )
        )}

        {/* PREFERENCES */}
        {tab === 'Preferences' && (
          <>
            <View style={styles.banner}>
              <View style={styles.bannerIcon}><Ionicons name="person" size={20} color={colors.primary} /></View>
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.prefTitle}>{editable ? 'My Partner Preferences' : `${profile.name}'s Partner Preferences`}</Text>
                <Text style={styles.prefDesc}>
                  {editable ? 'Help us show more relevant profiles. You can update them anytime.' : 'What they are looking for in a partner.'}
                </Text>
              </View>
            </View>

            {editable ? (
              defsFor('preferences').map((d) => (
                <Pressable key={d.id} style={styles.prefRow} onPress={() => editSection(d.id)} accessibilityRole="button" accessibilityLabel={`${d.title}. ${d.desc}`}>
                  <View style={[styles.prefIcon, { backgroundColor: prefColor(d.title) + '1A' }]}>
                    <Ionicons name={d.icon as any} size={20} color={prefColor(d.title)} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                    <Text style={styles.prefTitle}>{d.title}</Text>
                    <Text style={styles.prefDesc}>{d.desc}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
              ))
            ) : (
              defsFor('preferences').map((d) => renderDef(d, MATCH_PREFERENCES[d.id] ?? {}))
            )}

            <View style={styles.privacy}>
              <Ionicons name="lock-closed-outline" size={14} color={colors.primary} />
              <Text style={styles.privacyText}>Your preferences are private. They are only used to suggest relevant profiles.</Text>
            </View>
          </>
        )}
           </ScrollView>

      <FloatingNav navigation={navigation} active={editable ? 'Profile' : undefined} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },

  // header + menu
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  hBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text },
  menu: { position: 'absolute', top: 52, right: spacing.lg, zIndex: 10, backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingVertical: 4, minWidth: 150 },
  menuItem: { paddingHorizontal: spacing.md, paddingVertical: 12 },
  menuText: { fontFamily: fonts.regular, fontSize: 14, color: colors.text },

  // tabs
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginHorizontal: spacing.lg },
  tab: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  tabText: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },

  // cards
  card: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: SOFT_BORDER, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  sectionTitle: { flex: 1, marginLeft: spacing.sm, fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  pencil: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
  editText: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 4, paddingVertical: 6 },
  editLabel: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary },
  body: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.text },

  // rows
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7 },
  rowLine: { borderTopWidth: 1, borderTopColor: SOFT_BORDER },
  label: { width: '38%', fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted },
  optional: { fontFamily: fonts.regular, fontSize: 9.5, color: colors.muted },
  value: { flex: 1, fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  empty: { fontFamily: fonts.regular, color: colors.muted, fontStyle: 'italic' },

  // lifestyle
  interest: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9 },
  interestIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  interestTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  interestSub: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: SOFT_BORDER, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontFamily: fonts.regular, fontSize: 12, color: colors.text },

  // family note
  note: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.primarySoft, borderRadius: radius.md, borderWidth: 1, borderColor: SOFT_BORDER, padding: spacing.md, marginBottom: spacing.md },
  noteIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  noteText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.primary },

  // preferences
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md },
  bannerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  prefRow: { flexDirection: 'row', alignItems: 'center', minHeight: 64, backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  prefIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  prefTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  prefDesc: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm },
  privacyText: { flex: 1, fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted },
});