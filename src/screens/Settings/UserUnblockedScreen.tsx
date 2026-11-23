import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S } from '../../components/settings/SettingsUI';
import { settingsFonts } from '../../theme';

export default function UserUnblockedScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <View style={styles.body}>
          <View style={styles.glow}>
            <View style={styles.circle}><Ionicons name="checkmark" size={30} color="#fff" /></View>
          </View>
          <Text style={styles.title}>User Unblocked</Text>
          <Text style={styles.text}>This user has been unblocked successfully.</Text>
        </View>
        <ActionButton title="Done" onPress={() => navigation.popTo('Settings')} />
        <Pressable style={styles.secondary} onPress={() => navigation.popTo('BlockedUsers')} accessibilityRole="button">
          <Text style={styles.secondaryText}>Back to Blocked Users</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  wrap: { flex: 1, paddingHorizontal: 20 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  glow: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#E3F6EA', alignItems: 'center', justifyContent: 'center' },
  circle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: settingsFonts.bold, fontSize: 22, color: S.text, marginTop: 28 },
  text: { fontFamily: settingsFonts.regular, fontSize: 13.5, lineHeight: 20, color: S.muted, textAlign: 'center', marginTop: 10, maxWidth: 240 },
  secondary: { height: 48, borderRadius: 12, backgroundColor: '#EEF3FD', alignItems: 'center', justifyContent: 'center', marginTop: 12, marginBottom: 24 },
  secondaryText: { fontSize: 14, fontWeight: '700', color: S.primary },
});