import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../../components/Avatar';
import ChatBubble from '../../components/ChatBubble';
import ChatInput from '../../components/ChatInput';
import EmptyState from '../../components/EmptyState';
import { getMessages, markRead, Msg, sendMessage } from '../../services/chatApi';
import { colors, fonts, spacing } from '../../theme';

export default function ChatThreadScreen({ navigation, route }: any) {
  const { chatId, name, online } = route.params;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const scroll = useRef<ScrollView>(null);

  // fetch from server, but keep local messages that are still sending or failed
  const refresh = useCallback(async () => {
    try {
      const server = await getMessages(chatId);
      setMsgs((prev) => [...server, ...prev.filter((m) => m.status)]);
      setError(false);
    } catch { setError(true); }
    setLoading(false);
  }, [chatId]);

  useEffect(() => {
    refresh(); markRead(chatId).catch(() => {});
    const t = setInterval(refresh, 5000); // polling; WebSocket only if time is left
    return () => clearInterval(t);
  }, [refresh, chatId]);

  const deliver = async (temp: Msg) => {
    try {
      const saved = await sendMessage(chatId, temp.text);
      setMsgs((prev) => prev.filter((m) => m.id !== temp.id).concat(saved).filter((m, i, a) => a.findIndex((x) => x.id === m.id) === i));
    } catch {
      setMsgs((prev) => prev.map((m) => (m.id === temp.id ? { ...m, status: 'failed' } : m)));
    }
  };

  const onSend = () => {
    const body = text.trim();
    if (!body) return;
    const temp: Msg = { id: `tmp${Date.now()}`, mine: true, text: body, time: '', status: 'sending' };
    setMsgs((prev) => [...prev, temp]); setText('');
    deliver(temp);
  };

  const retry = (m: Msg) => {
    setMsgs((prev) => prev.map((x) => (x.id === m.id ? { ...x, status: 'sending' } : x)));
    deliver(m);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.back} accessibilityRole="button" accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Avatar size={40} online={online} />
        <View style={{ marginLeft: spacing.md }}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.sub}>{online ? 'Online' : 'Offline'}</Text>
        </View>
      </View>

      {/* 'padding' on BOTH platforms: Android draws edge to edge, so the OS no longer lifts the input above the keyboard */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        {error && msgs.length === 0 ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load messages" actionLabel="Try again" onAction={refresh} />
        ) : (
          <ScrollView ref={scroll} contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} keyboardShouldPersistTaps="handled">
            {!loading && msgs.length === 0 && <EmptyState icon="chatbubble-outline" title="No messages yet" description={`Say hello to ${name}.`} />}
            {msgs.map((m) => <ChatBubble key={m.id} mine={m.mine} text={m.text} time={m.time} status={m.status} onRetry={() => retry(m)} />)}
          </ScrollView>
        )}
        <ChatInput value={text} onChangeText={setText} onSend={onSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, minHeight: 60, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});