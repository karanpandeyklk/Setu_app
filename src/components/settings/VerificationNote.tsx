import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { S } from './SettingsUI';
import { settingsFonts } from '../../theme';

export default function VerificationNote({ channel = 'email' }: { channel?: 'email' | 'sms' }) {
  return (
    <View style={styles.note}>
      <View style={styles.shield}>
        <Ionicons name="shield" size={20} color={S.primary} />
        <Text style={styles.bang}>!</Text>
      </View>
      <Text style={styles.text}>
        You will receive a 6-digit verification code via {channel === 'sms' ? 'SMS' : 'email'}.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  note: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 16,
    backgroundColor: '#EEF3FD', borderWidth: 1, borderColor: '#DCE6F9', borderRadius: 12,
    paddingVertical: 14, paddingHorizontal: 14,
  },
  shield: { width: 20, height: 22, alignItems: 'center', justifyContent: 'center' },
  bang: { position: 'absolute', top: 4, fontFamily: settingsFonts.bold, fontSize: 10, lineHeight: 12, color: '#fff' },
  text: { flex: 1, fontFamily: settingsFonts.regular, fontSize: 12, lineHeight: 17, color: S.muted },
});