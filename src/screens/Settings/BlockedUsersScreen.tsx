import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

// TODO: demo data; replace with the real blocked list from the backend
const DEMO = [
  { id: 'b1', name: 'Arjun Sharma', since: '12 Aug 2026', bg: '#FFF6DD' },
  { id: 'b2', name: 'Rohit Kumar', since: '5 Jul 2026', bg: '#E6F3FF' },
  { id: 'b3', name: 'Vikram Rao', since: '21 Jun 2026', bg: '#E3F6EA' },
  { id: 'b4', name: 'Sameer Patel', since: '10 May 2026', bg: '#F1ECFF' },
];

export default function BlockedUsersScreen({ navigation }: any) {
  const [list, setList] = useState(DEMO);
  const [target, setTarget] = useState<string | null>(null);

  const confirm = () => {
    // TODO: call the unblock endpoint once it is confirmed
    setList((l) => l.filter((u) => u.id !== target));
    setTarget(null);
    navigation.navigate('UserUnblocked');
  };

  return (
    <SettingsScreenLayout title="Blocked Users" subtitle="Manage people you have blocked." bg="#F7F8FC" onBack={() => navigation.goBack()}>
      <View style={{ paddingTop: 16, gap: 10 }}>
        {list.length === 0 && <Text style={styles.empty}>You have not blocked anyone.</Text>}
        {list.map((u) => (
          <View key={u.id} style={styles.card}>
            <View style={[styles.avatar, { backgroundColor: u.bg }]}>
              <Ionicons name="person" size={18} color="#334155" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{u.name}</Text>
              <Text style={styles.sub}>Blocked on {u.since}</Text>
            </View>
            <Pressable style={styles.btn} onPress={() => setTarget(u.id)} accessibilityRole="button" accessibilityLabel={`Unblock ${u.name}`} hitSlop={8}>
              <Text style={styles.btnText}>Unblock</Text>
            </Pressable>
          </View>
        ))}
      </View>

      <Modal transparent visible={!!target} animationType="fade" onRequestClose={() => setTarget(null)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Pressable style={styles.close} onPress={() => setTarget(null)} accessibilityRole="button" accessibilityLabel="Close" hitSlop={10}>
              <Ionicons name="close" size={18} color="#64748B" />
            </Pressable>
            <View style={styles.modalAvatar}><Ionicons name="person" size={26} color={S.primary} /></View>
            <Text style={styles.modalTitle}>Unblock User?</Text>
            <Text style={styles.modalText}>Are you sure you want to unblock this user? They will be able to view your profile and send connection requests again.</Text>
            <ActionButton title="Unblock User" onPress={confirm} style={{ marginTop: 18, alignSelf: 'stretch' }} />
            <Pressable style={styles.cancel} onPress={() => setTarget(null)} accessibilityRole="button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  empty: { textAlign: 'center', color: '#64748B', marginTop: 40, fontSize: 13 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#EEF2F7' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 13.5, fontWeight: '700', color: S.text },
  sub: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  btn: { paddingHorizontal: 14, minHeight: 32, borderRadius: 8, backgroundColor: '#EAF1FF', alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 11.5, fontWeight: '700', color: S.primary },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 340, borderRadius: 20, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  close: { position: 'absolute', top: 14, right: 14 },
  modalAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E6EAFF', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  modalTitle: { fontSize: 16, fontWeight: '700', color: S.text, marginTop: 14 },
  modalText: { fontSize: 12, lineHeight: 18, color: '#64748B', textAlign: 'center', marginTop: 8 },
  cancel: { alignSelf: 'stretch', height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  cancelText: { fontSize: 14, fontWeight: '700', color: S.text },
});