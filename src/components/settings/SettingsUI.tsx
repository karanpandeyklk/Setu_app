import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export const S = {
  bg: '#F7F8FC',
  card: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  label: '#94A3B8',
  border: '#EEF1F6',
  primary: '#2563EB',
  primarySoft: '#EAF1FF',
  danger: '#EF4444',
  dangerSoft: '#FEF2F2',
  trackOff: '#E2E8F0',
};

export function SettingsScreenLayout({
  title, subtitle, onBack, bg, children,
}: { title: string; subtitle?: string; onBack?: () => void; bg?: string; children: React.ReactNode }) {
  return (
    <SafeAreaView style={[st.safe, bg ? { backgroundColor: bg } : null]}>
      <View style={st.scroll}>
        {onBack && (
          <Pressable onPress={onBack} hitSlop={12} style={st.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={24} color={S.text} />
          </Pressable>
        )}
        <Text style={st.title}>{title}</Text>
        {!!subtitle && <Text style={st.subtitle}>{subtitle}</Text>}
        {children}
      </View>
    </SafeAreaView>
  );
}
export function SectionLabel({ children }: { children: string }) {
  return <Text style={st.sectionLabel}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[st.card, style]}>{children}</View>;
}

type RowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  toggle?: { value: boolean; onChange: (v: boolean) => void };
  danger?: boolean;
  tint?: string;          // icon color
  tintBg?: string;        // icon circle background
  last?: boolean;
};

export function Row({ icon, title, subtitle, onPress, toggle, danger, tint, tintBg, last }: RowProps) {
  const iconColor = danger ? S.danger : tint ?? S.primary;
  const iconBg = danger ? '#FDE2E2' : tintBg ?? S.primarySoft;
  return (
    <Pressable
      onPress={toggle ? () => toggle.onChange(!toggle.value) : onPress}
      style={[st.row, !last && st.rowDivider]}
    >
      <View style={[st.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[st.rowTitle, danger && { color: S.danger }]}>{title}</Text>
        {!!subtitle && <Text style={st.rowSub}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onChange}
          trackColor={{ false: S.trackOff, true: S.primary }}
          thumbColor="#fff"
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={danger ? S.danger : '#A0AEC0'} />
      )}
    </Pressable>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: S.bg },
  scroll: { flex: 1, paddingHorizontal: 20 },
  back: { marginTop: 8, marginBottom: 8, alignSelf: 'flex-start' },
  title: { fontSize: 22, fontWeight: '700', color: S.text, marginTop: 8 },
  subtitle: { fontSize: 13, color: S.muted, marginTop: 4, marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, color: S.label, marginTop: 20, marginBottom: 8 },
  card: {
    backgroundColor: S.card, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#0F172A', shadowOpacity: 0.05, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: S.border },
  iconWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontSize: 14, fontWeight: '600', color: S.text },
  rowSub: { fontSize: 12, color: S.muted, marginTop: 2 },
});