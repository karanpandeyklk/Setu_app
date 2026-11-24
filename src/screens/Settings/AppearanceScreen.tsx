import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsScreenLayout } from '../../components/settings/SettingsUI';
import OptionList from '../../components/settings/OptionList';

const KEY = 'app_appearance';

const MODES = [
  { value: 'light', label: 'Light', subtitle: 'Always use the light theme' },
  { value: 'dark', label: 'Dark', subtitle: 'Always use the dark theme' },
  { value: 'system', label: 'System default', subtitle: 'Match your device setting' },
];

export default function AppearanceScreen({ navigation }: any) {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => v && setMode(v)).catch(() => {});
  }, []);

  const choose = (v: string) => {
    setMode(v);
    AsyncStorage.setItem(KEY, v).catch(() => {});
  };

  return (
    <SettingsScreenLayout
      title="Appearance"
      subtitle="Choose how Sambandh Setu looks on your device."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <OptionList options={MODES} selected={mode} onSelect={choose} />
      </ScrollView>
    </SettingsScreenLayout>
  );
}