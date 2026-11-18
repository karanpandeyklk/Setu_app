import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { colors, fonts, spacing } from '../theme';

type Props = {
  visible: boolean; title: string; options: string[]; selected: string[];
  multi?: boolean; exclusive?: string; maxSelect?: number;
  onClose: () => void; onDone: (selected: string[]) => void;
};

export default function PickerModal({ visible, title, options, selected, multi, exclusive, maxSelect, onClose, onDone }: Props) {
  const { height } = useWindowDimensions();
  const [draft, setDraft] = useState<string[]>(selected);
  const [limitHit, setLimitHit] = useState(false);

  useEffect(() => {
    if (visible) { setDraft(selected); setLimitHit(false); }
  }, [visible]);

  const tap = (opt: string) => {
    if (!multi) { onDone([opt]); return; } // single choice: pick and close
    setLimitHit(false);
    if (draft.includes(opt)) { setDraft(draft.filter((x) => x !== opt)); return; }
    if (exclusive && opt === exclusive) { setDraft([opt]); return; } // "Any" replaces the rest
    const base = exclusive ? draft.filter((x) => x !== exclusive) : draft;
    if (maxSelect && base.length >= maxSelect) { setLimitHit(true); return; }
    setDraft([...base, opt]);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
        <View style={[styles.sheet, { maxHeight: height * 0.7 }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>
          <ScrollView>
            {options.map((opt) => {
              const on = draft.includes(opt);
              return (
                <Pressable
                  key={opt}
                  style={styles.opt}
                  onPress={() => tap(opt)}
                  accessibilityRole={multi ? 'checkbox' : 'radio'}
                  accessibilityState={{ checked: on, selected: on }}
                  accessibilityLabel={opt}
                >
                  <Text style={[styles.optText, on && { color: colors.primary, fontFamily: fonts.semibold }]}>{opt}</Text>
                  {on && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
          {multi && (
            <>
              {limitHit && <Text style={styles.limit}>You can pick up to {maxSelect}.</Text>}
              <Button title="Done" disabled={draft.length === 0} onPress={() => onDone(draft)} style={{ marginTop: spacing.md }} />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: spacing.lg, paddingBottom: spacing.xl },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.md },
  title: { fontFamily: fonts.bold, fontSize: 17, color: colors.text, marginBottom: spacing.sm },
  opt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, borderBottomWidth: 1, borderBottomColor: colors.border },
  optText: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  limit: { fontFamily: fonts.regular, fontSize: 12, color: '#B45309', marginTop: spacing.sm },
});