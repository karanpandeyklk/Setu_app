import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import { savePrivacyChoice } from '../../services/journeyApi';
import { Sharing, sharingLabel } from '../../services/journeyData';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

export default function ReflectPrivacyScreen({ navigation, route }: any) {
  const match: string = route.params?.match ?? 'your match';
  const [choice, setChoice] = useState<Sharing>('keep_private');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const options: { key: Sharing; icon: string; desc: string }[] = [
    { key: 'keep_private', icon: 'lock-closed-outline', desc: 'Only you can see your answers' },
    { key: 'share_with_match', icon: 'people-outline', desc: `${match} can read your answers` },
    { key: 'share_later', icon: 'time-outline', desc: 'Stay private until you decide, after finishing all questions' },
  ];

  const next = async () => {
    setBusy(true); setError('');
    try { await savePrivacyChoice(choice); navigation.replace('ReflectQuestion', { index: 0, match }); }
    catch { setError("Couldn't save your choice. Try again."); }
    setBusy(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={styles.title}>Your Privacy, Your Choice</Text>
        <Text style={styles.sub}>Choose how your answers are shared by default. You can change this for each answer.</Text>
        {options.map((o) => {
          const on = choice === o.key;
          return (
            <Pressable key={o.key} onPress={() => setChoice(o.key)} accessibilityRole="radio" accessibilityState={{ selected: on }} style={[styles.card, shadow.card, on && styles.cardOn]}>
              <View style={styles.icon}><Ionicons name={o.icon as any} size={22} color={colors.primary} /></View>
              <View style={{ flex: 1, marginHorizontal: spacing.md }}>
                <Text style={styles.cardTitle}>{sharingLabel(o.key, match)}</Text>
                <Text style={styles.desc}>{o.desc}</Text>
              </View>
              <View style={[styles.radio, on && { borderColor: colors.primary }]}>{on && <View style={styles.radioDot} />}</View>
            </Pressable>
          );
        })}
        <Text style={styles.note}>Your answers stay private unless you choose to share them.</Text>
      </ScrollView>
      <View style={{ padding: spacing.lg }}>
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button title="Continue to Questions" arrow loading={busy} onPress={next} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: spacing.sm, marginBottom: spacing.xl, lineHeight: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1.5, borderColor: 'transparent', minHeight: 72 },
  cardOn: { borderColor: colors.primary },
  icon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  desc: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  note: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'center', marginTop: spacing.lg },
  error: { color: colors.danger, fontFamily: fonts.regular, fontSize: 13, textAlign: 'center', marginBottom: spacing.sm },
});