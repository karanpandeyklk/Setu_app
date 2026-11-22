import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppInput from '../../components/AppInput';
import SelectField from '../../components/settings/SelectField';
import BottomButton from '../../components/settings/BottomButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { useAuth } from '../../context/AuthContext';

const GENDERS = ['Female', 'Male', 'Prefer not to say'];
const MARITAL = ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'];
const LOCATIONS = ['Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Lucknow', 'Varanasi', 'Jaipur', 'Ahmedabad', 'Other'];
const HEIGHTS: string[] = (() => {
  const out: string[] = [];
  for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
      if (ft === 7 && inch > 0) break;
      out.push(`${ft} ft ${inch} in (${Math.round((ft * 12 + inch) * 2.54)} cm)`);
    }
  }
  return out;
})();

function dobError(v: string): string {
  if (v.length < 10) return '';
  const [d, m, y] = v.split('/').map(Number);
  const date = new Date(y, m - 1, d);
  if (y < 1900 || date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return 'Enter a valid date';
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now < new Date(now.getFullYear(), m - 1, d)) age -= 1;
  return age < 18 ? 'You must be 18 or older' : '';
}

export default function EditPersonalInfoScreen({ navigation }: any) {
  const auth = useAuth() as any;
  const user = auth.user;

  const [name, setName] = useState<string>(user?.name ?? '');
  const [dob, setDob] = useState<string>(user?.dob ?? '');
  const [gender, setGender] = useState<string>(user?.gender ?? '');
  const [marital, setMarital] = useState<string>(user?.maritalStatus ?? '');
  const [height, setHeight] = useState<string>(user?.height ?? '');
  const [location, setLocation] = useState<string>(user?.location ?? '');
  const [busy, setBusy] = useState(false);

  const onDob = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 8);
    setDob(d.length > 4 ? `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}` : d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  };

  const err = dobError(dob);
  const valid = name.trim().length >= 2 && dob.length === 10 && !err;

  const save = async () => {
    setBusy(true);
    try {
      // TODO: send dob, gender, marital status, height and location to your backend.
      // updateName is the only profile field AuthContext can store right now.
      await auth.updateName?.(name.trim());
      navigation.goBack();
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsScreenLayout title="Edit Personal Information" subtitle="Keep your profile information up to date." bg="#FFFFFF" onBack={() => navigation.goBack()}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <Text style={styles.label}>Full Name</Text>
        <AppInput value={name} onChangeText={setName} placeholder="Enter your full name" maxLength={40} />

        <Text style={styles.label}>Date of Birth</Text>
        <View>
          <AppInput value={dob} onChangeText={onDob} placeholder="DD/MM/YYYY" keyboardType="number-pad" maxLength={10} style={{ paddingRight: 44 }} />
          <View style={styles.icon} pointerEvents="none"><Ionicons name="calendar-outline" size={18} color="#94A3B8" /></View>
        </View>
        {!!err && <Text style={styles.error}>{err}</Text>}

        <Text style={styles.label}>Gender</Text>
        <View style={styles.radios}>
          {GENDERS.map((g) => (
            <Pressable key={g} style={styles.radioRow} onPress={() => setGender(g)}>
              <View style={[styles.radio, gender === g && styles.radioOn]}>{gender === g && <View style={styles.dot} />}</View>
              <Text style={styles.radioText}>{g}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Marital Status</Text>
        <SelectField value={marital} options={MARITAL} onChange={setMarital} placeholder="Select" />

        <Text style={styles.label}>Height <Text style={styles.optional}>(optional)</Text></Text>
        <SelectField value={height} options={HEIGHTS} onChange={setHeight} placeholder="Select" />

        <Text style={styles.label}>Location</Text>
        <SelectField value={location} options={LOCATIONS} onChange={setLocation} placeholder="Select" />
      </ScrollView>

      <BottomButton title={busy ? 'Saving…' : 'Save changes'} disabled={!valid || busy} onPress={save} />
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '700', color: S.text, marginTop: 16, marginBottom: 6 },
  optional: { fontWeight: '400', color: S.label },
  error: { fontSize: 12, color: S.danger, marginTop: 6 },
  icon: { position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center' },
  radios: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginTop: 2 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: '#94A3B8', alignItems: 'center', justifyContent: 'center' },
  radioOn: { borderColor: S.primary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: S.primary },
  radioText: { fontSize: 13, color: S.text },
});