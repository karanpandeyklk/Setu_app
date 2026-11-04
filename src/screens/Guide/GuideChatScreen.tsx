import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ChatBubble from '../../components/ChatBubble';
import ChatInput from '../../components/ChatInput';
import { askGuide, Intent, QUICK_ACTIONS } from '../../services/chatApi';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

type GMsg = { id: string; mine: boolean; text: string; questions?: string[]; chips?: string[]; safety?: string | null; time?: string };

const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function GuideChatScreen({ navigation }: any) {
  const [msgs, setMsgs] = useState<GMsg[]>([{
    id: 'm0', mine: false, time: `Today ${clock()}`,
    text: "Hi Aanya, I'm Setu Guide. I can suggest conversation ideas, help you understand this stage and share tips for your next steps. How can I help you today?",
    chips: QUICK_ACTIONS.map((q) => q.label),
  }]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const scroll = useRef<ScrollView>(null);

  const add = (m: GMsg) => setMsgs((prev) => [...prev, m]);

  const send = async (p: { intent?: Intent; text?: string }) => {
    const shown = p.text ?? QUICK_ACTIONS.find((q) => q.intent === p.intent)?.label ?? '';
    add({ id: `u${Date.now()}`, mine: true, text: shown, time: clock() });
    setText(''); setTyping(true);
    const r = await askGuide({ intent: p.intent, message: p.text }); // never throws: returns a fallback bubble
    setTyping(false);
    // fallback_used replies are shown as normal bubbles
    add({ id: `b${Date.now()}`, mine: false, text: r.reply, questions: r.questions, chips: r.chips, safety: r.safety });
  };

  const onChip = (label: string) => {
    const quick = QUICK_ACTIONS.find((q) => q.label === label);
    quick ? send({ intent: quick.intent }) : send({ text: label });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.avatar}><Ionicons name="sparkles" size={20} color={colors.primary} /></View>
        <View style={{ marginLeft: spacing.md }}>
          <Text style={styles.title}>Setu Guide</Text>
          <View style={styles.online}><View style={styles.dot} /><Text style={styles.onlineText}>Online</Text></View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled" onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
          {msgs.map((m) => (
            <ChatBubble key={m.id} mine={m.mine} bot text={m.text} time={m.time}>
              {!!m.safety && <View style={styles.safety}><Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} /><Text style={styles.safetyText}>{m.safety}</Text></View>}
              {!!m.questions?.length && (
                <View style={[styles.suggest, shadow.card]}>
                  <Text style={styles.suggestTitle}>Suggested questions</Text>
                  {m.questions.map((q) => (
                    <Pressable key={q} style={styles.q} onPress={() => setText(q)} accessibilityRole="button" accessibilityLabel={`Use question: ${q}`}>
                      <Text style={styles.qText}>{q}</Text>
                      <Ionicons name="copy-outline" size={18} color={colors.primary} />
                    </Pressable>
                  ))}
                </View>
              )}
              {!!m.chips?.length && (
                <View style={styles.chips}>
                  {m.chips.map((c) => (
                    <Pressable key={c} style={styles.chip} disabled={typing} onPress={() => onChip(c)} accessibilityRole="button">
                      <Text style={styles.chipText}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </ChatBubble>
          ))}
          {typing && <ChatBubble mine={false} bot text="Setu Guide is typing..." />}
        </ScrollView>
        <ChatInput value={text} onChangeText={setText} disabled={typing} onSend={() => send({ text: text.trim() })} maxLength={500} placeholder="Ask Setu Guide" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 60, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  online: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 4 },
  onlineText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  chip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.primary, backgroundColor: '#fff' },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary },
  suggest: { backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.md, marginTop: spacing.sm },
  suggestTitle: { fontFamily: fonts.semibold, fontSize: 14, color: colors.text, marginBottom: spacing.xs },
  q: { flexDirection: 'row', alignItems: 'center', minHeight: 48, borderTopWidth: 1, borderTopColor: colors.border },
  qText: { flex: 1, fontFamily: fonts.regular, fontSize: 13, color: colors.text, marginRight: spacing.sm },
  safety: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.sm },
  safetyText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.primaryDark, marginLeft: 6 },
});