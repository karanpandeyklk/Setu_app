import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { StageStatus } from '../services/mockData';

type Stage = { key: string; status: StageStatus };

// Mini horizontal stepper (Home, Connections). The vertical one comes with the Journey screen.
export default function MiniStepper({ stages, size = 18 }: { stages: Stage[]; size?: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Journey progress: ${stages.filter((s) => s.status === 'completed').length} of ${stages.length} stages completed`}>
      {stages.map((s, i) => (
        <React.Fragment key={s.key}>
          <View style={[
            styles.dot, { width: size, height: size, borderRadius: size / 2 },
            s.status === 'completed' && { backgroundColor: colors.primary, borderColor: colors.primary },
            s.status === 'active' && { borderColor: colors.primary, backgroundColor: '#fff' },
          ]}>
            {s.status === 'completed' && <Ionicons name="checkmark" size={size * 0.65} color="#fff" />}
            {s.status === 'active' && <View style={{ width: size * 0.4, height: size * 0.4, borderRadius: size, backgroundColor: colors.primary }} />}
          </View>
          {i < stages.length - 1 && <View style={[styles.line, s.status === 'completed' && { backgroundColor: colors.primary }]} />}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  dot: { borderWidth: 2, borderColor: colors.border, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, height: 2, backgroundColor: colors.border },
});
