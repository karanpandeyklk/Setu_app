import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { Footer, Grid, it, k, loadSaved, NoteBox, saveAll, Screen, Tile } from './lifestyleKit';

const PHYSICAL = [
  it('Gym', '🏋️', '#EEF1F6'), it('Walking', '🚶', '#DFF0E0'), it('Running', '🏃', '#E1F3E6'), it('Yoga', '🧘', '#EBE6F7'), it('Pilates', '🤸', '#FFF0D6'),
  it('Swimming', '🏊', '#DDF1F7'), it('Cycling', '🚴', '#E3ECFD'), it('Badminton', '🏸', '#E3EAF6'), it('Cricket', '🏏', '#DFF0E0'), it('Football', '⚽', '#E1F3E6'),
  it('Tennis', '🎾', '#FFF3B8'), it('Basketball', '🏀', '#FFEBDD'), it('Volleyball', '🏐', '#E3ECFD'), it('Dance', '💃', '#EBE6F7'), it('Home Workouts', '🏠', '#F1E6D6'),
];
const WELLNESS = [it('Meditation', '🧘', '#E3EAF6'), it('Mindfulness', '🪨', '#EEF1F6'), it('Healthy Eating', '🥗', '#E1F3E6'),
  it('Quality Sleep', '😴', '#E3EAF6'), it('Mental Relaxation', '🌅', '#FFEBDD')];
const OUTDOOR = [it('Nature Walks', '🌳', '#DFF0E0'), it('Hiking', '🥾', '#E1F3E6'), it('Trekking', '⛰️', '#E3EAF6'),
  it('Sports Outdoors', '🏕️', '#E3ECFD'), it('Other', '•••', '#EEF1F6')];

const FREQUENCY = [['Daily', 'calendar-outline'], ['Several times a week', 'stats-chart'], ['Weekly', 'calendar-outline'], ['Occasionally', 'calendar-outline'], ['Rarely', 'calendar-outline']];
const LEVEL = [['Very active', 'walk'], ['Active', 'walk'], ['Moderately active', 'person'], ['Lightly active', 'person'], ['Relaxed', 'bed']];

// small single-choice box with a line icon (frequency, activity level)
function Choice({ label, icon, on, onPress }: { label: string; icon: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ width: '20%', padding: 3 }}>
      <View style={[s.choice, on && s.choiceOn]}>
        {on && <View style={k.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>}
        <Ionicons name={icon as any} size={17} color={colors.primary} />
        <Text style={[s.choiceText, on && { color: colors.primary, fontWeight: '800' }]} numberOfLines={3}>{label}</Text>
      </View>
    </Pressable>
  );
}

function Head({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <View style={{ marginTop: 22 }}>
      <View style={s.headRow}>
        <View style={s.headIcon}><Ionicons name={icon as any} size={13} color={colors.primary} /></View>
        <Text style={k.h2}>{title}</Text>
      </View>
      <Text style={[k.h2Sub, { marginLeft: 30 }]}>{sub}</Text>
    </View>
  );
}

export default function FitnessScreen({ navigation }: any) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [acts, setActs] = useState<string[]>([]);
  const [freq, setFreq] = useState('');
  const [level, setLevel] = useState('');
  const [well, setWell] = useState<string[]>([]);
  const [out, setOut] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSaved('fitness', userId).then((v) => {
      if (!v) return;
      setActs(v.acts ?? []); setFreq(v.freq ?? ''); setLevel(v.level ?? '');
      setWell(v.well ?? []); setOut(v.out ?? []); setNote(v.note ?? '');
    });
  }, [userId]);

  const flip = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const save = async () => {
    setBusy(true);
    try {
      const summary = [...acts, ...well, ...out].filter((x) => x !== 'Other').slice(0, 4).join(', ');
      await saveAll('fitness', userId, { acts, freq, level, well, out, note }, 'fitness', summary);
      navigation.goBack();
    } catch { setBusy(false); }
  };

  return (
    <Screen>
      <View style={s.top}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={s.title}>Fitness & Wellness</Text>
        <Text style={s.subtitle}>Tell us about your fitness routine and overall wellness habits.</Text>
        <Text style={s.art}>🧘‍♀️</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Head icon="walk" title="Physical Activities" sub="Select all that apply." />
        <Grid>{PHYSICAL.map((x) => <Tile key={x.id} item={x} small cols={5} on={acts.includes(x.id)} onPress={() => flip(acts, setActs, x.id)} />)}</Grid>

        <Head icon="calendar-outline" title="Fitness Frequency" sub="How often do you engage in physical activities?" />
        <Grid>{FREQUENCY.map(([l, i]) => <Choice key={l} label={l} icon={i} on={freq === l} onPress={() => setFreq(l)} />)}</Grid>

        <Head icon="body" title="Activity Level" sub="How would you describe your activity level?" />
        <Grid>{LEVEL.map(([l, i]) => <Choice key={l} label={l} icon={i} on={level === l} onPress={() => setLevel(l)} />)}</Grid>

        <Head icon="leaf" title="Wellness Habits" sub="Select all that apply." />
        <Grid>{WELLNESS.map((x) => <Tile key={x.id} item={x} small cols={5} on={well.includes(x.id)} onPress={() => flip(well, setWell, x.id)} />)}</Grid>

        <Head icon="triangle" title="Outdoor & Nature Activities" sub="Select all that apply." />
        <Grid>{OUTDOOR.map((x) => <Tile key={x.id} item={x} small cols={5} on={out.includes(x.id)} onPress={() => flip(out, setOut, x.id)} />)}</Grid>

        <NoteBox title="Anything else about your fitness or wellness routine?" value={note} onChange={setNote}
          placeholder="e.g. I enjoy morning walks, try to stay active and focus on mental well-being." />
      </ScrollView>

      <Footer onBack={() => navigation.goBack()} onSave={save} busy={busy} />
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 14 },
  subtitle: { fontSize: 12.5, color: colors.muted, marginTop: 4, maxWidth: '62%', lineHeight: 18 },
  art: { position: 'absolute', right: 20, top: 36, fontSize: 52 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E3ECFD', alignItems: 'center', justifyContent: 'center' },
  choice: { minHeight: 74, borderRadius: 12, borderWidth: 1, borderColor: '#E3E8F2', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 4, gap: 5 },
  choiceOn: { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: '#F3F7FF' },
  choiceText: { fontSize: 9.5, fontWeight: '600', color: colors.text, textAlign: 'center' },
});