import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

type Props = {
  uri?: string;
  size?: number;
  online?: boolean;   // true = green dot, false = grey dot, undefined = no dot
  verified?: boolean;
  shape?: 'circle' | 'rounded';
  label?: string;     // read by screen readers, e.g. the person's name
};

export default function Avatar({ uri, size = 48, online, verified, shape = 'circle', label }: Props) {
  const [failed, setFailed] = useState(false); // photo URL broke, so show the fallback
  const radius = shape === 'rounded' ? size * 0.22 : size / 2;
  const dot = size * 0.26;
  const dotOffset = shape === 'rounded' ? size * 0.06 : 0;

  return (
    <View
      style={{ width: size, height: size }}
      accessible={!!label}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
    >
      {uri && !failed ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} onError={() => setFailed(true)} />
      ) : (
        <View style={[styles.fallback, { width: size, height: size, borderRadius: radius }]}>
          <Ionicons name="person" size={size * 0.5} color={colors.primary} />
        </View>
      )}
      {online !== undefined && (
        <View
          style={[
            styles.dot,
            { width: dot, height: dot, borderRadius: dot / 2, right: dotOffset, bottom: dotOffset, backgroundColor: online ? colors.success : colors.muted },
          ]}
        />
      )}
      {verified && (
        <Ionicons name="checkmark-circle" size={size * 0.3} color={colors.primary} style={styles.verified} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', borderWidth: 2, borderColor: '#fff' },
  verified: { position: 'absolute', right: -2, top: -2, backgroundColor: '#fff', borderRadius: 10 },
});