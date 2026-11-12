import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { getActive } from '../../services/api';
import { askGuide, Intent, QUICK_ACTIONS } from '../../services/chatApi';
import { colors, fonts, radius, spacing } from '../../theme';

const CHAT_BG = '#EAF1FD';
const ICONS: Record<Intent, string> = {
  conversation_ideas: 'chatbubble-ellipses-outline', help_me_understand: 'book-outline',
  next_steps: 'sparkles-outline', privacy_safety: 'shield-checkmark-outline',
};
const VISIBLE_QUESTIONS = 5;

type GMsg = {
  id: string; mine: boolean; kind?: 'greeting'; text?: string; time: string;
  questions?: string[]; topic?: string; safety?: string | null; chips?: string[];
};

const clock = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const greeting = (): GMsg => ({ id: 'm0', mine: false, kind: 'greeting', time: clock() });

export default function GuideChatScreen({ navigation }: any) {
  const [matchName, setMatchName] = useState('your match');
  const [msgs, setMsgs] = useState<GMsg[]>([greeting()]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState('');
  const [note, setNote] = useState('');
  const scroll = useRef<ScrollView>(null);
  const noteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    getActive().then((a) => a[0] && setMatchName(a[0].name)).catch(() => {});
    return () => { if (noteTimer.current) clearTimeout(noteTimer.current); };
  }, []);

  const flash = (m: string) => {
    setNote(m);
    if (noteTimer.current) clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(''), 2200);
  };

  const add = (m: GMsg) => setMsgs((prev) => [...prev, m]);

  const send = async (p: { intent?: Intent; text?: string }) => {
    if (typing) return;
    const shown = p.text ?? QUICK_ACTIONS.find((q) => q.intent === p.intent)?.label ?? '';
    add({ id: `u${Date.now()}`, mine: true, text: shown, time: clock() });
    setText(''); setTyping(true);
    const r = await askGuide({ intent: p.intent, message: p.text }); // never throws: a fallback bubble comes back
    setTyping(false);
    // a fallback_used reply is shown as a normal bubble
    add({ id: `b${Date.now()}`, mine: false, text: r.reply, time: clock(), questions: r.questions, topic: r.topic, chips: r.chips, safety: r.safety });
  };

  const onChip = (label: string) => {
    const quick = QUICK_ACTIONS.find((q) => q.label === label);
    quick ? send({ intent: quick.intent }) : send({ text: label });
  };

  const copy = async (q: string) => {
    try {
      await Clipboard.setStringAsync(q);
      setCopied(q);
      flash('Question copied');
      setTimeout(() => setCopied(''), 1500);
    } catch {
      flash("Couldn't copy. Tap the question to use it instead.");
    }
  };

  const canSend = text.trim().length > 0 && !typing;

  const BotAvatar = (
    <View style={styles.botAvatar}><Ionicons name="happy-outline" size={16} color={colors.primary} /></View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Chat with Setu Guide</Text>
          <View style={styles.online}><View style={styles.dot} /><Text style={styles.onlineText}>Online</Text></View>
        </View>
        <Pressable onPress={() => setMenuOpen(!menuOpen)} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="More options">
          <Ionicons name="ellipsis-vertical" size={20} color={colors.text} />
        </Pressable>
      </View>
      {menuOpen && (
        <Pressable style={styles.menu} onPress={() => { setMenuOpen(false); setMsgs([greeting()]); setExpanded({}); }} accessibilityRole="button" accessibilityLabel="Clear chat">
          <Ionicons name="trash-outline" size={18} color={colors.text} />
          <Text style={styles.menuText}>Clear chat</Text>
        </Pressable>
      )}

      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: CHAT_BG }} behavior="padding">
        <ScrollView
          ref={scroll}
          contentContainerStyle={{ padding: spacing.lg }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}
        >
          {msgs.map((m) => {
            const isOpen = !!expanded[m.id];
            const qs = m.questions ?? [];
            const visible = isOpen ? qs : qs.slice(0, VISIBLE_QUESTIONS);
            return (
              <View key={m.id} style={{ marginBottom: spacing.md }}>
                {m.mine ? (
                  <View style={styles.mineRow}>
                    <View style={styles.mine}>
                      <Text style={styles.mineText}>{m.text}</Text>
                      <View style={styles.meta}>
                        <Text style={styles.mineTime}>{m.time}</Text>
                        <Ionicons name="checkmark-done" size={14} color="#CFE0FB" style={{ marginLeft: 4 }} />
                      </View>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={styles.botRow}>
                      {BotAvatar}
                      <View style={styles.bot}>
                        <Text style={styles.botText}>
                          {m.kind === 'greeting'
                            ? `Hi! I'm Setu Guide 👋\nI'm here to support you with guidance, conversation ideas and helpful insights as you get to know ${matchName} better.`
                            : m.text}
                        </Text>
                        <Text style={styles.botTime}>{m.time}</Text>
                      </View>
                    </View>

                    {!!m.safety && (
                      <View style={styles.safety}>
                        <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
                        <Text style={styles.safetyText}>{m.safety}</Text>
                      </View>
                    )}

                    {/* Help card under the greeting */}
                    {m.kind === 'greeting' && (
                      <View style={styles.helpCard}>
                        <Text style={styles.helpTitle}>How can I help you today?</Text>
                        <View style={styles.helpGrid}>
                          {QUICK_ACTIONS.map((a) => (
                            <Pressable key={a.intent} style={styles.helpChip} disabled={typing} onPress={() => send({ intent: a.intent })} accessibilityRole="button" accessibilityLabel={a.label}>
                              <Ionicons name={ICONS[a.intent] as any} size={16} color={colors.primary} />
                              <Text style={styles.helpChipText} numberOfLines={1}>{a.label}</Text>
                            </Pressable>
                          ))}
                        </View>
                      </View>
                    )}

                    {/* Suggested questions card with copy icons */}
                    {qs.length > 0 && (
                      <View style={styles.suggest}>
                        <View style={styles.suggestHead}>
                          <Ionicons name="book-outline" size={18} color={colors.primary} />
                          <Text style={styles.suggestTitle}>{m.topic ?? 'Suggested questions'}</Text>
                        </View>
                        {visible.map((q) => (
                          <Pressable key={q} style={styles.q} onPress={() => setText(q)} accessibilityRole="button" accessibilityLabel={`Use question: ${q}`}>
                            <Ionicons name="ellipse" size={5} color={colors.primary} style={{ marginTop: 7 }} />
                            <Text style={styles.qText}>{q}</Text>
                            <Pressable onPress={() => copy(q)} style={styles.copy} hitSlop={6} accessibilityRole="button" accessibilityLabel={`Copy: ${q}`}>
                              <Ionicons name={copied === q ? 'checkmark' : 'copy-outline'} size={17} color={copied === q ? colors.success : colors.muted} />
                            </Pressable>
                          </Pressable>
                        ))}
                        {qs.length > VISIBLE_QUESTIONS && (
                          <Pressable onPress={() => setExpanded((e) => ({ ...e, [m.id]: !isOpen }))} style={styles.more} accessibilityRole="button">
                            <Text style={styles.moreText}>{isOpen ? 'Show fewer questions' : 'Show more questions'} {isOpen ? '↑' : '→'}</Text>
                          </Pressable>
                        )}
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
                  </View>
                )}
              </View>
            );
          })}

          {typing && (
            <View style={styles.botRow}>
              {BotAvatar}
              <View style={styles.bot}><Text style={styles.botText}>Setu Guide is typing...</Text></View>
            </View>
          )}
        </ScrollView>

        {!!note && <Text style={styles.note}>{note}</Text>}

        {/* Input bar: plus, text with emoji, mic or send */}
        <View style={styles.bar}>
          <Pressable style={styles.plus} onPress={() => flash("Attachments aren't supported yet.")} accessibilityRole="button" accessibilityLabel="Add attachment">
            <Ionicons name="add" size={24} color="#fff" />
          </Pressable>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={500}
              accessibilityLabel="Message"
            />
            <Pressable onPress={() => flash('Use your keyboard emoji button.')} style={styles.inlineIcon} accessibilityRole="button" accessibilityLabel="Emoji">
              <Ionicons name="happy-outline" size={21} color={colors.muted} />
            </Pressable>
          </View>
          {canSend ? (
            <Pressable style={styles.send} onPress={() => send({ text: text.trim() })} accessibilityRole="button" accessibilityLabel="Send">
              <Ionicons name="send" size={18} color="#fff" />
            </Pressable>
          ) : (
            <Pressable style={styles.mic} onPress={() => flash('Voice input is coming soon.')} accessibilityRole="button" accessibilityLabel="Voice input">
              <Ionicons name="mic-outline" size={22} color={colors.primary} />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 60, backgroundColor: colors.bg },
  iconBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  online: { flexDirection: 'row', alignItems: 'center', marginTop: 1 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success, marginRight: 4 },
  onlineText: { fontFamily: fonts.regular, fontSize: 11.5, color: colors.muted },
  menu: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', minHeight: 44, backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: spacing.lg, marginRight: spacing.lg, borderWidth: 1, borderColor: colors.border },
  menuText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, marginLeft: spacing.sm },

  botRow: { flexDirection: 'row', alignItems: 'flex-start' },
  botAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#DCE8FB', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm, marginTop: 2 },
  bot: { maxWidth: '82%', backgroundColor: '#fff', borderRadius: radius.lg, borderTopLeftRadius: 4, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  botText: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 20, color: colors.text },
  botTime: { fontFamily: fonts.regular, fontSize: 10.5, color: colors.muted, alignSelf: 'flex-end', marginTop: 4 },
  mineRow: { alignItems: 'flex-end' },
  mine: { maxWidth: '82%', backgroundColor: colors.primary, borderRadius: radius.lg, borderBottomRightRadius: 4, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  mineText: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 20, color: '#fff' },
  meta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 },
  mineTime: { fontFamily: fonts.regular, fontSize: 10.5, color: '#CFE0FB' },

  helpCard: { marginTop: spacing.md, marginLeft: 36, backgroundColor: '#DDE8FB', borderRadius: radius.lg, padding: spacing.md },
  helpTitle: { fontFamily: fonts.bold, fontSize: 13.5, color: colors.text, marginBottom: spacing.sm },
  helpGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  helpChip: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.md, borderWidth: 1, borderColor: '#CFDDF6', paddingHorizontal: spacing.sm, minHeight: 44 },
  helpChipText: { flex: 1, fontFamily: fonts.medium, fontSize: 11.5, color: colors.text, marginLeft: 6 },

  suggest: { marginTop: spacing.md, marginLeft: 36, backgroundColor: '#fff', borderRadius: radius.lg, padding: spacing.lg },
  suggestHead: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  suggestTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.text, marginLeft: spacing.sm },
  q: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, gap: spacing.sm },
  qText: { flex: 1, fontFamily: fonts.regular, fontSize: 12.5, lineHeight: 18, color: colors.text },
  copy: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  more: { alignSelf: 'center', minHeight: 44, justifyContent: 'center', marginTop: 2 },
  moreText: { fontFamily: fonts.semibold, fontSize: 12.5, color: colors.primary },

  safety: { flexDirection: 'row', alignItems: 'flex-start', marginTop: spacing.sm, marginLeft: 36, backgroundColor: '#fff', borderRadius: radius.md, padding: spacing.md },
  safetyText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 17, color: colors.primaryDark, marginLeft: 6 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm, marginLeft: 36 },
  chip: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.lg, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.primary, backgroundColor: '#fff' },
  chipText: { fontFamily: fonts.medium, fontSize: 13, color: colors.primary },

  note: { fontFamily: fonts.medium, fontSize: 12, color: colors.primaryDark, backgroundColor: '#fff', alignSelf: 'center', borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: 6, marginBottom: spacing.sm },
  bar: { flexDirection: 'row', alignItems: 'flex-end', padding: spacing.md, backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border },
  plus: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, marginHorizontal: spacing.sm, paddingLeft: spacing.lg, minHeight: 44 },
  input: { flex: 1, maxHeight: 100, paddingVertical: 10, fontFamily: fonts.regular, fontSize: 14, color: colors.text },
  inlineIcon: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  mic: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
});