import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme';
import { focusedBox, noOutline } from './focus';

type Props = { value: string; onChangeText: (t: string) => void; onSend: () => void; disabled?: boolean; maxLength?: number; placeholder?: string };

export default function ChatInput({ value, onChangeText, onSend, disabled, maxLength = 500, placeholder = 'Type a message' }: Props) {
  const [focused, setFocused] = useState(false);
  const can = value.trim().length > 0 && !disabled;
  return (
    <View style={styles.bar}>
      <TextInput
        style={[styles.input, focused && focusedBox, noOutline]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel="Message"
      />
      <Pressable onPress={onSend} disabled={!can} accessibilityRole="button" accessibilityLabel="Send" style={[styles.send, !can && { backgroundColor: colors.disabled }]}>
        <Ionicons name="send" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, maxHeight: 110, minHeight: 44, backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: spacing.lg, paddingTop: 12, paddingBottom: 12, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: spacing.sm },
});