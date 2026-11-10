import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';

// Selectable pill for gender and languages. Selected = filled blue with a tick.
export default function OptionChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.on]}
    >
      {selected && <Ionicons name="checkmark" size={16} color="#fff" style={{ marginRight: 4 }} />}
      <Text style={[styles.text, selected && { color: '#fff' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: 18, borderRadius: radius.pill, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border },
  on: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontFamily: fonts.medium, fontSize: 14, color: colors.text },
});