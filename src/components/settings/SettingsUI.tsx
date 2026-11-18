import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { settingsFonts as fonts } from '../../theme';

export const S = {
  bg: '#F7F8FC',
  card: '#FFFFFF',
  text: '#0F1B3D',
  muted: '#7B8498',
  label: '#94A3B8',
  border: '#EEF1F6',
  primary: '#2563EB',
  primarySoft: '#EAF1FF',
  danger: '#EF4444',
  dangerSoft: '#FEF2F2',
  trackOff: '#E2E8F0',
};

export function SettingsScreenLayout({
  title, subtitle, onBack, bg, inline, children,
}: {
  title: string; subtitle?: string; onBack?: () => void; bg?: string;
  inline?: boolean; // true: title sits on the same row as the back arrow
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView style={[st.safe, bg ? { backgroundColor: bg } : null]}>
      <View style={st.scroll}>
        {inline ? (
          <>
            <View style={st.inlineRow}>
              {onBack && (
                <Pressable onPress={onBack} hitSlop={12} accessibilityLabel="Back">
                  <Ionicons name="arrow-back" size={22} color={S.text} />
                </Pressable>
              )}
              <Text style={st.inlineTitle}>{title}</Text>
            </View>
            {!!subtitle && <Text style={st.subtitle}>{subtitle}</Text>}
          </>
        ) : (
          <>
            {onBack && (
              <Pressable onPress={onBack} hitSlop={12} style={st.back} accessibilityLabel="Back">
                <Ionicons name="arrow-back" size={22} color={S.text} />
              </Pressable>
            )}
            <Text style={st.title}>{title}</Text>
            {!!subtitle && <Text style={st.subtitle}>{subtitle}</Text>}
          </>
        )}
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
  tint?: string;
  tintBg?: string;
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
        <Ionicons name="chevron-forward" size={16} color="#B6BFCC" />
      )}
    </Pressable>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: S.bg },
  scroll: { flex: 1, paddingHorizontal: 20 },
  back: { marginTop: 10, marginBottom: 6, alignSelf: 'flex-start' },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  inlineTitle: { fontFamily: fonts.semibold, fontSize: 18, color: S.text },
  title: { fontFamily: fonts.semibold, fontSize: 24, color: S.text, marginTop: 10 },
  subtitle: { fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: S.muted, marginTop: 4, marginBottom: 12 },
  sectionLabel: { fontFamily: fonts.semibold, fontSize: 10.5, letterSpacing: 0.8, color: S.label, marginTop: 20, marginBottom: 8 },
  card: {
    backgroundColor: S.card, borderRadius: 20, overflow: 'hidden',
    shadowColor: '#1E3A8A', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, gap: 12 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: S.border },
  iconWrap: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: fonts.semibold, fontSize: 14, color: S.text },
  rowSub: { fontFamily: fonts.regular, fontSize: 11.5, color: S.muted, marginTop: 2 },
});