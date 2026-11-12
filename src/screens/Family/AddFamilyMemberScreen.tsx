import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import OptionChip from '../../components/OptionChip';
import ScreenHeader from '../../components/ScreenHeader';
import { addMember, RELATIONS } from '../../services/familyData';
import { colors, fonts, spacing } from '../../theme';

export default function AddFamilyMemberScreen({ navigation }: any) {
  const [relation, setRelation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const send = async () => {
    setBusy(true); setError('');
    try { await addMember(relation); navigation.goBack(); }
    catch { setError("Couldn't send the invitation. Try again."); }
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={styles.title}>Add a family member</Text>
        <Text style={styles.sub}>Choose how this person is related to you. They will get an invitation and can view only what you choose to share.</Text>
        <View style={styles.wrap}>
          {RELATIONS.map((r) => <OptionChip key={r} label={r} selected={relation === r} onPress={() => setRelation(r)} />)}
        </View>
        {!!error && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
      <View style={{ padding: spacing.lg }}>
        <Button title="Send invitation" disabled={!relation} loading={busy} onPress={send} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.xl },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, marginTop: spacing.lg },
});