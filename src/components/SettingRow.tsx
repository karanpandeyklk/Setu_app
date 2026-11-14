import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '../theme';

type RowProps = { icon: string; label: string; value?: string; onPress?: () => void; danger?: boolean; last?: boolean };

export function SettingRow({ icon, label, value, onPress, danger, last }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, !last && styles.border]}
      accessibilityRole="button"
      accessibilityLabel={value ? `${label}. ${value}` : label}
    >
      <View style={[styles.icon, danger && { backgroundColor: colors.dangerSoft }]}>
        <Ionicons name={icon as any} size={20} color={danger ? colors.danger : colors.primary} />
      </View>
      <Text style={[styles.label, danger && { color: colors.danger }]}>{label}</Text>
      {!!value && <Text style={styles.value}>{value}</Text>}
      {!danger && <Ionicons name="chevron-forward" size={18} color={colors.muted} />}
    </Pressable>
  );
}

type ToggleProps = { icon: string; label: string; desc?: string; value: boolean; onChange: (v: boolean) => void; last?: boolean };

export function ToggleRow({ icon, label, desc, value, onChange, last }: ToggleProps) {
  return (
    <View style={[styles.row, !last && styles.border]}>
      <View style={styles.icon}><Ionicons name={icon as any} size={20} color={colors.primary} /></View>
      <View style={{ flex: 1, marginRight: spacing.sm }}>
        <Text style={styles.label}>{label}</Text>
        {!!desc && <Text style={styles.desc}>{desc}</Text>}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" accessibilityLabel={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 60, paddingVertical: spacing.sm },
  border: { borderBottomWidth: 1, borderBottomColor: colors.border },
  icon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  label: { flex: 1, fontFamily: fonts.medium, fontSize: 14.5, color: colors.text },
  desc: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.muted, marginTop: 2 },
  value: { fontFamily: fonts.regular, fontSize: 12.5, color: colors.muted, marginRight: spacing.sm },
});