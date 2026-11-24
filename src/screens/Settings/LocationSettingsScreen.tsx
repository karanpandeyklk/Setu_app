import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import AppInput from '../../components/AppInput';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

export default function LocationSettingsScreen({ navigation }: any) {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [saved, setSaved] = useState(false);

  const valid = city.trim().length >= 2 && state.trim().length >= 2;

  const save = () => {
    // TODO: save to your backend / user profile
    setSaved(true);
  };

  return (
    <SettingsScreenLayout
      title="Location"
      subtitle="Add or update your current location."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <Text style={styles.label}>City</Text>
        <AppInput value={city} onChangeText={(t) => { setCity(t); setSaved(false); }} placeholder="e.g. Varanasi" />

        <Text style={styles.label}>State</Text>
        <AppInput value={state} onChangeText={(t) => { setState(t); setSaved(false); }} placeholder="e.g. Uttar Pradesh" />

        <Text style={styles.hint}>Your exact location is never shown. You can control how distance appears in Discovery settings.</Text>

        <Pressable style={[styles.btn, !valid && styles.btnOff]} disabled={!valid} onPress={save}>
          <Text style={styles.btnText}>Save location</Text>
        </Pressable>

        {saved && <Text style={styles.success}>Location saved.</Text>}
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '600', color: S.text, marginTop: 18, marginBottom: 8 },
  hint: { fontSize: 12, color: S.muted, lineHeight: 18, marginTop: 16 },
  btn: { marginTop: 24, height: 52, borderRadius: 26, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center' },
  btnOff: { backgroundColor: '#CBD5E1' },
  btnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  success: { fontSize: 14, color: '#16A34A', fontWeight: '600', marginTop: 16 },
});