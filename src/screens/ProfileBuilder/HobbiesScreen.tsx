import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { Footer, Grid, Header, Item, it, loadSaved, saveAll, Screen, Tile } from './lifestyleKit';

const GROUPS: { key: string; icon: string; title: string; items: Item[] }[] = [
  { key: 'creative', icon: '🎨', title: 'CREATIVE & ARTS', items: [
    it('Drawing', '✏️', '#EEE9E0'), it('Painting', '🎨', '#E3ECFD'), it('Sketching', '🖋️', '#E3EAF6'), it('Photography', '📷', '#E3ECFD'),
    it('Writing', '✍️', '#F1E6D6'), it('Crafting / DIY', '🧵', '#F1E6D6'), it('Calligraphy', '🖌️', '#EEE9E0'), it('Dancing', '💃', '#FFEBDD'),
    it('Singing', '🎤', '#FFE8E8'), it('Music Inst.', '🎸', '#F1E6D6') ] },
  { key: 'reading', icon: '📖', title: 'READING & LEARNING', items: [
    it('Reading', '📚', '#F1E6D6'), it('Fiction', '📕', '#FFE8E8'), it('Non-fiction', '📗', '#E1F3E6'), it('Self-dev', '🧠', '#FFF0D6'),
    it('History', '🏺', '#F1E6D6'), it('Sci & Tech', '🔬', '#E3EAF6'), it('Languages', '🗣️', '#E3ECFD'), it('Online Courses', '💻', '#E8EEFF'),
    it('Podcasts', '🎧', '#F1E8FF') ] },
  { key: 'food', icon: '🍴', title: 'FOOD & COOKING', items: [
    it('Cooking', '🍳', '#FFEBDD'), it('Baking', '🥐', '#FFF0D6'), it('New Recipes', '🥗', '#E1F3E6'), it('Food Explorer', '🍜', '#FFEBDD'),
    it('Hosting', '🥂', '#EBE6F7') ] },
  { key: 'nature', icon: '🌿', title: 'NATURE & OUTDOORS', items: [
    it('Gardening', '🌻', '#FFF3D6'), it('Nature Walks', '🚶', '#DFF0E0'), it('Bird Watch', '🐦', '#E3EAF6'), it('Hiking', '🥾', '#FFEBDD'),
    it('Camping', '⛺', '#E1F3E6') ] },
  { key: 'sports', icon: '🏃', title: 'SPORTS & ACTIVE', items: [
    it('Cricket', '🏏', '#E1F3E6'), it('Badminton', '🏸', '#E3EAF6'), it('Football', '⚽', '#DFF0E0'), it('Yoga', '🧘', '#EBE6F7'), it('Gym', '🏋️', '#EEF1F6') ] },
  { key: 'ent', icon: '🎬', title: 'ENTERTAINMENT & LEISURE', items: [
    it('Movies', '🎬', '#E3ECFD'), it('Web Series', '📺', '#E3EAF6'), it('Gaming', '🎮', '#E8EEFF'), it('Concerts', '🎶', '#FFE8F0'), it('Comedy', '😂', '#FFF3D6') ] },
  { key: 'social', icon: '👥', title: 'SOCIAL & COMMUNITY', items: [
    it('With Family', '👨‍👩‍👧', '#FFEBDD'), it('With Friends', '👫', '#E1F3E6'), it('Volunteering', '🤝', '#F1E6D6'), it('Cultural', '🎎', '#FFE8E8'),
    it('Gatherings', '🎉', '#FFF3D6') ] },
  { key: 'tech', icon: '💻', title: 'TECHNOLOGY & DIGITAL', items: [
    it('Tech', '🖥️', '#E3ECFD'), it('Gadgets', '📱', '#EEF1F6'), it('Coding', '👨‍💻', '#E3EAF6'), it('AI Tech', '🤖', '#E8EEFF'), it('VR & AR', '🥽', '#F1E8FF') ] },
  { key: 'other', icon: '🖤', title: 'PERSONAL & OTHER', items: [
    it('Collecting', '🪙', '#FFF0D6'), it('Pets', '🐶', '#FFEBDD'), it('Fashion', '👗', '#EEF1F6'), it('Meditation', '🧘', '#E1F3E6'), it('Other', '⋯', '#EEF1F6') ] },
];

export default function HobbiesScreen({ navigation }: any) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [sel, setSel] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSaved('hobbies', userId).then((s) => { if (s?.sel) setSel(s.sel); });
  }, [userId]);

  const toggle = (id: string) => setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  // "Select all" turns the whole group on, or off when it is already fully selected
  const toggleAll = (items: Item[]) =>
    setSel((p) => {
      const ids = items.map((x) => x.id);
      const all = ids.every((id) => p.includes(id));
      return all ? p.filter((x) => !ids.includes(x)) : Array.from(new Set([...p, ...ids]));
    });

  const save = async () => {
    setBusy(true);
    try {
      await saveAll('hobbies', userId, { sel }, 'hobbies', sel.slice(0, 4).join(', '));
      navigation.goBack();
    } catch { setBusy(false); }
  };

  return (
    <Screen>
      <Header title="Hobbies & Interests" avatar="🧘" onBack={() => navigation.goBack()}
        subtitle="Tell us about the things you enjoy and love to do." />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {GROUPS.map((g) => {
          const all = g.items.every((x) => sel.includes(x.id));
          return (
            <View key={g.key} style={{ marginBottom: 14 }}>
              <View style={s.head}>
                <Text style={s.headTitle}>{g.icon}  {g.title}</Text>
                <Pressable onPress={() => toggleAll(g.items)} hitSlop={8}>
                  <Text style={s.selectAll}>{all ? 'Clear' : 'Select all'}</Text>
                </Pressable>
              </View>
              <Text style={s.hint}>Select all that apply.</Text>
              <Grid>
                {g.items.map((x) => <Tile key={x.id} item={x} small cols={5} on={sel.includes(x.id)} onPress={() => toggle(x.id)} />)}
              </Grid>
            </View>
          );
        })}
      </ScrollView>
      <Footer onBack={() => navigation.goBack()} onSave={save} busy={busy} />
    </Screen>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  headTitle: { fontSize: 13, fontWeight: '800', color: colors.text },
  selectAll: { fontSize: 12, fontWeight: '700', color: colors.primary },
  hint: { fontSize: 11, color: colors.muted, marginTop: 2 },
});