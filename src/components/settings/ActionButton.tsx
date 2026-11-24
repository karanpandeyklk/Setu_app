import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { S } from './SettingsUI';
import { settingsFonts } from '../../theme';

type Props = { title: string; onPress: () => void; disabled?: boolean; loading?: boolean; style?: ViewStyle };

// Rounded-rectangle blue button from the Figma (not a pill)
export default function ActionButton({ title, onPress, disabled, loading, style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [styles.btn, disabled && styles.off, pressed && { opacity: 0.9 }, style]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 52, borderRadius: 12, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: S.primary, shadowOpacity: 0.28, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4,
  },
  off: { opacity: 0.45, shadowOpacity: 0, elevation: 0 },
  text: { fontFamily: settingsFonts.bold, fontSize: 15, color: '#fff' },
});