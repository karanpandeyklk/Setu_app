import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, S } from './SettingsUI';

export type Option = { value: string; label: string; subtitle?: string };

export default function OptionList({
  options, selected, onSelect,
}: { options: Option[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <Card>
      {options.map((o, i) => {
        const on = o.value === selected;
        return (
          <Pressable
            key={o.value}
            onPress={() => onSelect(o.value)}
            style={[styles.row, i < options.length - 1 && styles.divider]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{o.label}</Text>
              {!!o.subtitle && <Text style={styles.sub}>{o.subtitle}</Text>}
            </View>
            <View style={[styles.radio, on && styles.radioOn]}>
              {on && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
          </Pressable>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: S.border },
  label: { fontSize: 14, fontWeight: '600', color: S.text },
  sub: { fontSize: 12, color: S.muted, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center',
  },
  radioOn: { backgroundColor: S.primary, borderColor: S.primary },
});