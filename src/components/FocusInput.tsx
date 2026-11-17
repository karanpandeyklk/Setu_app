import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, fonts, radius, shadow } from '../theme';
import { focusedBox, noOutline } from './focus';

type Props = Omit<TextInputProps, 'style'> & { style?: ViewStyle };

// A text field whose whole box turns blue when focused (no black outline)
export default function FocusInput({ style, onFocus, onBlur, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.box, shadow.card, focused && focusedBox, style]}>
      <TextInput
        {...rest}
        placeholderTextColor={colors.muted}
        style={[styles.input, noOutline, rest.multiline && { minHeight: 90, textAlignVertical: 'top', paddingTop: 14 }]}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border },
  input: { paddingHorizontal: 16, minHeight: 50, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
});