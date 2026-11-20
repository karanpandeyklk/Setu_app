import React from 'react';
import { StyleSheet, Text } from 'react-native';
import PreferenceScaffold from '../../components/PreferenceScaffold';
import RadioGroup from '../../components/RadioGroup';
import SelectField from '../../components/SelectField';
import { EDUCATION, MARITAL, PROFESSIONS, WORK_MODES } from '../../services/preferencesStore';
import { colors, fonts } from '../../theme';
import { exitToProfile, usePrefSection } from './usePrefSection';

export default function PreferencesBasic2Screen({ navigation }: any) {
  const { values, set, busy, error, loading, save } = usePrefSection('basic');

  return (
    <PreferenceScaffold
      title="Basic Preferences"
      loading={loading}
      busy={busy}
      error={error}
      onBack={() => navigation.goBack()}
      onNext={() => save('next', () => navigation.navigate('PreferencesLifestyle'))}
      onSaveExit={() => save('exit', () => exitToProfile(navigation))}
    >
      {values && (
        <>
          <SelectField label="Education" value={values.education} options={EDUCATION} onChange={(v) => set('education', v)} />
          <SelectField label="Profession" value={values.profession} options={PROFESSIONS} onChange={(v) => set('profession', v)} />

          <Text style={styles.label}>Work Mode</Text>
          <RadioGroup options={WORK_MODES} value={values.workMode} onChange={(v) => set('workMode', v)} columns={3} />

          <SelectField label="Marital Status" value={values.maritalStatus} options={MARITAL} onChange={(v) => set('maritalStatus', v)} />
        </>
      )}
    </PreferenceScaffold>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text, marginTop: 22, marginBottom: 4 },
});