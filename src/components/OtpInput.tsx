import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radius } from '../theme';

// Display-only boxes. Digits come from the on-screen Keypad (like Figma).
export default function OtpInput({ value, length = 6 }: { value: string; length?: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Code entered: ${value.length} of ${length} digits`}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.box, i === value.length && styles.active]}>
          <Text style={styles.digit}>{value[i] ?? ''}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  box: { width: 46, height: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  active: { borderColor: colors.primary },
  digit: { fontFamily: fonts.semibold, fontSize: 20, color: colors.text },
});
