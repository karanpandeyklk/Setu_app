import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, settingsFonts as fonts } from '../../theme';

const NAVY = '#0F1B3D';
const GREY = '#7B8498';

// Sample data. Replace with the real journey from your backend.
const STEPS = ['Connect', 'Understand', 'Reflect', 'Discuss', 'Agree', 'Family', 'Reflect Again', 'Decision'];
const CURRENT = 1; // index of the current step ("Understand")
const PERSON = {
  name: 'Rohan, 27',
  info: 'Software Engineer · Hyderabad',
  avatar: undefined as string | undefined, // image URL if you have one
  online: true,
};

const HELP: { title: string; text: string; icon: keyof typeof Ionicons.glyphMap; tint: string; bg: string; to: string }[] = [
  { title: 'Understand', text: 'Learn about each other, values and lifestyle.', icon: 'book', tint: '#2563EB', bg: '#E3ECFF', to: 'Guide' },
  { title: 'Reflect', text: 'Explore your thoughts and feelings privately.', icon: 'heart-outline', tint: '#EF4444', bg: '#FDE2E2', to: 'ReflectIntro' },
  { title: 'Discuss', text: 'Get conversation ideas for important topics.', icon: 'chatbox-ellipses-outline', tint: '#7C3AED', bg: '#EDE9FE', to: 'Guide' },
  { title: 'Navigate', text: 'Get help with next steps, privacy, safety and more.', icon: 'compass-outline', tint: '#16A34A', bg: '#DCFCE7', to: 'Guide' },
];

