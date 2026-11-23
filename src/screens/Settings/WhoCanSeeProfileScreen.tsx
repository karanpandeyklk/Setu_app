import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

const OPTIONS = [
  { key: 'everyone', title: 'Everyone', sub: 'Anyone on Sambandh Setu' },
  { key: 'matching', title: 'People matching my preferences', sub: 'Only profiles that meet your preferences' },
  { key: 'connected', title: 'Connected people only', sub: 'Only people you have accepted' },
  { key: 'selected', title: 'Selected people', sub: 'Only people I choose' },
];

export default function WhoCanSeeProfileScreen({ navigation }: any) {
  const [sel, setSel] = useState('matching');

  const save = () => {
    // TODO: save to the backend once the privacy settings endpoint is confirmed
    navigation.goBack();
  };

  return (
    <SettingsScreenLayout title="Who can see my profile?" subtitle="Choose who can view your profile in Discover." bg="#F7F8FC" onBack={() => navigation.goBack()}>
      <View style={{ flex: 1 }}>
        <View style={{ paddingTop: 16, gap: 8 }}>
          {OPTIONS.map((o) => {
            const on = o.key === sel;
            return (
              <Pressable key={o.key} style={[styles.option, on && styles.optionOn]} onPress={() => setSel(o.key)} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={o.title}>
                <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.dot} />}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{o.title}</Text>
                  <Text style={styles.sub}>{o.sub}</Text>
                </View>
              </Pressable>
            );
          })}
          <View style={styles.info}>
            <View style={styles.infoIcon}><Ionicons name="help" size={14} color={S.primary} /></View>
            <Text style={styles.infoText}>You can change this setting anytime from Privacy & Visibility.</Text>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <ActionButton title="Continue" onPress={save} style={{ marginBottom: 24 }} />
      </View>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: 'transparent' },
  optionOn: { backgroundColor: '#EEF4FF', borderColor: '#DBE7FF' },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioOn: { borderColor: S.primary },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: S.primary },
  title: { fontSize: 13.5, fontWeight: '700', color: S.text },
  sub: { fontSize: 11.5, color: '#64748B', marginTop: 2 },
  info: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: '#EAF1FF', marginTop: 8 },
  infoIcon: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#D9E6FF', alignItems: 'center', justifyContent: 'center' },
  infoText: { flex: 1, fontSize: 11, color: '#475569' },
});