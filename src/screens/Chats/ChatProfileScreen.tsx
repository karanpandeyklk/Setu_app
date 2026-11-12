import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, Pressable, ScrollView, StyleSheet, Text, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ChatProfile, getChatProfile, setChatMuted } from '../../services/chatProfileApi';

// Put this file in src/screens/Chat/ChatProfileScreen.tsx
// Route params: { chatId: string }

const C = {
  primary: '#2563EB', primarySoft: '#EAF1FF', bg: '#FFFFFF', tile: '#F3F6FC', text: '#111827',
  sub: '#6B7280', border: '#E5EAF3', online: '#22C55E',
};

const soon = (what: string) => Alert.alert(what, 'This is not available yet.');

export default function ChatProfileScreen({ navigation, route }: any) {
  const { chatId } = route.params ?? {};
  const [p, setP] = useState<ChatProfile | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    getChatProfile(chatId).then(setP).catch(() => setFailed(true));
  }, [chatId]);

  useEffect(load, [load]);

  const toggleMute = async () => {
    if (!p) return;
    const next = !p.muted;
    setP({ ...p, muted: next }); // update straight away, undo if the server says no
    try {
      await setChatMuted(chatId, next);
    } catch {
      setP((x) => (x ? { ...x, muted: !next } : x));
      Alert.alert('Could not update', 'Please try again.');
    }
  };

  const openJourney = () => navigation.navigate('Journey'); // change to your Journey route name

  const Header = (
    <View style={styles.header}>
      <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.headerBtn}>
        <Ionicons name="arrow-back" size={24} color={C.text} />
      </Pressable>
      <Pressable hitSlop={10} style={styles.headerBtn} onPress={() => soon('More options')}>
        <Ionicons name="ellipsis-vertical" size={20} color={C.text} />
      </Pressable>
    </View>
  );

  if (!p) {
    return (
      <SafeAreaView style={styles.safe}>
        {Header}
        <View style={styles.center}>
          {failed ? (
            <>
              <Text style={styles.sub}>Could not load this profile.</Text>
              <Pressable onPress={load} style={styles.retry}><Text style={styles.retryText}>Try again</Text></Pressable>
            </>
          ) : (
            <ActivityIndicator color={C.primary} />
          )}
        </View>
      </SafeAreaView>
    );
  }

  const tiles = [
    { icon: 'call-outline', label: 'Audio\nCall', onPress: () => soon('Audio call') },
    { icon: 'videocam-outline', label: 'Video\nCall', onPress: () => soon('Video call') },
    { icon: 'search-outline', label: 'Search\nChat', onPress: () => soon('Search chat') },
    {
      icon: p.muted ? 'notifications-off-outline' : 'notifications-outline',
      label: p.muted ? 'Unmute\nNotifications' : 'Mute\nNotifications',
      onPress: toggleMute,
    },
  ] as const;

  return (
    <SafeAreaView style={styles.safe}>
      {Header}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Identity */}
        <View style={styles.identity}>
          <View style={{ width: 104, height: 104 }}>
            {p.photo ? (
              <Image source={{ uri: p.photo }} style={styles.photo} />
            ) : (
              <View style={[styles.photo, styles.photoFallback]}>
                <Text style={styles.photoInitial}>{p.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            {p.online && <View style={styles.onlineDot} />}
          </View>
          <Text style={styles.title}>{p.name}, {p.age}</Text>
          <Text style={styles.sub}>{p.role} • {p.city}</Text>
        </View>

        {/* Connected card */}
        <Pressable onPress={openJourney} style={styles.connected}>
          <MaterialCommunityIcons name="infinity" size={26} color={C.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.connectedTitle}>Connected</Text>
            <Text style={styles.sub}>Setu Journey • {p.journey.stage}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={C.primary} />
        </Pressable>

        {/* Quick actions */}
        <View style={styles.tiles}>
          {tiles.map((t) => (
            <Pressable key={t.icon} onPress={t.onPress} style={styles.tile}>
              <Ionicons name={t.icon} size={22} color={C.primary} />
              <Text style={styles.tileLabel}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Shared media */}
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Shared Media</Text>
          {p.media.total > 0 && (
            <Pressable onPress={() => soon('Shared media')} hitSlop={8}>
              <Text style={styles.link}>See all ({p.media.total}) →</Text>
            </Pressable>
          )}
        </View>
        {p.media.thumbs.length > 0 ? (
          <View style={styles.mediaRow}>
            {p.media.thumbs.slice(0, 4).map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.thumb} />
            ))}
          </View>
        ) : (
          <Text style={[styles.sub, { marginHorizontal: 20 }]}>Photos you share in this chat will appear here.</Text>
        )}

        {/* Rows */}
        <View style={{ marginTop: 8 }}>
          <Row icon="person-outline" label="View Profile" onPress={() => soon('Profile')} />
          <Row
            icon="compass-outline" label="Setu Journey" onPress={openJourney}
            value={p.journey.stage} valueStyle={{ color: C.primary, fontWeight: '700' }}
          />
          <Row
            icon="heart-outline" label="Shared Interests" onPress={() => soon('Shared interests')}
            value={p.interests.join(', ')}
          />
          <Row icon="settings-outline" label="Chat Settings" onPress={() => soon('Chat settings')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, value, valueStyle, onPress }: {
  icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value?: string; valueStyle?: object; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Ionicons name={icon} size={20} color={C.text} />
      <Text style={styles.rowLabel}>{label}</Text>
      {!!value && <Text numberOfLines={1} style={[styles.rowValue, valueStyle]}>{value}</Text>}
      <Ionicons name="chevron-forward" size={18} color={C.sub} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 6 },
  headerBtn: { padding: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  retry: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.primary },
  retryText: { color: C.primary, fontWeight: '600' },

  identity: { alignItems: 'center', marginTop: 4, marginBottom: 20 },
  photo: { width: 104, height: 104, borderRadius: 52 },
  photoFallback: { backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  photoInitial: { fontSize: 40, fontWeight: '700', color: C.primary },
  onlineDot: {
    position: 'absolute', right: 6, bottom: 6, width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.online, borderWidth: 3, borderColor: C.bg,
  },
  title: { fontSize: 22, fontWeight: '700', color: C.text, marginTop: 12 },
  sub: { fontSize: 13, color: C.sub, marginTop: 3 },

  connected: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, padding: 14, borderRadius: 14,
    backgroundColor: C.tile, borderWidth: 1, borderColor: C.border,
  },
  connectedTitle: { fontSize: 15, fontWeight: '700', color: C.text },

  tiles: { flexDirection: 'row', gap: 10, marginHorizontal: 20, marginTop: 14 },
  tile: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12,
    borderRadius: 14, backgroundColor: C.tile, borderWidth: 1, borderColor: C.border,
  },
  tileLabel: { fontSize: 11, fontWeight: '600', color: C.text, textAlign: 'center', lineHeight: 14 },

  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 20, marginTop: 22, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: C.text },
  link: { fontSize: 13, fontWeight: '600', color: C.primary },
  mediaRow: { flexDirection: 'row', gap: 8, marginHorizontal: 20 },
  thumb: { flex: 1, aspectRatio: 1, borderRadius: 10, backgroundColor: C.tile },

  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 16 },
  rowLabel: { flex: 1, fontSize: 15, color: C.text },
  rowValue: { maxWidth: '45%', fontSize: 12.5, color: C.sub },
});