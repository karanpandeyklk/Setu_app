import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { ChipInput, Footer, Grid, Header, it, loadSaved, NoteBox, saveAll, Screen, Tile, k } from './lifestyleKit';

type G = { id: string; label: string; sub?: string; emoji: string; tint: string };
const g = (label: string, emoji: string, tint: string, sub?: string): G => ({ id: label, label, sub, emoji, tint });

const GENRES: G[] = [
  g('Indian Classical', '🪕', '#F6E2C8', 'Carnatic, Hindustani'), g('Devotional / Spiritual', '🛕', '#FFE1CC'),
  g('Regional Music', '🥁', '#DDEBFA', 'Telugu, Tamil, etc.'), g('Bollywood / Indian Film Music', '🎬', '#F6D5DC'),
  g('Folk & Traditional', '🎶', '#DDF1E6'), g('Ghazal / Sufi', '🌙', '#EEE6D6'),
  g('Western Classical', '🎻', '#F1E6D6'), g('Pop', '🎤', '#E8E1F8'),
  g('Rock', '🤘', '#E8E8F2'), g('Indie', '🎸', '#FFE1CC'), g('Jazz / Blues', '🎷', '#F1E6D6'), g('R&B / Soul', '💜', '#F6D5DC'),
  g('EDM / Electronic', '🎧', '#E3E0F6'), g('Hip-Hop / Rap', '🎙️', '#E8E8F2'), g('Instrumental', '🎹', '#F6E2C8'), g('Acoustic', '🪵', '#F6E2C8'),
  g('Other', '•••', '#EEF1F6'),
];

const LANGS = [
  { id: 'Telugu', glyph: 'తె' }, { id: 'Tamil', glyph: 'தமிழ்' }, { id: 'Hindi', glyph: 'हि' }, { id: 'English', glyph: 'En' }, { id: 'Kannada', glyph: 'ಕ' },
  { id: 'Malayalam', glyph: 'മ' }, { id: 'Bengali', glyph: 'বা' }, { id: 'Punjabi', glyph: 'ਪੰ' }, { id: 'Marathi', glyph: 'म' }, { id: 'Other', glyph: '•••' },
];

const OFTEN = [it('Very often', '🎧', '#E3ECFD', '(Every day)'), it('Often', '▶️', '#E3ECFD', '(Several times a week)'),
  it('Sometimes', '📅', '#E3ECFD', '(A few times a month)'), it('Rarely', '🔆', '#FFF3D6', '(Occasionally)')];

const WHEN = [it('While studying / working', '🖥️', '#E3ECFD'), it('While travelling', '🎧', '#E3ECFD'), it('During workouts', '🏋️', '#EEF1F6'),
  it('To relax', '🍃', '#DDF5E7'), it('Before sleeping', '🌙', '#EBE6F7'), it('At social gatherings', '👥', '#EEF1F6')];

function Head({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <View style={{ marginTop: 22 }}>
      <View style={s.headRow}>
        <Ionicons name={icon as any} size={15} color={colors.primary} />
        <Text style={k.h2}>{title}</Text>
      </View>
      <Text style={[k.h2Sub, { marginLeft: 21 }]}>{sub}</Text>
    </View>
  );
}

