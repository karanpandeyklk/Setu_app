import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';
import { getSectionValues, saveSection } from '../../services/profileSections';
import { colors } from '../../theme';
import { Footer, loadSaved, NoteBox, Screen } from './lifestyleKit';

// every 30 minutes from 4:00 AM to 11:30 PM, then midnight to 3:30 AM
const TIMES = Array.from({ length: 48 }, (_, n) => {
  const m = (n * 30 + 240) % 1440;
  const h = Math.floor(m / 60);
  return `${h % 12 === 0 ? 12 : h % 12}:${m % 60 === 0 ? '00' : '30'} ${h < 12 ? 'AM' : 'PM'}`;
});
const DURATIONS = ['Less than 5 hours', '5 - 6 hours', '6 - 7 hours', '7 - 8 hours', '8 - 9 hours', 'More than 9 hours'];
const SCHEDULES = ['Full-time job', 'Full-time student', 'Part-time job', 'Self-employed', 'Homemaker', 'Other'];
const HOURS = ['9:00 AM – 5:00 PM', '9:30 AM – 6:00 PM', '10:00 AM – 6:00 PM', '8:00 AM – 4:00 PM', 'Night shift', 'Flexible hours'];

const MORNING = ['Exercise', 'Meditation', 'Reading', 'Skincare', 'Healthy breakfast', 'Other'];
const MODES = [['On campus', 'business-outline'], ['Hybrid', 'home-outline'], ['Remote', 'desktop-outline']];
const EVENING = [['Exercise', '🏋️'], ['Hobbies', '📖'], ['Family time', '👨‍👩‍👧'], ['Friends', '👫'], ['Relaxing', '☕'], ['Other', '•••']];
const WEEKENDS = [['Travel', '✈️'], ['Family time', '👨‍👩‍👧'], ['Friends', '👫'], ['Hobbies', '🪴'], ['Rest', '🛏️'], ['Spiritual', '🙏'], ['Social activities', '🛍️']];
const PATTERN = ['Early sleeper', 'Flexible', 'Late sleeper'];
const LIFESTYLE = ['Very structured', 'Flexible', 'Busy', 'Balanced'];

// ---------- small pieces ----------
function Card({ icon, tint, title, sub, children }: { icon: string; tint: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <View style={[s.cardIcon, { backgroundColor: tint }]}><Ionicons name={icon as any} size={17} color={colors.primary} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.cardTitle}>{title}</Text>
          {!!sub && <Text style={s.cardSub}>{sub}</Text>}
        </View>
      </View>
      {children}
    </View>
  );
}

