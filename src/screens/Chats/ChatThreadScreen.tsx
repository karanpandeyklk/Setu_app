import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList, Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMessages, sendMessage, markRead, Msg } from '../../services/chatApi';

// Put this file in src/screens/Chat/ChatThreadScreen.tsx
// Route params: { chatId: string; name: string; photo?: string; online?: boolean }

// Colours taken from the Figma design. Swap for your theme tokens if you prefer.
const C = {
  primary: '#2563EB', primarySoft: '#EAF1FF', bg: '#F7F9FD', card: '#FFFFFF',
  bubbleIn: '#EFF2F8', text: '#111827', sub: '#6B7280', border: '#E5EAF3',
  online: '#22C55E', danger: '#EF4444',
};

function Avatar({ uri, name, size, dot }: { uri?: string; name: string; size: number; dot?: boolean }) {
  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <View style={[styles.initials, { width: size, height: size, borderRadius: size / 2 }]}>
          <Text style={{ color: C.primary, fontWeight: '700', fontSize: size * 0.4 }}>
            {name.trim().charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      {dot && <View style={[styles.dot, { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14 }]} />}
    </View>
  );
}

export default function ChatThreadScreen({ navigation, route }: any) {
  const { chatId, name = 'Chat', photo, online = false } = route.params ?? {};
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList<Msg>>(null);

  // Server messages plus any local ones still sending or failed.
  const load = useCallback(async () => {
    try {
      const server = await getMessages(chatId);
      setMsgs((prev) => [...server, ...prev.filter((m) => m.status)]);
    } catch {
      // keep what we have; the next poll will try again
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  // Load on focus, mark as read, and poll every 4 seconds while the screen is open.
  // Replace the polling with a websocket later if the backend adds one.
  useFocusEffect(
    useCallback(() => {
      load();
      markRead(chatId).catch(() => {});
      const t = setInterval(load, 4000);
      return () => clearInterval(t);
    }, [chatId, load]),
  );

  const send = async (body: string, retryId?: string) => {
    const clean = body.trim();
    if (!clean) return;
    const tempId = retryId ?? `tmp${Date.now()}`;
    const temp: Msg = { id: tempId, mine: true, text: clean, time: '', status: 'sending' };
    setMsgs((prev) => (retryId ? prev.map((m) => (m.id === retryId ? temp : m)) : [...prev, temp]));
    if (!retryId) setText('');
    try {
      const saved = await sendMessage(chatId, clean);
      setMsgs((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
    } catch {
      setMsgs((prev) => prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m)));
    }
  };

  const openProfile = () => navigation.navigate('ChatProfile', { chatId });
const openJourney = () => navigation.navigate('Main', { screen: 'Journey' });

  const renderItem = ({ item }: { item: Msg }) => {
    if (item.mine) {
      return (
        <View style={styles.rowMine}>
          <Pressable
            disabled={item.status !== 'failed'}
            onPress={() => send(item.text, item.id)}
            style={[styles.bubble, styles.bubbleMine, item.status === 'failed' && { opacity: 0.85 }]}
          >
            <Text style={styles.textMine}>{item.text}</Text>
            <View style={styles.meta}>
              {item.status === 'failed' ? (
                <>
                  <Ionicons name="alert-circle" size={13} color="#FECACA" />
                  <Text style={[styles.timeMine, { color: '#FECACA' }]}> Tap to retry</Text>
                </>
              ) : item.status === 'sending' ? (
                <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.8)" />
              ) : (
                <>
                  <Text style={styles.timeMine}>{item.time} </Text>
                  <Ionicons name="checkmark-done" size={14} color="rgba(255,255,255,0.85)" />
                </>
              )}
            </View>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.rowTheirs}>
        <Avatar uri={photo} name={name} size={28} />
        <View style={[styles.bubble, styles.bubbleTheirs]}>
          <Text style={styles.textTheirs}>{item.text}</Text>
          <Text style={styles.timeTheirs}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={C.text} />
        </Pressable>
        <Pressable onPress={openProfile} style={styles.headerWho}>
          <Avatar uri={photo} name={name} size={40} dot={online} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.status}>{online ? 'Online' : 'Offline'}</Text>
          </View>
        </Pressable>
        {/* TODO: wire to your calling flow */}
        <Pressable hitSlop={8} style={styles.headerBtn}><Ionicons name="call-outline" size={21} color={C.text} /></Pressable>
        <Pressable hitSlop={8} style={styles.headerBtn}><Ionicons name="videocam-outline" size={23} color={C.text} /></Pressable>
        <Pressable hitSlop={8} onPress={openProfile} style={styles.headerBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={C.text} />
        </Pressable>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Connected banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <MaterialCommunityIcons name="infinity" size={22} color={C.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>You're connected</Text>
            <Text style={styles.bannerSub}>Continue your Setu journey together.</Text>
          </View>
          <Pressable onPress={openJourney} style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>View Journey</Text>
            <Ionicons name="arrow-forward" size={14} color={C.primary} style={{ marginLeft: 4 }} />
          </Pressable>
        </View>

        {/* Messages */}
        <FlatList
          ref={listRef}
          data={msgs}
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            msgs.length > 0 ? (
              // Msg has no date field yet, so this shows "Today" once. Add day grouping when the backend sends dates.
              <View style={styles.chip}><Text style={styles.chipText}>Today</Text></View>
            ) : null
          }
          ListEmptyComponent={
            !loading ? <Text style={styles.empty}>Say hi to {name} to start the conversation.</Text> : null
          }
        />

        {/* Composer */}
        <View style={styles.composer}>
          <Pressable style={styles.plus}><Ionicons name="add" size={26} color="#fff" /></Pressable>
          <View style={styles.inputWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type a message..."
              placeholderTextColor={C.sub}
              style={styles.input}
              multiline
              maxLength={1000}
            />
            <Ionicons name="happy-outline" size={22} color={C.sub} />
          </View>
          {text.trim() ? (
            <Pressable onPress={() => send(text)} hitSlop={8} style={styles.sendBtn}>
              <Ionicons name="send" size={18} color="#fff" />
            </Pressable>
          ) : (
            <Pressable hitSlop={8} style={styles.micBtn}>
              <Ionicons name="mic-outline" size={24} color={C.primary} />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.card },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8, backgroundColor: C.card },
  headerBtn: { padding: 8 },
  headerWho: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 17, fontWeight: '700', color: C.text },
  status: { fontSize: 12, color: C.sub, marginTop: 1 },
  initials: { backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  dot: { position: 'absolute', right: 0, bottom: 0, backgroundColor: C.online, borderWidth: 2, borderColor: C.card },

  banner: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 14, marginTop: 6, marginBottom: 4,
    padding: 12, borderRadius: 16, backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  bannerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primarySoft, alignItems: 'center', justifyContent: 'center' },
  bannerTitle: { fontSize: 14, fontWeight: '700', color: C.text },
  bannerSub: { fontSize: 12, color: C.sub, marginTop: 1 },
  bannerBtn: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1, borderColor: C.primary,
  },
  bannerBtnText: { fontSize: 12.5, fontWeight: '600', color: C.primary },

  list: { flexGrow: 1, paddingHorizontal: 14, paddingBottom: 10, backgroundColor: C.bg },
  chip: { alignSelf: 'center', backgroundColor: C.bubbleIn, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, marginVertical: 12 },
  chipText: { fontSize: 12, color: C.sub },
  empty: { textAlign: 'center', color: C.sub, marginTop: 40, fontSize: 14 },

  rowTheirs: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12, maxWidth: '86%' },
  rowMine: { alignItems: 'flex-end', marginBottom: 12 },
  bubble: { borderRadius: 16, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, maxWidth: '100%' },
  bubbleTheirs: { backgroundColor: C.bubbleIn, borderBottomLeftRadius: 4 },
  bubbleMine: { backgroundColor: C.primary, borderBottomRightRadius: 4, maxWidth: '80%' },
  textTheirs: { fontSize: 15, lineHeight: 21, color: C.text },
  textMine: { fontSize: 15, lineHeight: 21, color: '#fff' },
  timeTheirs: { fontSize: 11, color: C.sub, alignSelf: 'flex-end', marginTop: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end', marginTop: 4 },
  timeMine: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },

  composer: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border,
  },
  plus: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.bubbleIn, borderRadius: 22,
    paddingHorizontal: 14, minHeight: 40, maxHeight: 120,
  },
  input: { flex: 1, fontSize: 15, color: C.text, paddingVertical: 8, maxHeight: 110 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  micBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});