import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../theme';

type Tone = 'blue' | 'green' | 'orange' | 'grey' | 'red';
const tones: Record<Tone, { bg: string; fg: string }> = {
  blue: { bg: colors.primarySoft, fg: colors.primary },
  green: { bg: colors.successSoft, fg: colors.success },
  orange: { bg: colors.warningSoft, fg: '#B45309' },
  grey: { bg: '#F1F5F9', fg: colors.muted },
  red: { bg: colors.dangerSoft, fg: colors.danger },
};

// Used for: Connected, Active, Pending, Locked, stage chips, category chips
export default function Chip({ label, tone = 'blue', dot }: { label: string; tone?: Tone; dot?: boolean }) {
  const t = tones[tone];
  return (
    <View style={[styles.chip, { backgroundColor: t.bg }]}>
      {dot && <View style={[styles.dot, { backgroundColor: t.fg }]} />}
      <Text style={[styles.text, { color: t.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  text: { fontFamily: fonts.medium, fontSize: 12 },
});
