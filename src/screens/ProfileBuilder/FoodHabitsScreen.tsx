import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getSectionValues, saveSection } from '../../services/profileSections';
import { colors } from '../../theme';

type Opt = { id: string; label: string; icon: string; tint?: string; cat?: string };
type Step = {
  key: string; title: string; subtitle?: string; question?: string;
  kind: 'tiles' | 'cards' | 'list' | 'text';
  cols?: number; multi?: boolean; noneId?: string; search?: boolean; cats?: string[]; options?: Opt[];
};

const o = (id: string, icon: string, label = id): Opt => ({ id, icon, label });
const d = (id: string, icon: string, tint: string, label = id): Opt => ({ id, icon, label, tint });

const STEPS: Step[] = [
  { key: 'diet', title: 'Food & Eating Habits', subtitle: 'Tell us about the food you enjoy and your eating preferences.',
    question: '1. What best describes your diet?', kind: 'cards', cols: 2,
    options: [
      d('Vegetarian', '🥬', '#E6F6EC'), d('Eggetarian', '🥚', '#FFF3D6'),
      d('Non-vegetarian', '🍗', '#FFEBDD'), d('Vegan', '🌱', '#E6F6EC'),
      d('Pescatarian', '🐟', '#E3F1FF'), d('Jain', '🪷', '#FFE8F0'),
      d('Satvik', '☀️', '#FFF3D6'), d('Halal', '☪️', '#E6F6EC'),
      d('Kosher', '✡️', '#F1E8FF'), d('No specific preference', '⚪', '#EEF1F6'),
      d('Other', '⋯', '#E8EEFF'),
    ] },
  { key: 'cuisines', title: 'Cuisines I Enjoy', subtitle: 'Select all the cuisines you like.', kind: 'tiles', cols: 3, multi: true, search: true,
    cats: ['Indian', 'Asian', 'European', 'Middle Eastern'],
    options: [
      ...['South Indian','North Indian','Andhra','Telangana','Tamil','Kerala','Karnataka','Bengali','Gujarati','Punjabi','Rajasthani',
        'Maharashtrian','Odia','Kashmiri','Assamese','Goan','Mughlai','Indo-Chinese'].map((c) => ({ ...o(c, '🍛'), cat: 'Indian' })),
      ...['Chinese','Thai','Japanese','Korean','Vietnamese','Malaysian'].map((c) => ({ ...o(c, '🍜'), cat: 'Asian' })),
      ...['Italian','French','Spanish','Greek','Mediterranean','Continental'].map((c) => ({ ...o(c, '🍝'), cat: 'European' })),
      ...['Lebanese','Turkish','Persian','Arabic'].map((c) => ({ ...o(c, '🥙'), cat: 'Middle Eastern' })),
    ] },
  { key: 'style', title: 'Eating Style', subtitle: 'How do you usually prefer to eat?', kind: 'cards', cols: 2, multi: true,
    options: [
      d('Mostly home-cooked', '🏠', '#E6F6EC'), d('Usually eat out', '🍴', '#FFF3D6'),
      d('Mix of home-cooked & eating out', '🍽️', '#FFEBDD'), d('Enjoy trying new foods', '✨', '#FFF8DB'),
      d('Prefer familiar foods', '❤️', '#FFE8F0'), d('Street-food lover', '🛒', '#FFEBDD'),
      d('Café / restaurant lover', '☕', '#FFE8E8'), d('Health-conscious eating', '🥗', '#E6F6EC'),
      d('Flexible', '↔️', '#F1E8FF'),
    ] },
  { key: 'habits', title: 'Food Habits', subtitle: 'What sounds like you? Select all that apply.', kind: 'list', multi: true,
    options: [
      d('Breakfast is important to me', '☀️', '#FFFFFF'), d('Prefer light meals', '🍋', '#FFFFFF'),
      d('Prefer hearty meals', '🥣', '#FFFFFF'), d('Enjoy snacks', '🍿', '#E8EEFF'),
      d('Enjoy sweets & desserts', '🍰', '#FFFFFF'), d('Enjoy spicy food', '🌶️', '#FFFFFF'),
      d('Prefer mild food', '🍃', '#FFFFFF'), d('Enjoy experimenting with food', '🍴', '#E8EEFF'),
      d('Prefer traditional food', '🏺', '#FFFFFF'), d('Enjoy seasonal foods', '🌱', '#FFFFFF'),
      d('Prefer fresh / homemade food', '🏠', '#FFFFFF'),
    ] },
  { key: 'restrictions', title: 'Food Restrictions', subtitle: 'Do you have any food restrictions?', kind: 'list', multi: true, noneId: 'None',
    options: [
      d('None', '✅', '#DDF5E7'), d('Food allergies', '🚫', '#FFE8E8'), d('Lactose intolerance', '🥛', '#E3F1FF'),
      d('Gluten-free', '🌾', '#FFF3D6'), d('Avoid certain ingredients', '⛔', '#FFE8E8'),
      d('Medical / dietary restriction', '➕', '#FFE8E8'), d('Religious dietary restriction', '🕯️', '#FFEBDD'),
      d('Other', '⊕', '#E8EEFF'),
    ] },
  { key: 'spice', title: 'Spice Preference', subtitle: 'How spicy do you like your food?', kind: 'tiles', cols: 4,
    options: [o('Mild','🌿'), o('Medium','🌶️'), o('Spicy','🌶️'), o('Very spicy','🔥')] },
  { key: 'where', title: 'Where do you enjoy eating?', subtitle: 'Select all that apply.', kind: 'tiles', cols: 3, multi: true,
    options: [o('At home','🏠'), o('Restaurants','🍴'), o('Cafés','☕'), o('Street food','🛒'), o('Food courts','🏬'), o('Fine dining','🍷'),
      o('Family gatherings','👨‍👩‍👧'), o('Outdoor / picnic','🌲'), o("Doesn't matter",'⋯')] },
  { key: 'extra', title: 'Anything else about your food preferences?', subtitle: 'For example: favourite dishes, foods you avoid, or something important to know.', kind: 'text' },
];

