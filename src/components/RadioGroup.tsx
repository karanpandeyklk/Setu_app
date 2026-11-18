import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  options: string[]; value: string; onChange: (v: string) => void;
  columns?: number; trailing?: Record<string, React.ReactNode>;
};

export default function RadioGroup({ options, value, onChange, columns = 1, trailing }: Props) {
  return (
    <View style={styles.wrap} accessibilityRole="radiogroup">
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            style={[styles.item, { width: `${100 / columns}%` }]}
            onPress={() => onChange(o)}
            accessibilityRole="radio"
            accessibilityState={{ selected: on, checked: on }}
            accessibilityLabel={o}
          >
            <View style={[styles.radio, on && styles.radioOn]}>{on && <View style={styles.dot} />}</View>
            <Text style={[styles.label, on && { color: colors.text }]}>{o}</Text>
            {trailing?.[o]}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { flexDirection: 'row', alignItems: 'center', minHeight: 44, paddingRight: 4 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: '#B8C2D4', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  radioOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  label: { flexShrink: 1, flexGrow: 1, fontFamily: fonts.regular, fontSize: 13.5, color: colors.muted },
});