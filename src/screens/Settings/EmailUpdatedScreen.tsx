import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ActionButton from '../../components/settings/ActionButton';
import { S } from '../../components/settings/SettingsUI';
import { settingsFonts } from '../../theme';

export default function EmailUpdatedScreen({ navigation, route }: any) {
  const adding = route.params?.mode === 'add';

  const backToAccount = () =>
    navigation.popTo
      ? navigation.popTo('Account') // React Navigation 7: go back to the open Account screen
      : navigation.navigate('Account'); // older versions: navigate already goes back

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <View style={styles.body}>
          <View style={styles.glow}>
            <View style={styles.circle}>
              <Ionicons name="checkmark" size={28} color="#fff" />
            </View>
          </View>
          <Text style={styles.title}>{adding ? 'Secondary Email Added' : 'Email Address Updated'}</Text>
          <Text style={styles.text}>
            {adding ? 'Your secondary email has been added successfully.' : 'Your email address has been changed successfully.'}
          </Text>
        </View>
        <ActionButton title="Back to Account" onPress={backToAccount} style={{ marginBottom: 24 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  wrap: { flex: 1, paddingHorizontal: 20 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  glow: { width: 112, height: 112, borderRadius: 56, backgroundColor: '#E3F6EA', alignItems: 'center', justifyContent: 'center' },
  circle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: settingsFonts.bold, fontSize: 20, color: S.text, marginTop: 28, textAlign: 'center' },
  text: { fontFamily: settingsFonts.regular, fontSize: 13.5, lineHeight: 20, color: S.muted, textAlign: 'center', marginTop: 8, maxWidth: 240 },
});