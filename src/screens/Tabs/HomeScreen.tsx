import React, { useCallback, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';
import { getUnreadCount } from '../../services/notificationsApi';
import { getMyProfile, saveMyProfile } from '../../services/myProfile';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import MiniStepper from '../../components/Stepper';
import { getHome, HomeData } from '../../services/api';
import { STAGE_LABELS, StageKey } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// Photos may be stored under different field names depending on where the data came from.
// This tries the common ones so a renamed field doesn't leave the avatar blank.
function pickPhoto(obj: any): string | undefined {
  if (!obj) return undefined;
  const v = obj.avatar ?? obj.photo ?? obj.photoUrl ?? obj.photoURI ?? obj.profilePhoto ?? obj.profilePic ?? obj.image ?? obj.picture;
  return typeof v === 'string' && v.trim() ? v : undefined;
}

// Short message under the journey stepper. Placeholder wording: confirm the final copy with design.
const STAGE_BLURBS: Record<StageKey, { title: string; desc: string }> = {
  connect: { title: "You're just getting started.", desc: 'Say hello and take your time before going further.' },
  understand: { title: "You're currently getting to know each other.", desc: 'Take your time to have meaningful conversations and understand each other better.' },
  reflect: { title: "It's time to reflect.", desc: 'Think about what you have learned and how compatible you feel.' },
  discuss: { title: "You're discussing what matters.", desc: 'Talk openly about values, family and plans for the future.' },
  agree: { title: "You're finding common ground.", desc: 'Confirm that you both want to move forward together.' },
  family: { title: "You're involving family.", desc: 'Families come together to get to know each other.' },
  reflect_again: { title: 'One more moment to reflect.', desc: 'Take a calm, honest look at everything before deciding.' },
  decision: { title: "You're at the decision stage.", desc: 'Make your decision with care, and take the time you need.' },
};

export default function HomeScreen({ navigation }: any) {
  const { user, updateAvatar } = useAuth();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unread, setUnread] = useState(0);
  const [error, setError] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(); // photo saved by Edit Profile
  const reqId = useRef(0); // ignore responses from older requests

  const load = useCallback(async (pull = false) => {
    const id = ++reqId.current;
    pull ? setRefreshing(true) : setLoading(true);
    setError(false);
    try {
      const d = await getHome();
      if (id !== reqId.current) return;
      setData(d);
    } catch {
      if (id !== reqId.current) return;
      setError(true);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  // reload every time the tab is shown, so Home always matches Connections and Journey
  useFocusEffect(useCallback(() => {
    getUnreadCount().then(setUnread);
    getMyProfile().then((p) => setProfilePhoto(p?.photoUri)).catch(() => {}); // picks up a photo changed in Edit Profile
    load();
  }, [load]));

  const firstName = (user?.name || data?.userName || '').split(' ')[0];
  const cc = data?.currentConnection;
  const active = data?.stages.find((s) => s.status === 'active');
  const blurb = active ? STAGE_BLURBS[active.key as StageKey] : null;
  const labelledStages = data?.stages.map((s) => ({ ...s, label: STAGE_LABELS[s.key as StageKey] })) ?? [];

  const myPhoto = pickPhoto(user) ?? profilePhoto ?? pickPhoto(data);
  const ccPhoto = pickPhoto(cc);

  // Tap your own avatar (top right) to choose or change your photo.
  const changePhoto = async () => {
    try {
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
      if (!r.canceled) {
        const saved = await updateAvatar(r.assets[0].uri);
        setProfilePhoto(saved);
        // keep the Profile page's saved photo the same as the one shown here
        try {
          const p = await getMyProfile();
          if (p) await saveMyProfile({ ...p, photoUri: saved });
        } catch {}
      }
    } catch (e) {
      console.log('CHANGE PHOTO FAILED', e);
    }
  };

  // TEMP DEBUG: shows which fields really exist. Remove once photos show up.
  if (__DEV__) {
    console.log('HOME USER KEYS', Object.keys(user ?? {}), 'photo:', myPhoto ?? '(none)');
    console.log('HOME CONNECTION KEYS', Object.keys(cc ?? {}), 'photo:', ccPhoto ?? '(none)');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greet}>
              {greeting()}{firstName ? ', ' : ''}<Text style={styles.name}>{firstName}</Text>
            </Text>
            <Text style={styles.tagline}>Wishing you meaningful conversations and new possibilities ahead.</Text>
          </View>
          <Pressable style={styles.bell} onPress={() => navigation.navigate('Notifications')} accessibilityRole="button" accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            {unread > 0 && <View style={styles.badge} />}
          </Pressable>
          <Pressable onPress={changePhoto} accessibilityRole="button" accessibilityLabel="Change profile photo" hitSlop={6}>
            <Avatar size={40} uri={myPhoto} label={user?.name || firstName || 'Me'} />
          </Pressable>
        </View>

        {loading && !data ? (
          <View style={{ gap: spacing.lg }}>
            <Skeleton height={150} /><Skeleton height={190} /><Skeleton height={110} />
          </View>
        ) : error && !data ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load your dashboard" description="Check your connection and try again." actionLabel="Try again" onAction={() => load()} />
        ) : data && (
          <>
            {/* A failed refresh keeps the last data and shows a small banner */}
            {error && (
              <Pressable style={styles.banner} onPress={() => load()} accessibilityRole="button" accessibilityLabel="Couldn't refresh. Tap to try again.">
                <Ionicons name="cloud-offline-outline" size={16} color={colors.danger} />
                <Text style={styles.bannerText}>Couldn't refresh. Tap to try again.</Text>
              </Pressable>
            )}

            {/* Current Connection */}
            <View style={styles.sectionRow}>
              <Text style={styles.section}>Current Connection</Text>
              <Text style={styles.viewAll} onPress={() => navigation.navigate('Connections', { tab: 'active' })} accessibilityRole="link">View all</Text>
            </View>
            {cc ? (
              <Card onPress={() => navigation.navigate('ProfileDetail', { personId: cc.id })} accessibilityLabel={`View ${cc.name}'s profile`}>
                <View style={styles.row}>
                  <Avatar size={84} shape="rounded" uri={ccPhoto} online={cc.online} label={cc.name} />
                  <View style={{ flex: 1, marginLeft: spacing.lg }}>
                    <View style={styles.tag}><Text style={styles.tagText}>{STAGE_LABELS[cc.stage]}</Text></View>
                    <View style={styles.nameRow}>
                      <Text style={styles.cardName}>{cc.name}, {cc.age}</Text>
                      {cc.verified && <Ionicons name="checkmark-circle" size={16} color={colors.primary} style={{ marginLeft: 4 }} />}
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="location-outline" size={13} color={colors.muted} />
                      <Text style={styles.info}>{cc.location}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Ionicons name="briefcase-outline" size={13} color={colors.muted} />
                      <Text style={styles.info}>{cc.profession}</Text>
                    </View>
                    <Button title="Continue" arrow small style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }} onPress={() => navigation.navigate('Journey')} />
                  </View>
                </View>
              </Card>
            ) : (
              <Card><EmptyState icon="people-outline" title="No active connection yet" description="Accept a request or send interest to begin your journey." actionLabel="Find people" onAction={() => navigation.navigate('Connections')} /></Card>
            )}

            {/* Needs Your Attention */}
            <View style={[styles.sectionRow, styles.gap]}>
              <Text style={styles.section}>Needs Your Attention</Text>
              {data.attention.length > 0 && (
                <Text style={styles.viewAll} onPress={() => navigation.navigate('Connections', { tab: 'requests' })} accessibilityRole="link">View all</Text>
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

            {/* Your Journey */}
            <View style={[styles.sectionRow, styles.gap]}>
              <Text style={styles.section}>Your Journey</Text>
              <Text style={styles.viewAll} onPress={() => navigation.navigate('Journey')} accessibilityRole="link">View details →</Text>
            </View>
            <Card>
              <MiniStepper stages={labelledStages} />
              <View style={styles.callout}>
                {blurb ? (
                  <>
                    <Text style={styles.calloutTitle}>{blurb.title}</Text>
                    <Text style={styles.muted}>{blurb.desc}</Text>
                  </>
                ) : (
                  <Text style={styles.muted}>Journey not started</Text>
                )}
              </View>
            </Card>

            {/* Setu Guide promo */}
            <Card style={[styles.guide, styles.gap]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>Need help with your next step?</Text>
                <Text style={[styles.muted, { marginVertical: spacing.sm }]}>Get personalised guidance on conversations, family involvement and next steps.</Text>
                <Button title="Ask Setu Guide" arrow small variant="outline" onPress={() => navigation.navigate('Journey')} style={{ alignSelf: 'flex-start' }} />
              </View>
              <View style={styles.art}><Ionicons name="sparkles" size={36} color={colors.primary} /></View>
            </Card>

            {/* Discover */}
            <Card style={[styles.discover, styles.gap]}>
              <View style={{ flex: 1 }}>
                <View style={styles.infoRow}>
                  <Ionicons name="compass-outline" size={18} color={colors.primary} />
                  <Text style={[styles.cardName, { marginLeft: spacing.sm }]}>Discover</Text>
                </View>
                <Text style={[styles.muted, { marginVertical: spacing.sm }]}>Meet people who share your values, goals and future hopes.</Text>
                <Text style={styles.viewAll} onPress={() => navigation.navigate('Connections')} accessibilityRole="link">Find meaningful connections →</Text>
              </View>
              <View style={styles.art}><Ionicons name="people" size={34} color={colors.primary} /></View>
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
  greet: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  name: { fontFamily: fonts.display, fontSize: 22, color: colors.primary },
  tagline: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 4 },
  bell: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm },
  badge: { position: 'absolute', top: 10, right: 11, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.danger, borderWidth: 1.5, borderColor: colors.bg },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.lg },
  bannerText: { fontFamily: fonts.medium, fontSize: 13, color: colors.danger },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  viewAll: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, paddingVertical: 8 },
  gap: { marginTop: spacing.xl },
  attn: { flexDirection: 'row', alignItems: 'center', minHeight: 64 },
  attnBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  attnIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  attnTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  row: { flexDirection: 'row', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  info: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  tag: { alignSelf: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  tagText: { fontFamily: fonts.medium, fontSize: 11, color: colors.primary },
  cardName: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text },
  callout: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  calloutTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, marginBottom: 2 },
  guide: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft },
  discover: { flexDirection: 'row', alignItems: 'center' },
  art: { width: 72, height: 72, borderRadius: radius.lg, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginLeft: spacing.md },
});