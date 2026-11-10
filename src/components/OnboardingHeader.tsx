import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../theme';

// Back arrow, "1 of 3" and a progress bar, like the Figma onboarding screens
export default function OnboardingHeader({ step, total, onBack }: { step: number; total: number; onBack?: () => void }) {
  return (
    <View>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        ) : <View style={styles.back} />}
        <Text style={styles.count}>{step} of {total}</Text>
        <View style={styles.back} />
      </View>
      <View style={styles.track} accessibilityLabel={`Step ${step} of ${total}`}>
        <View style={[styles.fill, { width: `${(step / total) * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 44, height: 44, justifyContent: 'center' },
  count: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  track: { height: 4, borderRadius: 2, backgroundColor: colors.border, marginTop: spacing.xs, overflow: 'hidden' },
  fill: { height: 4, backgroundColor: colors.primary },
});