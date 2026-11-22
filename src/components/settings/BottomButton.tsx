import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { S } from './SettingsUI';
import { settingsFonts } from '../../theme';

export default function BottomButton({ title, onPress, disabled, color, offColor }: {
  title: string; onPress: () => void; disabled?: boolean;
  color?: string;     // button color (default blue)
  offColor?: string;  // color when disabled
}) {
  const bg = disabled ? offColor ?? '#CBD5E1' : color ?? S.primary;
  return (
    <Pressable
      style={[styles.btn, { backgroundColor: bg, shadowColor: color ?? S.primary }, disabled && styles.off]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    position: 'absolute', left: 0, right: 0, bottom: 24, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5,
  },
  off: { shadowOpacity: 0, elevation: 0 },
  text: { fontFamily: settingsFonts.bold, fontSize: 15, color: '#fff' },
});