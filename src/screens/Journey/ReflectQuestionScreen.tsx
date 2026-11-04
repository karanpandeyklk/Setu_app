import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import EmptyState from '../../components/EmptyState';
import ProgressBar from '../../components/ProgressBar';
import ScreenHeader from '../../components/ScreenHeader';
import { completeStage, loadReflect, saveAnswer } from '../../services/journeyApi';
import { Question, Sharing, sharingLabel } from '../../services/journeyData';
import { colors, fonts, radius, spacing } from '../../theme';

const SHARING: Sharing[] = ['keep_private', 'share_with_match', 'share_later'];
const MAX_CHARS = 500;

export default function ReflectQuestionScreen({ navigation, route }: any) {
  const index: number = route.params.index;
  const match: string = route.params.match ?? 'match';
  const [qs, setQs] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [value, setValue] = useState<any>(null);
  const [other, setOther] = useState('');
  const [sharing, setSharing] = useState<Sharing>('keep_private');
  const [menu, setMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setLoadError(false);
    try {
      const r = await loadReflect();
      const a = r.answers[r.questions[index].id];
      setQs(r.questions);
      setValue(a?.value ?? null); setOther(a?.other ?? ''); setSharing(a?.sharing ?? r.defaultSharing);
    } catch { setLoadError(true); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  if (loading || loadError) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScreenHeader onBack={() => navigation.goBack()} />
        {loadError ? <EmptyState icon="cloud-offline-outline" title="Couldn't load this question" actionLabel="Try again" onAction={load} /> : null}
      </SafeAreaView>
    );
  }

  const q = qs[index];
  const isLast = index === qs.length - 1;
  const textValue = typeof value === 'string' ? value : '';

  // Next stays disabled until the answer is valid
  const valid = (() => {
    if (value == null) return false;
    if (q.type === 'free_text') return textValue.trim().length > 0 && textValue.length <= MAX_CHARS;
    if (q.type === 'multi_select') return (value as string[]).length > 0 && (!q.max || (value as string[]).length <= q.max);
    if (q.type === 'single_select') return value !== 'Other' || other.trim().length > 0;
    return true; // rating: any selection is valid
  })();

  const toggleMulti = (opt: string) => {
    const cur: string[] = Array.isArray(value) ? value : [];
    if (cur.includes(opt)) return setValue(cur.filter((x) => x !== opt));
    if (q.max && cur.length >= q.max) return; // limit reached
    setValue([...cur, opt]);
  };

  const persist = () => saveAnswer(q.id, { value, other: value === 'Other' ? other : undefined, sharing });

  const onNext = async () => {
    setSaving(true); setError('');
    try {
      await persist();
      if (isLast) { await completeStage('reflect'); navigation.replace('ReflectDone', { match }); }
      else navigation.push('ReflectQuestion', { index: index + 1, match });
    } catch { setError("Couldn't save your answer. Your answer is kept on this phone."); }
    setSaving(false);
  };

  const onSaveExit = async () => {
    if (valid) { try { await persist(); } catch {} } // partial progress is saved on the phone
    navigation.navigate('Main');
  };

  const option = (label: string, selected: boolean, onPress: () => void, square = false) => (
    <Pressable key={label} onPress={onPress} accessibilityRole={square ? 'checkbox' : 'radio'} accessibilityState={{ selected }} style={[styles.opt, selected && styles.optOn]}>
      <View style={[styles.mark, square && { borderRadius: 5 }, selected && { borderColor: colors.primary, backgroundColor: square ? colors.primary : '#fff' }]}>
        {selected && (square ? <Ionicons name="checkmark" size={14} color="#fff" /> : <View style={styles.dot} />)}
      </View>
      <Text style={styles.optText}>{label === 'Other' ? 'Other, please specify' : label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
          <ProgressBar current={index + 1} total={qs.length} />
          <View style={{ marginTop: spacing.lg }}><Chip label={q.category} /></View>
          <Text style={styles.qnum}>Question {index + 1}</Text>
          <Text style={styles.qtext}>{q.text}</Text>
          {!!q.hint && <Text style={styles.hint}>{q.hint}</Text>}

          <View style={{ marginTop: spacing.lg }}>
            {q.type === 'single_select' && (
              <>
                {q.options!.map((o) => option(o, value === o, () => setValue(o)))}
                {value === 'Other' && (
                  <TextInput style={styles.input} value={other} onChangeText={setOther} placeholder="Please specify" placeholderTextColor={colors.muted} accessibilityLabel="Other answer" />
                )}
              </>
            )}

            {q.type === 'multi_select' && q.options!.map((o) => option(o, Array.isArray(value) && value.includes(o), () => toggleMulti(o), true))}

            {q.type === 'rating' && (
              <>
                <View style={styles.ratingRow}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Pressable key={n} onPress={() => setValue(n)} accessibilityRole="button" accessibilityLabel={`Rating ${n} of 5`} accessibilityState={{ selected: value === n }} style={[styles.rate, value === n && styles.rateOn]}>
                      <Text style={[styles.rateText, value === n && { color: '#fff' }]}>{n}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.labels}>
                  <Text style={styles.hint}>{q.labels?.[0]}</Text><Text style={styles.hint}>{q.labels?.[1]}</Text>
                </View>
              </>
            )}

            {q.type === 'free_text' && (
              <>
                <TextInput
                  style={[styles.input, { height: 140, textAlignVertical: 'top' }]}
                  value={textValue} onChangeText={setValue} multiline maxLength={MAX_CHARS}
                  placeholder="Write your answer here" placeholderTextColor={colors.muted} accessibilityLabel="Your answer"
                />
                <Text style={[styles.counter, textValue.length >= 450 && { color: '#B45309' }]}>{textValue.length}/{MAX_CHARS}</Text>
              </>
            )}
          </View>

          <Text style={styles.label}>Sharing preference for this answer</Text>
          <Pressable style={styles.select} onPress={() => setMenu(!menu)} accessibilityRole="button" accessibilityLabel="Sharing preference">
            <Text style={styles.optText}>{sharingLabel(sharing, match)}</Text>
            <Ionicons name={menu ? 'chevron-up' : 'chevron-down'} size={18} color={colors.muted} />
          </Pressable>
          {menu && SHARING.map((s) => (
            <Pressable key={s} style={styles.menuItem} onPress={() => { setSharing(s); setMenu(false); }}>
              <Text style={[styles.optText, s === sharing && { color: colors.primary, fontFamily: fonts.semibold }]}>{sharingLabel(s, match)}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {!!error && (
            <View style={styles.errorRow}>
              <Text style={styles.error}>{error}</Text>
              <Text style={styles.retry} onPress={onNext} accessibilityRole="button">Retry</Text>
            </View>
          )}
          <Button title={isLast ? 'Finish' : 'Next'} arrow disabled={!valid} loading={saving} onPress={onNext} />
          <Button title="Save & Exit" variant="text" onPress={onSaveExit} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  qnum: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, marginTop: spacing.lg },
  qtext: { fontFamily: fonts.display, fontSize: 21, lineHeight: 29, color: colors.text, marginTop: spacing.xs },
  hint: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.xs },
  opt: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, paddingHorizontal: spacing.lg, minHeight: 52, marginBottom: spacing.sm },
  optOn: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  optText: { fontFamily: fonts.regular, fontSize: 14, color: colors.text, flex: 1 },
  mark: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  input: { backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, fontFamily: fonts.regular, fontSize: 14, color: colors.text, minHeight: 48 },
  counter: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'right', marginTop: spacing.xs },
  ratingRow: { flexDirection: 'row', gap: spacing.sm },
  rate: { flex: 1, height: 52, borderRadius: radius.md, backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  rateOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  rateText: { fontFamily: fonts.semibold, fontSize: 17, color: colors.text },
  labels: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, marginTop: spacing.xl, marginBottom: spacing.sm },
  select: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.lg, minHeight: 48 },
  menuItem: { backgroundColor: '#fff', paddingHorizontal: spacing.lg, minHeight: 48, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: colors.border },
  footer: { padding: spacing.lg, paddingTop: spacing.sm },
  errorRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  error: { color: colors.danger, fontFamily: fonts.regular, fontSize: 12, flexShrink: 1 },
  retry: { color: colors.primary, fontFamily: fonts.semibold, fontSize: 13, marginLeft: spacing.sm, padding: 8 },
});