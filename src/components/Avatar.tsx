import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

type Props = {
  uri?: string;
  name?: string;
  label?: string;
  size?: number;
  shape?: 'circle' | 'rounded';
  online?: boolean;
  verified?: boolean;
};

// soft background and text colors, picked from the person's name so each person looks different
const PALETTE = [
  { bg: '#DBEAFE', fg: '#1D4ED8' }, { bg: '#DCFCE7', fg: '#15803D' }, { bg: '#FEF3C7', fg: '#B45309' },
  { bg: '#FCE7F3', fg: '#BE185D' }, { bg: '#EDE9FE', fg: '#6D28D9' }, { bg: '#CCFBF1', fg: '#0F766E' },
];
const pick = (name: string) => PALETTE[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % PALETTE.length];

// Photo if there is one, otherwise the initial letter, otherwise a generic icon
export default function Avatar({ uri, name, label, size = 48, shape = 'circle', online, verified }: Props) {
  const displayName = name ?? label;
  const initial = displayName?.trim().charAt(0).toUpperCase();
  const tone = displayName ? pick(displayName) : { bg: colors.primarySoft, fg: colors.primary };
  const cornerRadius = shape === 'rounded' ? size * 0.22 : size / 2;

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: cornerRadius }} />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: cornerRadius, backgroundColor: tone.bg }]}>
          {initial ? (
            <Text style={{ fontFamily: fonts.semibold, fontSize: size * 0.42, color: tone.fg }}>{initial}</Text>
          ) : (
            <Ionicons name="person" size={size * 0.5} color={tone.fg} />
          )}
        </View>
      )}
      {online && <View style={[styles.online, { width: size * 0.26, height: size * 0.26, borderRadius: size * 0.13 }]} />}
      {verified && <Ionicons name="checkmark-circle" size={size * 0.3} color={colors.primary} style={styles.verified} />}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center' },
  online: { position: 'absolute', right: 0, bottom: 0, backgroundColor: colors.success, borderWidth: 2, borderColor: '#fff' },
  verified: { position: 'absolute', right: -2, top: -2, backgroundColor: '#fff', borderRadius: 10 },
});