import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { Footer, Grid, Header, Item, it, loadSaved, saveAll, Screen, SectionTitle, Tile, k } from './lifestyleKit';

const PLACE_GROUPS: { title: string; items: Item[] }[] = [
  { title: 'NATURE & OUTDOORS', items: [
    it('Beaches', '🏖️', '#DDF1F7'), it('Mountains & Hills', '🏔️', '#E3EAF6'), it('Lakes & Waterfalls', '🏞️', '#E1F3E6'),
    it('Forests & Nature', '🌲', '#DFF0E0'), it('Wildlife & Safari', '🐅', '#FFF0D6'), it('Adventure Spots', '🧗', '#FFE6D9') ] },
  { title: 'SPIRITUAL & CULTURAL', items: [
    it('Temples & Faith', '🛕', '#FFEBD6'), it('Spiritual Places', '🕌', '#EBE6F7'), it('Heritage Sites', '🏛️', '#F1E6D6'),
    it('Cultural & Arts', '🏯', '#FFE8E8'), it('Museums & Art', '🖼️', '#E8EEFF') ] },
  { title: 'CITY & LIFESTYLE', items: [
    it('Urban Exploration', '🏙️', '#E8EEFF'), it('Shopping Havens', '🛍️', '#FFE8F0'), it('Food & Culinary', '🍽️', '#FFEBDD') ] },
  { title: 'RELAXATION & OTHERS', items: [
    it('Resorts & Spa', '🧖', '#FFEBDD'), it('Tropical Islands', '🏝️', '#DDF1F7'), it('Rural & Villages', '🌾', '#FFF3D6') ] },
];
const STYLE = [it('Solo', '🧍', '#E3EAF6'), it('With family', '👨‍👩‍👧', '#FFEBDD'), it('With friends', '👫', '#E1F3E6'),
  it('With partner', '💑', '#FFE8F0'), it('Group travel', '🎉', '#F1E8FF')];
const FREQ = [it('Frequently', '✈️', '#E3F1FF', '3+ trips / year'), it('Occasionally', '📅', '#E3ECFD', '1-2 trips / yr'), it('Rarely', '☕', '#FFF3D6', '< once a year')];
const PREF = [it('Domestic', '🗺️', '#DDF5E7', 'India only'), it('International', '🌐', '#E8EEFF', 'Abroad'), it('Both', '🛩️', '#F1E8FF', 'Anywhere')];
const ACTS = [it('Sightseeing', '🔭', '#E3EAF6'), it('Trekking & Hike', '🥾', '#DFF0E0'), it('Photography', '📷', '#FFF0D6'),
  it('Camping', '⛺', '#E1F3E6'), it('Local Food', '🍛', '#FFEBDD'), it('Shopping', '🛒', '#FFE8F0'),
  it('Spiritual Visits', '🙏', '#EBE6F7'), it('Cultural Shows', '🎭', '#FFE8E8'), it('Adventure Sports', '🪂', '#E3F1FF'),
  it('Relaxing / Unwind', '🛋️', '#FFF3D6'), it('Road Trips', '🚗', '#E3ECFD'), it('Nature Walks', '🌿', '#DFF0E0')];

