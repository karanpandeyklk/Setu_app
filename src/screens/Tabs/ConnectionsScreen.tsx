import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import {
  acceptRequest, declineRequest, getActive, getBookmarks, getClosed, getUnreadCount, getDiscover, getPaused, getReceived, getSent,
  pauseConnection, resumeConnection, sendInterest, toggleBookmark, withdrawRequest,
} from '../../services/api';
import { Connection, PausedConnection, Person, ReceivedRequest, SentRequest, STAGES, StageKey, STAGE_LABELS } from '../../services/mockData';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

type Tab = 'discover' | 'requests' | 'active';
const TABS: { key: Tab; label: string }[] = [
  { key: 'discover', label: 'Discover' }, { key: 'requests', label: 'Requests' }, { key: 'active', label: 'Active' },
];

const SUBTITLE: Record<Tab, string> = {
  discover: 'Find meaningful connections that share your values, goals and future hopes.',
  requests: 'Manage your interest requests.',
  active: 'Continue your journey with your connections.',
};

// colour of the progress dots for each stage (as in the design: blue, orange, red...)
const STAGE_COLOR: Record<StageKey, string> = {
  connect: colors.primary, understand: colors.primary,
  reflect: '#F97316', discuss: '#F97316',
  agree: '#E5484D', family: '#E5484D',
  reflect_again: colors.success, decision: colors.success,
};

function StageDots({ stage }: { stage: StageKey }) {
  const filled = STAGES.indexOf(stage) + 1;
  return (
    <View style={styles.dots} accessibilityLabel={`Stage ${filled} of ${STAGES.length}`}>
      {STAGES.map((s, i) => (
        <View key={s} style={[styles.dot, i < filled ? { backgroundColor: STAGE_COLOR[stage], borderColor: STAGE_COLOR[stage] } : null]} />
      ))}
    </View>
  );
}

