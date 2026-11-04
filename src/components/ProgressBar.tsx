import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

// Reflection flow: <ProgressBar current={2} total={10} /> shows bar + "2/10"
export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  return (
    <View style={styles.row} accessibilityLabel={`Question ${current} of ${total}`}>
      <View style={styles.track}><View style={[styles.fill, { width: `${pct}%` }]} /></View>
      <Text style={styles.label}>{current}/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.primary },
  label: { marginLeft: 10, fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
});
