import React, { useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { colors } from '../theme';

type Props = { min: number; max: number; low: number; high: number; minGap?: number; onChange: (low: number, high: number) => void };
const THUMB = 40; // touch area. The visible dot is smaller.

export default function RangeSlider({ min, max, low, high, minGap = 1, onChange }: Props) {
  const [width, setWidth] = useState(0);
  const live = useRef({ low, high, width, onChange, startLow: low, startHigh: high });
  live.current.low = low;
  live.current.high = high;
  live.current.width = width;
  live.current.onChange = onChange;

  const usable = Math.max(1, width - THUMB);
  const toX = (v: number) => ((v - min) / (max - min)) * usable;
  const delta = (dx: number) => Math.round((dx / Math.max(1, live.current.width - THUMB)) * (max - min));

  const lowPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => { live.current.startLow = live.current.low; },
    onPanResponderMove: (_e, g) => {
      const v = Math.max(min, Math.min(live.current.startLow + delta(g.dx), live.current.high - minGap));
      if (v !== live.current.low) live.current.onChange(v, live.current.high);
    },
  })).current;

  const highPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderTerminationRequest: () => false,
    onPanResponderGrant: () => { live.current.startHigh = live.current.high; },
    onPanResponderMove: (_e, g) => {
      const v = Math.min(max, Math.max(live.current.startHigh + delta(g.dx), live.current.low + minGap));
      if (v !== live.current.high) live.current.onChange(live.current.low, v);
    },
  })).current;

  // screen readers can step each handle by one
  const step = (which: 'low' | 'high', dir: 1 | -1) => {
    if (which === 'low') onChange(Math.max(min, Math.min(low + dir, high - minGap)), high);
    else onChange(low, Math.min(max, Math.max(high + dir, low + minGap)));
  };

  return (
    <View style={styles.wrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <View style={styles.track} />
      <View style={[styles.fill, { left: toX(low) + THUMB / 2, width: Math.max(0, toX(high) - toX(low)) }]} />
      {(['low', 'high'] as const).map((which) => (
        <View
          key={which}
          {...(which === 'low' ? lowPan : highPan).panHandlers}
          style={[styles.thumb, { left: toX(which === 'low' ? low : high) }]}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={which === 'low' ? 'Minimum age' : 'Maximum age'}
          accessibilityValue={{ min, max, now: which === 'low' ? low : high }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => step(which, e.nativeEvent.actionName === 'increment' ? 1 : -1)}
        >
          <View style={styles.dot} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: THUMB, justifyContent: 'center' },
  track: { position: 'absolute', left: THUMB / 2, right: THUMB / 2, top: THUMB / 2 - 2, height: 4, borderRadius: 2, backgroundColor: '#DCE6F5' },
  fill: { position: 'absolute', top: THUMB / 2 - 2, height: 4, borderRadius: 2, backgroundColor: colors.primary },
  thumb: { position: 'absolute', top: 0, width: THUMB, height: THUMB, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, borderWidth: 3, borderColor: '#fff', shadowColor: '#0F172A', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
});