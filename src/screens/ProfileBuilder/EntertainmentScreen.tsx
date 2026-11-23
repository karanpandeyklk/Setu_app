import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme';
import { ChipInput, Footer, Grid, it, Item, k, loadSaved, NoteBox, saveAll, Screen, Tile } from './lifestyleKit';

const GENRES = [
  it('Drama', '🎭', '#FFF0D6'), it('Comedy', '😂', '#FFF3B8'), it('Romance', '🖤', '#FFE1E6'), it('Thriller', '🔪', '#E8EAF2'), it('Mystery', '🔍', '#EEF1F6'),
  it('Crime', '🚨', '#FFE8E8'), it('Action', '💥', '#FFE1CC'), it('Adventure', '🧭', '#F6E2C8'), it('Sci-Fi', '🚀', '#DDE6FA'), it('Fantasy', '🏰', '#EBE6F7'),
  it('Horror', '👻', '#EEF1F6'), it('Animation', '🎨', '#DDF5F0'), it('Family', '👨‍👩‍👧', '#FFF0D6'), it('Documentary', '🦬', '#F1E6D6'), it('Biography', '📖', '#E3EAF6'),
  it('Historical', '🏛️', '#FFF3D6'), it('War', '🎖️', '#EEF1F6'), it('Sports', '🏃', '#DDF1F7'), it('Musical', '🎵', '#F1E8FF'), it('Feel-good', '🌻', '#FFF3B8'),
  it('Psychological', '🧠', '#E8E1F8'), it('Regional Cinema', '🇮🇳', '#F6D5DC'), it('Intl Cinema', '🌍', '#DDF5E7'), it('Other', '•••', '#EEF1F6'),
];

const LANGS = [
  { id: 'Telugu', glyph: 'తెలుగు' }, { id: 'Tamil', glyph: 'தமிழ்' }, { id: 'Hindi', glyph: 'हिन्दी' }, { id: 'Malayalam', glyph: 'മലയാളം' }, { id: 'Kannada', glyph: 'ಕನ್ನಡ' },
  { id: 'Bengali', glyph: 'বাংলা' }, { id: 'Marathi', glyph: 'मराठी' }, { id: 'English', glyph: 'English' }, { id: 'Korean', glyph: '한국어' }, { id: 'Japanese', glyph: '日本語' },
  { id: 'Other', glyph: '•••' },
];

const WATCH = [it('Movies', '🍿', '#FFE8E8'), it('Web series', '💻', '#E3EAF6'), it('TV shows', '📺', '#EEF1F6'), it('Documentaries', '🎞️', '#FFF3D6'),
  it('Short films', '🎥', '#EEF1F6'), it('Anime', '🍥', '#FFE8F0'), it('Reality shows', '🎙️', '#FFE8E8'), it('Stand-up', '🎤', '#FFF3D6'), it('Other', '•••', '#E8EEFF')];
const STYLE = [it('At home', '🏠', '#FFEBDD'), it('Cinema', '🎬', '#FFE8E8'), it('With family', '👨‍👩‍👧', '#FFEBDD'),
  it('With friends', '👫', '#E3ECFD'), it('Alone', '🧍', '#E3EAF6')];
const OFTEN = [it('Very often', '📅', '#E3ECFD', '(Daily)'), it('Often', '🗓️', '#EEF1F6', '(Few times a week)'),
  it('Sometimes', '📆', '#EEF1F6', '(A few times a month)'), it('Rarely', '⏳', '#FFEBDD', '(Less than once a month)')];

function Head({ icon, title, sub, right }: { icon: string; title: string; sub: string; right?: React.ReactNode }) {
  return (
    <View style={{ marginTop: 22 }}>
      <View style={s.headRow}>
        <Ionicons name={icon as any} size={15} color={colors.muted} />
        <Text style={[k.h2, { flex: 1 }]}>{title}</Text>
        {right}
      </View>
      <Text style={[k.h2Sub, { marginLeft: 21 }]}>{sub}</Text>
    </View>
  );
}

