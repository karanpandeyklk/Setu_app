// src/screens/ProfileBuilder/fields.tsx
// The four reusable inputs the builder needs.
// Colours come from src/theme.ts.

import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TileOption } from './config';
import { colors, fonts, radius, spacing, MIN_TAP } from '../../theme';

export const C = {
  primary: colors.primary,
  selectedBg: colors.primarySoft,
  text: colors.text,
  muted: colors.muted,
  border: colors.border,
  warn: colors.warning,
  white: colors.card,
};

/* ---------- ImageTileGrid (multi-select, with "+ Add your own") ---------- */

type TileProps = {
  options: TileOption[];
  value: string[];
  onChange: (next: string[]) => void;
};

export function ImageTileGrid({ options, value, onChange }: TileProps) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');

  const toggle = (label: string) =>
    onChange(value.includes(label) ? value.filter((v) => v !== label) : [...value, label]);

  const custom = value.filter((v) => !options.some((o) => o.label === v));
  const tiles: TileOption[] = [
    ...options,
    ...custom.map((label) => ({ label, emoji: '⭐', color: '#6B7280' })),
  ];

  const addCustom = () => {
    const label = draft.trim();
    if (label && !value.includes(label)) onChange([...value, label]);
    setDraft('');
    setAdding(false);
  };

  return (
    <View>
      <View style={s.tileGrid}>
        {tiles.map((t) => {
          const selected = value.includes(t.label);
          return (
            <Pressable
              key={t.label}
              onPress={() => toggle(t.label)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={t.label}
              style={[s.tile, { backgroundColor: t.color }, selected && s.tileSelected]}
            >
              <Text style={s.tileEmoji}>{t.emoji}</Text>
              <Text style={s.tileLabel}>{t.label}</Text>
              {selected && (
                <View style={s.tileTick}>
                  <Ionicons name="checkmark" size={12} color={C.white} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {adding ? (
        <View style={s.addRow}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Add your own"
            maxLength={30}
            autoFocus
            onSubmitEditing={addCustom}
            returnKeyType="done"
            style={s.addInput}
          />
          <Pressable onPress={addCustom} hitSlop={10}>
            <Text style={s.link}>Add</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => setAdding(true)} style={s.addLink} hitSlop={10}>
          <Text style={s.link}>+ Add your own</Text>
        </Pressable>
      )}
    </View>
  );
}

/* ---------- RadioList (single select, optional "Other, please specify") ---------- */

type RadioProps = {
  options: string[];
  value?: string;
  onChange: (next: string) => void;
  allowOther?: boolean;
  otherValue?: string;
  onOtherChange?: (text: string) => void;
};

export function RadioList({ options, value, onChange, allowOther, otherValue, onOtherChange }: RadioProps) {
  const all = allowOther ? [...options, 'Other'] : options;
  return (
    <View>
      {all.map((opt) => {
        const selected = value === opt;
        return (
          <View key={opt}>
            <Pressable
              onPress={() => onChange(opt)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[s.radioRow, selected && s.radioRowSelected]}
            >
              <View style={[s.radioOuter, selected && s.radioOuterOn]}>
                {selected && <View style={s.radioInner} />}
              </View>
              <Text style={s.radioText}>{opt}</Text>
            </Pressable>
            {opt === 'Other' && selected && (
              <TextInput
                value={otherValue}
                onChangeText={onOtherChange}
                placeholder="Please specify"
                maxLength={60}
                style={s.otherInput}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

/* ---------- ChipSelect (multi select with a maximum) ---------- */

type ChipProps = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
};

export function ChipSelect({ options, value, onChange, max }: ChipProps) {
  const atMax = max !== undefined && value.length >= max;
  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else if (!atMax) onChange([...value, opt]);
  };
  return (
    <View>
      <View style={s.chipWrap}>
        {options.map((opt) => {
          const selected = value.includes(opt);
          const disabled = !selected && atMax;
          return (
            <Pressable
              key={opt}
              onPress={() => toggle(opt)}
              disabled={disabled}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected, disabled }}
              style={[s.chip, selected && s.chipOn, disabled && s.chipDisabled]}
            >
              <Text style={[s.chipText, selected && s.chipTextOn]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
      {max !== undefined && (
        <Text style={s.counter}>
          {value.length}/{max} selected
        </Text>
      )}
    </View>
  );
}

/* ---------- TextArea (character counter + tappable prompts) ---------- */

type TextAreaProps = {
  value: string;
  onChange: (next: string) => void;
  maxLength?: number;
  placeholder?: string;
  prompts?: string[];
};

export function TextArea({ value, onChange, maxLength = 500, placeholder, prompts }: TextAreaProps) {
  const nearLimit = value.length >= maxLength * 0.9;
  return (
    <View>
      <View style={s.areaBox}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          multiline
          maxLength={maxLength}
          textAlignVertical="top"
          style={s.areaInput}
        />
        <Text style={[s.areaCount, nearLimit && { color: C.warn }]}>
          {value.length}/{maxLength}
        </Text>
      </View>

      {!!prompts?.length && (
        <View style={{ marginTop: 20 }}>
          <Text style={s.promptHeading}>Or choose a prompt</Text>
          {prompts.map((p) => (
            <Pressable
              key={p}
              onPress={() => onChange(value ? `${value} ${p}` : p)}
              style={s.promptRow}
              accessibilityRole="button"
            >
              <Text style={s.promptText}>{p}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  // tiles
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: {
    width: '31.5%', aspectRatio: 1, borderRadius: radius.md, marginBottom: 10,
    alignItems: 'center', justifyContent: 'flex-end', padding: 8, borderWidth: 2, borderColor: 'transparent',
  },
  tileSelected: { borderColor: C.primary },
  tileEmoji: { position: 'absolute', top: 14, fontSize: 28 },
  tileLabel: { color: C.white, fontSize: 12, fontFamily: fonts.semibold },
  tileTick: {
    position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9,
    backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center',
  },
  addLink: { alignSelf: 'center', paddingVertical: spacing.md, minHeight: MIN_TAP, justifyContent: 'center' },
  addRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  addInput: {
    flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 10,
    paddingHorizontal: 12, height: 44, marginRight: 12, backgroundColor: C.white,
  },
  link: { color: C.primary, fontFamily: fonts.semibold, fontSize: 14 },

  // radio
  radioRow: { flexDirection: 'row', alignItems: 'center', minHeight: MIN_TAP, paddingVertical: 10, paddingHorizontal: spacing.md, borderRadius: radius.sm },
  radioRowSelected: { backgroundColor: C.selectedBg },
  radioOuter: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  radioOuterOn: { borderColor: C.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.primary },
  radioText: { fontFamily: fonts.regular, fontSize: 15, color: C.text, flex: 1 },
  otherInput: {
    borderWidth: 1, borderColor: C.border, borderRadius: 10, height: 44,
    paddingHorizontal: 12, marginLeft: 44, marginBottom: 8, backgroundColor: C.white,
  },

  // chips
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    minHeight: 36, paddingHorizontal: 14, justifyContent: 'center', borderRadius: radius.pill,
    borderWidth: 1, borderColor: C.border, backgroundColor: C.white, marginRight: 8, marginBottom: 10,
  },
  chipOn: { backgroundColor: C.primary, borderColor: C.primary },
  chipDisabled: { opacity: 0.4 },
  chipText: { fontFamily: fonts.regular, fontSize: 13, color: C.text },
  chipTextOn: { color: C.white, fontFamily: fonts.semibold },
  counter: { marginTop: 4, fontFamily: fonts.regular, fontSize: 12, color: C.muted },

  // text area
  areaBox: { borderWidth: 1, borderColor: C.border, borderRadius: radius.md, backgroundColor: C.white, padding: spacing.md },
  areaInput: { minHeight: 110, fontFamily: fonts.regular, fontSize: 15, color: C.text },
  areaCount: { alignSelf: 'flex-end', fontFamily: fonts.regular, fontSize: 11, color: C.muted, marginTop: 4 },
  promptHeading: { fontFamily: fonts.regular, fontSize: 13, color: C.muted, marginBottom: 10 },
  promptRow: {
    minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 12, marginBottom: 8, backgroundColor: C.white,
  },
  promptText: { fontFamily: fonts.regular, fontSize: 13, color: C.text },
});