import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { S } from './SettingsUI';
import { settingsFonts } from '../../theme';

export default function OtpBoxes({ value, onChange, length = 6 }: {
  value: string; onChange: (v: string) => void; length?: number;
}) {
  const ref = useRef<React.ComponentRef<typeof TextInput>>(null);
  const activeIndex = Math.min(value.length, length - 1);

  return (
    <Pressable style={styles.row} onPress={() => ref.current?.focus()}>
      {Array.from({ length }).map((_, i) => (
        <View key={i} style={[styles.box, i === activeIndex && styles.boxActive]}>
          <Text style={styles.digit}>{value[i] ?? ''}</Text>
        </View>
      ))}
      {/* One invisible input receives all the typing */}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        autoFocus
        caretHidden
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 28 },
  box: {
    width: 46, height: 52, borderRadius: 10, borderWidth: 1, borderColor: '#E3E8F0',
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  boxActive: { borderColor: S.primary, borderWidth: 1.5 },
  digit: { fontFamily: settingsFonts.bold, fontSize: 20, color: S.text },
  hidden: { position: 'absolute', width: '100%', height: '100%', opacity: 0 },
});