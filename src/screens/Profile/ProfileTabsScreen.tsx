import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

const TABS = ['About', 'Lifestyle', 'Family', 'Preferences'] as const;
type Tab = (typeof TABS)[number];

// Mock data: replace with your API / route params.
const DATA = {
  name: 'Aanya', age: 27,
  about: "I am a curious and compassionate person who values honesty, respect and open communication. I enjoy exploring new places, good food, and meaningful conversations. I'm looking for a partner who is kind, supportive, and shares similar values to build a happy and balanced life together.",
  personal: [['Age', '27 years'], ['Gender', 'Female'], ['Height', '4\'9"'], ['Location', 'Menek Chowk, Gujarat'],
    ['Currently Living In', 'Menek Chowk, Gujarat'], ['Hometown', 'Menek Chowk, Gujarat'], ['Marital Status', 'Un Married']],
  career: [['Education', 'B.Tech (Computer Science & Engineering)'], ['Profession', 'Ethical Hacker'], ['Work Mode', 'Hybrid'],
    ['Company', 'Tech Company (Product Team)'], ['Work Location', 'Hyderabad, Telangana']],
  interests: [
    { icon: 'fast-food-outline', color: '#F59E0B', title: 'Food', sub: 'South Indian, healthy food' },
    { icon: 'airplane-outline', color: '#3B82F6', title: 'Travel', sub: 'Love to explore new places' },
    { icon: 'sparkles-outline', color: '#A855F7', title: 'Hobbies', sub: 'Reading, sketching, photography' },
    { icon: 'musical-notes-outline', color: '#0EA5E9', title: 'Music', sub: 'Indie, soft pop, classical' },
    { icon: 'film-outline', color: '#EF4444', title: 'Movies & Shows', sub: 'Feel-good, travel, comedy' },
    { icon: 'barbell-outline', color: '#A855F7', title: 'Fitness', sub: 'Yoga, walking' },
  ],
  routine: [['Wake up', '6:00 AM – 6:30 AM'], ['Work', '9:00 AM – 6:00 PM'], ['Evening', 'Work, unwind, hobbies'], ['Weekends', 'Travel, family time, friends']],
  values: ['Honesty', 'Respect', 'Open Communication', 'Family-oriented', 'Personal Growth', 'Work-Life Balance', 'Kindness', 'Emotional Maturity'],
  family: [['Father', 'Businessman'], ['Mother', 'Homemaker'], ['Family Type', 'Nuclear Family'], ['Siblings', 'Younger Brother (Studying)'],
    ['Caste', 'Kamma'], ['Sub-caste (Optional)', 'Not specified'], ['Location', 'Menek Chowk, Gujarat'],
    ['Family Values', 'Traditional with modern outlook, respect, togetherness']],
  familyNote: 'My family is supportive of my personal and professional choices and values open communication.',
  involvement: [['Preferred Stage', 'After mutual understanding'], ['Family Meeting', 'Open to meeting family when both are comfortable']],
  prefs: [
    { icon: 'shield-checkmark-outline', color: colors.primary, title: 'Basic Preferences', sub: 'Age, height, location, education, profession' },
    { icon: 'paper-plane-outline', color: '#3B82F6', title: 'Lifestyle Preferences', sub: 'Food, habits, lifestyle, interests' },
    { icon: 'people-outline', color: '#F97316', title: 'Family Preferences', sub: 'Family type, caste, location, values' },
    { icon: 'heart-outline', color: '#A855F7', title: 'Values & Outlook', sub: 'Life goals, beliefs, personality' },
    { icon: 'grid-outline', color: colors.primary, title: 'Additional Preferences', sub: 'Languages, work location, openness' },
  ],
};

