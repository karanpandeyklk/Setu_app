import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S } from '../../components/settings/SettingsUI';
import { settingsFonts } from '../../theme';

export default function ReportSubmittedScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <View style={styles.body}>
          <View style={styles.glow}>
            <Ionicons name="shield-checkmark" size={64} color={S.primary} />
          </View>
          <Text style={styles.title}>Report Submitted</Text>
          <Text style={styles.text}>Thank you for helping keep Sambandh Setu safe.</Text>
          <Text style={[styles.text, { marginTop: 16 }]}>We&apos;ll review your report and take appropriate action.</Text>
        </View>
        <ActionButton title="Done" onPress={() => navigation.popTo('Settings')} />
        <ActionButton title="Back to Report & Safety" onPress={() => navigation.popTo('SafetyResources')} style={{ marginTop: 12, marginBottom: 24 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  wrap: { flex: 1, paddingHorizontal: 20 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  glow: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#EAF1FF', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: settingsFonts.bold, fontSize: 22, color: S.text, marginTop: 28, textAlign: 'center' },
  text: { fontFamily: settingsFonts.regular, fontSize: 13.5, lineHeight: 20, color: S.muted, textAlign: 'center', marginTop: 10, maxWidth: 260 },
});