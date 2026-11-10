import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import OnboardingHeader from '../../components/OnboardingHeader';
import OptionChip from '../../components/OptionChip';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

const GENDERS = ['Woman', 'Man', 'Prefer to self-describe', 'Prefer not to say'];

// "12/05/1998" -> error text, or '' when valid. Must be a real date and 18 or older.
function dobError(v: string): string {
  if (v.length < 10) return '';
  const [d, m, y] = v.split('/').map(Number);
  const date = new Date(y, m - 1, d);
  if (y < 1900 || date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return 'Enter a valid date';
  const now = new Date();
  let age = now.getFullYear() - y;
  if (now < new Date(now.getFullYear(), m - 1, d)) age -= 1;
  return age < 18 ? 'You must be 18 or older to join' : '';
}

export default function OnboardingBasicsScreen({ navigation, route }: any) {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  // auto-insert the slashes while typing: 12051998 -> 12/05/1998
  const onDob = (t: string) => {
    const d = t.replace(/\D/g, '').slice(0, 8);
    setDob(d.length > 4 ? `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}` : d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  };

  const err = dobError(dob);
  const valid = name.trim().length >= 2 && dob.length === 10 && !err && !!gender;

  return (
    <SafeAreaView style={styles.safe}>
      <OnboardingHeader step={1} total={3} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Let's start with{'\n'}the basics</Text>
          <Text style={styles.sub}>These details help create your Sambandh profile.</Text>

          <Text style={styles.label}>Full name</Text>
          <TextInput style={[styles.input, shadow.card]} value={name} onChangeText={setName} placeholder="Enter your name" placeholderTextColor={colors.muted} maxLength={40} accessibilityLabel="Full name" />

          <Text style={styles.label}>Date of birth</Text>
          <TextInput style={[styles.input, shadow.card]} value={dob} onChangeText={onDob} placeholder="DD / MM / YYYY" placeholderTextColor={colors.muted} keyboardType="number-pad" maxLength={10} accessibilityLabel="Date of birth" />
          {!!err && <Text style={styles.error}>{err}</Text>}

          <Text style={styles.label}>Gender</Text>
          <View style={styles.wrap}>
            {GENDERS.map((g) => <OptionChip key={g} label={g} selected={gender === g} onPress={() => setGender(g)} />)}
          </View>
        </ScrollView>

        <Button title="Continue" arrow disabled={!valid} onPress={() => navigation.navigate('OnboardingLanguages', { ...route.params, basics: { name: name.trim(), dob, gender } })} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 34, color: colors.text, marginTop: spacing.lg },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.sm },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, marginTop: spacing.xl, marginBottom: spacing.sm },
  input: { backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: spacing.lg, minHeight: 52, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  error: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, marginTop: spacing.xs },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});