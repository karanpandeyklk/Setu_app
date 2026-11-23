import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PickerModal from './PickerModal';
import { colors, fonts, radius, shadow } from '../theme';

type Props = { label: string; value: string; options: string[]; onChange: (v: string) => void };

export default function SelectField({ label, value, options, onChange }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={[styles.box, shadow.card]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}. Tap to change`}
      >
        <Text style={styles.value} numberOfLines={1}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.primary} />
      </Pressable>
      <PickerModal
        visible={open}
        title={label}
        options={options}
        selected={[value]}
        onClose={() => setOpen(false)}
        onDone={(s) => { onChange(s[0]); setOpen(false); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, marginTop: 22, marginBottom: 8 },
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, minHeight: 48 },
  value: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
});