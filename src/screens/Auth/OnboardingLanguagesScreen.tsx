import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import OnboardingHeader from '../../components/OnboardingHeader';
import OptionChip from '../../components/OptionChip';
import { colors, fonts, spacing } from '../../theme';

const LANGUAGES = ['Telugu', 'English', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Other'];

export default function OnboardingLanguagesScreen({ navigation, route }: any) {
  const [selected, setSelected] = useState<string[]>(['English']);
  const toggle = (l: string) => setSelected((s) => (s.includes(l) ? s.filter((x) => x !== l) : [...s, l]));

  return (
    <SafeAreaView style={styles.safe}>
      <OnboardingHeader step={2} total={3} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
        <Text style={styles.title}>Languages you speak</Text>
        <Text style={styles.sub}>Select that apply.</Text>
        <View style={styles.wrap}>
          {LANGUAGES.map((l) => <OptionChip key={l} label={l} selected={selected.includes(l)} onPress={() => toggle(l)} />)}
        </View>
      </ScrollView>
      <Button title="Continue" arrow disabled={selected.length === 0} onPress={() => navigation.navigate('OnboardingPhoto', { ...route.params, languages: selected })} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text, marginTop: spacing.lg },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
});