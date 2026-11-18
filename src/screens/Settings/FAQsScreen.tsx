import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { settingsFonts as fonts } from '../../theme';

const NAVY = '#0F1B3D';
const GREY = '#7B8498';

// Edit these so they match how your app really works
const FAQS = [
  { q: 'How does verification work?', a: 'Go to Settings → Verification and complete each level. A verified badge appears on your profile once a level is approved.' },
  { q: 'Who can see my profile?', a: 'You control this in Settings → Privacy & Visibility. By default, only people matching your preferences can see it.' },
  { q: 'How do I block or report someone?', a: 'Open their profile or chat, tap the menu, and choose Block or Report. You can manage blocked accounts in Settings → Blocked Users.' },
  { q: 'What can Setu Guide access?', a: 'Only what you allow. You can review and change this anytime in Settings → AI & Privacy.' },
  { q: 'How do I change my phone number or email?', a: 'Go to Settings → Account and tap Phone Number or Email Address.' },
  { q: 'How do I delete my account?', a: 'Go to Settings → Password & Security → Delete Account.' },
];

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Pressable onPress={() => setOpen((o) => !o)} style={styles.item}>
      <View style={styles.head}>
        <Text style={styles.q}>{q}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#B6BFCC" />
      </View>
      {open && <Text style={styles.a}>{a}</Text>}
    </Pressable>
  );
}

export default function FAQsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerPad}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={24} color={NAVY} />
          </Pressable>
          <Text style={styles.title}>FAQs</Text>
          <Text style={styles.subtitle}>Find answers to common questions.</Text>
        </View>

        <View style={styles.card}>
          {FAQS.map((f) => (
            <Faq key={f.q} q={f.q} a={f.a} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F5FC' },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  headerPad: { paddingHorizontal: 8 },
  back: { marginTop: 10, alignSelf: 'flex-start' },
  title: { fontFamily: fonts.semibold, fontSize: 30, color: NAVY, marginTop: 18 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: GREY, marginTop: 4 },

  card: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 18,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  item: { paddingVertical: 16 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  q: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: NAVY },
  a: { fontFamily: fonts.regular, fontSize: 13, color: GREY, lineHeight: 20, marginTop: 8 },
});