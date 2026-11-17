import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../theme';

const SUPPORT_EMAIL = 'support@sambandhsetu.com'; // replace with your real address

const NAVY = '#0F1B3D';
const GREY = '#7B8498';

type Item = {
  title: string;
  subtitle: string;
  bg: string;
  icon: React.ReactNode;
  onPress: () => void;
};

export default function HelpScreen({ navigation }: any) {
  const items: Item[] = [
    {
      title: 'FAQs',
      subtitle: 'Find answers to common questions',
      bg: '#DCEEFE',
      icon: (
        <View style={styles.faqDot}>
          <Text style={styles.faqMark}>?</Text>
        </View>
      ),
      onPress: () => navigation.navigate('FAQs'),
    },
    {
      title: 'Contact Support',
      subtitle: 'Get help from our support team',
      bg: '#E3ECFF',
      icon: <Ionicons name="headset-outline" size={22} color="#2563EB" />,
      onPress: () => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Sambandh Setu support`),
    },
    {
      title: 'Report a Problem',
      subtitle: 'Report a technical issue',
      bg: '#FDE2E4',
      icon: <Ionicons name="flag" size={20} color="#EF4444" />,
      onPress: () => navigation.navigate('ReportSafety'),
    },
    {
      title: 'Safety Resources',
      subtitle: 'Tips for a safe and positive experience',
      bg: '#DDF5E5',
      icon: <Ionicons name="shield-checkmark" size={22} color="#16A34A" />,
      onPress: () => navigation.navigate('SafetyResources'),
    },
    {
      title: 'Community Guidelines',
      subtitle: 'Our rules and guidelines',
      bg: '#E3ECFF',
      icon: <Ionicons name="document-text" size={22} color="#2563EB" />,
      onPress: () => navigation.navigate('CommunityGuidelines'),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerPad}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.back} accessibilityLabel="Back">
            <Ionicons name="arrow-back" size={24} color={NAVY} />
          </Pressable>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>We're here to help.</Text>
        </View>

        <View style={styles.card}>
          {items.map((it) => (
            <Pressable key={it.title} onPress={it.onPress} style={styles.row}>
              <View style={[styles.iconWrap, { backgroundColor: it.bg }]}>{it.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{it.title}</Text>
                <Text style={styles.rowSub} numberOfLines={1}>{it.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#B6BFCC" />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F2F5FC' },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  headerPad: { paddingHorizontal: 8 },
  back: { marginTop: 10, alignSelf: 'flex-start' },
  title: { fontFamily: fonts.semibold, fontSize: 30, color: NAVY, marginTop: 18 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: GREY, marginTop: 4 },

  card: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 8,
    paddingHorizontal: 14,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { fontFamily: fonts.semibold, fontSize: 16, color: NAVY },
  rowSub: { fontFamily: fonts.regular, fontSize: 12.5, color: GREY, marginTop: 3 },

  faqDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#1E9BF0', alignItems: 'center', justifyContent: 'center' },
  faqMark: { color: '#fff', fontSize: 15, fontWeight: '800', lineHeight: 18 },
});