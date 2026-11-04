import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../../components/Button';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import { loadReflect, ReflectData } from '../../services/journeyApi';
import { colors, fonts, spacing } from '../../theme';

export default function ReflectIntroScreen({ navigation, route }: any) {
  const match: string = route.params?.match ?? '';
  const [data, setData] = useState<ReflectData | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try { setData(await loadReflect()); } catch { setError(true); }
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  if (error) return <SafeAreaView style={styles.safe}><ScreenHeader onBack={() => navigation.goBack()} /><EmptyState icon="cloud-offline-outline" title="Couldn't load questions" actionLabel="Try again" onAction={load} /></SafeAreaView>;

  const total = data?.questions.length ?? 0;
  const answered = data ? data.questions.filter((q) => data.answers[q.id]).length : 0;
  const resuming = answered > 0;

  const start = () => {
    if (!data) return;
    if (!data.privacySeen) return navigation.navigate('ReflectPrivacy', { match });
    const first = data.questions.findIndex((q) => !data.answers[q.id]);
    navigation.navigate('ReflectQuestion', { index: first === -1 ? total - 1 : first, match });
  };

  const bullets = [
    'Your answers are private by default',
    'You can choose to share each answer later',
    `There are ${total} questions in this stage`,
    'Save and return anytime',
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.circle}><Ionicons name="create-outline" size={34} color={colors.primary} /></View>
        <Text style={styles.stage}>Reflect, Stage 3 of 8</Text>
        <Text style={styles.title}>Take a moment to think about what matters to you</Text>
        <View style={{ marginTop: spacing.xl, alignSelf: 'stretch' }}>
          {bullets.map((b) => (
            <View key={b} style={styles.bullet}>
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              <Text style={styles.bulletText}>{b}</Text>
            </View>
          ))}
        </View>
        {resuming && <Text style={styles.progress}>{answered} of {total} answered</Text>}
      </View>
      <View style={{ padding: spacing.lg }}>
        <Button title={resuming ? 'Continue' : 'Start Reflecting'} arrow disabled={!data} onPress={start} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  circle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  stage: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, marginTop: spacing.lg },
  title: { fontFamily: fonts.display, fontSize: 24, lineHeight: 32, color: colors.text, textAlign: 'center', marginTop: spacing.sm },
  bullet: { flexDirection: 'row', alignItems: 'center', minHeight: 44 },
  bulletText: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, marginLeft: spacing.md, flex: 1 },
  progress: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, marginTop: spacing.lg },
});