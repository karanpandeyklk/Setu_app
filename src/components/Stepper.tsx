import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';
import { StageStatus } from '../services/mockData';

// `label` is optional. If any stage has one, the stepper shows names under the dots
// and scrolls sideways when they don't fit (as on the Home design).
type Stage = { key: string; status: StageStatus; label?: string };

const COL_W = 76; // width of one labelled stage

function Dot({ status, size }: { status: StageStatus; size: number }) {
  return (
    <View style={[
      styles.dot, { width: size, height: size, borderRadius: size / 2 },
      status === 'completed' && { backgroundColor: colors.primary, borderColor: colors.primary },
      status === 'active' && { borderColor: colors.primary, backgroundColor: '#fff' },
    ]}>
      {status === 'completed' && <Ionicons name="checkmark" size={size * 0.65} color="#fff" />}
      {status === 'active' && <View style={{ width: size * 0.4, height: size * 0.4, borderRadius: size, backgroundColor: colors.primary }} />}
    </View>
  );
}

// Mini horizontal stepper (Home, Connections). The vertical one comes with the Journey screen.
export default function MiniStepper({ stages, size = 18 }: { stages: Stage[]; size?: number }) {
  const done = stages.filter((s) => s.status === 'completed').length;
  const a11y = `Journey progress: ${done} of ${stages.length} stages completed`;
  const labelled = stages.some((s) => s.label);

  if (!labelled) {
    return (
      <View style={styles.row} accessible accessibilityLabel={a11y}>
        {stages.map((s, i) => (
          <React.Fragment key={s.key}>
            <Dot status={s.status} size={size} />
            {i < stages.length - 1 && <View style={[styles.line, s.status === 'completed' && { backgroundColor: colors.primary }]} />}
          </React.Fragment>
        ))}
      </View>
    );
  }

  return (
    <View accessible accessibilityLabel={a11y}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {stages.map((s, i) => (
          <View key={s.key} style={{ width: COL_W, alignItems: 'center' }}>
            <View style={styles.row}>
              <View style={[styles.half, i > 0 && stages[i - 1].status === 'completed' && { backgroundColor: colors.primary }, i === 0 && { backgroundColor: 'transparent' }]} />
              <Dot status={s.status} size={size} />
              <View style={[styles.half, s.status === 'completed' && { backgroundColor: colors.primary }, i === stages.length - 1 && { backgroundColor: 'transparent' }]} />
            </View>
            <Text style={[styles.label, s.status !== 'locked' && { color: colors.text }]} numberOfLines={2}>{s.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { borderWidth: 2, borderColor: colors.border, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, height: 2, backgroundColor: colors.border },
  half: { flex: 1, height: 2, backgroundColor: colors.border },
  label: { fontFamily: fonts.medium, fontSize: 11, color: colors.muted, textAlign: 'center', marginTop: 6, paddingHorizontal: 4 },
});