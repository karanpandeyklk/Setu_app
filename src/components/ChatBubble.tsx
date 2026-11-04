import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius, spacing } from '../theme';

type Props = {
  mine: boolean; text: string; time?: string; bot?: boolean;
  status?: 'sending' | 'failed'; onRetry?: () => void; children?: React.ReactNode;
};

// Bot / other person on the left, me on the right (filled blue)
export default function ChatBubble({ mine, text, time, bot, status, onRetry, children }: Props) {
  return (
    <View style={[styles.row, mine && { justifyContent: 'flex-end' }]}>
      {!mine && bot && <View style={styles.bot}><Ionicons name="sparkles" size={16} color={colors.primary} /></View>}
      <View style={{ maxWidth: '78%' }}>
        <View style={[styles.bubble, mine ? styles.mine : styles.theirs, status === 'sending' && { opacity: 0.6 }]}>
          <Text style={[styles.text, mine && { color: '#fff' }]}>{text}</Text>
        </View>
        {children}
        {status === 'failed' ? (
          <Pressable onPress={onRetry} accessibilityRole="button" accessibilityLabel="Message not sent. Retry" style={styles.retry}>
            <Ionicons name="alert-circle" size={14} color={colors.danger} />
            <Text style={styles.retryText}>Not sent. Tap to retry</Text>
          </Pressable>
        ) : !!time && <Text style={[styles.time, mine && { textAlign: 'right' }]}>{status === 'sending' ? 'Sending...' : time}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md },
  bot: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  bubble: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.lg },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  theirs: { backgroundColor: '#fff', borderBottomLeftRadius: 4 },
  text: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  time: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, marginTop: 4 },
  retry: { flexDirection: 'row', alignItems: 'center', minHeight: 36 },
  retryText: { fontFamily: fonts.medium, fontSize: 12, color: colors.danger, marginLeft: 4 },
});