import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, fonts, spacing } from '../../theme';

export default function ReflectDoneScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.circle}><Ionicons name="checkmark" size={44} color="#fff" /></View>
        <Text style={styles.title}>Reflect complete</Text>
        <Text style={styles.sub}>Nice work. Discuss is now unlocked, so you can talk through what matters to each of you.</Text>
      </View>
      <View style={{ padding: spacing.lg }}>
        <Button title="Done" onPress={() => navigation.navigate('Main', { screen: 'Journey' })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  circle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text, marginTop: spacing.xl },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: spacing.sm, lineHeight: 21 },
});