export default function TravelScreen({ navigation }: any) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [sel, setSel] = useState<Record<string, string[]>>({});
  const [dests, setDests] = useState<string[]>([]);
  const [destInput, setDestInput] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSaved('travel', userId).then((s) => {
      if (!s) return;
      setSel(s.sel ?? {}); setDests(s.dests ?? []); setNote(s.note ?? '');
    });
  }, [userId]);

  const has = (g: string, id: string) => (sel[g] ?? []).includes(id);
  const pick = (g: string, id: string, single?: boolean) =>
    setSel((p) => {
      const cur = p[g] ?? [];
      if (single) return { ...p, [g]: [id] };
      return { ...p, [g]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] };
    });

  const addDest = () => {
    const v = destInput.trim();
    if (v && !dests.includes(v)) setDests([...dests, v]);
    setDestInput('');
  };

  const save = async () => {
    setBusy(true);
    try {
      const summary = [...(sel.places ?? []), ...(sel.acts ?? [])].slice(0, 4).join(', ');
      await saveAll('travel', userId, { sel, dests, note }, 'travel', summary);
      navigation.goBack();
    } catch { setBusy(false); }
  };

  return (
    <Screen>
      <Header pill="Lifestyle Compatibility" title="Travel & Experiences" onBack={() => navigation.goBack()}
        subtitle="Tell us about the places you love to explore, preferred style, and how you wander together." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <SectionTitle title="Places I Enjoy Visiting" sub="Select all destinations you love." line />
        {PLACE_GROUPS.map((g) => (
          <View key={g.title}>
            <Text style={s.cat}>{g.title}</Text>
            <Grid>
              {g.items.map((x) => <Tile key={x.id} item={x} cols={3} on={has('places', x.id)} onPress={() => pick('places', x.id)} />)}
            </Grid>
          </View>
        ))}

        <SectionTitle title="Travel Style" sub="How do you usually like to travel?" line />
        <Grid>
          {STYLE.map((x) => (
            <Tile key={x.id} item={x} cols={3} span={x.id === 'Group travel' ? 2 : 1} on={has('style', x.id)} onPress={() => pick('style', x.id, true)} />
          ))}
        </Grid>

        <SectionTitle title="Travel Frequency" sub="How often do you travel?" line />
        <Grid>{FREQ.map((x) => <Tile plain key={x.id} item={x} cols={3} on={has('freq', x.id)} onPress={() => pick('freq', x.id, true)} />)}</Grid>

        <SectionTitle title="Travel Preference" sub="Which places do you prefer?" line />
        <Grid>{PREF.map((x) => <Tile plain key={x.id} item={x} cols={3} on={has('pref', x.id)} onPress={() => pick('pref', x.id, true)} />)}</Grid>

        <SectionTitle title="Activities I Enjoy" sub="Select all activities that resonate with you." line />
        <Grid>{ACTS.map((x) => <Tile key={x.id} item={x} cols={3} on={has('acts', x.id)} onPress={() => pick('acts', x.id)} />)}</Grid>

        <View style={{ marginTop: 22, flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={k.h2}>Favourite Destinations </Text><Text style={s.opt}>(Optional)</Text>
        </View>
        <Text style={k.h2Sub}>Add dream spots or memorable places.</Text>
        <View style={s.card}>
          <View style={s.addRow}>
            <Ionicons name="location-outline" size={16} color={colors.muted} />
            <TextInput value={destInput} onChangeText={setDestInput} onSubmitEditing={addDest} placeholder="e.g. Himalayas, Bali, Goa, Japan..."
              placeholderTextColor={colors.muted} style={s.addInput} />
            <Pressable onPress={addDest} style={s.addBtn}><Text style={s.addText}>Add</Text></Pressable>
          </View>
          <View style={s.chips}>
            {dests.map((d) => (
              <View key={d} style={s.chip}>
                <Text style={s.chipText}>📍 {d}</Text>
                <Pressable onPress={() => setDests(dests.filter((x) => x !== d))} hitSlop={8}>
                  <Ionicons name="close" size={13} color={colors.muted} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 22, flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={k.h2}>Anything else about travel? </Text><Text style={s.opt}>(Optional)</Text>
        </View>
        <Text style={k.h2Sub}>Share what makes a trip memorable for you.</Text>
        <View style={[s.card, { marginTop: 10 }]}>
          <TextInput value={note} onChangeText={(t) => setNote(t.slice(0, 300))} multiline
            placeholder="I love exploring tranquil hill stations, discovering heritage temples..." placeholderTextColor={colors.muted} style={s.note} />
          <View style={s.noteFoot}>
            <Text style={s.hint}>💡 Helps find partners with matched vibe</Text>
            <Text style={s.hint}>{note.length}/300</Text>
          </View>
        </View>
      </ScrollView>
      <Footer onBack={() => navigation.goBack()} onSave={save} busy={busy} />
    </Screen>
  );
}

const s = StyleSheet.create({
  cat: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.4, marginTop: 18 },
  opt: { fontSize: 12, color: colors.muted },
  card: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E3E8F2', padding: 12, marginTop: 10 },
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F7F9FD', borderRadius: 10, paddingLeft: 10, paddingRight: 6, height: 42 },
  addInput: { flex: 1, fontSize: 13, color: colors.text, ...({ outlineStyle: 'none' } as any) },
  addBtn: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 14, height: 30, alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF3FF', borderWidth: 1, borderColor: '#D6E4FC', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  note: { minHeight: 90, fontSize: 13, color: colors.text, textAlignVertical: 'top', ...({ outlineStyle: 'none' } as any) },
  noteFoot: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  hint: { fontSize: 11, color: colors.muted },
});