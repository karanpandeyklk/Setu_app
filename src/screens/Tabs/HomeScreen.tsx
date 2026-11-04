import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
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
import { STAGE_LABELS } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (pull = false) => {
    pull ? setRefreshing(true) : setLoading(true);
    setError(false);
    try { setData(await getHome()); } catch { setError(true); }
    setLoading(false); setRefreshing(false);
  }, []);

  // reload every time the tab is shown, so Home always matches Connections and Journey
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const cc = data?.currentConnection;
  const active = data?.stages.find((s) => s.status === 'active');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}>
        <View style={styles.header}>
          <Avatar size={44} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.greet}>{greeting()},</Text>
            <Text style={styles.name}>{data?.userName ?? 'Aanya'}</Text>
          </View>
          <Pressable style={styles.bell} accessibilityRole="button" accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {!!data?.unreadNotifications && <View style={styles.badge} />}
          </Pressable>
        </View>

        {loading && !data ? (
          <View style={{ gap: spacing.lg }}>
            <Skeleton height={150} /><Skeleton height={190} /><Skeleton height={110} />
          </View>
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load your dashboard" description="Check your connection and try again." actionLabel="Try again" onAction={() => load()} />
        ) : data && (
          <>
            {/* Needs Your Attention */}
            <View style={styles.sectionRow}>
              <Text style={styles.section}>Needs Your Attention</Text>
              {data.attention.length > 0 && (
                <Text style={styles.viewAll} onPress={() => navigation.navigate('Connections', { tab: 'requests' })} accessibilityRole="link">View all →</Text>
              )}
            </View>
            {data.attention.length === 0 ? (
              <Card><EmptyState icon="checkmark-done-outline" title="You're all caught up" description="Nothing needs your attention right now." /></Card>
            ) : (
              <Card style={{ paddingVertical: spacing.xs }}>
                {data.attention.map((a, i) => (
                  <Pressable key={a.id} style={[styles.attn, i > 0 && styles.attnBorder]} onPress={() => navigation.navigate('Connections', { tab: a.target })} accessibilityRole="button" accessibilityLabel={`${a.title}. ${a.description}`}>
                    <View style={styles.attnIcon}><Ionicons name={a.icon as any} size={20} color={colors.primary} /></View>
                    <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                      <Text style={styles.attnTitle}>{a.title}</Text>
                      <Text style={styles.muted}>{a.description}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                  </Pressable>
                ))}
              </Card>
            )}

            {/* Current Connection */}
            <Text style={[styles.section, styles.gap]}>Current Connection</Text>
            {cc ? (
              <Card>
                <View style={styles.row}>
                  <Avatar size={64} online={cc.online} verified={cc.verified} />
                  <View style={{ flex: 1, marginLeft: spacing.lg }}>
                    <Text style={styles.cardName}>{cc.name}, {cc.age}</Text>
                    <Text style={styles.muted}>{cc.location}</Text>
                    <Text style={styles.muted}>{cc.profession}</Text>
                  </View>
                </View>
                <Button title="Continue" arrow style={{ marginTop: spacing.lg }} onPress={() => navigation.navigate('Journey')} />
              </Card>
            ) : (
              <Card><EmptyState icon="people-outline" title="No active connection yet" description="Accept a request or send interest to begin your journey." actionLabel="Find people" onAction={() => navigation.navigate('Connections')} /></Card>
            )}

            {/* Your Journey */}
            <View style={[styles.sectionRow, styles.gap]}>
              <Text style={styles.section}>Your Journey</Text>
              <Text style={styles.viewAll} onPress={() => navigation.navigate('Journey')} accessibilityRole="link">View details →</Text>
            </View>
            <Card>
              <MiniStepper stages={data.stages} />
              <Text style={[styles.muted, { marginTop: spacing.md }]}>
                {active ? `Stage ${data.stages.indexOf(active) + 1} of 8: ${STAGE_LABELS[active.key as keyof typeof STAGE_LABELS]}` : 'Journey not started'}
              </Text>
            </Card>

            {/* Setu Guide promo */}
            <Card style={[styles.guide, styles.gap]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>Setu Guide</Text>
                <Text style={[styles.muted, { marginVertical: spacing.sm }]}>Conversation ideas, tips and help at every step of your journey.</Text>
                <Button title="Ask Setu Guide" small variant="outline" onPress={() => navigation.navigate('Journey')} style={{ alignSelf: 'flex-start' }} />
                  <Button title="Ask Setu Guide" small variant="outline" onPress={() => navigation.navigate('Guide')} style={{ alignSelf: 'flex-start' }} />
              </View>
              <View style={styles.guideArt}><Ionicons name="sparkles" size={36} color={colors.primary} /></View>
            </Card>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl },
  greet: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  name: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  bell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 10, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, borderWidth: 1.5, borderColor: colors.bg },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginBottom: spacing.md },
  viewAll: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, paddingVertical: 8, marginBottom: spacing.md },
  gap: { marginTop: spacing.xl },
  attn: { flexDirection: 'row', alignItems: 'center', minHeight: 64 },
  attnBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  attnIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  attnTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardName: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text },
  guide: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft },
  guideArt: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginLeft: spacing.md },
});
