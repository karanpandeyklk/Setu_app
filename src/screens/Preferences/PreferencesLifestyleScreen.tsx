import React from 'react';
import PreferenceScaffold from '../../components/PreferenceScaffold';
import PrefRowList, { RowDef } from '../../components/PrefRowList';
import { exitToProfile, usePrefSection } from './usePrefSection';

const ROWS: RowDef[] = [
  { key: 'food', title: 'Food Habits', icon: 'restaurant-outline', tint: '#7C3AED', bg: '#F3E8FF', options: ['Any', 'Vegetarian', 'Non-vegetarian', 'Eggetarian', 'Vegan', 'Jain'] },
  { key: 'smoking', title: 'Smoking', icon: 'cloud-outline', tint: '#0EA5E9', bg: '#E0F2FE', options: ['Any', 'No', 'Occasionally', 'Yes'] },
  { key: 'drinking', title: 'Drinking', icon: 'wine-outline', tint: '#F97316', bg: '#FFEDD5', options: ['Any', 'No', 'Occasionally', 'Regularly'] },
  { key: 'fitness', title: 'Fitness & Activity', icon: 'stopwatch-outline', tint: '#8B5CF6', bg: '#EDE9FE', options: ['Any', 'Active lifestyle', 'Moderately active', 'Not very active'] },
  { key: 'travel', title: 'Travel', icon: 'airplane-outline', tint: '#2563EB', bg: '#DBEAFE', options: ['Any', 'Loves travel', 'Travels sometimes', 'Prefers staying home'] },
  {
    key: 'hobbies', title: 'Hobbies & Interests', icon: 'pricetag-outline', tint: '#16A34A', bg: '#DCFCE7', multi: true, exclusive: 'Any', maxSelect: 6,
    options: ['Any', 'Reading', 'Music', 'Movies', 'Cooking', 'Sports', 'Art', 'Gaming', 'Photography', 'Gardening', 'Volunteering'],
  },
];

export default function PreferencesLifestyleScreen({ navigation }: any) {
  const { values, set, busy, error, loading, save } = usePrefSection('lifestyle');

  return (
    <PreferenceScaffold
      title="Lifestyle Preferences"
      subtitle="Choose lifestyle preferences that are important to you."
      loading={loading}
      busy={busy}
      error={error}
      onBack={() => navigation.goBack()}
      onNext={() => save('next', () => navigation.navigate('PreferencesFamily'))}
      onSaveExit={() => save('exit', () => exitToProfile(navigation))}
    >
      {values && <PrefRowList rows={ROWS} values={values as any} onChange={(k, v) => set(k as any, v as any)} />}
    </PreferenceScaffold>
  );
}