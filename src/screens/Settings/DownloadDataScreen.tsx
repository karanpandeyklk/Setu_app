import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomButton from '../../components/settings/BottomButton';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { useAuth } from '../../context/AuthContext';

const INCLUDED = ['Profile information', 'Your preferences', 'Your connections (if any)', 'Your chats (if permitted)', 'Your Setu Journey data (if permitted)'];

export default function DownloadDataScreen({ navigation }: any) {
  const { user } = useAuth() as any;
  const email = user?.email ?? 'aanya.k@example.com';

  const request = () => {
    // TODO: call your backend export endpoint, then show the confirmation
    navigation.navigate('DataRequestSubmitted', { email });
  };

  return (
    <SettingsScreenLayout title="Download Your Data" subtitle="We'll prepare a copy of your data to download." bg="#F7F8FC" onBack={() => navigation.goBack()}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 110 }}>
        <Text style={styles.heading}>INCLUDED IN YOUR DATA:</Text>
        {INCLUDED.map((t) => (
          <View key={t} style={styles.item}>
            <View style={styles.check}><Ionicons name="checkmark" size={12} color="#fff" /></View>
            <Text style={styles.itemText}>{t}</Text>
          </View>
        ))}

        <View style={styles.info}>
          <View style={styles.infoIcon}><Ionicons name="information" size={12} color="#fff" /></View>
          <Text style={styles.infoText}>You&apos;ll receive a download link via email. This may take a few minutes.</Text>
        </View>
      </ScrollView>
      <BottomButton title="Request Data" onPress={request} />
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: S.label, marginTop: 12, marginBottom: 12 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  check: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  itemText: { fontSize: 13, color: S.text },
  info: { flexDirection: 'row', gap: 10, backgroundColor: S.primarySoft, borderRadius: 14, padding: 14, marginTop: 16 },
  infoIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  infoText: { flex: 1, fontSize: 12, color: S.muted, lineHeight: 18 },
});