import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const formatPhone = (p: string) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

function Row({ icon, title, sub, onPress, divider }: { icon: any; title: string; sub: string; onPress: () => void; divider?: boolean }) {
  return (
    <Pressable
      style={[styles.row, divider && styles.divider]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={16} color={S.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{sub}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
    </Pressable>
  );
}

export default function PhoneNumberScreen({ navigation }: any) {
  const [phone, setPhone] = useState<string | null>(null);

  // demo copy saved by phoneOtp.ts; replace with the real profile phone once the backend returns it
  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('setu_phone').then(setPhone).catch(() => {});
    }, [])
  );

  return (
    <SettingsScreenLayout
      title="Phone Number"
      subtitle="Manage your phone number for account security and alerts."
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <View style={{ paddingTop: 16 }}>
        <Text style={styles.label}>Current Phone Number</Text>
        <View style={[styles.card, styles.current]}>
          <View style={styles.iconCircle}>
            <Ionicons name="call" size={16} color={S.primary} />
          </View>
          <Text style={styles.number}>{phone ? formatPhone(phone) : 'Phone number not added'}</Text>
          {!!phone && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Verified</Text>
            </View>
          )}
        </View>

        <View style={[styles.card, { marginTop: 16 }]}>
          <Row
            icon="call"
            title="Change Phone Number"
            sub="Update your existing number"
            onPress={() => navigation.navigate('ChangePhone')}
            divider
          />
          <Row
            icon="phone-portrait-outline"
            title="Add Another Number"
            sub="Add a secondary number (optional)"
            onPress={() => navigation.navigate('ChangePhone', { mode: 'add' })}
          />
        </View>
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '600', color: S.text, marginBottom: 10 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  current: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#EEF2F7' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EAF1FF', alignItems: 'center', justifyContent: 'center' },
  number: { flex: 1, fontSize: 14, fontWeight: '600', color: S.text },
  badge: { backgroundColor: '#E3F6EA', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#16A34A' },
  rowTitle: { fontSize: 13.5, fontWeight: '700', color: S.text },
  rowSub: { fontSize: 11, color: '#64748B', marginTop: 2 },
});