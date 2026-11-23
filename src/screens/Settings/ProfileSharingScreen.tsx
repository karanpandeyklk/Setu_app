import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import ActionButton from '../../components/settings/ActionButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const FIELDS: { key: string; label: string; on: boolean }[] = [
  { key: 'name', label: 'Name', on: true },
  { key: 'age', label: 'Age', on: true },
  { key: 'location', label: 'Location', on: true },
  { key: 'education', label: 'Education', on: true },
  { key: 'profession', label: 'Profession', on: true },
  { key: 'family', label: 'Family details', on: false },
  { key: 'contact', label: 'Contact information', on: false },
  { key: 'photos', label: 'Photos', on: true },
  { key: 'religion', label: 'Religion & community', on: true },
];

export default function ProfileSharingScreen({ navigation }: any) {
  const [vals, setVals] = useState<Record<string, boolean>>(Object.fromEntries(FIELDS.map((f) => [f.key, f.on])));
  const [busy, setBusy] = useState(false);

  const save = async () => {
    setBusy(true);
    // TODO: save to the backend once the privacy settings endpoint is confirmed
    await new Promise((r) => setTimeout(r, 400));
    setBusy(false);
    navigation.goBack();
  };

  return (
    <SettingsScreenLayout title="Profile Information Sharing" subtitle="Choose what information is visible to others." bg="#F7F8FC" onBack={() => navigation.goBack()}>
      <View style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}>
          <View style={styles.card}>
            {FIELDS.map((f, i) => (
              <View key={f.key} style={[styles.row, i < FIELDS.length - 1 && styles.divider]}>
                <Text style={styles.label}>{f.label}</Text>
                <Switch
                  value={vals[f.key]}
                  onValueChange={(v) => setVals((s) => ({ ...s, [f.key]: v }))}
                  trackColor={{ false: '#D5DBE5', true: S.primary }}
                  thumbColor="#fff"
                  accessibilityLabel={f.label}
                />
              </View>
            ))}
          </View>
        </ScrollView>
        <ActionButton title="Save Changes" loading={busy} onPress={save} style={{ marginBottom: 24 }} />
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#EEF2F7' },
  label: { fontSize: 12.5, fontWeight: '700', color: S.text },
});