export default function JourneyScreen({ navigation }: any) {
  const go = (name: string, params?: object) => () => navigation.navigate(name, params);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Setu Guide</Text>
            <Text style={styles.subtitle}>Your companion for a thoughtful and meaningful journey.</Text>
          </View>
          <Pressable onPress={go('Notifications')} hitSlop={10} accessibilityLabel="Notifications" style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color={NAVY} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Build understanding.{'\n'}At your own pace.</Text>
            <Text style={styles.heroText}>Get guidance, conversation ideas and helpful insights to know each other better.</Text>
          </View>
          {/* Replace with the Figma illustration: <Image source={require('../../../assets/guide-hero.png')} style={styles.heroImg} /> */}
          <View style={styles.heroArt}>
            <Ionicons name="sparkles" size={34} color="#2563EB" />
          </View>
        </View>

        {/* Active journey */}
        <View style={styles.rowHead}>
          <Text style={styles.section}>Your Active Journey</Text>
          <Pressable onPress={go('Connections')} hitSlop={8}>
            <Text style={styles.seeAll}>See all →</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Pressable style={styles.person} onPress={go('ChatProfile')}>
            <View>
              {PERSON.avatar ? (
                <Image source={{ uri: PERSON.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarText}>{PERSON.name.charAt(0)}</Text>
                </View>
              )}
              {PERSON.online && <View style={styles.online} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{PERSON.name}</Text>
              <Text style={styles.info}>{PERSON.info}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B6BFCC" />
          </Pressable>

          {/* Stepper */}
          <View style={styles.stepper}>
            {STEPS.map((label, i) => {
              const done = i < CURRENT;
              const current = i === CURRENT;
              return (
                <View key={label} style={styles.step}>
                  {i < STEPS.length - 1 && <View style={[styles.line, i < CURRENT && styles.lineDone]} />}
                  <View style={[styles.dot, (done || current) && styles.dotOn, current && styles.dotCurrent]}>
                    {(done || current) && <Ionicons name="checkmark" size={10} color="#fff" />}
                  </View>
                  <Text style={[styles.stepLabel, current && styles.stepLabelOn]} numberOfLines={2}>{label}</Text>
                </View>
              );
            })}
          </View>

          {/* Current stage */}
          <View style={styles.stage}>
            <View style={styles.stageHead}>
              <View style={styles.bulb}><Ionicons name="bulb-outline" size={18} color="#2563EB" /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stageLabel}>CURRENT STAGE</Text>
                <Text style={styles.stageName}>{STEPS[CURRENT]}</Text>
              </View>
            </View>
            <Text style={styles.stageText}>
              Learn more about each other through meaningful conversation and shared perspectives.
            </Text>
            <Pressable style={styles.cta} onPress={go('Stage', { stage: STEPS[CURRENT] })}>
              <Text style={styles.ctaText}>Continue Journey  →</Text>
            </Pressable>
          </View>
        </View>

        {/* How Setu Guide can help you */}
        <Text style={[styles.section, { marginTop: 22, marginBottom: 12 }]}>How Setu Guide can help you</Text>
        <View style={styles.grid}>
          {HELP.map((h) => (
            <Pressable key={h.title} style={styles.help} onPress={go(h.to, h.to === 'Guide' ? { topic: h.title } : undefined)}>
              <View style={[styles.helpIcon, { backgroundColor: h.bg }]}>
                <Ionicons name={h.icon} size={18} color={h.tint} />
              </View>
              <Text style={styles.helpTitle}>{h.title}</Text>
              <Text style={styles.helpText}>{h.text}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FD' },
  content: { paddingHorizontal: 18, paddingBottom: 24 },

  header: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 10 },
  title: { fontFamily: fonts.bold, fontSize: 26, color: NAVY },
  subtitle: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: GREY, marginTop: 4, paddingRight: 12 },
  bell: { padding: 4, marginTop: 4 },
  bellDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#F7F9FD' },

  hero: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F1FF', borderWidth: 1, borderColor: '#D6E6FF', borderRadius: 20, padding: 18, marginTop: 18 },
  heroTitle: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: NAVY },
  heroText: { fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 17, color: GREY, marginTop: 8, paddingRight: 8 },
  heroArt: { width: 86, height: 86, borderRadius: 43, backgroundColor: '#D6E6FF', alignItems: 'center', justifyContent: 'center' },
  heroImg: { width: 96, height: 96 },

  rowHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 24, marginBottom: 12 },
  section: { fontFamily: fonts.bold, fontSize: 15, color: NAVY },
  seeAll: { fontFamily: fonts.semibold, fontSize: 12, color: '#2563EB' },

  card: { backgroundColor: '#fff', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#EDF1F8', shadowColor: '#1E3A8A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 46, height: 46, borderRadius: 23 },
  avatarFallback: { backgroundColor: '#E3ECFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.bold, fontSize: 18, color: '#2563EB' },
  online: { position: 'absolute', right: 0, bottom: 0, width: 12, height: 12, borderRadius: 6, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#fff' },
  name: { fontFamily: fonts.bold, fontSize: 15, color: NAVY },
  info: { fontFamily: fonts.regular, fontSize: 11.5, color: GREY, marginTop: 2 },

  stepper: { flexDirection: 'row', marginTop: 18, marginBottom: 14 },
  step: { flex: 1, alignItems: 'center' },
  line: { position: 'absolute', top: 9, left: '50%', right: '-50%', height: 2, backgroundColor: '#E3E8F2' },
  lineDone: { backgroundColor: '#2563EB' },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#D5DCE8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  dotOn: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
  dotCurrent: { shadowColor: '#2563EB', shadowOpacity: 0.35, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  stepLabel: { fontFamily: fonts.regular, fontSize: 8, lineHeight: 10, color: GREY, textAlign: 'center', marginTop: 5 },
  stepLabelOn: { fontFamily: fonts.bold, color: NAVY },

  stage: { backgroundColor: '#EEF4FF', borderRadius: 16, padding: 14 },
  stageHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bulb: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  stageLabel: { fontFamily: fonts.semibold, fontSize: 9.5, letterSpacing: 0.6, color: GREY },
  stageName: { fontFamily: fonts.bold, fontSize: 16, color: NAVY, marginTop: 1 },
  stageText: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: '#5B657A', marginTop: 10 },
  cta: { height: 44, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  ctaText: { fontFamily: fonts.bold, fontSize: 14, color: '#fff' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  help: { width: '48%', flexGrow: 1, backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#EDF1F8', shadowColor: '#1E3A8A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  helpIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  helpTitle: { fontFamily: fonts.bold, fontSize: 14, color: NAVY, marginTop: 10 },
  helpText: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, color: GREY, marginTop: 3 },
});