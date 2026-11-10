import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import { ChatFilter, ChatItem, getChats } from '../../services/chatApi';
import { colors, fonts, radius, spacing } from '../../theme';

const FILTERS: { key: ChatFilter; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'new', label: 'New' }, { key: 'muted', label: 'Muted' },
];

export default function ChatsScreen({ navigation }: any) {
  const [filter, setFilter] = useState<ChatFilter>('all');
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [searching, setSearching] = useState(false);
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);   // first load failed
  const [banner, setBanner] = useState('');    // a later refresh failed
  const hasLoaded = useRef(false);
  const requestId = useRef(0);

  // wait 300ms after the last keystroke before searching
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const load = useCallback(async (pull = false) => {
    const id = ++requestId.current; // lets us ignore an older response that arrives late
    if (pull) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true);
    setError(false);
    setBanner('');
    try {
      const result = await getChats(filter, debounced);
      if (id !== requestId.current) return;
      setChats(result);
      hasLoaded.current = true;
    } catch {
      if (id !== requestId.current) return;
      if (hasLoaded.current) setBanner("Couldn't refresh. Showing your last saved chats.");
      else setError(true);
    }
    setLoading(false);
    setRefreshing(false);
  }, [filter, debounced]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Chat</Text>
          <Text style={styles.subtitle}>Meaningful conversations for a brighter tomorrow.</Text>
        </View>
        <Pressable
          style={styles.icon}
          onPress={() => { setSearching(!searching); setQuery(''); }}
          accessibilityRole="button"
          accessibilityLabel={searching ? 'Close search' : 'Search chats'}
        >
          <Ionicons name={searching ? 'close-outline' : 'search-outline'} size={22} color={colors.text} />
        </Pressable>
        <Pressable style={styles.icon} accessibilityRole="button" accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      {searching && (
        <TextInput style={styles.search} value={query} onChangeText={setQuery} placeholder="Search by name" placeholderTextColor={colors.muted} autoFocus accessibilityLabel="Search by name" />
      )}

      <View style={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable key={f.key} style={[styles.fchip, filter === f.key && styles.fchipOn]} onPress={() => setFilter(f.key)} accessibilityRole="button" accessibilityState={{ selected: filter === f.key }}>
            <Text style={[styles.ftext, filter === f.key && { color: '#fff' }]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      {!!banner && (
        <Pressable style={styles.banner} onPress={() => setBanner('')} accessibilityRole="button" accessibilityLabel="Dismiss message">
          <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
          <Text style={styles.bannerText}>{banner}</Text>
        </Pressable>
      )}

      {loading ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}><Skeleton height={64} /><Skeleton height={64} /><Skeleton height={64} /></View>
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Couldn't load your chats" description="Check your connection and try again." actionLabel="Try again" onAction={() => load()} />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(c) => c.id}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
          ListEmptyComponent={<EmptyState icon="chatbubbles-outline" title="No chats here" description={debounced ? 'No one matches that name.' : 'Start a conversation after you connect with someone.'} />}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => navigation.navigate('ChatThread', { chatId: item.id, name: item.name, online: item.online })}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}.${item.unread > 0 ? ` ${item.unread} unread.` : ''} ${item.last}`}
            >
              <Avatar size={52} online={item.online} />
              <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.last} numberOfLines={1}>{item.last}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.time}>{item.time}</Text>
                {item.muted ? <Ionicons name="volume-mute-outline" size={16} color={colors.muted} style={{ marginTop: 6 }} />
                  : item.unread > 0 ? <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View> : null}
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingLeft: spacing.lg, paddingRight: spacing.sm, minHeight: 64 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  icon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  search: { marginHorizontal: spacing.lg, minHeight: 44, backgroundColor: '#fff', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.lg, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  filters: { flexDirection: 'row', gap: spacing.sm, padding: spacing.lg },
  fchip: { minHeight: 44, minWidth: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.pill, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  fchipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  ftext: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.md, marginHorizontal: spacing.lg, marginBottom: spacing.sm },
  bannerText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.danger },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, minHeight: 72, borderBottomWidth: 1, borderBottomColor: colors.border },
  name: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  last: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  badge: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginTop: 6 },
  badgeText: { fontFamily: fonts.semibold, fontSize: 11, color: '#fff' },
});