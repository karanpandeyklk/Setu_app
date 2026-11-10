// src/screens/ProfileBuilder/ProfileBuilderScreen.tsx
// Install once:  npx expo install @react-native-async-storage/async-storage react-native-safe-area-context
//
// One screen, six steps. All answers live in a single state object and are
// saved to AsyncStorage after every change, so the user can close the app and resume.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { STEPS, Step } from './config';
import { C, ImageTileGrid, RadioList, ChipSelect, TextArea } from './fields';
import { colors, fonts, radius, shadow, spacing, MIN_TAP } from '../../theme';

const STORAGE_KEY = 'profileBuilder:v1';

// answers[stepId] is string[] for tiles/chips, string for radio/about.
// For "groups" steps the answers are stored under each group's own id.
type Answers = Record<string, string | string[]>;
type Saved = { answers: Answers; stepIndex: number };

export default function ProfileBuilderScreen() {
  const navigation = useNavigation<any>();
  const [loaded, setLoaded] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  // ---- restore saved progress ----
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved: Saved = JSON.parse(raw);
          setAnswers(saved.answers ?? {});
          setStepIndex(Math.min(saved.stepIndex ?? 0, STEPS.length - 1));
        }
      } catch {
        /* start fresh if storage is empty or unreadable */
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // ---- persist on every change ----
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, stepIndex } as Saved)).catch(() => {});
  }, [answers, stepIndex, loaded]);

  const set = useCallback((key: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ---- can the user press Continue? (Skip is always allowed) ----
  const canContinue = (st: Step): boolean => {
    switch (st.kind) {
      case 'tiles':
        return ((answers[st.id] as string[]) ?? []).length > 0;
      case 'chips':
        return ((answers[st.id] as string[]) ?? []).length > 0;
      case 'radio': {
        const v = answers[st.id] as string | undefined;
        if (!v) return false;
        return v !== 'Other' || !!(answers[`${st.id}_other`] as string)?.trim();
      }
      case 'groups':
        return st.groups.every((g) => !!answers[g.id]);
      case 'about':
        return ((answers[st.id] as string) ?? '').trim().length > 0;
    }
  };

  const finish = async () => {
    setSaving(true);
    setError(null);
    try {
      // TODO (Bharrath's API): await profileApi.saveBuilderAnswers(answers);
      // keep the final answers so My Profile can show them (the draft below is only for resuming)
      await AsyncStorage.setItem('setu_builder_answers', JSON.stringify(answers));
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem('setu_open_builder'); // stop reopening the builder on next launch
      // Reset the stack so Back does not return to onboarding.
      // Route 'Main' is the tab navigator inside the signed-in stack in RootNavigator.
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch {
      setError("We couldn't save your profile. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const next = () => (isLast ? finish() : setStepIndex((i) => i + 1));
  const back = () => (stepIndex === 0 ? navigation.goBack() : setStepIndex((i) => i - 1));

  if (!loaded) {
    return (
      <SafeAreaView style={s.center}>
        <ActivityIndicator color={C.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* progress bar */}
      <View style={s.progressTrack} accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: STEPS.length, now: stepIndex + 1 }}>
        <View style={[s.progressFill, { width: `${((stepIndex + 1) / STEPS.length) * 100}%` }]} />
      </View>

      <Pressable onPress={back} style={s.backBtn} accessibilityLabel="Go back" hitSlop={8}>
        <Ionicons name="chevron-back" size={24} color={C.text} />
      </Pressable>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={s.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.title}>{step.title}</Text>
          {'subtitle' in step && !!step.subtitle && <Text style={s.subtitle}>{step.subtitle}</Text>}

          <View style={{ marginTop: 20 }}>
            {step.kind === 'tiles' && (
              <ImageTileGrid
                options={step.options}
                value={(answers[step.id] as string[]) ?? []}
                onChange={(v) => set(step.id, v)}
              />
            )}

            {step.kind === 'radio' && (
              <RadioList
                options={step.options}
                allowOther={step.allowOther}
                value={answers[step.id] as string | undefined}
                onChange={(v) => set(step.id, v)}
                otherValue={(answers[`${step.id}_other`] as string) ?? ''}
                onOtherChange={(t) => set(`${step.id}_other`, t)}
              />
            )}

            {step.kind === 'chips' && (
              <ChipSelect
                options={step.options}
                max={step.max}
                value={(answers[step.id] as string[]) ?? []}
                onChange={(v) => set(step.id, v)}
              />
            )}

            {step.kind === 'groups' &&
              step.groups.map((g) => (
                <View key={g.id} style={{ marginBottom: 20 }}>
                  <Text style={s.groupTitle}>{g.title}</Text>
                  <RadioList
                    options={g.options}
                    value={answers[g.id] as string | undefined}
                    onChange={(v) => set(g.id, v)}
                  />
                </View>
              ))}

            {step.kind === 'about' && (
              <TextArea
                value={(answers[step.id] as string) ?? ''}
                onChange={(v) => set(step.id, v)}
                maxLength={step.maxLength}
                placeholder="Write a few lines about yourself..."
                prompts={step.prompts}
              />
            )}
          </View>
        </ScrollView>

        {/* footer */}
        <View style={s.footer}>
          {!!error && <Text style={s.error}>{error}</Text>}
          <View style={s.footerRow}>
            <Pressable onPress={next} disabled={saving} hitSlop={10} style={s.skip}>
              <Text style={s.skipText}>Skip for now</Text>
            </Pressable>
            <Pressable
              onPress={next}
              disabled={!canContinue(step) || saving}
              accessibilityRole="button"
              style={[s.continueBtn, (!canContinue(step) || saving) && s.continueDisabled]}
            >
              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={s.continueText}>{isLast ? 'Finish' : 'Continue'}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 3, backgroundColor: colors.primarySoft, marginHorizontal: spacing.lg, marginTop: 8, borderRadius: 2 },
  progressFill: { height: 3, backgroundColor: C.primary, borderRadius: 2 },
  backBtn: { width: MIN_TAP, height: MIN_TAP, justifyContent: 'center', marginLeft: 8 },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 36, color: C.text },
  subtitle: { marginTop: spacing.sm, fontFamily: fonts.regular, fontSize: 14, color: C.muted },
  groupTitle: { fontFamily: fonts.semibold, fontSize: 15, color: C.text, marginBottom: 6 },
  footer: { paddingHorizontal: spacing.lg, paddingTop: 8, paddingBottom: 8 },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  skip: { minHeight: MIN_TAP, justifyContent: 'center', paddingRight: 16 },
  skipText: { color: C.primary, fontFamily: fonts.semibold, fontSize: 14 },
  continueBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: C.primary, borderRadius: radius.pill, height: 48, paddingHorizontal: spacing.xxl, minWidth: 140,
    ...shadow.button,
  },
  continueDisabled: { backgroundColor: colors.disabled, shadowOpacity: 0, elevation: 0 },
  continueText: { color: '#FFFFFF', fontFamily: fonts.semibold, fontSize: 15 },
  error: { color: colors.danger, fontFamily: fonts.regular, fontSize: 13, marginBottom: 8 },
});