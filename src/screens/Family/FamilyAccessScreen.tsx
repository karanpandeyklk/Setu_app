import React, { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../../components/Button';
import Card from '../../components/Card';
import EmptyState from '../../components/EmptyState';
import ScreenHeader from '../../components/ScreenHeader';
import Skeleton from '../../components/Skeleton';
import { getMembers, Member, removeMember, resendInvite } from '../../services/familyData';
import { colors, fonts, radius, spacing } from '../../theme';

const BENEFITS = [
  { icon: 'checkmark-circle-outline', title: 'Share selected profile information', desc: 'Let your trusted family members view limited details.' },
  { icon: 'shield-checkmark-outline', title: 'Keep control', desc: 'You choose what to share and can change it anytime.' },
  { icon: 'people-outline', title: 'Build trust and support', desc: 'Your family can support you in a safe and respectful way.' },
];

export default function FamilyAccessScreen({ navigation }: any) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [target, setTarget] = useState<Member | null>(null); // member being removed
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError(false);
    try { setMembers(await getMembers()); } catch { setError(true); }
    setLoading(false);
  }, []);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const confirmRemove = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await removeMember(target.id);
      setTarget(null);
      navigation.navigate('FamilyRemoved');
    } catch {
      setNote("Couldn't remove this member. Try again.");
    }
    setBusy(false);
  };

  const resend = async (m: Member) => {
    setNote('');
    try { await resendInvite(m.id); setNote(`Invitation sent again to ${m.relation}.`); }
    catch { setNote("Couldn't resend the invitation. Try again."); }
  };

  const isEmpty = !loading && !error && members.length === 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={{ padding: spacing.lg, gap: spacing.md }}><Skeleton height={64} /><Skeleton height={64} /><Skeleton height={64} /></View>
      ) : error ? (
        <EmptyState icon="cloud-offline-outline" title="Couldn't load Family Access" actionLabel="Try again" onAction={load} />
      ) : isEmpty ? (
        // Intro screen (no members yet)
        <>
          <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
            <Text style={styles.title}>Family Access</Text>
            <Text style={styles.sub}>Allow trusted family members to view selected parts of your profile and support your journey.</Text>
            <View style={styles.art}><Ionicons name="shield-checkmark" size={56} color={colors.primary} /></View>
            {BENEFITS.map((b) => (
              <Card key={b.title} style={styles.benefit}>
                <View style={styles.icon}><Ionicons name={b.icon as any} size={20} color={colors.primary} /></View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={styles.itemTitle}>{b.title}</Text>
                  <Text style={styles.muted}>{b.desc}</Text>
                </View>
              </Card>
            ))}
          </ScrollView>
          <View style={styles.footer}><Button title="Add family Member" onPress={() => navigation.navigate('AddFamilyMember')} /></View>
        </>
      ) : (
        // List screen
        <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
          <Text style={styles.title}>Family Access</Text>
          <Text style={styles.sub}>Manage the family members who can view your profile.</Text>
          {!!note && <Text style={styles.note}>{note}</Text>}

          <View style={{ marginTop: spacing.lg }}>
            {members.map((m) => (
              <Card key={m.id} style={styles.member}>
                <View style={styles.icon}><Ionicons name="person" size={20} color={colors.primary} /></View>
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={styles.itemTitle}>{m.relation}</Text>
                  <View style={styles.statusRow}>
                    <View style={[styles.dot, { backgroundColor: m.status === 'active' ? colors.success : colors.warning }]} />
                    <Text style={[styles.status, { color: m.status === 'active' ? colors.success : '#B45309' }]}>{m.status === 'active' ? 'Active' : 'Pending'}</Text>
                  </View>
                </View>
                {m.status === 'pending' && (
                  <Pressable onPress={() => resend(m)} style={styles.resend} accessibilityRole="button" accessibilityLabel={`Resend invitation to ${m.relation}`}>
                    <Text style={styles.resendText}>Resend</Text>
                  </Pressable>
                )}
                <Pressable onPress={() => setTarget(m)} style={styles.more} accessibilityRole="button" accessibilityLabel={`Remove ${m.relation}`}>
                  <Ionicons name="ellipsis-vertical" size={20} color={colors.muted} />
                </Pressable>
              </Card>
            ))}

            <Pressable style={[styles.add]} onPress={() => navigation.navigate('AddFamilyMember')} accessibilityRole="button" accessibilityLabel="Add family member">
              <View style={styles.icon}><Ionicons name="add" size={22} color={colors.primary} /></View>
              <Text style={styles.addText}>Add Family Member</Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

      {/* Remove confirmation, like the Figma modal */}
      <Modal visible={!!target} transparent animationType="fade" onRequestClose={() => setTarget(null)}>
        <View style={styles.backdrop}>
          <View style={styles.modal}>
            <Pressable style={styles.close} onPress={() => setTarget(null)} accessibilityRole="button" accessibilityLabel="Close">
              <Ionicons name="close" size={22} color={colors.muted} />
            </Pressable>
            <View style={styles.trash}><Ionicons name="trash-outline" size={26} color={colors.danger} /></View>
            <Text style={styles.modalTitle}>Remove Family Member?</Text>
            <Text style={styles.modalText}>
              {target?.relation} will no longer be able to view your profile information or support you on Sambandh Setu.
            </Text>
            <Button title="Remove" variant="danger" loading={busy} onPress={confirmRemove} style={{ alignSelf: 'stretch', marginTop: spacing.lg }} />
            <Button title="Cancel" variant="outline" disabled={busy} onPress={() => setTarget(null)} style={{ alignSelf: 'stretch', marginTop: spacing.sm }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.muted, marginTop: spacing.sm },
  note: { fontFamily: fonts.medium, fontSize: 12, color: colors.primaryDark, backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  art: { alignSelf: 'center', width: 140, height: 140, borderRadius: 70, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginVertical: spacing.xl },
  benefit: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  member: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, paddingVertical: spacing.md },
  icon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontFamily: fonts.semibold, fontSize: 15, color: colors.text },
  muted: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 2, lineHeight: 17 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 5 },
  status: { fontFamily: fonts.medium, fontSize: 12 },
  resend: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
  resendText: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary },
  more: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
  add: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.md, minHeight: 64 },
  addText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.primary, marginLeft: spacing.md },
  footer: { padding: spacing.lg },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.5)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  modal: { width: '100%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 24, padding: spacing.xl, alignItems: 'center' },
  close: { position: 'absolute', top: 8, right: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  trash: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.dangerSoft, alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  modalTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, marginTop: spacing.lg, textAlign: 'center' },
  modalText: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 19, color: colors.muted, textAlign: 'center', marginTop: spacing.sm },
});