import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors, fonts, radius, spacing } from '../theme';

const BLUE = '#2563EB'; // swap for your Figma border hex, or use a colors.primary if you have one

export default function AppInput(props: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor={colors.muted}
      selectionColor={BLUE}
      {...props}
      onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
      onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      style={[styles.input, focused && styles.focused, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',            // default: light gray (keeps layout from jumping on focus)
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 52,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
    ...Platform.select({ web: { outlineStyle: 'none' } as any }),   // removes the black browser outline
  },
  focused: {
    borderColor: BLUE,
    ...Platform.select({
      web: { boxShadow: '0 0 0 3px rgba(37,99,235,0.2)' } as any,  // soft blue glow
      ios: { shadowColor: BLUE, shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 0 } },
      android: { elevation: 2 },
    }),
  },
});