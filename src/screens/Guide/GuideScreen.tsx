import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import MiniStepper from '../../components/Stepper';
import { getHome, HomeData } from '../../services/api';
import { STAGE_LABELS, StageKey } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

// Short description of each stage. Placeholder wording: confirm the final copy with design.
const STAGE_DESC: Record<StageKey, string> = {
  connect: 'Say hello and take your time before going further.',
  understand: 'Learn more about each other through meaningful conversation and shared perspectives.',
  reflect: 'Think about what you have learned and how compatible you feel.',
  discuss: 'Talk openly about values, family and plans for the future.',
  agree: 'Confirm that you both want to move forward together.',
  family: 'Families come together to get to know each other.',
  reflect_again: 'Take a calm, honest look at everything before deciding.',
  decision: 'Make your decision with care, and take the time you need.',
};

export default function GuideScreen({ navigation }: any) {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // reload when the screen is shown, so the journey card always matches Home and Journey
  useFocusEffect(useCallback(() => {
    let alive = true;
    (async () => {
      try {
        const d = await getHome();
        if (alive) { setData(d); setError(false); }
      } catch {
        if (alive) setError(true);
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []));

  const cc = data?.currentConnection;
  const active = data?.stages.find((s) => s.status === 'active');
  const stageKey = (active?.key ?? 'connect') as StageKey;
  const labelledStages = data?.stages.map((s) => ({ ...s, label: STAGE_LABELS[s.key as StageKey] })) ?? [];

  const openChat = (intent?: string) => navigation.navigate('GuideChat', intent ? { intent } : undefined);
  const goJourney = () => navigation.navigate('Main', { screen: 'Journey' });

  const TILES = [
    { key: 'understand', title: 'Understand', desc: 'Learn about each other, values and lifestyle.', icon: 'book-outline', color: colors.primary, tint: '#E8F0FF', onPress: () => openChat('help_me_understand') },
    { key: 'reflect', title: 'Reflect', desc: 'Explore your thoughts and feelings privately.', icon: 'heart-outline', color: '#E5484D', tint: '#FDECEC', onPress: goJourney },
    { key: 'discuss', title: 'Discuss', desc: 'Get conversation ideas for important topics.', icon: 'chatbubble-ellipses-outline', color: '#8E4EC6', tint: '#F3EAFB', onPress: () => openChat('conversation_ideas') },
    { key: 'navigate', title: 'Navigate', desc: 'Next steps, privacy, safety and more.', icon: 'compass-outline', color: '#2E9E6B', tint: '#E6F6EE', onPress: () => openChat('next_steps') },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.icon} accessibilityRole="button" accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Setu Guide</Text>
            <Text style={styles.sub}>Your companion for a thoughtful and meaningful journey.</Text>
          </View>
          <Pressable style={styles.icon} accessibilityRole="button" accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Hero */}
        <Card style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Build understanding.{'\n'}At your own pace.</Text>
            <Text style={[styles.muted, { marginVertical: spacing.sm }]}>Get guidance, conversation ideas and helpful insights to know each other better.</Text>
            <Button title="Ask Setu Guide" arrow small onPress={() => openChat()} style={{ alignSelf: 'flex-start' }} />
          </View>
          <View style={styles.art}><Ionicons name="sparkles" size={36} color={colors.primary} /></View>
        </Card>

        {/* Active journey */}
        <View style={[styles.sectionRow, styles.gap]}>
          <Text style={styles.section}>Your Active Journey</Text>
          <Text style={styles.link} onPress={goJourney} accessibilityRole="link">See all →</Text>
        </View>
        {loading ? (
          <Skeleton height={230} />
        ) : error && !data ? (
          <Card><EmptyState icon="cloud-offline-outline" title="Couldn't load your journey" description="Check your connection and try again." actionLabel="Try again" onAction={() => { setLoading(true); setError(false); getHome().then((d) => { setData(d); setLoading(false); }).catch(() => { setError(true); setLoading(false); }); }} /></Card>
        ) : cc ? (
          <Card>
            <Pressable style={styles.row} onPress={() => navigation.navigate('ProfileDetail', { personId: cc.id })} accessibilityRole="button" accessibilityLabel={`View ${cc.name}'s profile`}>
              <Avatar size={44} uri={cc.photo} online={cc.online} label={cc.name} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.cardName}>{cc.name}, {cc.age}</Text>
                <Text style={styles.muted}>{cc.profession} · {cc.location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
            <View style={{ marginTop: spacing.lg }}><MiniStepper stages={labelledStages} /></View>
            <View style={styles.callout}>
              <Text style={styles.eyebrow}>CURRENT STAGE</Text>
              <Text style={styles.calloutTitle}>{STAGE_LABELS[stageKey]}</Text>
              <Text style={styles.muted}>{STAGE_DESC[stageKey]}</Text>
            </View>
            <Button title="Continue Journey" arrow style={{ marginTop: spacing.md }} onPress={goJourney} />
          </Card>
        ) : (
          <Card><EmptyState icon="people-outline" title="No active journey yet" description="Accept a request or send interest to begin." actionLabel="Find people" onAction={() => navigation.navigate('Main', { screen: 'Connections' })} /></Card>
        )}

        {/* Help tiles */}
        <Text style={[styles.section, styles.gap]}>How Setu Guide can help you</Text>
        <View style={styles.grid}>
          {TILES.map((t) => (
            <Pressable key={t.key} style={styles.tile} onPress={t.onPress} accessibilityRole="button" accessibilityLabel={`${t.title}. ${t.desc}`}>
              <View style={[styles.tileIcon, { backgroundColor: t.tint }]}><Ionicons name={t.icon as any} size={20} color={t.color} /></View>
              <Text style={styles.tileTitle}>{t.title}</Text>
              <Text style={styles.muted}>{t.desc}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg },
  icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  hero: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft },
  heroTitle: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24, color: colors.text },
  art: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginLeft: spacing.md },
  gap: { marginTop: spacing.xl },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginBottom: spacing.md },
  link: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, paddingVertical: 8, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  callout: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  eyebrow: { fontFamily: fonts.medium, fontSize: 10, letterSpacing: 0.8, color: colors.muted },
  calloutTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.primary, marginVertical: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { width: '47.5%', flexGrow: 1, backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.md, minHeight: 130 },
  tileIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  tileTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, marginBottom: 2 },
});