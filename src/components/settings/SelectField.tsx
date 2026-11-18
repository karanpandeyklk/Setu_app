import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { S } from './SettingsUI';

export default function SelectField({ value, options, onChange, placeholder }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable style={styles.field} onPress={() => setOpen((o) => !o)}>
        <Text style={[styles.value, !value && { color: S.label }]}>{value || placeholder || 'Select'}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#94A3B8" />
      </Pressable>
      {open && (
        <View style={styles.list}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
            {options.map((o) => (
              <Pressable key={o} style={styles.item} onPress={() => { onChange(o); setOpen(false); }}>
                <Text style={[styles.itemText, o === value && { color: S.primary, fontWeight: '700' }]}>{o}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  minHeight: 48, borderRadius: 10, borderWidth: 1, borderColor: '#E3E8F0', backgroundColor: '#fff', paddingHorizontal: 14,
  },
  value: { fontSize: 14, color: S.text },
  list: { marginTop: 6, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff', overflow: 'hidden' },
  item: { paddingHorizontal: 14, paddingVertical: 12 },
  itemText: { fontSize: 14, color: S.text },
});