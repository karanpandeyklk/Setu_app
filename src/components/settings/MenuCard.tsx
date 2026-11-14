import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  tint: string;
  bg: string;
  onPress: () => void;
};

export default function MenuCard({ items, dividers }: { items: MenuItem[]; dividers?: boolean }) {
  return (
    <View style={styles.card}>
      {items.map((it, i) => (
        <Pressable
          key={it.title}
          onPress={it.onPress}
          style={[styles.row, dividers && i < items.length - 1 && styles.divider]}
        >
          <View style={[styles.iconWrap, { backgroundColor: it.bg }]}>
            <Ionicons name={it.icon} size={18} color={it.tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{it.title}</Text>
            <Text style={styles.sub} numberOfLines={1}>{it.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#B6BFCC" />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingVertical: 6,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 18, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#EEF1F6' },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: '#0F1B3D' },
  sub: { fontSize: 12, color: '#7B8498', marginTop: 2 },
});