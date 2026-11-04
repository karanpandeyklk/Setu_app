import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors, fonts, spacing } from '../theme';

type Props = { icon?: string; title: string; description?: string; actionLabel?: string; onAction?: () => void };

// Used for empty lists and for errors (pass actionLabel="Try again")
export default function EmptyState({ icon = 'file-tray-outline', title, description, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.circle}><Ionicons name={icon as any} size={30} color={colors.primary} /></View>
      <Text style={styles.title}>{title}</Text>
      {!!description && <Text style={styles.desc}>{description}</Text>}
      {!!actionLabel && !!onAction && <Button title={actionLabel} variant="outline" small onPress={onAction} style={{ marginTop: spacing.lg }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.xxl, paddingHorizontal: spacing.xl },
  circle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text, marginTop: spacing.lg, textAlign: 'center' },
  desc: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.xs, textAlign: 'center', lineHeight: 19 },
});
