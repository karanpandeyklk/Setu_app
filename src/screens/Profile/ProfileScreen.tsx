import React, { useCallback, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { getJourney } from '../../services/journeyApi';
import { useOwnProfile } from '../../services/ownProfile';
import { STAGE_LABELS } from '../../services/mockData';
import { colors, fonts, radius, spacing } from '../../theme';

const SOFT_BORDER = '#D6E4FC';

// small card: icon on the left, value + label on the right (age, gender, height, education, profession)
function InfoCard({ icon, value, label, placeholder, onPress, flex = 1 }: {
  icon: string; value?: string; label: string; placeholder?: string; onPress?: () => void; flex?: number;
}) {
  const empty = !value;
  return (
    <Pressable
      style={[styles.info, { flex }]}
      onPress={empty ? onPress : undefined}
      disabled={!empty || !onPress}
      accessibilityRole={empty && onPress ? 'button' : 'text'}
      accessibilityLabel={`${label}: ${value || placeholder || 'not set'}`}
    >
      <Ionicons name={icon as any} size={20} color={colors.primary} />
      <View style={{ marginLeft: spacing.sm, flex: 1 }}>
        <Text style={[styles.infoValue, empty && { color: colors.primary }]} numberOfLines={1}>{value || placeholder || '—'}</Text>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const me = useOwnProfile(); // the signed-in user's own data, not a mock
  const [stageLabel, setStageLabel] = useState('');

  useFocusEffect(useCallback(() => {
    getJourney()
      .then((j) => {
        const a = j.stages.find((s: any) => s.status === 'active');
        setStageLabel(a ? STAGE_LABELS[a.key as keyof typeof STAGE_LABELS] : '');
      })
      .catch(() => setStageLabel(''));
  }, []));

  const soon = (what: string) => () => Alert.alert(what, 'This screen is a stretch goal and is not built yet.');
  const edit = () => navigation.navigate('EditProfile');
  const photo = me.photoUri || (user as any)?.avatar; // a photo chosen in Edit Profile, or the one from sign-up

  const menu = [
    { icon: 'person-outline', label: 'View My Profile', onPress: () => navigation.navigate('ProfileDetail', { mode: 'own', profileId: user?.id }) },
    { icon: 'create-outline', label: 'Edit Profile', onPress: edit },
    { icon: 'clipboard-outline', label: 'Privacy & Safety', onPress: soon('Privacy & Safety') },
    { icon: 'shield-checkmark-outline', label: 'Verification', onPress: soon('Verification') },
    { icon: 'settings-outline', label: 'Settings', onPress: soon('Settings') },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>My Profile</Text>
            <Text style={styles.subtitle}>Manage your profile and share what matters to you.</Text>
          </View>
          <Pressable style={styles.iconBtn} onPress={soon('Settings')} accessibilityRole="button" accessibilityLabel="Settings">
            <Ionicons name="settings-outline" size={22} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn} onPress={soon('More options')} accessibilityRole="button" accessibilityLabel="More options">
            <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
          </Pressable>
        </View>

        {/* profile card */}
        <View style={styles.softCard}>
          <View>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} accessibilityLabel="Your profile photo" />
            ) : (
              <View style={[styles.photo, styles.photoEmpty]}><Ionicons name="person" size={40} color={colors.primary} /></View>
            )}
            <Pressable style={styles.photoEdit} onPress={edit} accessibilityRole="button" accessibilityLabel="Edit photo" hitSlop={8}>
              <Ionicons name="pencil" size={13} color={colors.primary} />
            </Pressable>
          </View>

          <View style={styles.identity}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{me.name}{me.age ? `, ${me.age}` : ''}</Text>
              <Pressable onPress={edit} hitSlop={10} accessibilityRole="button" accessibilityLabel="Edit name" style={{ marginLeft: 6 }}>
                <Ionicons name="pencil-outline" size={16} color={colors.primary} />
              </Pressable>
            </View>
            {!!me.profession && <Text style={styles.muted}>{me.profession}</Text>}
            {me.location ? (
              <View style={styles.locRow}>
                <Ionicons name="location-outline" size={14} color={colors.primary} />
                <Text style={[styles.muted, { marginLeft: 4, flex: 1 }]} numberOfLines={1}>{me.location}</Text>
              </View>
            ) : (
              <Text style={[styles.muted, { color: colors.primary }]} onPress={edit} accessibilityRole="button">Add your location</Text>
            )}
            <View style={styles.activeChip}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.activeText}>Profile Active</Text>
              <View style={styles.activeDot} />
            </View>
          </View>
        </View>

        {/* bio */}
        <View style={[styles.softCard, { marginTop: spacing.md, alignItems: 'flex-start' }]}>
          <Text style={styles.quote}>“</Text>
          {me.bio ? (
            <Text style={styles.bio}>{me.bio}</Text>
          ) : (
            <Text style={[styles.bio, { color: colors.primary }]} onPress={edit} accessibilityRole="button">
              Add a short bio so people can get to know you
            </Text>
          )}
          <Pressable onPress={edit} hitSlop={10} accessibilityRole="button" accessibilityLabel="Edit bio">
            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
          </Pressable>
        </View>

        {/* age / gender / height */}
        <View style={styles.infoRow}>
          <InfoCard icon="calendar-outline" value={me.age ? `${me.age} years` : ''} label="Age" placeholder="—" />
          <InfoCard icon="person-outline" value={me.gender} label="Gender" placeholder="—" />
          <InfoCard icon="resize-outline" value={me.height} label="Height" placeholder="Add" onPress={edit} />
        </View>
        {/* education / profession */}
        <View style={styles.infoRow}>
          <InfoCard icon="school-outline" value={me.education} label="Education" placeholder="Add education" onPress={edit} />
          <InfoCard icon="briefcase-outline" value={me.profession} label="Profession" placeholder="Add profession" onPress={edit} />
        </View>

        {/* my journey */}
        <View style={[styles.softCard, { marginTop: spacing.md, flexDirection: 'column', alignItems: 'stretch' }]}>
          <View style={styles.journeyHead}>
            <View style={styles.bulb}><Ionicons name="bulb-outline" size={18} color={colors.primary} /></View>
            <Text style={styles.journeyTitle}>My Journey</Text>
            <Text style={styles.seeAll} onPress={() => navigation.navigate('Journey')} accessibilityRole="link">See all →</Text>
          </View>
          <Text style={[styles.muted, { marginTop: spacing.sm, lineHeight: 19 }]}>
            Currently exploring meaningful connections at my own pace.{'\n'}Open to conversations with like-minded individuals.
          </Text>
          {!!stageLabel && <Text style={[styles.muted, { marginTop: spacing.sm, color: colors.primaryDark }]}>Now at: {stageLabel}</Text>}
        </View>

        {/* menu */}
        <Card style={{ paddingVertical: 0, marginTop: spacing.lg }}>
          {menu.map((m, i) => (
            <Pressable key={m.label} onPress={m.onPress} style={[styles.menuRow, i > 0 && styles.menuBorder]} accessibilityRole="button" accessibilityLabel={m.label}>
              <Ionicons name={m.icon as any} size={20} color={colors.text} />
              <Text style={styles.menuText}>{m.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </Pressable>
          ))}
        </Card>

        <Pressable style={styles.signOut} onPress={signOut} accessibilityRole="button" accessibilityLabel="Sign out">
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { padding: spacing.lg, paddingBottom: 120 }, // extra space so the floating tab bar never covers the last row
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg },
  title: { fontFamily: fonts.bold, fontSize: 26, color: colors.text },
  subtitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },

  softCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: SOFT_BORDER, borderRadius: radius.lg, padding: spacing.lg },
  photo: { width: 80, height: 80, borderRadius: radius.md },
  photoEmpty: { backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SOFT_BORDER },
  photoEdit: { position: 'absolute', right: -6, bottom: -6, width: 28, height: 28, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: SOFT_BORDER, alignItems: 'center', justifyContent: 'center' },
  identity: { flex: 1, marginLeft: spacing.lg },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, flexShrink: 1 },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: 2 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  activeChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: colors.successSoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm },
  activeText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.success, marginLeft: 4 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success, marginLeft: 6 },

  quote: { fontFamily: fonts.bold, fontSize: 30, lineHeight: 34, color: colors.primary, marginRight: spacing.sm },
  bio: { flex: 1, fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 20, color: colors.text, marginRight: spacing.sm },

  infoRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  info: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, minHeight: 56 },
  infoValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text },
  infoLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  journeyHead: { flexDirection: 'row', alignItems: 'center' },
  bulb: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  journeyTitle: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, color: colors.text, marginLeft: spacing.sm },
  seeAll: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary, paddingVertical: 10 },

  menuRow: { flexDirection: 'row', alignItems: 'center', minHeight: 52 },
  menuBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  menuText: { flex: 1, fontFamily: fonts.regular, fontSize: 14.5, color: colors.text, marginLeft: spacing.md },
  signOut: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', minHeight: 48, marginTop: spacing.lg },
  signOutText: { fontFamily: fonts.medium, fontSize: 14, color: colors.danger, marginLeft: spacing.sm },
});