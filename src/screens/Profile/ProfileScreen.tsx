import React, { useCallback, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Avatar from '../../components/Avatar';
import Card from '../../components/Card';
import Chip from '../../components/Chip';
import MiniStepper from '../../components/Stepper';
import { useAuth } from '../../context/AuthContext';
import { getJourney } from '../../services/journeyApi';
import { useOwnProfile } from '../../services/ownProfile';
import { STAGE_LABELS } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const me = useOwnProfile(); // the signed-in user's own data, not a mock
  const [stages, setStages] = useState<any[]>([]);

  useFocusEffect(useCallback(() => {
    getJourney().then((j) => setStages(j.stages)).catch(() => setStages([]));
  }, []));

  const active = stages.find((s) => s.status === 'active');
  const soon = (what: string) => () => Alert.alert(what, 'This screen is a stretch goal and is not built yet.');
  const dash = (v?: string | number) => (v ? String(v) : '—');

  const menu = [
    { icon: 'person-outline', label: 'View My Profile', onPress: () => navigation.navigate('ProfileDetail', { mode: 'own', profileId: 'u_aanya' }) },
    { icon: 'create-outline', label: 'Edit Profile', onPress: soon('Edit Profile') },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Safety', onPress: soon('Privacy & Safety') },
    { icon: 'ribbon-outline', label: 'Verification', onPress: soon('Verification') },
    { icon: 'settings-outline', label: 'Settings', onPress: soon('Settings') },
    { icon: 'log-out-outline', label: 'Sign out', onPress: signOut },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.top}>
          <View>
            {me.photoUri ? (
              <Image source={{ uri: me.photoUri }} style={styles.photo} accessibilityLabel="Your profile photo" />
            ) : (
              <Avatar size={96} verified />
            )}
            <Pressable style={styles.pencil} onPress={soon('Edit photo')} accessibilityRole="button" accessibilityLabel="Edit photo">
              <Ionicons name="pencil" size={14} color="#fff" />
            </Pressable>
          </View>
          <Text style={styles.name}>{me.name}</Text>
          <Chip label="Profile Active" tone="green" dot />
          {me.bio ? (
            <Text style={styles.bio}>{me.bio}</Text>
          ) : (
            <Text style={[styles.bio, { color: colors.primary }]} onPress={soon('Edit Profile')} accessibilityRole="button">
              Add a short bio so people can get to know you
            </Text>
          )}
        </View>

        <View style={styles.stats}>
          {[['Age', dash(me.age)], ['Gender', dash(me.gender)], ['Height', dash(me.height)]].map(([k, v]) => (
            <Card key={k} style={styles.stat}><Text style={styles.statV}>{v}</Text><Text style={styles.statK}>{k}</Text></Card>
          ))}
        </View>
        <View style={styles.pair}>
          <Pressable style={styles.pairItem} onPress={me.education ? undefined : soon('Edit Profile')}>
            <Ionicons name="school-outline" size={18} color={colors.primary} />
            <Text style={styles.pairText}>{me.education || 'Add education'}</Text>
          </Pressable>
          <Pressable style={styles.pairItem} onPress={me.profession ? undefined : soon('Edit Profile')}>
            <Ionicons name="briefcase-outline" size={18} color={colors.primary} />
            <Text style={styles.pairText}>{me.profession || 'Add profession'}</Text>
          </Pressable>
        </View>

        <Card style={{ marginVertical: spacing.lg }}>
          <Text style={styles.cardTitle}>My Journey</Text>
          {stages.length > 0 ? (
            <>
              <View style={{ marginVertical: spacing.md }}><MiniStepper stages={stages} size={16} /></View>
              <Text style={styles.muted}>{active ? `Now at: ${STAGE_LABELS[active.key as keyof typeof STAGE_LABELS]}` : 'Journey not started'}</Text>
            </>
          ) : <Text style={[styles.muted, { marginTop: spacing.sm }]}>Your journey starts when you connect with someone.</Text>}
        </Card>

        <Card style={{ paddingVertical: 0 }}>
          {menu.map((m, i) => (
            <Pressable key={m.label} onPress={m.onPress} style={[styles.menuRow, i > 0 && styles.menuBorder]} accessibilityRole="button" accessibilityLabel={m.label}>
              <Ionicons name={m.icon as any} size={22} color={m.label === 'Sign out' ? colors.danger : colors.primary} />
              <Text style={[styles.menuText, m.label === 'Sign out' && { color: colors.danger }]}>{m.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xxl },
  top: { alignItems: 'center', gap: spacing.sm },
  photo: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primarySoft },
  pencil: { position: 'absolute', right: 0, bottom: 0, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.bg },
  name: { fontFamily: fonts.display, fontSize: 26, color: colors.text, marginTop: spacing.sm },
  bio: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, textAlign: 'center', lineHeight: 19, paddingHorizontal: spacing.lg },
  stats: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.sm },
  statV: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  statK: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2 },
  pair: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  pairItem: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radius.pill, paddingHorizontal: spacing.lg, minHeight: 44 },
  pairText: { fontFamily: fonts.medium, fontSize: 13, color: colors.primaryDark, marginLeft: spacing.sm, flex: 1 },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted },
  menuRow: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
  menuBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  menuText: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.text, marginLeft: spacing.md },
});