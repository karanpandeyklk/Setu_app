import React, { useCallback, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import MiniStepper from '../../components/Stepper';
import {
  acceptRequest, declineRequest, getActive, getDiscover, getReceived, getSent,
  sendInterest, skipPerson, toggleBookmark, withdrawRequest,
} from '../../services/api';
import { buildStages, Connection, Person, ReceivedRequest, SentRequest, STAGE_LABELS } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

type Tab = 'discover' | 'requests' | 'active';
const TABS: { key: Tab; label: string }[] = [
  { key: 'discover', label: 'Discover' }, { key: 'requests', label: 'Requests' }, { key: 'active', label: 'Active' },
];

export default function ConnectionsScreen({ navigation, route }: any) {
  const [tab, setTab] = useState<Tab>('discover');
  const [discover, setDiscover] = useState<Person[]>([]);
  const [received, setReceived] = useState<ReceivedRequest[]>([]);
  const [sent, setSent] = useState<SentRequest[]>([]);
  const [active, setActive] = useState<Connection[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null); // row currently being updated

  const load = useCallback(async (pull = false) => {
    pull ? setRefreshing(true) : setLoading(true);
    setError(false);
    try {
      const [d, r, s, a] = await Promise.all([getDiscover(), getReceived(), getSent(), getActive()]);
      setDiscover(d); setReceived(r); setSent(s); setActive(a);
    } catch { setError(true); }
    setLoading(false); setRefreshing(false);
  }, []);

  // reload on focus; also honour a tab chosen from Home ("View all", attention rows)
  useFocusEffect(useCallback(() => {
    if (route.params?.tab) { setTab(route.params.tab); navigation.setParams({ tab: undefined }); }
    load();
  }, [load, route.params?.tab, navigation]));

  // Run one action, then refresh the lists. Show an inline error if it fails.
  const act = async (id: string, fn: () => Promise<unknown>) => {
    setBusyId(id);
    try { await fn(); await load(true); } catch { setError(true); }
    setBusyId(null);
  };

  const top = discover[0];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Connections</Text>

      <View style={styles.segment} accessibilityRole="tablist">
        {TABS.map((t) => {
          const on = tab === t.key;
          const count = t.key === 'requests' ? received.length : 0;
          return (
            <Pressable key={t.key} style={[styles.seg, on && styles.segOn]} onPress={() => setTab(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }}>
              <Text style={[styles.segText, on && { color: '#fff' }]}>{t.label}{count > 0 ? ` (${count})` : ''}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}>
        {loading ? (
          <View style={{ gap: spacing.lg }}><Skeleton height={90} /><Skeleton height={90} /><Skeleton height={90} /></View>
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Something went wrong" description="Your last action may not have saved. Check your connection and try again." actionLabel="Try again" onAction={() => load()} />
        ) : tab === 'discover' ? (
          <>
            <Text style={styles.section}>Recommended for you</Text>
            {discover.length === 0 ? (
              <EmptyState icon="search-outline" title="No more recommendations" description="Check back soon for new people who share your values." />
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
                  {discover.map((p) => (
                    <View key={p.id} style={{ alignItems: 'center', width: 64 }}>
                      <Avatar size={56} verified={p.verified} />
                      <Text style={styles.small} numberOfLines={1}>{p.name}</Text>
                    </View>
                  ))}
                </ScrollView>
                <Card>
                  <View style={styles.photo}>
                    <Ionicons name="person" size={64} color={colors.primary} />
                    <Pressable
                      style={styles.bookmark}
                      accessibilityRole="button"
                      accessibilityLabel={bookmarked.includes(top.id) ? 'Remove bookmark' : 'Bookmark'}
                      onPress={async () => { const on = await toggleBookmark(top.id); setBookmarked((b) => on ? [...b, top.id] : b.filter((x) => x !== top.id)); }}
                    >
                      <Ionicons name={bookmarked.includes(top.id) ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.primary} />
                    </Pressable>
                  </View>
                  <Text style={styles.cardName}>{top.name}, {top.age}</Text>
                  <Text style={styles.muted}>{top.location} · {top.profession}</Text>
                  <View style={[styles.row, { marginTop: spacing.lg, gap: spacing.md }]}>
                    <Button variant="outline" title="Not Interested" style={{ flex: 1 }} loading={busyId === top.id} onPress={() => act(top.id, () => skipPerson(top))} />
                    <Button title="Interested" style={{ flex: 1 }} loading={busyId === top.id} onPress={() => act(top.id, () => sendInterest(top))} />
                  </View>
                </Card>
              </>
            )}
          </>
        ) : tab === 'requests' ? (
          <>
            <Text style={styles.section}>Received Requests</Text>
            {received.length === 0 ? (
              <EmptyState icon="mail-open-outline" title="No requests yet" description="When someone shows interest in you, it will appear here." />
            ) : received.map((r) => (
              <Card key={r.id} style={styles.item}>
                <View style={styles.row}>
                  <Avatar size={52} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.cardName}>{r.name}, {r.age}</Text>
                    <Text style={styles.muted}>{r.location}</Text>
                    <Text style={styles.muted}>{r.time}</Text>
                  </View>
                </View>
                <View style={[styles.row, { gap: spacing.md, marginTop: spacing.md }]}>
                  <Button small variant="outline" title="Decline" style={{ flex: 1 }} disabled={busyId === r.id} onPress={() => act(r.id, () => declineRequest(r.id))} />
                  <Button small title="Accept" style={{ flex: 1 }} loading={busyId === r.id} onPress={() => act(r.id, () => acceptRequest(r.id))} />
                </View>
              </Card>
            ))}

            <Text style={[styles.section, { marginTop: spacing.xl }]}>Sent Requests</Text>
            {sent.length === 0 ? (
              <EmptyState icon="paper-plane-outline" title="No pending requests" description="Requests you send will show up here until they respond." />
            ) : sent.map((s) => (
              <Card key={s.id} style={styles.item}>
                <View style={styles.row}>
                  <Avatar size={52} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.cardName}>{s.name}, {s.age}</Text>
                    <Text style={styles.muted}>{s.location}</Text>
                    <Text style={[styles.muted, { color: '#B45309' }]}>{s.status}</Text>
                  </View>
                  <Button small variant="outline" title="Withdraw" loading={busyId === s.id} onPress={() => act(s.id, () => withdrawRequest(s.id))} />
                </View>
              </Card>
            ))}
          </>
        ) : active.length === 0 ? (
          <EmptyState icon="people-outline" title="No active connections" description="Accept a request or send interest to start your Setu journey." actionLabel="Find people" onAction={() => setTab('discover')} />
        ) : active.map((c) => (
          <Card key={c.id} style={styles.item}>
            <View style={styles.row}>
              <Avatar size={56} online={c.online} verified={c.verified} />
              <View style={{ flex: 1, marginLeft: spacing.md }}>
                <Text style={styles.cardName}>{c.name}, {c.age}</Text>
                <Text style={styles.muted}>{c.location}</Text>
                <View style={{ marginTop: 6 }}><Chip label={`Setu: ${STAGE_LABELS[c.stage]}`} /></View>
              </View>
            </View>
            <View style={{ marginVertical: spacing.md }}><MiniStepper stages={buildStages(c.stage)} size={14} /></View>
            <Button title="Continue Journey" arrow onPress={() => navigation.navigate('Journey')} />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  segment: { flexDirection: 'row', backgroundColor: '#E9EEF6', borderRadius: radius.pill, margin: spacing.lg, padding: 4 },
  seg: { flex: 1, minHeight: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.primary },
  segText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginBottom: spacing.md },
  item: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 1 },
  small: { fontFamily: fonts.regular, fontSize: 11, color: colors.text, marginTop: 4 },
  photo: { height: 220, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  bookmark: { position: 'absolute', top: 10, right: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
