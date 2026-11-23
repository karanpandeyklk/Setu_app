import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const MAX = 500;

export default function ReportDetailsScreen({ navigation }: any) {
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    // TODO: send { kind, reason, details } (both come from route.params) once the backend report endpoint is confirmed
    await new Promise((r) => setTimeout(r, 500));
    setBusy(false);
    navigation.replace('ReportSubmitted');
  };

  return (
    <SettingsScreenLayout
      title="Additional Details"
      subtitle="Provide more information to help us review your report."
      bg="#F7F8FC"
      onBack={() => navigation.goBack()}
    >
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}>
          <Text style={styles.label}>Additional details <Text style={styles.opt}>(optional)</Text></Text>
          <View style={styles.box}>
            <TextInput
              style={styles.input}
              value={details}
              onChangeText={(t) => setDetails(t.slice(0, MAX))}
              placeholder="Tell us what happened..."
              placeholderTextColor="#94A3B8"
              multiline
              textAlignVertical="top"
              accessibilityLabel="Additional details"
            />
            <Text style={styles.count}>{details.length}/{MAX}</Text>
          </View>

          <View style={styles.imagesCard}>
            <View style={styles.hint}>
              <Ionicons name="information-circle" size={14} color={S.primary} />
              <Text style={styles.hintText}>You can also add screenshots to support your report.</Text>
            </View>
            {/* Placeholder only: no image picker yet */}
            <View style={styles.drop}>
              <Ionicons name="image-outline" size={20} color={S.primary} />
              <Text style={styles.dropTitle}>Add images <Text style={styles.opt}>(optional)</Text></Text>
              <Text style={styles.dropSub}>JPG, PNG up to 5 images (Max 5 MB each)</Text>
            </View>
          </View>
        </ScrollView>
        <ActionButton title="Submit report" loading={busy} onPress={submit} style={{ marginBottom: 24 }} />
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12.5, fontWeight: '700', color: S.text, marginBottom: 8 },
  opt: { fontWeight: '400', color: '#94A3B8' },
  box: { height: 150, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#fff', padding: 14 },
  input: { flex: 1, fontSize: 13.5, color: S.text, outlineStyle: 'none' } as any,
  count: { alignSelf: 'flex-end', fontSize: 10.5, color: '#94A3B8' },
  imagesCard: { marginTop: 16, padding: 12, borderRadius: 14, backgroundColor: '#EEF3FD' },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  hintText: { flex: 1, fontSize: 11, color: '#475569' },
  drop: { alignItems: 'center', gap: 6, paddingVertical: 18, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#9DB8F5', backgroundColor: '#F7F9FF' },
  dropTitle: { fontSize: 12, fontWeight: '700', color: S.text },
  dropSub: { fontSize: 10, color: '#94A3B8' },
});