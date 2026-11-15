import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import OnboardingHeader from '../../components/OnboardingHeader';
import OptionChip from '../../components/OptionChip';
import { APPROVED_LANGUAGES, MAX_LANGUAGES, MIN_LANGUAGES } from '../../constants/languages';
import { colors, fonts, spacing } from '../../theme';

export default function OnboardingLanguagesScreen({ navigation, route }: any) {
  const [selected, setSelected] = useState<string[]>(['English']);
  const [limitHit, setLimitHit] = useState(false);

  const toggle = (language: string) => {
    if (selected.includes(language)) {
      setSelected((s) => s.filter((x) => x !== language));
      setLimitHit(false);
      return;
    }
    if (selected.length >= MAX_LANGUAGES) { setLimitHit(true); return; } // maximum of 5
    setSelected((s) => [...s, language]);
    setLimitHit(false);
  };

  const valid = selected.length >= MIN_LANGUAGES && selected.length <= MAX_LANGUAGES;

  const next = () => {
    // sent in the approved order, as an array of strings under the key "languages"
    const languages = APPROVED_LANGUAGES.filter((l) => selected.includes(l));
    navigation.navigate('OnboardingPhoto', { ...route.params, languages });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <OnboardingHeader step={2} total={3} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
        <Text style={styles.title}>Languages you speak</Text>
        <Text style={styles.sub}>Choose {MIN_LANGUAGES} to {MAX_LANGUAGES} languages.</Text>

        <View style={styles.wrap}>
          {APPROVED_LANGUAGES.map((l) => (
            <OptionChip key={l} label={l} selected={selected.includes(l)} onPress={() => toggle(l)} />
          ))}
        </View>

        <Text style={[styles.count, limitHit && { color: '#B45309' }]} accessibilityLiveRegion="polite">
          {limitHit
            ? `You can pick up to ${MAX_LANGUAGES} languages. Remove one to choose another.`
            : selected.length === 0
              ? `Select at least ${MIN_LANGUAGES} language.`
              : `${selected.length} of ${MAX_LANGUAGES} selected`}
        </Text>
      </ScrollView>
      <Button title="Continue" arrow disabled={!valid} onPress={next} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text, marginTop: spacing.lg },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  count: { fontFamily: fonts.medium, fontSize: 12.5, color: colors.muted, marginTop: spacing.lg },
});