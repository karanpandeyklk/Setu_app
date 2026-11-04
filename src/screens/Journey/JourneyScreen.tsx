import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import { getJourney } from '../../services/journeyApi';
import { STAGE_INFO } from '../../services/journeyData';
import { Connection, StageKey, STAGE_LABELS } from '../../services/mockData';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

const HELP = [
  { icon: 'search-outline', label: 'Understand' }, { icon: 'create-outline', label: 'Reflect' },
  { icon: 'chatbubbles-outline', label: 'Discuss' }, { icon: 'compass-outline', label: 'Navigate' },
];

export default function JourneyScreen({ navigation }: any) {
  const [conn, setConn] = useState<Connection | null>(null);
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try { const j = await getJourney(); setConn(j.connection); setStages(j.stages); } catch { setError(true); }
    setLoading(false);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const askGuide = () => navigation.navigate('Guide');

  const open = (key: StageKey) => {
    const params = { stage: key, match: conn?.name ?? '' };
    navigation.navigate(key === 'reflect' ? 'ReflectIntro' : 'Stage', params);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{conn ? `Your Journey with ${conn.name}` : 'Your Journey'}</Text>

        {loading ? (
          <View style={{ gap: spacing.lg }}><Skeleton height={110} /><Skeleton height={70} /><Skeleton height={380} /></View>
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load your journey" description="Check your connection and try again." actionLabel="Try again" onAction={load} />
        ) : !conn ? (
          <EmptyState icon="people-outline" title="No journey yet" description="Accept a request to begin a journey with someone." actionLabel="Find people" onAction={() => navigation.navigate('Connections')} />
        ) : (
          <>
            <Card style={styles.row}>
              <Avatar size={56} online={conn.online} verified={conn.verified} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.name}>{conn.name}, {conn.age}</Text>
                <Text style={styles.muted}>{conn.profession}</Text>
                <Text style={styles.muted}>{conn.location}</Text>
              </View>
              <Chip label="Connected" tone="green" dot />
            </Card>

            <View style={styles.banner}>
              <Ionicons name="footsteps-outline" size={22} color={colors.primary} />
              <Text style={styles.bannerText}>Every meaningful relationship grows step by step</Text>
            </View>

            {stages.map((s, i) => {
              const info = STAGE_INFO[s.key as StageKey];
              const locked = s.status === 'locked';
              const isActive = s.status === 'active';
              return (
                <Pressable
                  key={s.key}
                  disabled={!isActive}
                  onPress={() => open(s.key)}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !isActive }}
                  accessibilityLabel={`${STAGE_LABELS[s.key as StageKey]}, ${s.status}`}
                  style={[styles.stage, shadow.card, isActive && styles.stageActive, locked && { opacity: 0.55 }]}
                >
                  <View style={[styles.stageIcon, s.status === 'completed' && { backgroundColor: colors.successSoft }, locked && { backgroundColor: '#F1F5F9' }]}>
                    <Ionicons name={info.icon as any} size={20} color={s.status === 'completed' ? colors.success : locked ? colors.muted : colors.primary} />
                  </View>
                  <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                    <Text style={styles.stageTitle}>{i + 1}. {STAGE_LABELS[s.key as StageKey]}</Text>
                    <Text style={styles.muted}>{info.description}</Text>
                  </View>
                  {s.status === 'completed' && <Chip label="Completed ✓" tone="green" />}
                  {isActive && <Chip label="Active" tone="blue" dot />}
                  {locked && <Ionicons name="lock-closed" size={18} color={colors.muted} />}
                </Pressable>
              );
            })}

            <Text style={styles.section}>How Setu Guide can help you</Text>
            <View style={styles.grid}>
              {HELP.map((h) => (
                <Pressable key={h.label} style={[styles.gridItem, shadow.card]} onPress={askGuide} accessibilityRole="button" accessibilityLabel={h.label}>
                  <Ionicons name={h.icon as any} size={24} color={colors.primary} />
                  <Text style={styles.gridText}>{h.label}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable style={[styles.pill, shadow.button]} onPress={askGuide} accessibilityRole="button" accessibilityLabel="Ask Setu Guide">
              <Ionicons name="sparkles" size={18} color="#fff" />
              <Text style={styles.pillText}>Ask Setu Guide</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.text, marginBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'center' },
  name: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.lg, marginVertical: spacing.lg },
  bannerText: { flex: 1, marginLeft: spacing.md, fontFamily: fonts.medium, fontSize: 14, color: colors.primaryDark },
  stage: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, minHeight: 72, borderWidth: 1, borderColor: 'transparent' },
  stageActive: { borderColor: colors.primary },
  stageIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  stageTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '48%', backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.lg, minHeight: 80, justifyContent: 'center' },
  gridText: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginTop: spacing.sm },
  pill: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 22, minHeight: 48, marginTop: spacing.xl },
  pillText: { fontFamily: fonts.semibold, fontSize: 15, color: '#fff', marginLeft: 8 },
});