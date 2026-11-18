import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PickerModal from '../../components/PickerModal';
import PreferenceScaffold from '../../components/PreferenceScaffold';
import RadioGroup from '../../components/RadioGroup';
import RangeSlider from '../../components/RangeSlider';
import SelectField from '../../components/SelectField';
import { AGE_MAX, AGE_MIN, CITIES, HEIGHTS, LOCATION_OPTIONS } from '../../services/preferencesStore';
import { colors, fonts } from '../../theme';
import { exitToProfile, usePrefSection } from './usePrefSection';

export default function PreferencesBasicScreen({ navigation }: any) {
  const { values, set, busy, error, loading, save } = usePrefSection('basic');
  const [cityOpen, setCityOpen] = useState(false);

  const specific = values?.locationPref === 'Prefer specific cities';
  const needCities = specific && (values?.cities.length ?? 0) === 0;

  return (
    <PreferenceScaffold
      title="Basic Preferences"
      subtitle="Set the basic details you are looking for."
      loading={loading}
      busy={busy}
      error={error}
      nextDisabled={needCities}
      onBack={() => navigation.goBack()}
      onNext={() => save('next', () => navigation.navigate('PreferencesBasic2'))}
      onSaveExit={() => save('exit', () => exitToProfile(navigation))}
    >
      {values && (
        <>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Age Range</Text>
            <Text style={styles.ageValue}>{values.ageMin} – {values.ageMax} years</Text>
          </View>
          <RangeSlider
            min={AGE_MIN}
            max={AGE_MAX}
            low={values.ageMin}
            high={values.ageMax}
            onChange={(lo, hi) => { set('ageMin', lo); set('ageMax', hi); }}
          />

          <SelectField label="Height" value={values.height} options={HEIGHTS} onChange={(v) => set('height', v)} />

          <Text style={[styles.label, { marginTop: 22, marginBottom: 4 }]}>Location</Text>
          <RadioGroup
            options={LOCATION_OPTIONS}
            value={values.locationPref}
            onChange={(v) => { set('locationPref', v); if (v === 'Prefer specific cities') setCityOpen(true); }}
            trailing={{ 'Prefer specific cities': <Ionicons name="chevron-forward" size={16} color={colors.muted} /> }}
          />
          {specific && (
            <Text style={[styles.cities, needCities && { color: '#B45309' }]} onPress={() => setCityOpen(true)} accessibilityRole="button">
              {values.cities.length ? values.cities.join(', ') : 'Choose at least 1 city'}
            </Text>
          )}

          <PickerModal
            visible={cityOpen}
            title="Preferred cities"
            options={CITIES}
            selected={values.cities}
            multi
            maxSelect={5}
            onClose={() => setCityOpen(false)}
            onDone={(s) => { set('cities', s); setCityOpen(false); }}
          />
        </>
      )}
    </PreferenceScaffold>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  ageValue: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted },
  cities: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary, marginLeft: 30, paddingVertical: 6 },
});