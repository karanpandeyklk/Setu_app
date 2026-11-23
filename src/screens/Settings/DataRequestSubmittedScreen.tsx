import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomButton from '../../components/settings/BottomButton';
import { S } from '../../components/settings/SettingsUI';

export default function DataRequestSubmittedScreen({ navigation, route }: any) {
  const email: string = route.params?.email ?? 'your email';
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>
        <View style={styles.circle}>
          <Ionicons name="document-text" size={36} color={S.primary} />
          <View style={styles.badge}><Ionicons name="checkmark" size={12} color="#fff" /></View>
        </View>
        <Text style={styles.title}>Data Request Submitted</Text>
        <Text style={styles.text}>We're preparing your data. You'll receive a download link at {email}</Text>
      </View>
      <View style={{ paddingHorizontal: 20, height: 70 }}>
        <BottomButton
  title="Back to account"
  onPress={() => (navigation.popTo ? navigation.popTo('Account') : navigation.navigate('Account'))}
/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  circle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#DCEBFF', alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', right: 4, bottom: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  title: { fontSize: 18, fontWeight: '800', color: S.text, marginTop: 20 },
  text: { fontSize: 13, color: S.muted, textAlign: 'center', lineHeight: 19, marginTop: 8 },
});