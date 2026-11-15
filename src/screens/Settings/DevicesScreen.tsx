import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

type Device = { id: string; name: string; info: string; current?: boolean };

// Sample data. Replace with your backend list.
const INITIAL: Device[] = [
  { id: '1', name: 'This device', info: 'Active now', current: true },
  { id: '2', name: 'Chrome on Windows', info: 'Varanasi · 2 days ago' },
  { id: '3', name: 'Samsung Galaxy', info: 'Lucknow · 1 week ago' },
];

export default function DevicesScreen({ navigation }: any) {
  const [list, setList] = useState(INITIAL);
  const others = list.filter((d) => !d.current);

  return (
    <SettingsScreenLayout
      title="Manage Devices"
      subtitle="Devices where you're logged in to Sambandh Setu."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <Card>
          {list.map((d, i) => (
            <View key={d.id} style={[styles.row, i < list.length - 1 && styles.divider]}>
              <View style={styles.icon}>
                <Ionicons name="phone-portrait" size={18} color={S.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{d.name}</Text>
                <Text style={[styles.info, d.current && { color: '#16A34A' }]}>{d.info}</Text>
              </View>
              {!d.current && (
                <Pressable onPress={() => setList((l) => l.filter((x) => x.id !== d.id))} style={styles.out}>
                  <Text style={styles.outText}>Log out</Text>
                </Pressable>
              )}
            </View>
          ))}
        </Card>

        {others.length > 0 && (
          <Pressable style={styles.all} onPress={() => setList((l) => l.filter((x) => x.current))}>
            <Text style={styles.allText}>Log out of all other devices</Text>
          </Pressable>
        )}
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: S.border },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: S.primarySoft, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: S.text },
  info: { fontSize: 12, color: S.muted, marginTop: 2 },
  out: { borderWidth: 1, borderColor: S.danger, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 5 },
  outText: { fontSize: 12, fontWeight: '700', color: S.danger },
  all: { marginTop: 20, alignItems: 'center', paddingVertical: 14, borderRadius: 16, backgroundColor: S.dangerSoft },
  allText: { fontSize: 14, fontWeight: '700', color: S.danger },
});