import React, { useCallback, useRef, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import Skeleton from '../../components/Skeleton';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/api';
import { NotificationItem } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

export default function NotificationsScreen({ navigation }: any) {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [banner, setBanner] = useState('');
  const hasLoaded = useRef(false);

  const load = useCallback(async (pull = false) => {
    if (pull) setRefreshing(true);
    else if (!hasLoaded.current) setLoading(true);
    setError(false);
    setBanner('');
    try {
      setItems(await getNotifications());
      hasLoaded.current = true;
    } catch {
      if (hasLoaded.current) setBanner("Couldn't refresh. Showing your last saved notifications.");
      else setError(true);
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const unreadCount = items.filter((n) => n.unread).length;

  const markAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch {
      setBanner("Couldn't update your notifications. Try again.");
    }
  };

  const open = async (n: NotificationItem) => {
    // show it as read straight away; if the server call fails the next refresh corrects it
    setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)));
    markNotificationRead(n.id).catch(() => {});
    if (n.target === 'requests') navigation.navigate('Main', { screen: 'Connections', params: { tab: 'requests' } });
    else if (n.target === 'active') navigation.navigate('Main', { screen: 'Connections', params: { tab: 'active' } });
    else if (n.target === 'guide') navigation.navigate('Guide');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} />

      {!!banner && (
        <Pressable style={styles.banner} onPress={() => setBanner('')} accessibilityRole="button" accessibilityLabel="Dismiss message">
          <Ionicons name="alert-circle-outline" size={18} color={colors.danger} />
          <Text style={styles.bannerText}>{banner}</Text>
        </Pressable>
      )}

      {loading ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}><Skeleton height={72} /><Skeleton height={72} /><Skeleton height={72} /></View>
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Couldn't load notifications" description="Check your connection and try again." actionLabel="Try again" onAction={() => load()} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => n.id}
          contentContainerStyle={{ paddingBottom: spacing.xxl, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
          ListHeaderComponent={
            items.length > 0 ? (
              <View style={styles.headRow}>
                <Text style={styles.headText}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</Text>
                {unreadCount > 0 && (
                  <Text style={styles.markAll} onPress={markAll} accessibilityRole="button">Mark all as read</Text>
                )}
              </View>
            ) : null
          }
          ListEmptyComponent={<EmptyState icon="notifications-off-outline" title="No notifications yet" description="Requests, updates and tips will show up here." />}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.row, item.unread && styles.rowUnread]}
              onPress={() => open(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.unread ? 'Unread. ' : ''}${item.title}. ${item.body}. ${item.time}`}
            >
              <View style={styles.iconWrap}><Ionicons name={item.icon as any} size={20} color={colors.primary} /></View>
              <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.time}>{item.time}</Text>
                {item.unread && <View style={styles.dot} />}
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
  banner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.md, marginHorizontal: spacing.lg, marginTop: spacing.sm },
  bannerText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.danger },
  headRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headText: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  markAll: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary, paddingVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, minHeight: 72, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowUnread: { backgroundColor: colors.primarySoft },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginTop: 2 },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 8 },
});