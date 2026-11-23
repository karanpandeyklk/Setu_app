import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsScreenLayout } from '../../components/settings/SettingsUI';
import OptionList from '../../components/settings/OptionList';

const KEY = 'app_language';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिन्दी', subtitle: 'Hindi' },
  { value: 'bn', label: 'বাংলা', subtitle: 'Bengali' },
  { value: 'mr', label: 'मराठी', subtitle: 'Marathi' },
  { value: 'ta', label: 'தமிழ்', subtitle: 'Tamil' },
  { value: 'te', label: 'తెలుగు', subtitle: 'Telugu' },
  { value: 'gu', label: 'ગુજરાતી', subtitle: 'Gujarati' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ', subtitle: 'Punjabi' },
];

export default function LanguageScreen({ navigation }: any) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => v && setLang(v)).catch(() => {});
  }, []);

  const choose = (v: string) => {
    setLang(v);
    AsyncStorage.setItem(KEY, v).catch(() => {});
  };

  return (
    <SettingsScreenLayout
      title="Language"
      subtitle="Choose your preferred language."
      bg="#EEF3FF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 32 }}>
        <OptionList options={LANGUAGES} selected={lang} onSelect={choose} />
      </ScrollView>
    </SettingsScreenLayout>
  );
}