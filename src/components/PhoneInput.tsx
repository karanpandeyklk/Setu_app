import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius } from '../theme';
import { focusedBox, noOutline } from './focus';

type Props = { value: string; onChangeText: (v: string) => void };

export default function PhoneInput({ value, onChangeText }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    // the border is on the whole box (flag + +91 + number), so the blue outline covers all of it
    <View style={[styles.box, focused && focusedBox]}>
      <Text style={styles.flag}>🇮🇳</Text>
      <Text style={styles.code}>+91</Text>
      <View style={styles.divider} />
      <TextInput
        style={[styles.input, noOutline]}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/\D/g, '').slice(0, 10))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Enter mobile number"
        placeholderTextColor={colors.muted}
        keyboardType="number-pad"
        maxLength={10}
        accessibilityLabel="Mobile number"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: 14, minHeight: 52, borderWidth: 1.5, borderColor: colors.border },
  flag: { fontSize: 20, marginRight: 6 },
  code: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  divider: { width: 1, height: 22, backgroundColor: colors.border, marginHorizontal: 12 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text, minHeight: 44 },
});