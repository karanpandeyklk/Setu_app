import React from 'react';
import PreferenceScaffold from '../../components/PreferenceScaffold';
import PrefRowList, { RowDef } from '../../components/PrefRowList';
import { exitToProfile, usePrefSection } from './usePrefSection';

const ROWS: RowDef[] = [
  { key: 'familyType', title: 'Family Type', icon: 'people-outline', tint: '#F43F5E', bg: '#FFE4E6', options: ['Any', 'Nuclear Family', 'Joint Family'] },
  { key: 'caste', title: 'Caste Preference', icon: 'triangle-outline', tint: '#2563EB', bg: '#DBEAFE', options: ['Any', 'Same as mine', 'Prefer not to say'] },
  { key: 'familyLocation', title: 'Family Location', icon: 'location-outline', tint: '#8B5CF6', bg: '#EDE9FE', options: ['Open (India / Abroad)', 'India only', 'Same city', 'Abroad'] },
  { key: 'familyValues', title: 'Family Values', icon: 'grid-outline', tint: '#F97316', bg: '#FFEDD5', options: ['Any', 'Traditional', 'Traditional with modern outlook', 'Modern'] },
  { key: 'familyInvolvement', title: 'Family Involvement', icon: 'layers-outline', tint: '#16A34A', bg: '#DCFCE7', options: ['From the beginning', 'After mutual understanding', 'Only at the final stage', 'Not needed'] },
];

export default function PreferencesFamilyScreen({ navigation }: any) {
  const { values, set, busy, error, loading, save } = usePrefSection('family');

  return (
    <PreferenceScaffold
      title="Family Preferences"
      subtitle="Tell us about the kind of family background you prefer."
      loading={loading}
      busy={busy}
      error={error}
      onBack={() => navigation.goBack()}
      // Next saves, then opens the Values & Outlook screen
      onNext={() => save('next', () => navigation.navigate('PreferencesValues'))}
      onSaveExit={() => save('exit', () => exitToProfile(navigation))}
    >
      {values && <PrefRowList rows={ROWS} values={values as any} onChange={(k, v) => set(k as any, v as any)} valueBelow />}
    </PreferenceScaffold>
  );
}