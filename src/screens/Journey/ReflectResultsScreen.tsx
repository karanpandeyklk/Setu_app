import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import EmptyState from '../../components/EmptyState';
import Skeleton from '../../components/Skeleton';
import { Answer, Question } from '../../services/journeyData';
import { getReflectResults, ResultsData } from '../../services/reflectResults';
import { colors, fonts, radius, spacing } from '../../theme';

type Filter = 'all' | 'shared' | 'private';
const SCALE = ['Very low', 'Low', 'Moderate', 'High', 'Very high'];

function AnswerView({ q, a }: { q: Question; a: Answer }) {
  if (q.type === 'rating') {
    const n = Number(a.value);
    return (
      <View style={styles.rating}>
        <Text style={styles.ratingNum}>{n} / 5</Text>
        <Text style={styles.ratingLabel}>{SCALE[n - 1]}</Text>
      </View>
    );
  }
  if (Array.isArray(a.value)) {
    return <View>{a.value.map((v) => <Text key={v} style={styles.answerText}>{v}</Text>)}</View>;
  }
  const text = a.value === 'Other' && a.other ? a.other : String(a.value ?? '');
  return <Text style={styles.answerText}>{text}</Text>;
}

const Col = ({ label, name, children }: { label: string; name: string; children: React.ReactNode }) => (
  <View style={styles.col}>
    <View style={styles.colHead}>
      <Avatar size={20} name={name} />
      <Text style={styles.colLabel} numberOfLines={1}>{label}</Text>
    </View>
    {children}
  </View>
);

