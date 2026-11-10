import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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
  acceptRequest, declineRequest, getActive, getBookmarks, getDiscover, getReceived, getSent,
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
  const [selectedId, setSelectedId] = useState<string | null>(null); // person shown in the large card
  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);          // first load failed: show full error state
  const [banner, setBanner] = useState('');           // later failures: small message above the list
  const [busyKey, setBusyKey] = useState<string | null>(null); // e.g. "r1:accept"
  const hasLoaded = useRef(false);

  const load = useCallback(async (pull = false) => {
    if (pull) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true); // skeletons only on the very first load
    setError(false);
    setBanner('');
    try {
      const [d, r, s, a, b] = await Promise.all([getDiscover(), getReceived(), getSent(), getActive(), getBookmarks()]);
      setDiscover(d); setReceived(r); setSent(s); setActive(a); setBookmarked(b);
      hasLoaded.current = true;
    } catch {
      if (hasLoaded.current) setBanner("Couldn't refresh. Showing your last saved lists.");
      else setError(true);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  // reload every time the tab is shown
  useFocusEffect(useCallback(() => { load(); }, [load]));

  // honour a tab chosen from Home ("View all", attention rows)
  useEffect(() => {
    if (route.params?.tab) {
      setTab(route.params.tab);
      navigation.setParams({ tab: undefined });
    }
  }, [route.params?.tab, navigation]);

  // Run one action, then refresh the lists. A failure shows the banner instead of wiping the screen.
  const act = async (key: string, fn: () => Promise<unknown>) => {
    setBusyKey(key);
    setBanner('');
    try {
      await fn();
      await load(true);
    } catch {
      setBanner("That didn't go through. Check your connection and try again.");
    }
    setBusyKey(null);
  };

  const openProfile = (p: Person) => navigation.navigate('ProfileDetail', { personId: p.id });

  const q = query.trim().toLowerCase();
  const filtered = q
    ? discover.filter((p) => `${p.name} ${p.location} ${p.profession}`.toLowerCase().includes(q))
    : discover;
  const featured = filtered.find((p) => p.id === selectedId) ?? filtered[0];

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

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
      >
        {!!banner && (
          <Pressable style={styles.banner} onPress={() => setBanner('')} accessibilityRole="button" accessibilityLabel="Dismiss message">
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.bannerText}>{banner}</Text>
          </Pressable>
        )}

        {loading ? (
          <View style={{ gap: spacing.lg }}><Skeleton height={90} /><Skeleton height={90} /><Skeleton height={90} /></View>
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load connections" description="Check your connection and try again." actionLabel="Try again" onAction={() => load()} />
        ) : tab === 'discover' ? (
          <>
            <View style={styles.search}>
              <Ionicons name="search-outline" size={18} color={colors.muted} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by name, city or profession"
                placeholderTextColor={colors.muted}
                style={styles.searchInput}
                returnKeyType="search"
                accessibilityLabel="Search people"
              />
              {!!query && (
                <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
                  <Ionicons name="close-circle" size={18} color={colors.muted} />
                </Pressable>
              )}
            </View>

            {!featured ? (
              <EmptyState
                icon="search-outline"
                title={q ? 'No matches' : 'No more recommendations'}
                description={q ? 'Try a different name, city or profession.' : 'Check back soon for new people who share your values.'}
              />
            ) : (
              <>
                <Text style={styles.section}>Recommended for you</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.lg }}>
                  {filtered.map((p) => {
                    const on = p.id === featured.id;
                    return (
                      <Pressable key={p.id} style={{ alignItems: 'center', width: 64 }} onPress={() => setSelectedId(p.id)} accessibilityRole="button" accessibilityLabel={`Show ${p.name}`}>
                        <View style={[styles.ring, on && styles.ringOn]}>
                          <Avatar size={52} verified={p.verified} />
                        </View>
                        <Text style={styles.small} numberOfLines={1}>{p.name}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                <Card>
                  <View style={styles.photo}>
                    <Ionicons name="person" size={64} color={colors.primary} />
                    <Pressable
                      style={styles.bookmark}
                      accessibilityRole="button"
                      accessibilityLabel={bookmarked.includes(featured.id) ? 'Remove bookmark' : 'Bookmark'}
                      onPress={async () => {
                        try {
                          const on = await toggleBookmark(featured.id);
                          setBookmarked((b) => (on ? [...b, featured.id] : b.filter((x) => x !== featured.id)));
                        } catch {
                          setBanner("Couldn't update your bookmark. Try again.");
                        }
                      }}
                    >
                      <Ionicons name={bookmarked.includes(featured.id) ? 'bookmark' : 'bookmark-outline'} size={22} color={colors.primary} />
                    </Pressable>
                  </View>
                  <Text style={styles.cardName}>{featured.name}, {featured.age}</Text>
                  <Text style={styles.muted}>{featured.location} · {featured.profession}</Text>
                  <View style={[styles.row, { marginTop: spacing.lg, gap: spacing.md }]}>
                    <Button variant="outline" title="View Profile" style={{ flex: 1 }} disabled={busyKey !== null} onPress={() => openProfile(featured)} />
                    <Button title="Express Interest" style={{ flex: 1 }} loading={busyKey === `${featured.id}:interest`} disabled={busyKey !== null} onPress={() => act(`${featured.id}:interest`, () => sendInterest(featured))} />
                  </View>
                  <Text
                    style={styles.skipLink}
                    onPress={() => busyKey === null && act(`${featured.id}:skip`, () => skipPerson(featured))}
                    accessibilityRole="button"
                  >
                    Not interested
                  </Text>
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
                <Pressable style={styles.row} onPress={() => openProfile(r)} accessibilityRole="button" accessibilityLabel={`View ${r.name}'s profile`}>
                  <Avatar size={52} />
                  <View style={{ flex: 1, marginLeft: spacing.md }}>
                    <Text style={styles.cardName}>{r.name}, {r.age}</Text>
                    <Text style={styles.muted}>{r.location}</Text>
                    <Text style={styles.muted}>{r.time}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
                <View style={[styles.row, { gap: spacing.md, marginTop: spacing.md }]}>
                  <Button small variant="outline" title="Decline" style={{ flex: 1 }} loading={busyKey === `${r.id}:decline`} disabled={busyKey !== null} onPress={() => act(`${r.id}:decline`, () => declineRequest(r.id))} />
                  <Button small title="Accept" style={{ flex: 1 }} loading={busyKey === `${r.id}:accept`} disabled={busyKey !== null} onPress={() => act(`${r.id}:accept`, () => acceptRequest(r.id))} />
                </View>
              </Card>
            ))}

            <Text style={[styles.section, { marginTop: spacing.xl }]}>Sent Requests</Text>
            {sent.length === 0 ? (
              <EmptyState icon="paper-plane-outline" title="No pending requests" description="Requests you send will show up here until they respond." />
            ) : sent.map((s) => (
              <Card key={s.id} style={styles.item}>
                <View style={styles.row}>
                  <Pressable style={[styles.row, { flex: 1 }]} onPress={() => openProfile(s)} accessibilityRole="button" accessibilityLabel={`View ${s.name}'s profile`}>
                    <Avatar size={52} />
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={styles.cardName}>{s.name}, {s.age}</Text>
                      <Text style={styles.muted}>{s.location}</Text>
                      <Text style={[styles.muted, { color: '#B45309' }]}>{s.status}</Text>
                    </View>
                  </Pressable>
                  <Button small variant="outline" title="Withdraw" loading={busyKey === `${s.id}:withdraw`} disabled={busyKey !== null} onPress={() => act(`${s.id}:withdraw`, () => withdrawRequest(s.id))} />
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
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  bannerText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.danger },
  search: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, minHeight: 44, marginBottom: spacing.lg },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text, paddingVertical: 8 },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginBottom: spacing.md },
  item: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardName: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 1 },
  small: { fontFamily: fonts.regular, fontSize: 11, color: colors.text, marginTop: 4 },
  ring: { padding: 2, borderRadius: 999, borderWidth: 2, borderColor: 'transparent' },
  ringOn: { borderColor: colors.primary },
  photo: { height: 220, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  bookmark: { position: 'absolute', top: 10, right: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  skipLink: { alignSelf: 'center', fontFamily: fonts.medium, fontSize: 13, color: colors.muted, paddingVertical: 12, marginTop: spacing.xs },
});