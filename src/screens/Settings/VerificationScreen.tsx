import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { S, SettingsScreenLayout } from '../../components/settings/SettingsUI';

type Status = 'verified' | 'start' | 'optional';

function VerifyCard({ icon, title, subtitle, status, onPress }: {
  icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; status: Status; onPress?: () => void;
}) {
  const ok = status === 'verified';
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, ok && { backgroundColor: '#DCFCE7' }]}>
        <Ionicons name={icon} size={18} color={ok ? '#16A34A' : '#64748B'} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub} numberOfLines={1}>{subtitle}</Text>
      </View>
      {status === 'verified' && <View style={styles.verifiedPill}><Text style={styles.verifiedText}>Verified</Text></View>}
      {status === 'start' && (
        <Pressable style={styles.startBtn} onPress={onPress}><Text style={styles.startText}>Start</Text></Pressable>
      )}
      {status === 'optional' && <View style={styles.optionalPill}><Text style={styles.optionalText}>Optional</Text></View>}
    </View>
  );
}

export default function VerificationScreen({ navigation }: any) {
  return (
    <SettingsScreenLayout
      title="Verification"
      subtitle="Build trust and show verified information on your profile."
      bg="#FFFFFF"
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingBottom: 110 }}>
        <View style={styles.banner}>
          <View style={styles.bannerIcon}><Ionicons name="shield-checkmark" size={20} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Partially verified</Text>
            <Text style={styles.bannerText}>Complete more verification levels to show more verified information on your profile.</Text>
          </View>
        </View>

        <VerifyCard icon="shield-checkmark" title="Identity Verification" subtitle="Verify your identity with a government ID" status="verified" />
        <VerifyCard icon="briefcase" title="Professional Verification" subtitle="Verify your professional information" status="start"
          onPress={() => navigation.navigate('ProfessionalVerification')} />
        <VerifyCard icon="shield-half" title="Additional Verification" subtitle="Optionally verify more information" status="optional" />

        <View style={styles.info}>
          <View style={styles.infoIcon}><Ionicons name="information" size={12} color="#fff" /></View>
          <Text style={styles.infoText}>
            Verification confirms completion of a verification process; it does not guarantee a person's character, intentions, or safety.{' '}
            <Text style={{ color: S.primary, fontWeight: '700' }}>Learn more</Text>
          </Text>
        </View>
      </ScrollView>

      <Pressable style={styles.continue} onPress={() => navigation.goBack()}>
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', gap: 12, backgroundColor: '#EFF5FF', borderWidth: 1, borderColor: '#DCE8FF', borderRadius: 16, padding: 14, marginBottom: 14 },
  bannerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: S.text },
  bannerText: { fontSize: 12, color: S.muted, marginTop: 2, lineHeight: 17 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#EDF1F8', borderRadius: 16, padding: 14, marginBottom: 12,
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '700', color: S.text },
  rowSub: { fontSize: 11.5, color: S.muted, marginTop: 2 },
  verifiedPill: { backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  verifiedText: { fontSize: 11, fontWeight: '600', color: '#16A34A' },
  startBtn: { backgroundColor: S.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 7 },
  startText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  optionalPill: { backgroundColor: '#F1F5F9', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  optionalText: { fontSize: 11, color: S.muted },
  info: { flexDirection: 'row', gap: 10, backgroundColor: '#EFF5FF', borderWidth: 1, borderColor: '#DCE8FF', borderRadius: 16, padding: 14, marginTop: 8 },
  infoIcon: { width: 18, height: 18, borderRadius: 9, backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  infoText: { flex: 1, fontSize: 11.5, color: S.muted, lineHeight: 19 },
  continue: {
    position: 'absolute', left: 0, right: 0, bottom: 16, height: 54, borderRadius: 27,
    backgroundColor: S.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: S.primary, shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6,
  },
  continueText: { fontSize: 16, fontWeight: '700', color: '#fff' },
});