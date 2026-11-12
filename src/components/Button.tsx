import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, MIN_TAP, radius, shadow } from '../theme';

type Variant = 'primary' | 'outline' | 'text' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  arrow?: boolean; // arrow icon after the title, like "Get Started"
  icon?: string; // Ionicons name before the title, like "close" or "heart"
  small?: boolean; // compact size for list rows
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export default function Button({
  title, onPress, variant = 'primary', disabled, loading, arrow, icon, small, style, accessibilityLabel,
}: Props) {
  const isFilled = variant === 'primary' || variant === 'danger';
  const textColor = isFilled ? '#fff' : colors.primary;
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: !!inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        small && styles.small,
        variant === 'primary' && [styles.primary, shadow.button, pressed && { backgroundColor: colors.primaryDark }],
        variant === 'danger' && [styles.danger, pressed && { opacity: 0.85 }],
        variant === 'outline' && [styles.outline, pressed && { backgroundColor: colors.primarySoft }],
        variant === 'text' && styles.text,
        inactive && isFilled && { backgroundColor: colors.disabled, shadowOpacity: 0 },
        inactive && !isFilled && { opacity: 0.5 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {!!icon && <Ionicons name={icon as any} size={small ? 16 : 18} color={textColor} style={{ marginRight: 8 }} />}
          <Text style={[styles.label, small && { fontSize: 13 }, { color: textColor }]}>{title}</Text>
          {arrow && <Ionicons name="arrow-forward" size={18} color={textColor} style={{ marginLeft: 8 }} />}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52, minWidth: MIN_TAP, borderRadius: radius.pill,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20,
  },
  small: { minHeight: MIN_TAP, paddingHorizontal: 16 },
  primary: { backgroundColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: colors.primary },
  text: { backgroundColor: 'transparent', minHeight: MIN_TAP },
  label: { fontFamily: fonts.semibold, fontSize: 16 },
});