import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = { uri?: string; size?: number; online?: boolean; verified?: boolean };

export default function Avatar({ uri, size = 48, online, verified }: Props) {
  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
          <Ionicons name="person" size={size * 0.5} color={colors.primary} />
        </View>
      )}
      {online && <View style={[styles.online, { width: size * 0.26, height: size * 0.26, borderRadius: size * 0.13 }]} />}
      {verified && (
        <Ionicons name="checkmark-circle" size={size * 0.3} color={colors.primary} style={styles.verified} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  online: { position: 'absolute', right: 0, bottom: 0, backgroundColor: colors.success, borderWidth: 2, borderColor: '#fff' },
  verified: { position: 'absolute', right: -2, top: -2, backgroundColor: '#fff', borderRadius: 10 },
});
