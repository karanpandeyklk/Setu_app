import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';

type Props = { onDigit: (d: string) => void; onDelete: () => void };
const rows = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', 'del']];

export default function Keypad({ onDigit, onDelete }: Props) {
  return (
    <View style={styles.wrap}>
      {rows.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((k, c) => {
            if (k === '') return <View key={c} style={styles.keySpace} />;
            const isDel = k === 'del';
            return (
              <Pressable
                key={c}
                style={({ pressed }) => [styles.key, pressed && { backgroundColor: colors.border }]}
                onPress={() => (isDel ? onDelete() : onDigit(k))}
                accessibilityRole="button"
                accessibilityLabel={isDel ? 'Delete' : k}
              >
                {isDel ? <Ionicons name="backspace-outline" size={22} color={colors.text} /> : <Text style={styles.keyText}>{k}</Text>}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  key: { flex: 1, height: 50, borderRadius: radius.md, backgroundColor: '#EEF1F5', alignItems: 'center', justifyContent: 'center' },
  keySpace: { flex: 1, height: 50 },
  keyText: { fontFamily: fonts.medium, fontSize: 22, color: colors.text },
});
