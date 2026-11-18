import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSectionValues, saveSection } from '../../services/profileSections';
import { colors } from '../../theme';

export type Item = { id: string; label: string; emoji: string; tint: string; sub?: string };
export const it = (label: string, emoji: string, tint = '#EEF1F6', sub?: string): Item => ({ id: label, label, emoji, tint, sub });

// ---------- saving ----------
export async function loadSaved(name: string, userId: string) {
  try {
    const raw = await AsyncStorage.getItem(`setu_${name}:${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// stores all answers, and puts a short summary into the matching row of the Lifestyle tab
export async function saveAll(name: string, userId: string, data: any, field: string, summary: string) {
  await AsyncStorage.setItem(`setu_${name}:${userId}`, JSON.stringify(data));
  const all = await getSectionValues(userId);
  await saveSection(userId, 'interests', { ...all.interests, [field]: summary });
}

// ---------- UI pieces ----------
export function Tile({ item, on, onPress, cols, span = 1, small, plain }: {
  item: Item; on: boolean; onPress: () => void; cols: number; span?: number; small?: boolean; plain?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={{ width: `${(100 / cols) * span}%` as any, padding: small ? 3 : 4 }}>
      <View style={[k.tile, plain && k.tilePlain, on && k.tileOn]}>
        {on && <View style={k.badge}><Ionicons name="checkmark" size={10} color="#fff" /></View>}
        {plain ? (
          <>
            <View style={[k.plainIcon, { backgroundColor: item.tint }]}><Text style={{ fontSize: 18 }}>{item.emoji}</Text></View>
            <Text style={[k.label, on && k.labelOn, { fontSize: 13 }]}>{item.label}</Text>
            {!!item.sub && <Text style={k.sub}>{item.sub}</Text>}
          </>
        ) : (
          <>
            <View style={[k.photo, small && k.photoSmall, span > 1 && k.photoWide, { backgroundColor: item.tint }]}>
              <Text style={{ fontSize: small ? 22 : 30 }}>{item.emoji}</Text>
            </View>
            <Text style={[k.label, on && k.labelOn, small && { fontSize: 9.5 }]} numberOfLines={2}>{item.label}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

export const Grid = ({ children }: { children: React.ReactNode }) => <View style={k.grid}>{children}</View>;

export function Header({ title, subtitle, onBack, pill, avatar }: {
  title: string; subtitle: string; onBack: () => void; pill?: string; avatar?: string;
}) {
  return (
    <View style={k.header}>
      {!!pill && (
        <View style={k.pill}>
          <Ionicons name="heart" size={11} color={colors.primary} />
          <Text style={k.pillText}>{pill}</Text>
        </View>
      )}
      <View style={k.titleRow}>
        <Pressable onPress={onBack} hitSlop={10}><Ionicons name="chevron-back" size={24} color={colors.text} /></Pressable>
        <Text style={k.title}>{title}</Text>
        {!!avatar && <View style={k.avatar}><Text style={{ fontSize: 26 }}>{avatar}</Text></View>}
      </View>
      <Text style={k.subtitle}>{subtitle}</Text>
    </View>
  );
}

export const SectionTitle = ({ title, sub, line }: { title: string; sub?: string; line?: boolean }) => (
  <View style={[{ marginTop: 22 }]}>
    <Text style={k.h2}>{title}</Text>
    {!!sub && <Text style={k.h2Sub}>{sub}</Text>}
    {line && <View style={k.line} />}
  </View>
);

export function Footer({ onBack, onSave, busy }: { onBack: () => void; onSave: () => void; busy?: boolean }) {
  return (
    <View style={k.footer}>
      <Pressable onPress={onBack} style={[k.btn, k.btnOutline]}><Text style={[k.btnText, { color: colors.primary }]}>Back</Text></Pressable>
      <Pressable onPress={onSave} disabled={busy} style={[k.btn, k.btnSolid, busy && { opacity: 0.6 }]}>
        <Text style={[k.btnText, { color: '#fff' }]}>Save & Continue</Text>
      </Pressable>
    </View>
  );
}

export const Screen = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F9FD' }}>{children}</SafeAreaView>
);

// "Favourite ..." box: type, press Add, removable chips
export function ChipInput({ title, sub, placeholder, items, setItems, search }: {
  title: string; sub: string; placeholder: string; items: string[]; setItems: (v: string[]) => void; search?: boolean;
}) {
  const [text, setText] = React.useState('');
  const add = () => {
    const v = text.trim();
    if (v && !items.includes(v)) setItems([...items, v]);
    setText('');
  };
  return (
    <View style={{ marginTop: 22 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="heart" size={14} color="#EF4444" />
        <Text style={k.h2}>{title} <Text style={kk.opt}>(Optional)</Text></Text>
      </View>
      <Text style={k.h2Sub}>{sub}</Text>
      <View style={kk.inputRow}>
        {search && <Ionicons name="search-outline" size={16} color={colors.muted} />}
        <TextInput value={text} onChangeText={setText} onSubmitEditing={add} placeholder={placeholder}
          placeholderTextColor={colors.muted} style={kk.input} />
        {!!text.trim() && <Pressable onPress={add} style={kk.add}><Text style={kk.addText}>Add</Text></Pressable>}
      </View>
      <View style={kk.chips}>
        {items.map((x) => (
          <View key={x} style={kk.chip}>
            <Text style={kk.chipText}>{x}</Text>
            <Pressable onPress={() => setItems(items.filter((y) => y !== x))} hitSlop={8}>
              <Ionicons name="close" size={12} color={colors.muted} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

// "Anything else about ...?" box with a 300 character counter
export function NoteBox({ title, placeholder, value, onChange }: {
  title: string; placeholder: string; value: string; onChange: (t: string) => void;
}) {
  return (
    <View style={{ marginTop: 22 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name="chatbubble" size={14} color={colors.primary} />
        <Text style={[k.h2, { flex: 1 }]}>{title} <Text style={kk.opt}>(Optional)</Text></Text>
      </View>
      <View style={[kk.inputRow, { height: undefined, minHeight: 100, alignItems: 'flex-start', paddingVertical: 10, marginTop: 10 }]}>
        <TextInput value={value} onChangeText={(t) => onChange(t.slice(0, 300))} multiline placeholder={placeholder}
          placeholderTextColor={colors.muted} style={[kk.input, { minHeight: 70, textAlignVertical: 'top' }]} />
      </View>
      <Text style={kk.counter}>{value.length}/300</Text>
    </View>
  );
}

const kk = StyleSheet.create({
  opt: { fontSize: 12, fontWeight: '400', color: colors.muted },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E3E8F2', borderRadius: 12, paddingHorizontal: 12, height: 44, marginTop: 10 },
  input: { flex: 1, fontSize: 13, color: colors.text, ...({ outlineStyle: 'none' } as any) },
  add: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 14, height: 30, alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#EEF3FF', borderWidth: 1, borderColor: '#D6E4FC', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 12, fontWeight: '500', color: colors.text },
  counter: { alignSelf: 'flex-end', fontSize: 11, color: colors.muted, marginTop: 4 },
});

export const k = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6, backgroundColor: '#F7F9FD' },
  pill: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 5, backgroundColor: '#E3ECFD', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 5, marginBottom: 10, marginLeft: 4 },
  pillText: { fontSize: 11, fontWeight: '600', color: colors.primary },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 12.5, color: colors.muted, marginTop: 8, marginLeft: 30, lineHeight: 18 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF3D6', alignItems: 'center', justifyContent: 'center' },

  h2: { fontSize: 16, fontWeight: '800', color: colors.text },
  h2Sub: { fontSize: 12, color: colors.muted, marginTop: 3 },
  line: { height: 1, backgroundColor: '#E3E8F2', marginTop: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, marginHorizontal: -4 },
  tile: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#E3E8F2', padding: 5, alignItems: 'center' },
  tilePlain: { paddingVertical: 14, minHeight: 92, justifyContent: 'center', gap: 4 },
  tileOn: { borderColor: colors.primary, borderWidth: 1.5, backgroundColor: '#F3F7FF' },
  photo: { width: '100%', height: 62, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  photoSmall: { height: 48 },
  photoWide: { height: 90 },
  plainIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '600', color: colors.text, textAlign: 'center', marginTop: 5 },
  labelOn: { color: colors.primary },
  sub: { fontSize: 10.5, color: colors.muted },
  badge: { position: 'absolute', top: -5, right: -5, width: 17, height: 17, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', zIndex: 2 },

  footer: { flexDirection: 'row', gap: 12, padding: 16, paddingTop: 10, backgroundColor: '#F7F9FD', borderTopWidth: 1, borderTopColor: '#E9EDF5' },
  btn: { flex: 1, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  btnOutline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: '#fff' },
  btnSolid: { backgroundColor: colors.primary },
  btnText: { fontSize: 15, fontWeight: '700' },
});