import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { S } from './SettingsUI';
import { settingsFonts } from '../../theme';

export default function BottomButton({ title, onPress, disabled, color, offColor, inline }: {
  title: string; onPress: () => void; disabled?: boolean;
  color?: string;     // button color (default blue)
  offColor?: string;  // color when disabled
  inline?: boolean;   // true: sits under the content instead of the bottom edge
}) {
  const bg = disabled ? offColor ?? '#CBD5E1' : color ?? S.primary;
  return (
    <Pressable
      style={[styles.btn, inline ? styles.inline : styles.fixed, { backgroundColor: bg, shadowColor: color ?? S.primary }, disabled && styles.off]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  fixed: { position: 'absolute', left: 0, right: 0, bottom: 24 },
  inline: { marginTop: 20 },
  off: { shadowOpacity: 0, elevation: 0 },
  text: { fontFamily: settingsFonts.bold, fontSize: 15, color: '#fff' },
});