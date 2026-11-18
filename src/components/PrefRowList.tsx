import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PickerModal from './PickerModal';
import { colors, fonts, shadow } from '../theme';

export type RowDef = {
  key: string; title: string; icon: string; tint: string; bg: string; options: string[];
  multi?: boolean; exclusive?: string; maxSelect?: number;
};
type Value = string | string[];

const show = (v: Value) =>
  Array.isArray(v) ? (v.length <= 2 ? v.join(', ') : `${v.slice(0, 2).join(', ')} +${v.length - 2}`) : v;

type Props = {
  rows: RowDef[]; values: Record<string, Value>; onChange: (key: string, value: Value) => void;
  valueBelow?: boolean; // Family page: value under the title. Lifestyle page: value on the right.
};

export default function PrefRowList({ rows, values, onChange, valueBelow }: Props) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const row = rows.find((r) => r.key === openKey);
  const cur = row ? values[row.key] : undefined;

  return (
    <>
      {rows.map((r) => (
        <Pressable
          key={r.key}
          style={[styles.row, shadow.card]}
          onPress={() => setOpenKey(r.key)}
          accessibilityRole="button"
          accessibilityLabel={`${r.title}: ${show(values[r.key])}. Tap to change`}
        >
          <View style={[styles.icon, { backgroundColor: r.bg }]}>
            <Ionicons name={r.icon as any} size={20} color={r.tint} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.title}>{r.title}</Text>
            {valueBelow && <Text style={styles.below} numberOfLines={1}>{show(values[r.key])}</Text>}
          </View>
          {!valueBelow && <Text style={styles.value} numberOfLines={1}>{show(values[r.key])}</Text>}
          <Ionicons name="chevron-forward" size={16} color={colors.muted} style={{ marginLeft: 6 }} />
        </Pressable>
      ))}
      {row && (
        <PickerModal
          visible
          title={row.title}
          options={row.options}
          selected={Array.isArray(cur) ? cur : [String(cur ?? '')]}
          multi={row.multi}
          exclusive={row.exclusive}
          maxSelect={row.maxSelect}
          onClose={() => setOpenKey(null)}
          onDone={(s) => { onChange(row.key, row.multi ? s : s[0]); setOpenKey(null); }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#EEF2F8', paddingHorizontal: 12, paddingVertical: 10, minHeight: 60, marginBottom: 12 },
  icon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  below: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  value: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, maxWidth: '45%' },
});