// dropdown: tap to open a list below the field
function Select({ label, icon, value, options, onChange, wide }: { label: string; icon: string; value: string; options: string[]; onChange: (v: string) => void; wide?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={wide ? { alignSelf: 'flex-start', minWidth: 150 } : { flex: 1 }}>
      <View style={s.selLabel}><Ionicons name={icon as any} size={12} color={colors.primary} /><Text style={s.selLabelText}>{label}</Text></View>
      <Pressable onPress={() => setOpen(!open)} style={[s.select, wide && { borderRadius: 18, backgroundColor: '#F1F6FF' }]}>
        <Text style={[s.selectText, !value && { color: colors.muted }]}>{value || 'Select'}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={14} color={colors.muted} />
      </Pressable>
      {open && (
        <ScrollView style={s.list} nestedScrollEnabled>
          {options.map((o) => (
            <Pressable key={o} onPress={() => { onChange(o); setOpen(false); }} style={s.listItem}>
              <Text style={[s.selectText, o === value && { color: colors.primary, fontWeight: '700' }]}>{o}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

// tile for emoji choices
function Pick({ label, emoji, on, onPress, width }: { label: string; emoji: string; on: boolean; onPress: () => void; width: number }) {
  return (
    <Pressable onPress={onPress} style={{ width: `${width}%` as any, padding: 3 }}>
      <View style={[s.tile, on && s.tileOn]}>
        {on && <View style={s.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>}
        <Text style={{ fontSize: 20 }}>{emoji}</Text>
        <Text style={[s.tileLabel, on && { color: colors.primary, fontWeight: '800' }]} numberOfLines={2}>{label}</Text>
      </View>
    </Pressable>
  );
}

// rounded chip. "ring" shows an empty circle before the text when not selected (morning routine)
function Pill({ label, on, onPress, ring }: { label: string; on: boolean; onPress: () => void; ring?: boolean }) {
  return (
    <Pressable onPress={onPress} style={[s.pill, on && s.pillOn]}>
      {on ? <Ionicons name="checkmark" size={12} color={colors.primary} />
        : ring ? <Ionicons name="ellipse-outline" size={11} color={colors.muted} /> : null}
      <Text style={[s.pillText, on && { color: colors.primary, fontWeight: '700' }]}>{label}</Text>
    </Pressable>
  );
}

// ---------- screen ----------
export default function DailyRoutineScreen({ navigation }: any) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [t, setT] = useState<Record<string, string>>({
    wake: '6:30 AM', schedule: 'Full-time student', hours: '9:00 AM – 5:00 PM',
    breakfast: '8:00 AM', lunch: '1:00 PM', dinner: '8:00 PM', sleep: '11:00 PM', duration: '7 - 8 hours',
  });
  const [morning, setMorning] = useState<string[]>([]);
  const [mode, setMode] = useState('On campus');
  const [evening, setEvening] = useState<string[]>([]);
  const [weekends, setWeekends] = useState<string[]>([]);
  const [pattern, setPattern] = useState('Flexible');
  const [lifestyle, setLifestyle] = useState('Flexible');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSaved('routine', userId).then((v) => {
      if (!v) return;
      if (v.t) setT((p) => ({ ...p, ...v.t }));
      setMorning(v.morning ?? []); setMode(v.mode ?? 'On campus');
      setEvening(v.evening ?? []); setWeekends(v.weekends ?? []);
      setPattern(v.pattern ?? 'Flexible'); setLifestyle(v.lifestyle ?? 'Flexible'); setNote(v.note ?? '');
    });
  }, [userId]);

  const set = (key: string) => (v: string) => setT((p) => ({ ...p, [key]: v }));

  // "select up to 3"
  const limited = (list: string[], setList: (v: string[]) => void, id: string) => {
    if (list.includes(id)) return setList(list.filter((x) => x !== id));
    if (list.length < 3) setList([...list, id]);
  };

  const save = async () => {
    setBusy(true);
    try {
      await AsyncStorage.setItem(`setu_routine:${userId}`, JSON.stringify({ t, morning, mode, evening, weekends, pattern, lifestyle, note }));
      // fills the Daily Routine card on the Lifestyle tab
      const all = await getSectionValues(userId);
      await saveSection(userId, 'routine', {
        ...all.routine,
        wake: t.wake,
        work: t.hours,
        evening: evening.join(', '),
        weekends: weekends.join(', '),
      });
      navigation.goBack();
    } catch { setBusy(false); }
  };

  return (
    <Screen>
      <View style={s.topBar}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30, gap: 14 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Title card */}
        <View style={[s.card, s.titleCard]}>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>Daily Routine</Text>
            <Text style={s.subtitle}>Tell us about your typical day and routine.</Text>
          </View>
          <Text style={{ fontSize: 48 }}>🧑‍💼</Text>
        </View>

        {/* Morning */}
        <Card icon="sunny-outline" tint="#FFF3D6" title="Morning" sub="How do you usually start your day?">
          <Select wide label="Wake-up time" icon="time-outline" value={t.wake} options={TIMES} onChange={set('wake')} />
          <Text style={[s.selLabelText, { marginTop: 14, marginBottom: 8 }]}>
            Morning routine <Text style={s.muted}>(select up to 3)</Text>
          </Text>
          <View style={s.pills}>
            {MORNING.map((p) => <Pill ring key={p} label={p} on={morning.includes(p)} onPress={() => limited(morning, setMorning, p)} />)}
          </View>
        </Card>

        {/* Work / Study */}
        <Card icon="briefcase-outline" tint="#E3ECFD" title="Work / Study" sub="Tell us about your work or study schedule.">
          <View style={s.row}>
            <Select label="Schedule" icon="reload-outline" value={t.schedule} options={SCHEDULES} onChange={set('schedule')} />
            <Select label="Typical hours" icon="time-outline" value={t.hours} options={HOURS} onChange={set('hours')} />
          </View>
          <View style={s.modeRow}>
            <Text style={s.selLabelText}>Mode</Text>
            {MODES.map(([l, i]) => (
              <Pressable key={l} onPress={() => setMode(l)} style={[s.mode, mode === l && s.modeOn]}>
                <Ionicons name={i as any} size={14} color={colors.primary} />
                <Text style={[s.modeText, mode === l && { color: colors.primary, fontWeight: '700' }]} numberOfLines={2}>{l}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Meals */}
        <Card icon="restaurant-outline" tint="#FFEBDD" title="Meals" sub="Your regular meal timings.">
          <View style={s.row}>
            <Select label="Breakfast" icon="sunny" value={t.breakfast} options={TIMES} onChange={set('breakfast')} />
            <Select label="Lunch" icon="sunny" value={t.lunch} options={TIMES} onChange={set('lunch')} />
            <Select label="Dinner" icon="moon" value={t.dinner} options={TIMES} onChange={set('dinner')} />
          </View>
        </Card>

        {/* Evening */}
        <Card icon="partly-sunny-outline" tint="#FFF3D6" title="Evening" sub="What do you usually do in the evenings? (Select up to 3)">
          <View style={s.grid}>
            {EVENING.map(([l, e]) => <Pick key={l} label={l} emoji={e} width={100 / 6} on={evening.includes(l)} onPress={() => limited(evening, setEvening, l)} />)}
          </View>
        </Card>

        {/* Sleep */}
        <Card icon="moon-outline" tint="#EBE6F7" title="Sleep" sub="Tell us about your sleep routine.">
          <View style={s.row}>
            <Select label="Sleep time" icon="time-outline" value={t.sleep} options={TIMES} onChange={set('sleep')} />
            <Select label="Typical duration" icon="bed-outline" value={t.duration} options={DURATIONS} onChange={set('duration')} />
          </View>
          <Text style={[s.selLabelText, { marginTop: 12, marginBottom: 6 }]}>Sleep pattern</Text>
          <View style={s.pills}>{PATTERN.map((p) => <Pill key={p} label={p} on={pattern === p} onPress={() => setPattern(p)} />)}</View>
        </Card>

        {/* Weekends */}
        <Card icon="calendar-outline" tint="#E3ECFD" title="Weekends" sub="How do you usually spend your weekends? (Select up to 3)">
          <View style={s.grid}>
            {WEEKENDS.map(([l, e]) => <Pick key={l} label={l} emoji={e} width={100 / 7} on={weekends.includes(l)} onPress={() => limited(weekends, setWeekends, l)} />)}
          </View>
        </Card>

        {/* Daily Lifestyle */}
        <Card icon="options-outline" tint="#E3ECFD" title="Daily Lifestyle" sub="Which of these best describes your routine overall?">
          <View style={s.pills}>{LIFESTYLE.map((p) => <Pill key={p} label={p} on={lifestyle === p} onPress={() => setLifestyle(p)} />)}</View>
        </Card>

        <View style={s.card}>
          <NoteBox title="Anything else about your daily routine?" value={note} onChange={setNote}
            placeholder="e.g. I prefer a balanced routine with some time for study, exercise and hobbies." />
        </View>
      </ScrollView>

      <Footer onBack={() => navigation.goBack()} onSave={save} busy={busy} />
    </Screen>
  );
}

const s = StyleSheet.create({
  topBar: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6, backgroundColor: '#fff' },
  titleCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18 },
  title: { fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12.5, color: colors.muted, marginTop: 6, maxWidth: '80%', lineHeight: 18 },
  muted: { fontSize: 11, fontWeight: '400', color: colors.muted },

  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E3E8F2', padding: 14 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  cardIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  cardSub: { fontSize: 11.5, color: colors.muted, marginTop: 1 },

  row: { flexDirection: 'row', gap: 10 },
  selLabel: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 },
  selLabelText: { fontSize: 11.5, fontWeight: '600', color: colors.text },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, height: 38, borderRadius: 9, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#F7F9FD', paddingHorizontal: 10 },
  selectText: { fontSize: 12.5, color: colors.text },
  list: { maxHeight: 170, marginTop: 4, borderRadius: 9, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#fff' },
  listItem: { paddingHorizontal: 10, paddingVertical: 9 },

  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  mode: { flex: 1, minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 10, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#fff', paddingHorizontal: 6 },
  modeOn: { borderColor: colors.primary, backgroundColor: '#E8F0FE' },
  modeText: { fontSize: 11.5, fontWeight: '500', color: colors.text, flexShrink: 1, textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -3 },
  tile: { minHeight: 68, borderRadius: 12, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 4, gap: 4 },
  tileOn: { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: '#F3F7FF' },
  tileLabel: { fontSize: 9.5, fontWeight: '600', color: colors.text, textAlign: 'center' },
  badge: { position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 2 },

  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, height: 32, borderRadius: 16, backgroundColor: '#F7F9FD', borderWidth: 1, borderColor: '#E3E8F2' },
  pillOn: { backgroundColor: '#E8F0FE', borderColor: '#BBD0F8' },
  pillText: { fontSize: 12, fontWeight: '500', color: colors.text },
});