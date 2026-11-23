import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import FocusInput from '../../components/FocusInput';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { getSectionValues, saveSection, SECTIONS } from '../../services/profileSections';
import { colors, fonts, spacing } from '../../theme';

export default function EditSectionScreen({ navigation, route }: any) {
  const def = SECTIONS.find((s) => s.id === route.params?.sectionId);
  const { user } = useAuth();
  const userId = user?.id ?? 'guest';
  const [vals, setVals] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!def) return;
    getSectionValues(userId).then((all) => { setVals(all[def.id] ?? {}); setReady(true); });
  }, []);

  if (!def) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader onBack={() => navigation.goBack()} />
        <EmptyState icon="alert-circle-outline" title="Nothing to edit" description="This section isn't available." actionLabel="Go back" onAction={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const save = async () => {
    setBusy(true); setError('');
    try {
      const cleaned: Record<string, string> = {};
      def.fields.forEach((f) => { cleaned[f.key] = (vals[f.key] ?? '').trim(); });
      await saveSection(userId, def.id, cleaned);
      navigation.goBack();
    } catch {
      setError("Couldn't save your changes. Try again.");
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title={def.title} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
          {ready && def.fields.map((f) => (
            <View key={f.key}>
              <Text style={styles.label}>{f.label}</Text>
              <FocusInput
                value={vals[f.key] ?? ''}
                onChangeText={(t) => setVals((v) => ({ ...v, [f.key]: t }))}
                placeholder={f.placeholder}
                multiline={f.multiline}
                maxLength={f.multiline ? 200 : 60}
                accessibilityLabel={f.label}
              />
            </View>
          ))}
          {!!error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
        <View style={{ padding: spacing.lg }}>
          <Button title="Save changes" loading={busy} disabled={!ready} onPress={save} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, marginTop: spacing.lg },
});