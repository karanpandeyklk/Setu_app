import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomButton from '../../components/settings/BottomButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const REASONS = [
  'Fake or misleading profile',
  'Harassment or abusive messages',
  'Inappropriate photos or content',
  'Asking for money or personal details',
  'Spam or promotion',
  'Technical problem with the app',
  'Something else',
];

export default function ReportSafetyScreen({ navigation }: any) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);

  const submit = () => {
    // TODO: send { reason, details } to your backend / support system
    setSent(true);
  };

  if (sent) {
    return (
      <SettingsScreenLayout title="Report submitted" bg="#F7F8FC" onBack={() => navigation.goBack()}>
        <View style={styles.done}>
          <View style={styles.circle}><Ionicons name="checkmark" size={32} color="#fff" /></View>
          <Text style={styles.doneTitle}>Thank you</Text>
          <Text style={styles.doneText}>
            Our team will review your report. If someone is in immediate danger, contact your local emergency services.
          </Text>
        </View>
        <BottomButton title="Done" onPress={() => navigation.goBack()} />
      </SettingsScreenLayout>
    );
  }

  return (
    <SettingsScreenLayout
      title="Report & Safety"
      subtitle="Tell us what happened. Your report is confidential."
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        <Text style={styles.label}>What are you reporting?</Text>
        <View style={styles.card}>
          {REASONS.map((r, i) => {
            const on = r === reason;
            return (
              <Pressable key={r} onPress={() => setReason(r)} style={[styles.row, i < REASONS.length - 1 && styles.divider]}>
                <Text style={styles.rowText}>{r}</Text>
                <View style={[styles.radio, on && styles.radioOn]}>
                  {on && <Ionicons name="checkmark" size={13} color="#fff" />}
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Details <Text style={styles.optional}>(optional)</Text></Text>
        <TextInput
          value={details}
          onChangeText={setDetails}
          placeholder="Tell us more so we can help"
          placeholderTextColor="#94A3B8"
          multiline
          maxLength={500}
          style={styles.input}
        />
        <Text style={styles.count}>{details.length}/500</Text>
      </ScrollView>

      <BottomButton title="Submit report" disabled={!reason} onPress={submit} />
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, fontWeight: '700', color: S.text, marginTop: 18, marginBottom: 8 },
  optional: { fontWeight: '400', color: S.label },
  card: { backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: S.border },
  rowText: { flex: 1, fontSize: 14, color: S.text },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: S.primary, borderColor: S.primary },
  input: {
    minHeight: 110, borderRadius: 14, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff',
    padding: 14, fontSize: 14, color: S.text, textAlignVertical: 'top',
  },
  count: { alignSelf: 'flex-end', fontSize: 11, color: S.label, marginTop: 6 },
  done: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  circle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  doneTitle: { fontSize: 18, fontWeight: '800', color: S.text, marginTop: 18 },
  doneText: { fontSize: 13, color: S.muted, textAlign: 'center', lineHeight: 19, marginTop: 8 },
});