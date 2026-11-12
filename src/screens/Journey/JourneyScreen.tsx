import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import { getJourney } from '../../services/journeyApi';
import { Connection, StageKey, StageStatus, STAGE_LABELS } from '../../services/mockData';
import { STAGE_LIST } from '../../services/stageContent';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

// The Figma frame ends after the "no rush" note. Set to false to hide the Setu Guide help tiles below it.
const SHOW_GUIDE_HELP = true;

const HELP = [
  { icon: 'search-outline', label: 'Understand' }, { icon: 'create-outline', label: 'Reflect' },
  { icon: 'chatbubbles-outline', label: 'Discuss' }, { icon: 'compass-outline', label: 'Navigate' },
];
const RAIL = '#D5DCE8';

export default function JourneyScreen({ navigation }: any) {
  const [conn, setConn] = useState<Connection | null>(null);
  const [stages, setStages] = useState<{ key: string; status: StageStatus }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try { const j = await getJourney(); setConn(j.connection); setStages(j.stages); } catch { setError(true); }
    setLoading(false);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

    const open = (key: StageKey, status?: string) => {
    const params = { stage: key, match: conn?.name ?? '' };
    if (key === 'reflect' && status === 'completed') return navigation.navigate('ReflectResults', params);
    navigation.navigate(key === 'reflect' ? 'ReflectIntro' : 'Stage', params);
  };
  const askGuide = () => navigation.navigate('Guide');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Top bar: back arrow and centered title, like Figma */}
      <View style={styles.top}>
        <Pressable onPress={() => navigation.navigate('Home')} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>{conn ? `Your Journey with ${conn.name}` : 'Your Journey'}</Text>
        <View style={styles.iconBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading ? (
          <View style={{ gap: spacing.lg }}><Skeleton height={80} /><Skeleton height={90} /><Skeleton height={380} /></View>
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load your journey" description="Check your connection and try again." actionLabel="Try again" onAction={load} />
        ) : !conn ? (
          <EmptyState icon="people-outline" title="No journey yet" description="Accept a request to begin a journey with someone." actionLabel="Find people" onAction={() => navigation.navigate('Connections')} />
        ) : (
          <>
            {/* Match */}
            <View style={styles.matchRow}>
              <Avatar size={56} name={conn.name} online={conn.online} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.name}>{conn.name}, {conn.age}</Text>
                <Text style={styles.muted}>{conn.profession} · {conn.location.split(',')[0]}</Text>
                <View style={styles.connected}>
                  <Ionicons name="checkmark-circle" size={15} color={colors.success} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
              <Pressable onPress={() => setMenuOpen(!menuOpen)} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="More options">
                <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
              </Pressable>
            </View>
            {menuOpen && (
              <Pressable
                style={styles.menu}
                onPress={() => { setMenuOpen(false); navigation.navigate('MatchProfile', { personId: conn.id }); }}
                accessibilityRole="button"
                accessibilityLabel={`View ${conn.name}'s profile`}
              >
                <Ionicons name="person-outline" size={18} color={colors.text} />
                <Text style={styles.menuText}>View profile</Text>
              </Pressable>
            )}

            {/* Banner */}
            <View style={styles.banner}>
              <View style={{ flex: 1, paddingRight: 90 }}>
                <Text style={styles.bannerTitle}>Every meaningful relationship grows step by step.</Text>
                <Text style={styles.bannerSub}>Take the time you need. Setu Guide is here to support you.</Text>
              </View>
              <View style={styles.art} pointerEvents="none">
                <Ionicons name="triangle" size={72} color="#C4D6F4" style={{ position: 'absolute', right: 34, bottom: -6 }} />
                <Ionicons name="triangle" size={52} color="#9DB9EA" style={{ position: 'absolute', right: 2, bottom: -6 }} />
              </View>
            </View>

            {/* Vertical stepper with a connected rail */}
            <View style={{ marginTop: spacing.lg }}>
              {stages.map((s, i) => {
                const key = s.key as StageKey;
                const info = STAGE_LIST[key];
                const first = i === 0;
                const last = i === stages.length - 1;
                const completed = s.status === 'completed';
                const isActive = s.status === 'active';
                const locked = s.status === 'locked';
                const prevDone = !first && stages[i - 1].status === 'completed';

                return (
                  <Pressable
                    key={s.key}
                        disabled={!isActive && !(completed && key === 'reflect')}
    onPress={() => open(key, s.status)}
    accessibilityState={{ disabled: !isActive && !(completed && key === 'reflect') }}
                    accessibilityRole="button"
                    accessibilityLabel={`${STAGE_LABELS[key]}, ${s.status}`}
                    style={[styles.stageRow, isActive && styles.stageRowActive]}
                  >
                    <View style={styles.rail}>
                      <View style={[styles.railLine, { backgroundColor: first ? 'transparent' : prevDone ? colors.success : RAIL }]} />
                      <View style={[styles.node, completed && { backgroundColor: colors.success }, isActive && { backgroundColor: colors.primary }, locked && { backgroundColor: '#E8EDF5' }]}>
                        {completed || isActive ? (
                          <Ionicons name="checkmark" size={18} color="#fff" />
                        ) : (
                          <Ionicons name={info.icon as any} size={16} color={colors.muted} />
                        )}
                      </View>
                      <View style={[styles.railLine, { backgroundColor: last ? 'transparent' : completed ? colors.success : RAIL }]} />
                    </View>

                    <View style={[styles.stageText, locked && { opacity: 0.6 }]}>
                      <Text style={[styles.stageTitle, isActive && { color: colors.primary }]}>{STAGE_LABELS[key]}</Text>
                      <Text style={styles.stageDesc}>{info.text}</Text>
                    </View>

                    <View style={styles.status}>
                      {isActive ? (
                        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
                      ) : (
                        <Text style={styles.statusText}>{completed ? 'Completed' : 'Locked'}</Text>
                      )}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Note */}
            <View style={styles.note}>
              <MaterialCommunityIcons name="infinity" size={22} color={colors.primary} />
              <Text style={styles.noteText}>You can pause, take more time, or revisit any stage. There is no rush.</Text>
            </View>

            {SHOW_GUIDE_HELP && (
              <>
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 52 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: 120 },

  matchRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  name: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 1 },
  connected: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  connectedText: { fontFamily: fonts.medium, fontSize: 12, color: colors.success, marginLeft: 4 },
  menu: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', minHeight: 44, backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: colors.border, marginTop: spacing.xs },
  menuText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, marginLeft: spacing.sm },

  banner: { flexDirection: 'row', backgroundColor: '#E8F0FD', borderRadius: radius.lg, padding: spacing.lg, minHeight: 92, overflow: 'hidden', marginTop: spacing.lg },
  bannerTitle: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: colors.text },
  bannerSub: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.muted, marginTop: 4 },
  art: { position: 'absolute', right: 0, bottom: 0, width: 110, height: 70 },

  stageRow: { flexDirection: 'row', alignItems: 'stretch', minHeight: 64, borderRadius: radius.md },
  stageRowActive: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: '#CFE0FB' },
  rail: { width: 44, alignItems: 'center', alignSelf: 'stretch' },
  railLine: { flex: 1, width: 2 },
  node: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stageText: { flex: 1, paddingVertical: spacing.md, paddingRight: spacing.sm, justifyContent: 'center' },
  stageTitle: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.text },
  stageDesc: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.muted, marginTop: 2 },
  status: { minWidth: 56, justifyContent: 'center', alignItems: 'flex-end', paddingRight: spacing.md },
  statusText: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  note: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F0FD', borderRadius: radius.md, padding: spacing.lg, marginTop: spacing.lg },
  noteText: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.muted, marginLeft: spacing.md },

  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  gridItem: { width: '48%', backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.lg, minHeight: 80, justifyContent: 'center' },
  gridText: { fontFamily: fonts.medium, fontSize: 14, color: colors.text, marginTop: spacing.sm },
  pill: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 22, minHeight: 48, marginTop: spacing.xl },
  pillText: { fontFamily: fonts.semibold, fontSize: 15, color: '#fff', marginLeft: 8 },
});