export default function ReflectResultsScreen({ navigation, route }: any) {
  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try { setData(await getReflectResults()); } catch { setError(true); }
    setLoading(false);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const match = data?.matchName ?? route.params?.match ?? 'Rohan';

  const Top = (
    <View style={styles.top}>
      <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.topTitle}>Reflect – Completed</Text>
      <View style={styles.iconBtn} />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        {Top}
        <View style={{ padding: spacing.lg, gap: spacing.md }}><Skeleton height={100} /><Skeleton height={70} /><Skeleton height={160} /></View>
      </SafeAreaView>
    );
  }
  if (error || !data) {
    return (
      <SafeAreaView style={styles.safe}>
        {Top}
        <EmptyState icon="cloud-offline-outline" title="Couldn't load the answers" description="Check your connection and try again." actionLabel="Try again" onAction={load} />
      </SafeAreaView>
    );
  }

  const total = data.questions.length;
  const mineDone = data.questions.filter((q) => data.mine[q.id]).length;

  // Answers are compared only when both people have finished
  if (mineDone < total) {
    return (
      <SafeAreaView style={styles.safe}>
        {Top}
        <EmptyState icon="create-outline" title="Finish your reflections first" description={`You have answered ${mineDone} of ${total}. Compare answers once you have both finished.`} actionLabel="Continue reflecting" onAction={() => navigation.navigate('ReflectIntro', { match })} />
      </SafeAreaView>
    );
  }
  if (data.matchAnswered < total) {
    return (
      <SafeAreaView style={styles.safe}>
        {Top}
        <EmptyState icon="time-outline" title={`Waiting for ${match}`} description={`${match} has answered ${data.matchAnswered} of ${total}. You can compare answers once they finish.`} />
      </SafeAreaView>
    );
  }

  const sharedCount = data.questions.filter((q) => data.theirs[q.id]).length;
  const privateCount = total - sharedCount;
  const shown = data.questions.filter((q) => (filter === 'all' ? true : filter === 'shared' ? !!data.theirs[q.id] : !data.theirs[q.id]));
  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: `All Questions (${total})` },
    { key: 'shared', label: `Shared (${sharedCount})` },
    { key: 'private', label: `Private (${privateCount})` },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {Top}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.success}>
          <View style={styles.check}><Ionicons name="checkmark" size={20} color="#fff" /></View>
          <View style={{ flex: 1, marginLeft: spacing.md, paddingRight: 56 }}>
            <Text style={styles.successTitle}>You've both completed the Reflect stage!</Text>
            <Text style={styles.successText}>Here are our reflections for this stage. You can see each other's answers based on the sharing choices made.</Text>
          </View>
          <Ionicons name="document-text" size={44} color="#BFD3F5" style={styles.docArt} />
        </View>

        <View style={styles.people}>
          {[{ name: 'You', done: mineDone }, { name: match, done: data.matchAnswered }].map((p, i) => (
            <View key={p.name} style={[styles.person, i === 0 && { marginRight: spacing.md }]}>
              <Avatar size={36} name={p.name === 'You' ? 'Y' : p.name} />
              <View style={{ marginLeft: spacing.sm }}>
                <Text style={styles.personName}>{p.name}</Text>
                <Text style={styles.personCount}>{p.done}/{total}</Text>
                <Text style={styles.personDone}>Completed</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.filters} accessibilityRole="tablist">
          {FILTERS.map((f) => (
            <Pressable key={f.key} style={[styles.filter, filter === f.key && styles.filterOn]} onPress={() => setFilter(f.key)} accessibilityRole="tab" accessibilityState={{ selected: filter === f.key }}>
              <Text style={[styles.filterText, filter === f.key && { color: '#fff' }]}>{f.label}</Text>
            </Pressable>
          ))}
        </View>

        {shown.length === 0 && <EmptyState icon="list-outline" title="Nothing here" description="No questions match this filter." />}

        {shown.map((q) => {
          const index = data.questions.indexOf(q) + 1;
          const mine = data.mine[q.id];
          const theirs = data.theirs[q.id];
          return (
            <View key={q.id} style={styles.card}>
              <View style={styles.cardHead}>
                <View style={styles.num}><Text style={styles.numText}>{index}</Text></View>
                <View style={styles.cat}><Text style={styles.catText}>{q.category}</Text></View>
              </View>
              <Text style={styles.question}>{q.text}</Text>
              <View style={styles.cols}>
                <Col label="Your answer" name="Y">
                  {mine ? <AnswerView q={q} a={mine} /> : null}
                </Col>
                <Col label={`${match}'s answer`} name={match}>
                  {theirs ? (
                    <AnswerView q={q} a={theirs} />
                  ) : (
                    <View style={styles.locked}>
                      <Ionicons name="lock-closed-outline" size={14} color={colors.muted} />
                      <Text style={styles.lockedText}>{match} has kept this answer private.</Text>
                    </View>
                  )}
                </Col>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 52 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  scroll: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  success: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E1ECFD', borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.sm, overflow: 'hidden' },
  check: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 19, color: colors.text },
  successText: { fontFamily: fonts.regular, fontSize: 11.5, lineHeight: 16, color: colors.muted, marginTop: 3 },
  docArt: { position: 'absolute', right: 12, bottom: 8 },

  people: { flexDirection: 'row', marginTop: spacing.lg },
  person: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md },
  personName: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text },
  personCount: { fontFamily: fonts.bold, fontSize: 12, color: colors.primary },
  personDone: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.muted },

  filters: { flexDirection: 'row', backgroundColor: '#E9EEF6', borderRadius: radius.pill, padding: 3, marginVertical: spacing.lg },
  filter: { flex: 1, minHeight: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  filterOn: { backgroundColor: colors.primary },
  filterText: { fontFamily: fonts.semibold, fontSize: 11.5, color: colors.muted, textAlign: 'center' },

  card: { backgroundColor: '#fff', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.md },
  cardHead: { flexDirection: 'row', alignItems: 'center' },
  num: { width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  numText: { fontFamily: fonts.bold, fontSize: 11, color: colors.primary },
  cat: { backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, marginLeft: spacing.sm },
  catText: { fontFamily: fonts.medium, fontSize: 10.5, color: colors.primaryDark },
  question: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 20, color: colors.text, marginTop: spacing.md },
  cols: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  col: { flex: 1 },
  colHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  colLabel: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.muted, marginLeft: 6, flex: 1 },
  answerText: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 17, color: colors.text, marginBottom: 2 },
  rating: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, alignItems: 'center' },
  ratingNum: { fontFamily: fonts.bold, fontSize: 15, color: colors.primaryDark },
  ratingLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, marginTop: 1 },
  locked: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.md },
  lockedText: { flex: 1, fontFamily: fonts.regular, fontSize: 11, lineHeight: 16, color: colors.muted, marginLeft: 6 },
});