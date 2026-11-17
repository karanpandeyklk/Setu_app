import React, { useEffect, useMemo } from 'react';
import { Animated, ViewStyle } from 'react-native';

// Pulsing grey block shown while data loads
export default function Skeleton({ height = 80, width = '100%', radius = 16, style }: { height?: number; width?: number | string; radius?: number; style?: ViewStyle }) {
  const o = useMemo(() => new Animated.Value(0.4), []);
  useEffect(() => {
    const a = Animated.loop(Animated.sequence([
      Animated.timing(o, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(o, { toValue: 0.4, duration: 700, useNativeDriver: true }),
    ]));
    a.start();
    return () => a.stop();
  }, [o]);
  return <Animated.View style={[{ height, width: width as any, borderRadius: radius, backgroundColor: '#E2E8F0', opacity: o }, style]} />;
}
