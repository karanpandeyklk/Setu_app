import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, fonts, spacing } from '../../theme';

export default function FamilyRemovedScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <View style={styles.ring}><View style={styles.circle}><Ionicons name="checkmark" size={40} color="#fff" /></View></View>
        <Text style={styles.title}>Family Member{'\n'}Removed</Text>
        <Text style={styles.sub}>This family member no longer has access to your profile.</Text>
      </View>
      <Button title="Done" onPress={() => navigation.navigate('Main', { screen: 'Profile' })} />
      <Button title="Back to Family Access" variant="outline" onPress={() => navigation.navigate('FamilyAccess')} style={{ marginTop: spacing.md }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.lg },
  ring: { width: 150, height: 150, borderRadius: 75, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 30, color: colors.text, textAlign: 'center', marginTop: spacing.xl },
  sub: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
});