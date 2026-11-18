import React from 'react';
import PreferenceScaffold from '../../components/PreferenceScaffold';
import PrefRowList, { RowDef } from '../../components/PrefRowList';
import { exitToProfile, usePrefSection } from './usePrefSection';
import {
  LIFE_GOALS, FINANCIAL_OUTLOOKS, BELIEFS, PERSONALITY_OPTIONS, EMOTIONAL_MATURITY,
} from '../../services/preferencesStore';

// One row per line in the Figma "Values & Outlook" screen
const ROWS: RowDef[] = [
  { key: 'lifeGoals', title: 'Life Goals', icon: 'compass-outline', tint: '#2563EB', bg: '#DBEAFE', options: LIFE_GOALS },
  { key: 'financialOutlook', title: 'Financial Outlook', icon: 'briefcase-outline', tint: '#16A34A', bg: '#DCFCE7', options: FINANCIAL_OUTLOOKS },
  { key: 'beliefs', title: 'Beliefs & Practices', icon: 'sparkles-outline', tint: '#8B5CF6', bg: '#EDE9FE', options: BELIEFS },
  { key: 'personality', title: 'Personality & Communication', icon: 'chatbubbles-outline', tint: '#F97316', bg: '#FFEDD5', options: PERSONALITY_OPTIONS },
  { key: 'emotionalMaturity', title: 'Emotional Maturity', icon: 'shield-checkmark-outline', tint: '#2563EB', bg: '#DBEAFE', options: EMOTIONAL_MATURITY },
];

export default function PreferencesValuesScreen({ navigation }: any) {
  const { values, set, busy, error, loading, save } = usePrefSection('values');

  return (
    <PreferenceScaffold
      title="Values & Outlook"
      subtitle="Select what matters to you for a long-term compatible relationship."
      loading={loading}
      busy={busy}
      error={error}
      onBack={() => navigation.goBack()}
      // Additional Preferences isn't built yet, so Next saves and returns to the Preferences tab for now.
      // When it exists, change to: save('next', () => navigation.navigate('PreferencesAdditional'))
      onNext={() => save('next', () => exitToProfile(navigation))}
      onSaveExit={() => save('exit', () => exitToProfile(navigation))}
    >
      {values && <PrefRowList rows={ROWS} values={values as any} onChange={(k, v) => set(k as any, v as any)} />}
    </PreferenceScaffold>
  );
}