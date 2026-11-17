import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow, spacing } from '../theme';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'link';
};

export default function Card({ children, style, onPress, accessibilityLabel, accessibilityRole = 'button' }: Props) {
  const flatStyle = StyleSheet.flatten([styles.card, shadow.card, style]);

  if (onPress) {
    return (
      <Pressable
        style={flatStyle}
        onPress={onPress}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={flatStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg },
});
