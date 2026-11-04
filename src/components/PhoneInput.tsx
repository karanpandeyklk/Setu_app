import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius, shadow } from '../theme';

type Props = { value: string; onChangeText: (v: string) => void };

export default function PhoneInput({ value, onChangeText }: Props) {
  return (
    <View style={[styles.box, shadow.card]}>
      <Text style={styles.flag}>🇮🇳</Text>
      <Text style={styles.code}>+91</Text>
      <View style={styles.divider} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/\D/g, '').slice(0, 10))}
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
  box: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: 14, minHeight: 52 },
  flag: { fontSize: 20, marginRight: 6 },
  code: { fontFamily: fonts.medium, fontSize: 15, color: colors.text },
  divider: { width: 1, height: 22, backgroundColor: colors.border, marginHorizontal: 12 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text, minHeight: 44 },
});