export default function ConnectionsScreen({ navigation, route }: any) {
  const { width } = useWindowDimensions();
  const cardWidth = width - spacing.lg * 2; // one profile card per page in the carousel
  const carousel = useRef<ScrollView>(null);
  const [tab, setTab] = useState<Tab>('discover');
  const [discover, setDiscover] = useState<Person[]>([]);
  const [received, setReceived] = useState<ReceivedRequest[]>([]);
  const [sent, setSent] = useState<SentRequest[]>([]);
  const [active, setActive] = useState<Connection[]>([]);
  const [paused, setPaused] = useState<PausedConnection[]>([]);
  const [closed, setClosed] = useState<Person[]>([]);
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [unread, setUnread] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [banner, setBanner] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const hasLoaded = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef({ received: 0, sent: 0 });
  const [box, setBox] = useState<'received' | 'sent'>('received');

  const load = useCallback(async (pull = false) => {
    if (pull) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true);
    setError(false);
    setBanner('');
    try {
      const [d, r, s, a, pa, cl, b, u] = await Promise.all([
        getDiscover(), getReceived(), getSent(), getActive(), getPaused(), getClosed(), getBookmarks(), getUnreadCount(),
      ]);
      setDiscover(d); setReceived(r); setSent(s); setActive(a); setPaused(pa); setClosed(cl); setBookmarked(b); setUnread(u);
      hasLoaded.current = true;
    } catch {
      if (hasLoaded.current) setBanner("Couldn't refresh. Showing your last saved lists.");
      else setError(true);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  useEffect(() => {
    if (route.params?.tab) {
      setTab(route.params.tab);
      navigation.setParams({ tab: undefined });
    }
  }, [route.params?.tab, navigation]);

  const act = async (key: string, fn: () => Promise<unknown>) => {
    if (busyKey !== null) return; // one action at a time, without greying out the other rows
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
  const soon = (what: string) => () => Alert.alert(what, 'This screen is a stretch goal and is not built yet.');

  // the ⋮ menu on an active connection
  const activeMenu = (c: Connection) =>
    Alert.alert(`${c.name}, ${c.age}`, undefined, [
      { text: 'View profile', onPress: () => openProfile(c) },
      { text: 'Pause connection', onPress: () => act(`${c.id}:pause`, () => pauseConnection(c.id)) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  const pausedMenu = (c: PausedConnection) =>
    Alert.alert(`${c.name}, ${c.age}`, undefined, [
      { text: 'View profile', onPress: () => openProfile(c) },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const requestMenu = (p: Person) =>
    Alert.alert(`${p.name}, ${p.age}`, undefined, [
      { text: 'View profile', onPress: () => openProfile(p) },
      { text: 'Cancel', style: 'cancel' },
    ]);

  const q = query.trim().toLowerCase();
  const filtered = q ? discover.filter((p) => `${p.name} ${p.location} ${p.profession}`.toLowerCase().includes(q)) : discover;
  const recommended = filtered.slice(0, 5);
  const newProfiles = filtered.slice(5);
  const index = Math.max(recommended.findIndex((p) => p.id === selectedId), 0);
  const recIds = recommended.map((p) => p.id).join(',');

  // when the list changes (someone removed, or a search), go back to the first card
  useEffect(() => {
    setSelectedId(null);
    carousel.current?.scrollTo({ x: 0, animated: false });
  }, [recIds]);

  const goTo = (i: number) => {
    const p = recommended[i];
    if (!p) return;
    setSelectedId(p.id);
    carousel.current?.scrollTo({ x: i * cardWidth, animated: true });
  };

  const nothingActive = active.length === 0 && paused.length === 0 && closed.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
      >
        {/* header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Connections</Text>
            <Text style={styles.subtitle}>{SUBTITLE[tab]}</Text>
          </View>
          <Pressable style={styles.bell} onPress={() => navigation.navigate('Notifications')} accessibilityRole="button" accessibilityLabel={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {unread > 0 && <View style={styles.badge} />}
          </Pressable>
        </View>

        {/* tab pills */}
        <View style={styles.pills} accessibilityRole="tablist">
          {TABS.map((t) => {
            const on = tab === t.key;
            return (
              <Pressable key={t.key} style={[styles.pill, on && styles.pillOn]} onPress={() => setTab(t.key)} accessibilityRole="tab" accessibilityState={{ selected: on }}>
                <Text style={[styles.pillText, on && { color: '#fff' }]}>{t.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {!!banner && (
          <Pressable style={styles.banner} onPress={() => setBanner('')} accessibilityRole="button" accessibilityLabel="Dismiss message">
            <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
            <Text style={styles.bannerText}>{banner}</Text>
          </Pressable>
        )}

        {loading ? (
          <View style={{ gap: spacing.lg }}><Skeleton height={130} /><Skeleton height={130} /><Skeleton height={90} /></View>
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load connections" description="Check your connection and try again." actionLabel="Try again" onAction={() => load()} />
        ) : tab === 'discover' ? (
          <>
            {/* search + filter */}
            <View style={styles.searchRow}>
              <View style={styles.search}>
                <Ionicons name="search-outline" size={18} color={colors.muted} />
                <TextInput value={query} onChangeText={setQuery} placeholder="Search by name, location, profession..." placeholderTextColor={colors.muted} style={styles.searchInput} returnKeyType="search" accessibilityLabel="Search people" />
                {!!query && (
                  <Pressable onPress={() => setQuery('')} hitSlop={10} accessibilityLabel="Clear search">
                    <Ionicons name="close-circle" size={18} color={colors.muted} />
                  </Pressable>
                )}
              </View>
              <Pressable style={styles.filterBtn} onPress={soon('Filters')} accessibilityRole="button" accessibilityLabel="Filters">
                <Ionicons name="options-outline" size={20} color={colors.text} />
              </Pressable>
            </View>

            {recommended.length === 0 ? (
              <EmptyState icon="search-outline" title={q ? 'No matches' : 'No more recommendations'} description={q ? 'Try a different name, city or profession.' : 'Check back soon for new people who share your values.'} />
            ) : (
              <>
                {/* Recommended for you */}
                <View style={styles.rowBetween}>
                  <Text style={styles.sectionMid}>Recommended for you</Text>
                  <Text style={styles.viewAll} onPress={soon('Recommendations')} accessibilityRole="link">See all</Text>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.lg }}>
                  {recommended.map((p, i) => (
                    <Pressable key={p.id} style={styles.avItem} onPress={() => goTo(i)} accessibilityRole="button" accessibilityLabel={`Show ${p.name}`}>
                      <View style={[styles.ring, i === index && styles.ringOn]}><Avatar size={52} online={p.online} verified={p.verified} /></View>
                      <Text style={styles.avName} numberOfLines={1}>{p.name}</Text>
                      <Text style={styles.avAge}>{p.age}</Text>
                    </Pressable>
                  ))}
                </ScrollView>

                {/* swipeable profile cards */}
                <ScrollView
                  ref={carousel}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(e) => {
                    const i = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
                    const p = recommended[i];
                    if (p) setSelectedId(p.id);
                  }}
                >
                  {recommended.map((p) => (
                    <View key={p.id} style={{ width: cardWidth }}>
                      <View style={[styles.hero, shadow.card]}>
                        <View style={styles.heroPhoto}>
                          {p.photo ? (
                            <Image source={{ uri: p.photo }} style={StyleSheet.absoluteFill} accessibilityLabel={`${p.name}'s photo`} />
                          ) : (
                            <Ionicons name="person" size={72} color={colors.primary} />
                          )}
                          <Pressable
                            style={styles.heroBookmark}
                            accessibilityRole="button"
                            accessibilityLabel={bookmarked.includes(p.id) ? 'Remove bookmark' : 'Bookmark'}
                            onPress={async () => {
                              try {
                                const on = await toggleBookmark(p.id);
                                setBookmarked((b) => (on ? [...b, p.id] : b.filter((x) => x !== p.id)));
                              } catch { setBanner("Couldn't update your bookmark. Try again."); }
                            }}
                          >
                            <Ionicons name={bookmarked.includes(p.id) ? 'bookmark' : 'bookmark-outline'} size={18} color={colors.primary} />
                          </Pressable>
                        </View>

                        <View style={styles.heroBody}>
                          <View style={styles.row}>
                            <Text style={styles.heroName}>{p.name}, {p.age}</Text>
                            {p.verified && <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: 6 }} />}
                          </View>
                          <Text style={styles.heroSub}>{p.profession} · {p.location.split(',')[0]}</Text>
                          {!!p.education && (
                            <View style={styles.heroLine}><Ionicons name="school-outline" size={15} color={colors.muted} /><Text style={styles.heroLineText}>{p.education}</Text></View>
                          )}
                          <View style={styles.heroLine}><Ionicons name="location-outline" size={15} color={colors.muted} /><Text style={styles.heroLineText}>{p.location}</Text></View>
                          {!!p.bio && (
                            <View style={styles.quoteBox}>
                              <Text style={styles.quoteMark}>“</Text>
                              <Text style={styles.quoteText}>{p.bio}</Text>
                            </View>
                          )}
                          <View style={styles.ctaRow}>
                            <Pressable style={[styles.cta, styles.ctaOutline]} onPress={() => openProfile(p)} accessibilityRole="button">
                              <Text style={styles.ctaOutlineText}>View Profile</Text>
                            </Pressable>
                            <Pressable
                              style={[styles.cta, styles.ctaFill]}
                              disabled={!!busyKey?.startsWith(`${p.id}:`)}
                              onPress={() => act(`${p.id}:interest`, () => sendInterest(p))}
                              accessibilityRole="button"
                              accessibilityLabel={`Express interest in ${p.name}`}
                            >
                              {busyKey === `${p.id}:interest` ? (
                                <ActivityIndicator color="#fff" />
                              ) : (
                                <>
                                  <Ionicons name="heart" size={15} color="#fff" />
                                  <Text style={styles.ctaFillText}>Express Interest</Text>
                                </>
                              )}
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>

                {/* page dots */}
                <View style={styles.pageDots} accessibilityLabel={`Profile ${index + 1} of ${recommended.length}`}>
                  {recommended.map((p, i) => <View key={p.id} style={[styles.pageDot, i === index && styles.pageDotOn]} />)}
                </View>

                {/* New Profiles */}
                {newProfiles.length > 0 && (
                  <>
                    <View style={[styles.rowBetween, { marginTop: spacing.lg }]}>
                      <Text style={styles.sectionMid}>New Profiles</Text>
                      <Text style={styles.viewAll} onPress={soon('New profiles')} accessibilityRole="link">See all</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
                      {newProfiles.map((p) => (
                        <Pressable key={p.id} style={styles.avItem} onPress={() => openProfile(p)} accessibilityRole="button" accessibilityLabel={`View ${p.name}'s profile`}>
                          <Avatar size={52} online={p.online} verified={p.verified} />
                          <Text style={styles.avName} numberOfLines={1}>{p.name}</Text>
                          <Text style={styles.avAge}>{p.age}</Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </>
                )}
              </>
            )}
          </>
        ) : tab === 'requests' ? (
          <>
            {/* Received / Sent switch: jumps to the section */}
            <View style={styles.inner} accessibilityRole="tablist">
              {(['received', 'sent'] as const).map((k) => {
                const on = box === k;
                const n = k === 'received' ? received.length : sent.length;
                return (
                  <Pressable
                    key={k}
                    style={[styles.innerSeg, on && styles.innerSegOn]}
                    onPress={() => { setBox(k); scrollRef.current?.scrollTo({ y: Math.max(sectionY.current[k] - spacing.sm, 0), animated: true }); }}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: on }}
                  >
                    <Text style={[styles.innerText, on && { color: colors.primary, fontFamily: fonts.semibold }]}>{k === 'received' ? 'Received' : 'Sent'} ({n})</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Received Requests */}
            <View onLayout={(e) => { sectionY.current.received = e.nativeEvent.layout.y; }}>
              <Text style={styles.sectionBig}>Received Requests</Text>
              <Text style={styles.sectionSub}>People who are interested in you.</Text>
              {received.length === 0 ? (
                <EmptyState icon="mail-open-outline" title="No requests yet" description="When someone shows interest in you, it will appear here." />
              ) : received.map((r, i) => (
                <View key={r.id} style={[styles.reqRow, i > 0 && styles.divider]}>
                  <View style={styles.reqTop}>
                    <Pressable style={[styles.row, { flex: 1 }]} onPress={() => openProfile(r)} accessibilityRole="button" accessibilityLabel={`View ${r.name}'s profile`}>
                      <Avatar size={48} online={r.online} />
                      <View style={{ flex: 1, marginLeft: spacing.md }}>
                        <Text style={styles.cardNameSm}>{r.name}, {r.age}</Text>
                        <Text style={styles.muted} numberOfLines={1}>{r.location}</Text>
                        <View style={styles.metaRow}><Ionicons name="heart-outline" size={12} color={colors.muted} /><Text style={styles.tiny}>  Interested in you</Text></View>
                      </View>
                    </Pressable>
                    <View style={styles.row}>
                      <Text style={styles.tiny}>{r.time}</Text>
                      <Pressable style={styles.more} onPress={() => requestMenu(r)} accessibilityRole="button" accessibilityLabel={`More options for ${r.name}`}>
                        <Ionicons name="ellipsis-vertical" size={18} color={colors.muted} />
                      </Pressable>
                    </View>
                  </View>
                  <View style={[styles.row, { gap: spacing.md, marginTop: spacing.sm }]}>
                    <Button small variant="outline" title="Decline" style={{ flex: 1 }} loading={busyKey === `${r.id}:decline`} disabled={!!busyKey?.startsWith(`${r.id}:`)} onPress={() => act(`${r.id}:decline`, () => declineRequest(r.id))} />
                    <Button small title="Accept" style={{ flex: 1 }} loading={busyKey === `${r.id}:accept`} disabled={!!busyKey?.startsWith(`${r.id}:`)} onPress={() => act(`${r.id}:accept`, () => acceptRequest(r.id))} />
                  </View>
                </View>
              ))}
            </View>

            {/* Sent Requests */}
            <View style={{ marginTop: spacing.xl }} onLayout={(e) => { sectionY.current.sent = e.nativeEvent.layout.y; }}>
              <Text style={styles.sectionBig}>Sent Requests</Text>
              <Text style={styles.sectionSub}>People you have shown interest in.</Text>
              {sent.length === 0 ? (
                <EmptyState icon="paper-plane-outline" title="No pending requests" description="Requests you send will show up here until they respond." />
              ) : sent.map((s, i) => (
                <View key={s.id} style={[styles.reqRow, i > 0 && styles.divider]}>
                  <View style={styles.reqTop}>
                    <Pressable style={[styles.row, { flex: 1 }]} onPress={() => openProfile(s)} accessibilityRole="button" accessibilityLabel={`View ${s.name}'s profile`}>
                      <Avatar size={48} online={s.online} />
                      <View style={{ flex: 1, marginLeft: spacing.md }}>
                        <Text style={styles.cardNameSm}>{s.name}, {s.age}</Text>
                        <Text style={styles.muted} numberOfLines={1}>{s.location}</Text>
                        <View style={styles.metaRow}><Ionicons name="time-outline" size={12} color={colors.muted} /><Text style={styles.tiny}>  {s.status}</Text></View>
                      </View>
                    </Pressable>
                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={styles.row}>
                        {!!s.time && <Text style={styles.tiny}>{s.time}</Text>}
                        <Pressable style={styles.more} onPress={() => requestMenu(s)} accessibilityRole="button" accessibilityLabel={`More options for ${s.name}`}>
                          <Ionicons name="ellipsis-vertical" size={18} color={colors.muted} />
                        </Pressable>
                      </View>
                      <Button small variant="outline" title="Withdraw" loading={busyKey === `${s.id}:withdraw`} disabled={!!busyKey?.startsWith(`${s.id}:`)} onPress={() => act(`${s.id}:withdraw`, () => withdrawRequest(s.id))} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : nothingActive ? (
          <EmptyState icon="people-outline" title="No active connections" description="Accept a request or send interest to start your Setu journey." actionLabel="Find people" onAction={() => setTab('discover')} />
        ) : (
          <>
            {/* Active Connections */}
            <Text style={styles.sectionBig}>Active Connections</Text>
            <Text style={styles.sectionSub}>People you are connected with and exploring.</Text>
            {active.length === 0 ? (
              <Text style={[styles.muted, { marginBottom: spacing.lg }]}>No active connections right now.</Text>
            ) : active.map((c) => (
              <Card key={c.id} style={styles.item}>
                <View style={styles.cardTop}>
                  <Pressable style={[styles.row, { flex: 1 }]} onPress={() => openProfile(c)} accessibilityRole="button" accessibilityLabel={`View ${c.name}'s profile`}>
                    <Avatar size={56} online={c.online} verified={c.verified} />
                    <View style={{ flex: 1, marginLeft: spacing.md }}>
                      <Text style={styles.cardName}>{c.name}, {c.age}</Text>
                      <Text style={styles.muted}>{c.location}</Text>
                      <Text style={styles.stage}>Setu: {STAGE_LABELS[c.stage]}</Text>
                      <StageDots stage={c.stage} />
                    </View>
                  </Pressable>
                  <Pressable style={styles.more} onPress={() => activeMenu(c)} accessibilityRole="button" accessibilityLabel={`More options for ${c.name}`}>
                    <Ionicons name="ellipsis-vertical" size={18} color={colors.muted} />
                  </Pressable>
                </View>
                <Button variant="outline" title="Continue Journey" arrow loading={busyKey === `${c.id}:pause`} onPress={() => navigation.navigate('Journey')} style={{ marginTop: spacing.md }} />
              </Card>
            ))}

            {/* Paused Connections */}
            {paused.length > 0 && (
              <>
                <Text style={[styles.sectionBig, { marginTop: spacing.lg }]}>Paused Connections</Text>
                <Text style={styles.sectionSub}>People you have paused for now.</Text>
                <Card style={{ paddingVertical: 0 }}>
                  {paused.map((c, i) => (
                    <View key={c.id} style={[styles.pausedRow, i > 0 && styles.divider]}>
                      <Avatar size={44} online={c.online} />
                      <View style={{ flex: 1, marginLeft: spacing.md }}>
                        <Text style={styles.cardNameSm}>{c.name}, {c.age}</Text>
                        <Text style={styles.muted}>{c.location}</Text>
                        <Text style={styles.tiny}>Paused on {c.pausedOn}</Text>
                      </View>
                      <Button small variant="outline" title="Resume" loading={busyKey === `${c.id}:resume`} disabled={!!busyKey?.startsWith(`${c.id}:`)} onPress={() => act(`${c.id}:resume`, () => resumeConnection(c.id))} />
                      <Pressable style={styles.more} onPress={() => pausedMenu(c)} accessibilityRole="button" accessibilityLabel={`More options for ${c.name}`}>
                        <Ionicons name="ellipsis-vertical" size={18} color={colors.muted} />
                      </Pressable>
                    </View>
                  ))}
                </Card>
              </>
            )}

            {/* Completed / Closed */}
            {closed.length > 0 && (
              <>
                <View style={[styles.row, { marginTop: spacing.xl, justifyContent: 'space-between' }]}>
                  <Text style={styles.sectionBig}>Completed / Closed</Text>
                  <Text style={styles.viewAll} onPress={soon('Closed connections')} accessibilityRole="link">View ({closed.length}) →</Text>
                </View>
                <Text style={styles.sectionSub}>Past connections that you have closed.</Text>
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
  scroll: { padding: spacing.lg, paddingBottom: 120 }, // room for the floating tab bar
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  bell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, borderWidth: 1.5, borderColor: colors.bg },

  pills: { flexDirection: 'row', gap: spacing.sm, marginVertical: spacing.lg },
  pill: { flex: 1, minHeight: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  pillOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },

  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  bannerText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.danger },

  sectionBig: { fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  sectionSub: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 2, marginBottom: spacing.md },
  viewAll: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary, paddingVertical: 8 },

  item: { marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start' },
  more: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  stage: { fontFamily: fonts.bold, fontSize: 13, color: colors.text, marginTop: 4 },
  dots: { flexDirection: 'row', gap: 5, marginTop: 6 },
  dot: { width: 9, height: 9, borderRadius: 5, borderWidth: 1, borderColor: colors.disabled, backgroundColor: 'transparent' },

  inner: { flexDirection: 'row', backgroundColor: '#E9EEF6', borderRadius: radius.pill, padding: 4, marginBottom: spacing.lg },
  innerSeg: { flex: 1, minHeight: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  innerSegOn: { backgroundColor: '#fff' },
  innerText: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  reqRow: { paddingVertical: spacing.md },
  reqTop: { flexDirection: 'row', alignItems: 'flex-start' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  filterBtn: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionMid: { fontFamily: fonts.bold, fontSize: 15, color: colors.text },
  avItem: { alignItems: 'center', width: 64 },
  avName: { fontFamily: fonts.semibold, fontSize: 12, color: colors.text, marginTop: 4 },
  avAge: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  hero: { backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  heroPhoto: { aspectRatio: 1.26, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  heroBookmark: { position: 'absolute', top: 10, right: 10, width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  heroBody: { padding: spacing.lg },
  heroName: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  heroSub: { fontFamily: fonts.regular, fontSize: 13.5, color: colors.text, marginTop: 2 },
  heroLine: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  heroLineText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  quoteBox: { flexDirection: 'row', backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  quoteMark: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 26, color: colors.muted, marginRight: spacing.sm },
  quoteText: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.text },
  ctaRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  cta: { flex: 1, minHeight: 44, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  ctaOutline: { borderWidth: 1, borderColor: colors.primary, backgroundColor: '#fff' },
  ctaOutlineText: { fontFamily: fonts.semibold, fontSize: 13.5, color: colors.primary },
  ctaFill: { backgroundColor: colors.primary },
  ctaFillText: { fontFamily: fonts.semibold, fontSize: 13.5, color: '#fff' },
  pageDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
  pageDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.disabled },
  pageDotOn: { backgroundColor: colors.primary },
  pausedRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  cardName: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  cardNameSm: { fontFamily: fonts.semibold, fontSize: 14.5, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 1 },
  tiny: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted, marginTop: 2 },

  search: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: spacing.lg, minHeight: 44, flex: 1 },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text, paddingVertical: 8 },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginBottom: spacing.md },
  small: { fontFamily: fonts.regular, fontSize: 11, color: colors.text, marginTop: 4 },
  ring: { padding: 2, borderRadius: 999, borderWidth: 2, borderColor: 'transparent' },
  ringOn: { borderColor: colors.primary },
  photo: { height: 220, borderRadius: radius.md, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  bookmark: { position: 'absolute', top: 10, right: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  skipLink: { alignSelf: 'center', fontFamily: fonts.medium, fontSize: 13, color: colors.muted, paddingVertical: 12, marginTop: spacing.xs },
});