export default function EntertainmentScreen({ navigation }: any) {
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [genres, setGenres] = useState<string[]>([]);
  const [langs, setLangs] = useState<string[]>([]);
  const [watch, setWatch] = useState<string[]>([]);
  const [style, setStyle] = useState<string[]>([]);
  const [often, setOften] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadSaved('entertainment', userId).then((v) => {
      if (!v) return;
      setGenres(v.genres ?? []); setLangs(v.langs ?? []); setWatch(v.watch ?? []); setStyle(v.style ?? []);
      setOften(v.often ?? []); setTitles(v.titles ?? []); setNote(v.note ?? '');
    });
  }, [userId]);

  const flip = (list: string[], set: (v: string[]) => void, id: string) =>
    set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const allGenres = (GENRES as Item[]).every((x) => genres.includes(x.id));
  const toggleAllGenres = () => setGenres(allGenres ? [] : GENRES.map((x) => x.id));

  const save = async () => {
    setBusy(true);
    try {
      const summary = titles.length ? titles.slice(0, 3).join(', ') : genres.slice(0, 3).join(', ');
      await saveAll('entertainment', userId, { genres, langs, watch, style, often, titles, note }, 'movies', summary);
      navigation.goBack();
    } catch { setBusy(false); }
  };

  return (
    <Screen>
      <View style={s.top}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10}><Ionicons name="arrow-back" size={22} color={colors.text} /></Pressable>
        <Text style={s.title}>Movies & Shows</Text>
        <Text style={s.subtitle}>Tell us about the movies and shows you enjoy.</Text>
        <Text style={s.emoji}>🍿🎬</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Genres */}
        <Head icon="film-outline" title="Genres" sub="Select all that apply."
          right={<Pressable onPress={toggleAllGenres} hitSlop={8}><Text style={s.selectAll}>{allGenres ? 'Clear' : 'Select all'}</Text></Pressable>} />
        <Grid>{GENRES.map((x) => <Tile key={x.id} item={x} small cols={5} on={genres.includes(x.id)} onPress={() => flip(genres, setGenres, x.id)} />)}</Grid>

        {/* Languages / Cinema I Enjoy */}
        <Head icon="globe-outline" title="Languages / Cinema I Enjoy" sub="Select all that apply." />
        <Grid>
          {LANGS.map((x) => {
            const on = langs.includes(x.id);
            return (
              <Pressable key={x.id} onPress={() => flip(langs, setLangs, x.id)} style={{ width: '20%', padding: 3 }}>
                <View style={[k.tile, s.langTile, on && k.tileOn]}>
                  {on && <View style={k.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>}
                  <Text style={[s.glyph, (on || x.id === 'Other') && { color: colors.primary }]} numberOfLines={1}>{x.glyph}</Text>
                  {x.id !== 'Other' && <Text style={[s.langLabel, on && { color: colors.primary }]} numberOfLines={1}>{x.id}</Text>}
                  {x.id === 'Other' && <Text style={s.langLabel}>Other</Text>}
                </View>
              </Pressable>
            );
          })}
        </Grid>

        {/* What I Usually Watch */}
        <Head icon="tv-outline" title="What I Usually Watch" sub="Select all that apply." />
        <Grid>{WATCH.map((x) => <Tile key={x.id} item={x} small cols={5} on={watch.includes(x.id)} onPress={() => flip(watch, setWatch, x.id)} />)}</Grid>

        {/* Watching Style */}
        <Head icon="people-outline" title="Watching Style" sub="How do you usually like to watch?" />
        <Grid>{STYLE.map((x) => <Tile key={x.id} item={x} small cols={5} on={style.includes(x.id)} onPress={() => flip(style, setStyle, x.id)} />)}</Grid>

        {/* How Often */}
        <Head icon="alarm-outline" title="How Often Do You Watch?" sub="Select one option." />
        <Grid>{OFTEN.map((x) => <Tile plain key={x.id} item={x} cols={4} on={often.includes(x.id)} onPress={() => setOften([x.id])} />)}</Grid>

        <ChipInput title="Favourite Movies / Shows" sub="Add your favourite titles."
          placeholder="e.g. Interstellar, Maharaja, Friends, Your Name..." items={titles} setItems={setTitles} search />
        <NoteBox title="Anything else about your entertainment preferences?" value={note} onChange={setNote}
          placeholder="e.g. I enjoy feel-good movies, thrillers and good web series. I also like exploring regional cinema." />
      </ScrollView>

      <Footer onBack={() => navigation.goBack()} onSave={save} busy={busy} />
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6, backgroundColor: '#F7F9FD' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginTop: 14 },
  subtitle: { fontSize: 12.5, color: colors.muted, marginTop: 4, maxWidth: '75%' },
  emoji: { position: 'absolute', right: 16, top: 34, fontSize: 30 },
  headRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  selectAll: { fontSize: 12.5, fontWeight: '700', color: colors.primary },
  langTile: { paddingVertical: 12, minHeight: 62, justifyContent: 'center', gap: 4 },
  glyph: { fontSize: 13, fontWeight: '700', color: colors.text },
  langLabel: { fontSize: 9.5, color: colors.muted, fontWeight: '500' },
});