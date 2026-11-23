import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { S } from './SettingsUI';
import { settingsFonts } from '../../theme';

type Props = { title: string; subtitle?: React.ReactNode; onBack: () => void };

// Back arrow, with the title beside it and the subtitle under the title (as in the Figma)
export default function TitleBar({ title, subtitle, onBack }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        style={styles.back}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="arrow-back" size={22} color={S.text} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.sub}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 12 },
  back: { width: 28, height: 30, justifyContent: 'center', marginRight: 12 },
  title: { fontFamily: settingsFonts.bold, fontSize: 20, lineHeight: 30, color: S.text },
  sub: { fontFamily: settingsFonts.regular, fontSize: 12, lineHeight: 17, color: S.muted, marginTop: 2 },
});