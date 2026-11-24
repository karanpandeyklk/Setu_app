import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { settingsFonts } from '../../theme';

const RED = '#DC2626';

export default function DangerCard({ title, items, warning }: {
  title: string; items: string[];
  warning?: boolean; // true: triangle icon and red bullet text (delete). false: plain heading and dark text (deactivate)
}) {
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        {warning && <Ionicons name="warning" size={14} color={RED} />}
        <Text style={styles.title}>{title}</Text>
      </View>
      {items.map((t) => (
        <View key={t} style={styles.item}>
          <View style={styles.dot} />
          <Text style={[styles.text, warning && { color: RED }]}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFF5F4', borderWidth: 1, borderColor: '#FBE0DE', borderRadius: 16, padding: 16 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  title: { fontFamily: settingsFonts.bold, fontSize: 12.5, color: RED },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: RED, marginTop: 6 },
  text: { flex: 1, fontFamily: settingsFonts.regular, fontSize: 11.5, lineHeight: 17, color: '#334155' },
});