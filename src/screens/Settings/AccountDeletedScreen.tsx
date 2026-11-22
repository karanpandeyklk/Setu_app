import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomButton from '../../components/settings/BottomButton';
import { S } from '../../components/settings/SettingsUI';
import { useAuth } from '../../context/AuthContext';
import { settingsFonts } from '../../theme';

export default function AccountDeletedScreen() {
  const auth = useAuth() as any;
  const logout = auth.signOut ?? auth.logout ?? auth.signout;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <View style={styles.body}>
          <View style={styles.glow}>
            <View style={styles.circle}>
              <Ionicons name="trash-outline" size={30} color="#DC2626" />
            </View>
          </View>
          <Text style={styles.title}>Your Account Has Been Deleted</Text>
          <Text style={styles.text}>Your account and all associated data have been permanently removed.</Text>
        </View>
        {/* Signing out switches the app back to the Welcome screen */}
        <BottomButton title="Back to Accounts  →" onPress={() => logout?.()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  wrap: { flex: 1, paddingHorizontal: 20 },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  glow: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#FDECEC', alignItems: 'center', justifyContent: 'center' },
  circle: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#FFF5F4', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: settingsFonts.bold, fontSize: 16, color: S.text, marginTop: 22, textAlign: 'center' },
  text: { fontFamily: settingsFonts.regular, fontSize: 12, color: S.muted, textAlign: 'center', lineHeight: 18, marginTop: 8 },
});