function Card({ icon, title, onEdit, children }: { icon: string; title: string; onEdit?: () => void; children: React.ReactNode }) {
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <Ionicons name={icon as any} size={18} color={colors.text} />
        <Text style={s.cardTitle}>{title}</Text>
        {onEdit && (
          <Pressable onPress={onEdit} hitSlop={8} style={s.edit} accessibilityLabel={`Edit ${title}`}>
            <Ionicons name="create-outline" size={17} color={colors.primary} />
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

function KV({ rows, divider }: { rows: string[][]; divider?: boolean }) {
  return (
    <View>
      {rows.map(([k, v], i) => (
        <View key={k} style={[s.kv, divider && i > 0 && s.kvLine]}>
          <Text style={s.k}>{k}</Text>
          <Text style={s.v}>{v}</Text>
        </View>
      ))}
    </View>
  );
}

function LinkRow({ icon, color, title, sub, onPress, boxed }: { icon: string; color: string; title: string; sub: string; onPress?: () => void; boxed?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[s.link, boxed && s.linkBoxed]}>
      <View style={[s.linkIcon, { backgroundColor: color + '1A' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={s.linkTitle}>{title}</Text>
        <Text style={s.linkSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.muted} />
    </Pressable>
  );
}

export default function ProfileTabsScreen({ navigation, route }: any) {
  const [tab, setTab] = useState<Tab>(route?.params?.tab ?? 'About');
  const d = DATA;

  // TODO: point these at your real edit screens (EditSectionScreen exists in your project).
  const edit = (section: string) => navigation.navigate('EditSection', { section });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={s.hBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Text style={s.hTitle}>{d.name}, {d.age}</Text>
        <Pressable hitSlop={10} style={s.hBtn}><Ionicons name="ellipsis-vertical" size={20} color={colors.text} /></Pressable>
      </View>

      <View style={s.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[s.tab, tab === t && s.tabOn]} accessibilityRole="tab" accessibilityState={{ selected: tab === t }}>
            <Text style={[s.tabText, tab === t && s.tabTextOn]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {tab === 'About' && (
          <>
            <Card icon="person-outline" title="About Me" onEdit={() => edit('about')}>
              <Text style={s.body}>{d.about}</Text>
            </Card>
            <Card icon="person-outline" title="Personal Details" onEdit={() => edit('personal')}><KV rows={d.personal} /></Card>
            <Card icon="school-outline" title="Education & Career" onEdit={() => edit('career')}><KV rows={d.career} /></Card>
          </>
        )}

        {tab === 'Lifestyle' && (
          <>
            <Card icon="bag-handle-outline" title="Lifestyle & Interests" onEdit={() => edit('interests')}>
              {d.interests.map((x) => (
                <LinkRow key={x.title} icon={x.icon} color={x.color} title={x.title} sub={x.sub} onPress={() => edit(x.title.toLowerCase())} />
              ))}
            </Card>
            <Card icon="time-outline" title="Daily Routine" onEdit={() => edit('routine')}><KV rows={d.routine} /></Card>
            <Card icon="sparkles-outline" title="Values & Outlook" onEdit={() => edit('values')}>
              <View style={s.chips}>
                {d.values.map((v) => <View key={v} style={s.chip}><Text style={s.chipText}>{v}</Text></View>)}
              </View>
            </Card>
          </>
        )}

        {tab === 'Family' && (
          <>
            <Card icon="people-outline" title="Family Background" onEdit={() => edit('family')}><KV rows={d.family} divider /></Card>
            <View style={s.note}>
              <Ionicons name="home-outline" size={18} color={colors.primary} />
              <Text style={s.noteText}>{d.familyNote}</Text>
            </View>
            <Card icon="people-outline" title="Family Involvement Preference" onEdit={() => edit('involvement')}><KV rows={d.involvement} /></Card>
          </>
        )}

        {tab === 'Preferences' && (
          <>
            <View style={s.banner}>
              <View style={s.bannerIcon}><Ionicons name="person" size={20} color={colors.primary} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.linkTitle}>My Partner Preferences</Text>
                <Text style={s.linkSub}>Help us show more relevant profiles. You can update them anytime.</Text>
              </View>
            </View>
            {d.prefs.map((p) => (
              <LinkRow boxed key={p.title} icon={p.icon} color={p.color} title={p.title} sub={p.sub} onPress={() => navigation.navigate('EditSection', { section: p.title })} />
            ))}
            <View style={s.privacy}>
              <Ionicons name="lock-closed-outline" size={14} color={colors.primary} />
              <Text style={s.privacyText}>Your preferences are private. They are only used to suggest relevant profiles.</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 8 },
  hBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  hTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 8 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabOn: { borderBottomColor: colors.primary },
  tabText: { fontSize: 13, color: colors.muted },
  tabTextOn: { color: colors.primary, fontWeight: '700' },
  scroll: { padding: 14, paddingBottom: 40, gap: 12 },

  card: { backgroundColor: colors.primarySoft, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardTitle: { flex: 1, marginLeft: 8, fontSize: 14, fontWeight: '700', color: colors.text },
  edit: { padding: 2 },
  body: { fontSize: 13, lineHeight: 19, color: colors.text },

  kv: { flexDirection: 'row', paddingVertical: 6 },
  kvLine: { borderTopWidth: 1, borderTopColor: colors.border },
  k: { width: '38%', fontSize: 12, color: colors.muted },
  v: { flex: 1, fontSize: 12.5, color: colors.text, fontWeight: '500' },

  link: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  linkBoxed: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12 },
  linkIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  linkTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  linkSub: { fontSize: 11.5, color: colors.muted, marginTop: 2 },

  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 12, color: colors.text },

  note: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.primarySoft, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 12 },
  noteText: { flex: 1, fontSize: 12, color: colors.primary },

  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: 14, padding: 14 },
  bannerIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primarySoft, borderRadius: 12, padding: 12 },
  privacyText: { flex: 1, fontSize: 11.5, color: colors.muted },
});