import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

type Blocked = { id: string; name: string; note: string };

// Sample data. Replace with your backend list.
const INITIAL: Blocked[] = [
  { id: '1', name: 'Rohan M', note: 'Blocked on 02 Nov' },
  { id: '2', name: 'Kunal S', note: 'Blocked on 28 Oct' },
];

export default function BlockedUsersScreen({ navigation }: any) {
  const [list, setList] = useState<Blocked[]>(INITIAL);

  const unblock = (u: Blocked) =>
    Alert.alert('Unblock user', `Unblock ${u.name}? They will be able to find and message you again.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Unblock', onPress: () => setList((l) => l.filter((x) => x.id !== u.id)) },
    ]);

  return (
    <SettingsScreenLayout
      title="Blocked Users"
      subtitle="People you have blocked can't see your profile or message you."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        {list.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="checkmark-circle" size={36} color={S.primary} />
            <Text style={styles.emptyTitle}>No blocked users</Text>
            <Text style={styles.emptyText}>People you block will show up here.</Text>
          </View>
        ) : (
          <Card>
            {list.map((u, i) => (
              <View key={u.id} style={[styles.row, i < list.length - 1 && styles.divider]}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{u.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{u.name}</Text>
                  <Text style={styles.note}>{u.note}</Text>
                </View>
                <Pressable style={styles.btn} onPress={() => unblock(u)}>
                  <Text style={styles.btnText}>Unblock</Text>
                </Pressable>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: S.border },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: S.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontWeight: '700', color: S.primary },
  name: { fontSize: 14, fontWeight: '600', color: S.text },
  note: { fontSize: 12, color: S.muted, marginTop: 2 },
  btn: { borderWidth: 1, borderColor: S.primary, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6 },
  btnText: { fontSize: 12, fontWeight: '700', color: S.primary },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: S.text, marginTop: 6 },
  emptyText: { fontSize: 12, color: S.muted },
});