export default function FoodHabitsScreen({ navigation }: any) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [restrictionNote, setRestrictionNote] = useState('');
  const [extra, setExtra] = useState('');
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('Indian');

  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const storeKey = `setu_food:${userId}`;

  const step = STEPS[i];
  const last = i === STEPS.length - 1;
  const selected = answers[step.key] ?? [];

  // restore earlier picks when the flow is reopened
  useEffect(() => {
    AsyncStorage.getItem(storeKey).then((raw) => {
      if (!raw) return;
      try {
        const saved = JSON.parse(raw);
        setAnswers(saved.answers ?? {});
        setRestrictionNote(saved.restrictionNote ?? '');
        setExtra(saved.extra ?? '');
      } catch {}
    });
  }, [storeKey]);

  const toggle = (id: string) =>
    setAnswers((prev) => {
      const cur = prev[step.key] ?? [];
      if (!step.multi) return { ...prev, [step.key]: [id] };
      if (step.noneId && id === step.noneId) return { ...prev, [step.key]: cur.includes(id) ? [] : [id] };
      const base = step.noneId ? cur.filter((x) => x !== step.noneId) : cur;
      return { ...prev, [step.key]: base.includes(id) ? base.filter((x) => x !== id) : [...base, id] };
    });

  const back = () => (i === 0 ? navigation.goBack() : setI(i - 1));
  const next = () => { setQuery(''); setI(i + 1); };

  const submit = async () => {
    try {
      // full answers, so the flow can be reopened and edited
      await AsyncStorage.setItem(storeKey, JSON.stringify({ answers, restrictionNote, extra }));
      // short summary shown as the "Food" row on the Lifestyle tab
      const all = await getSectionValues(userId);
      const food = [...(answers.diet ?? []), ...(answers.cuisines ?? [])].join(', ');
      await saveSection(userId, 'interests', { ...all.interests, food });
      navigation.goBack();
    } catch {
      console.log('FOOD SAVE FAILED');
    }
  };

  const summary = ['diet', 'cuisines', 'where', 'style'].flatMap((k) => answers[k] ?? []).join(' • ');

  const visible = (step.options ?? []).filter(
    (x) => (!step.cats || !!query || x.cat === cat) && (!query || x.label.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.top}>
        <Pressable onPress={back} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <View style={s.bars}>
          {STEPS.map((_, n) => <View key={n} style={[s.bar, n <= i && { backgroundColor: colors.primary }]} />)}
        </View>
        <Text style={s.count}>{i + 1}/{STEPS.length}</Text>
      </View>

      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{step.title}</Text>
            {!!step.subtitle && <Text style={s.sub}>{step.subtitle}</Text>}
          </View>
          {i === 0 && (
            <View style={s.hero}><Text style={{ fontSize: 40 }}>🍛</Text></View>
          )}
        </View>

        {!!step.question && (
          <View style={s.questionRow}>
            <Text style={s.question}>{step.question}</Text>
            <Ionicons name="information-circle-outline" size={16} color={colors.primary} style={{ marginLeft: 6 }} />
          </View>
        )}

        {step.search && (
          <View style={s.search}>
            <Ionicons name="search" size={16} color={colors.muted} />
            <TextInput value={query} onChangeText={setQuery} placeholder="Search cuisines..." placeholderTextColor={colors.muted} style={s.searchInput} />
          </View>
        )}

        {step.cats && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }} contentContainerStyle={{ gap: 8 }}>
            {step.cats.map((c) => (
              <Pressable key={c} onPress={() => setCat(c)} style={[s.chip, cat === c && s.chipOn]}>
                <Text style={[s.chipText, cat === c && { color: '#fff' }]}>{c}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
        {step.cats && !query && <Text style={s.catLabel}>{cat} Cuisines</Text>}

        {step.kind === 'cards' && (
          <View style={s.cardGrid}>
            {visible.map((opt) => {
              const on = selected.includes(opt.id);
              return (
                <Pressable key={opt.id} onPress={() => toggle(opt.id)} style={s.cardWrap}>
                  <View style={[s.optCard, on && s.optCardOn]}>
                    {on && <View style={s.badge}><Ionicons name="checkmark" size={11} color="#fff" /></View>}
                    <View style={[s.optIcon, { backgroundColor: opt.tint ?? colors.primarySoft }]}>
                      <Text style={{ fontSize: 18 }}>{opt.icon}</Text>
                    </View>
                    <Text style={s.optText} numberOfLines={3}>{opt.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {step.kind === 'tiles' && (
          <View style={s.grid}>
            {visible.map((opt) => {
              const on = selected.includes(opt.id);
              return (
                <Pressable key={opt.id} onPress={() => toggle(opt.id)} style={[s.tileWrap, { width: `${100 / step.cols!}%` }]}>
                  <View style={[s.tile, on && s.tileOn]}>
                    {on && <View style={s.badge}><Ionicons name="checkmark" size={11} color="#fff" /></View>}
                    <Text style={{ fontSize: 34 }}>{opt.icon}</Text>
                    <Text style={s.tileText}>{opt.label}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {step.kind === 'list' && (
          <View style={{ marginTop: 14 }}>
            {/* "None" sits in its own highlighted box on the restrictions step */}
            {step.noneId && (() => {
              const none = (step.options ?? []).find((x) => x.id === step.noneId)!;
              const on = selected.includes(none.id);
              return (
                <Pressable onPress={() => toggle(none.id)} style={[s.noneBox, on && s.noneBoxOn]}>
                  <View style={[s.listIcon, s.listIconBig, { backgroundColor: none.tint }]}><Text style={{ fontSize: 16 }}>{none.icon}</Text></View>
                  <Text style={[s.rowText, { fontWeight: '700', flex: 1 }]}>{none.label}</Text>
                  <View style={[s.check, on && s.checkOn]}>{on && <Ionicons name="checkmark" size={14} color="#fff" />}</View>
                </Pressable>
              );
            })()}

            <View style={s.listCard}>
              {visible.filter((x) => x.id !== step.noneId).map((opt, idx) => {
                const on = selected.includes(opt.id);
                return (
                  <Pressable key={opt.id} onPress={() => toggle(opt.id)} style={[s.listRow, idx > 0 && s.listRowLine]}>
                    <View style={[s.listIcon, { backgroundColor: opt.tint ?? 'transparent' }]}><Text style={{ fontSize: 14 }}>{opt.icon}</Text></View>
                    <Text style={[s.rowText, { flex: 1 }]}>{opt.label}</Text>
                    <View style={[s.check, on && s.checkOn]}>{on && <Ionicons name="checkmark" size={14} color="#fff" />}</View>
                  </Pressable>
                );
              })}
            </View>

            {step.key === 'restrictions' && (
              <>
                <Text style={[s.sub, { marginTop: 18, color: colors.text }]}>Tell us more (optional)</Text>
                <TextInput value={restrictionNote} onChangeText={setRestrictionNote} placeholder="e.g. I avoid garlic and onion"
                  placeholderTextColor={colors.muted} style={[s.note, { backgroundColor: '#F7F9FD', marginTop: 8, height: 64 }]} multiline />
              </>
            )}
          </View>
        )}

        {step.kind === 'text' && (
          <>
            <TextInput value={extra} onChangeText={(t) => setExtra(t.slice(0, 300))} multiline
              placeholder="I love South Indian food, enjoy trying new cuisines and prefer healthy home-cooked meals."
              placeholderTextColor={colors.muted} style={[s.note, { height: 130, marginTop: 16 }]} />
            <Text style={s.counter}>{extra.length}/300</Text>
            <View style={s.summary}>
              <Text style={s.summaryTitle}>Summary</Text>
              <Text style={s.sub}>{summary || 'Nothing selected yet'}</Text>
            </View>
          </>
        )}
      </ScrollView>

      <View style={s.footer}>
        {i > 0 && !last && (
          <Pressable onPress={back} style={[s.btn, s.btnOutline]}><Text style={[s.btnText, { color: colors.primary }]}>Back</Text></Pressable>
        )}
        <Pressable onPress={last ? submit : next} style={[s.btn, s.btnSolid, i === 0 && s.btnBig]}>
          <Text style={[s.btnText, { color: '#fff' }, i === 0 && { fontSize: 17 }]}>{last ? 'Submit' : 'Next'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
  bars: { flex: 1, flexDirection: 'row', gap: 6 },
  bar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E3E8F2' },
  count: { fontSize: 12, color: colors.muted },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  scroll: { padding: 16, paddingBottom: 24 },
  sub: { fontSize: 13, color: colors.muted, marginTop: 4 },

  // heading with plate picture + numbered question
  heroRow: { flexDirection: 'row', alignItems: 'center' },
  hero: { width: 96, height: 80, borderRadius: 40, backgroundColor: '#2F6B3A', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  questionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  question: { fontSize: 15, fontWeight: '700', color: colors.text },

  // row cards (steps 1, 3)
  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, marginHorizontal: -5 },
  cardWrap: { width: '50%', padding: 5 },
  optCard: { flexDirection: 'row', alignItems: 'center', minHeight: 56, borderRadius: 12, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#fff', padding: 8, gap: 12 },
  optCardOn: { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: colors.primarySoft },
  optIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  optText: { flex: 1, fontSize: 13.5, fontWeight: '600', color: colors.text },

  // search, chips, tiles (steps 2, 6, 7)
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F1F3F8', borderRadius: 999, paddingHorizontal: 16, height: 46, marginTop: 16 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, ...({ outlineStyle: 'none' } as any) },
  chip: { paddingHorizontal: 16, height: 32, borderRadius: 16, backgroundColor: '#EEF1F6', alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  catLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginHorizontal: -4 },
  tileWrap: { padding: 4 },
  tile: { minHeight: 92, borderRadius: 14, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 8, gap: 6 },
  tileOn: { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: '#fff' },
  tileText: { fontSize: 12, textAlign: 'center', color: colors.text, fontWeight: '600' },
  badge: { position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 2 },

  // list rows (steps 4, 5)
  listCard: { borderWidth: 1, borderColor: '#E3E8F2', borderRadius: 14, backgroundColor: '#fff', overflow: 'hidden', marginTop: 8 },
  listRow: { flexDirection: 'row', alignItems: 'center', minHeight: 46, paddingHorizontal: 12, gap: 12 },
  listRowLine: { borderTopWidth: 1, borderTopColor: '#EEF1F6' },
  listIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  listIconBig: { width: 34, height: 34, borderRadius: 17 },
  rowText: { fontSize: 13.5, color: colors.text },
  check: { width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: '#D5DBE7', alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  noneBox: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#fff' },
  noneBoxOn: { borderColor: colors.primary, borderWidth: 2, backgroundColor: colors.primarySoft },

  // text step (step 8)
  note: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, fontSize: 14, color: colors.text, textAlignVertical: 'top', minHeight: 48, ...({ outlineStyle: 'none' } as any) },
  counter: { alignSelf: 'flex-end', fontSize: 11, color: colors.muted, marginTop: 4 },
  summary: { backgroundColor: colors.primarySoft, borderRadius: 12, padding: 14, marginTop: 16 },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: colors.text },

  // footer buttons
  footer: { flexDirection: 'row', gap: 12, padding: 16, paddingTop: 8 },
  btn: { flex: 1, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1, borderColor: colors.primary },
  btnSolid: { backgroundColor: colors.primary },
  btnBig: { height: 54, borderRadius: 27, marginHorizontal: 12, shadowColor: colors.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  btnText: { fontSize: 15, fontWeight: '600' },
});