import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors, fonts, spacing } from '../theme';

type Props = {
  title: string; subtitle?: string; children?: React.ReactNode;
  onBack: () => void; onNext: () => void; onSaveExit: () => void;
  loading?: boolean; busy?: 'next' | 'exit' | null; error?: string; nextDisabled?: boolean;
};

export default function PreferenceScaffold({ title, subtitle, children, onBack, onNext, onSaveExit, loading, busy, error, nextDisabled }: Props) {
  const locked = !!loading || !!busy;
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Pressable onPress={onBack} style={styles.back} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.back} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
        {loading ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xxl }} /> : children}
      </ScrollView>

      <View style={styles.footer}>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button title="Next" loading={busy === 'next'} disabled={locked || !!nextDisabled} onPress={onNext} />
        <Button title="Save & Exit" variant="text" loading={busy === 'exit'} disabled={locked} onPress={onSaveExit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 52 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontFamily: fonts.bold, fontSize: 17, color: colors.text },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginBottom: spacing.sm },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, paddingTop: spacing.sm },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, textAlign: 'center', marginBottom: spacing.sm },
});