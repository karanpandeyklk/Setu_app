import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Row, S, SectionLabel } from '../../components/settings/SettingsUI';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen({ navigation }: any) {
  const auth = useAuth() as any;
  // Uses whichever logout function your AuthContext exposes
  const logout = auth.signOut ?? auth.logout ?? auth.signout;
  const go = (name: string) => () => navigation.navigate(name);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: S.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={{ marginTop: 8 }}>
          <Ionicons name="chevron-back" size={20} color={S.muted} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.sub}>Manage your account, privacy and app preferences.</Text>

        <SectionLabel>ACCOUNT</SectionLabel>
        <Card>
          <Row icon="person" title="Account" subtitle="Personal information, phone & email" onPress={go('Account')} />
          <Row icon="lock-closed" title="Password & Security" subtitle="Change password, security settings" onPress={go('PasswordSecurity')} last />
        </Card>

        <SectionLabel>PRIVACY & SAFETY</SectionLabel>
        <Card>
          <Row icon="shield-checkmark" title="Privacy & Visibility" subtitle="Control who can see your profile" onPress={go('PrivacyVisibility')} />
          <Row icon="compass" title="Discovery" subtitle="Control how you appear in Discover" onPress={go('DiscoverySettings')} />
          <Row icon="ban" title="Blocked Users" subtitle="Manage blocked accounts" tint={S.danger} tintBg="#FDE2E2" onPress={go('BlockedUsers')} />
          <Row icon="checkmark-circle" title="Verification" subtitle="View your verification status" tint="#16A34A" tintBg="#DCFCE7" onPress={go('Verification')} last />
        </Card>

        <SectionLabel>SETU & AI</SectionLabel>
        <Card>
          <Row icon="sparkles" title="Setu Guide" subtitle="Manage your AI companion settings" tint="#7C3AED" tintBg="#EDE9FE" onPress={go('SetuGuideSettings')} />
          <Row icon="hardware-chip" title="AI & Privacy" subtitle="Control what AI can access" onPress={go('AIPrivacy')} last />
        </Card>

        <SectionLabel>PREFERENCES</SectionLabel>
        <Card>
          <Row icon="notifications" title="Notifications" subtitle="Manage your notification preferences" tint="#F59E0B" tintBg="#FEF3C7" onPress={go('NotificationSettings')} />
          <Row icon="chatbubble-ellipses" title="Chat" subtitle="Chat settings and privacy" onPress={go('ChatSettings')} />
          <Row icon="globe" title="Language" subtitle="Choose your preferred language" onPress={go('Language')} />
          <Row icon="moon" title="Appearance" subtitle="Light or dark mode" tint={S.text} tintBg="#E2E8F0" onPress={go('Appearance')} last />
        </Card>

        <SectionLabel>SUPPORT</SectionLabel>
        <Card>
          <Row icon="help-circle" title="Help & Support" subtitle="FAQs, contact us, and support resources" tint="#0D9488" tintBg="#CCFBF1" onPress={go('Help')} />
          <Row icon="information-circle" title="About Sambandh Setu" subtitle="Version, terms, privacy policy" tint="#7C3AED" tintBg="#EDE9FE" onPress={go('About')} last />
        </Card>

        <Card style={{ marginTop: 20, backgroundColor: S.dangerSoft }}>
          <Row icon="log-out-outline" title="Log Out" danger onPress={() => logout?.()} last />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: S.text, marginTop: 12 },
  sub: { fontSize: 13, color: S.muted, marginTop: 4 },
});