export default function MusicScreen({ navigation }: any) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [genres, setGenres] = useState<string[]>([]);
  const [langs, setLangs] = useState<string[]>([]);
  const [often, setOften] = useState<string[]>([]);
  const [when, setWhen] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSaved('music', userId).then((v) => {
      if (!v) return;
      setGenres(v.genres ?? []); setLangs(v.langs ?? []); setOften(v.often ?? []);
      setWhen(v.when ?? []); setArtists(v.artists ?? []); setNote(v.note ?? '');
    });
  }, [userId]);

  const flip = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const save = async () => {
    setBusy(true);
    try {
      await saveAll('music', userId, { genres, langs, often, when, artists, note }, 'music', genres.slice(0, 4).join(', '));
      navigation.goBack();
    } catch { setBusy(false); }
  };

  return (
    <Screen>
      <View style={s.back}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
      </View>
      <Header title="Music" avatar="🎧" onBack={() => navigation.goBack()} subtitle="Tell us about the music you enjoy." />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Music Genres */}
        <Head icon="musical-notes" title="Music Genres" sub="Select all that apply." />
        <Grid>
          {GENRES.map((x) => {
            const on = genres.includes(x.id);
            return (
              <Pressable key={x.id} onPress={() => flip(genres, setGenres, x.id)} style={{ width: '25%', padding: 3 }}>
                <View style={[k.tile, s.genreTile, on && k.tileOn]}>
                  {on && <View style={k.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>}
                  <View style={[k.photo, { height: 58, backgroundColor: x.tint }]}><Text style={{ fontSize: 26 }}>{x.emoji}</Text></View>
                  <Text style={[k.label, s.genreLabel, on && k.labelOn]} numberOfLines={2}>{x.label}</Text>
                  {!!x.sub && <Text style={s.genreSub} numberOfLines={2}>{x.sub}</Text>}
                </View>
              </Pressable>
            );
          })}
        </Grid>

        {/* Languages of Music */}
        <Head icon="language" title="Languages of Music" sub="Which language songs do you enjoy?" />
        <Grid>
          {LANGS.map((x) => {
            const on = langs.includes(x.id);
            return (
              <Pressable key={x.id} onPress={() => flip(langs, setLangs, x.id)} style={{ width: '20%', padding: 3 }}>
                <View style={[k.tile, s.langTile, on && k.tileOn]}>
                  {on && <View style={k.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>}
                  <Text style={[s.glyph, on && { color: colors.primary }, x.id === 'Other' && { color: colors.primary }]}>{x.glyph}</Text>
                  <Text style={[s.langLabel, on && { color: colors.primary, fontWeight: '700' }]} numberOfLines={1}>{x.id}</Text>
                </View>
              </Pressable>
            );
          })}
        </Grid>

        {/* Listening Habits */}
        <Head icon="headset" title="Listening Habits" sub="How often do you listen to music?" />
        <Grid>
          {OFTEN.map((x) => <Tile plain key={x.id} item={x} cols={4} on={often.includes(x.id)} onPress={() => setOften([x.id])} />)}
        </Grid>

        {/* When */}
        <Head icon="time-outline" title="When do you usually listen?" sub="Select all that apply." />
        <Grid>
          {WHEN.map((x) => <Tile plain key={x.id} item={x} cols={3} on={when.includes(x.id)} onPress={() => flip(when, setWhen, x.id)} />)}
        </Grid>

        <ChipInput title="Favourite Artists / Songs" sub="Add your favourite artists, bands or songs."
          placeholder="e.g. A.R. Rahman, Shreya Ghoshal, Coldplay, Ilaiyaraaja..." items={artists} setItems={setArtists} search />
        <NoteBox title="Anything else about your music preferences?" value={note} onChange={setNote}
          placeholder="e.g. I love soulful music, enjoy classical and film songs, and like listening to music while travelling." />
      </ScrollView>

      <Footer onBack={() => navigation.goBack()} onSave={save} busy={busy} />
    </Screen>
  );
}

const s = StyleSheet.create({
  back: { paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#F7F9FD' },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  genreTile: { paddingBottom: 8, minHeight: 104 },
  genreLabel: { fontSize: 10.5, fontWeight: '700' },
  genreSub: { fontSize: 8.5, color: colors.muted, textAlign: 'center', marginTop: 1 },
  langTile: { paddingVertical: 10, minHeight: 66, justifyContent: 'center', gap: 4 },
  glyph: { fontSize: 20, fontWeight: '700', color: colors.text },
  langLabel: { fontSize: 10, color: colors.muted, fontWeight: '500' },
});