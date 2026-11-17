import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import MenuCard from '../../components/settings/MenuCard';

// Replace with your real pages
const TERMS_URL = 'https://sambandhsetu.com/terms';
const PRIVACY_URL = 'https://sambandhsetu.com/privacy';

export default function AboutScreen({ navigation }: any) {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityLabel="Back">
          <Ionicons name="arrow-back" size={24} color="#0F1B3D" />
        </Pressable>
        <Text style={styles.headerTitle}>About Sambandh Setu</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.brand}>
          {/* Replace with your logo: <Image source={require('../../../assets/logo.png')} style={{ width: 64, height: 64 }} /> */}
          <Ionicons name="heart" size={64} color="#1D4ED8" />
          <Text style={styles.brandName}>Sambandh Setu</Text>
          <Text style={styles.tagline}>Meaningful Connections{'\n'}For a Brighter Tomorrow</Text>
          <Text style={styles.version}>Version {version}</Text>
        </View>

        <MenuCard
          dividers
          items={[
            { icon: 'person', title: 'Our Story', subtitle: 'Our mission and vision', tint: '#7C3AED', bg: '#EDE9FE', onPress: () => navigation.navigate('OurStory') },
            { icon: 'document', title: 'Terms of Service', subtitle: 'Read our terms and conditions', tint: '#2563EB', bg: '#E3ECFF', onPress: () => Linking.openURL(TERMS_URL) },
            { icon: 'lock-closed', title: 'Privacy Policy', subtitle: 'How we protect your data', tint: '#7C3AED', bg: '#EDE9FE', onPress: () => Linking.openURL(PRIVACY_URL) },
            { icon: 'shield-checkmark', title: 'Open Source Licenses', subtitle: 'Third-party libraries', tint: '#2563EB', bg: '#E3ECFF', onPress: () => navigation.navigate('Licenses') },
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5FD' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 20, paddingTop: 12 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#0F1B3D' },
  body: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 28 },
  brand: { alignItems: 'center', marginTop: 40 },
  brandName: { fontSize: 22, fontWeight: '800', color: '#0F1B3D', marginTop: 14 },
  tagline: { fontSize: 13, color: '#5B657A', textAlign: 'center', lineHeight: 19, marginTop: 8 },
  version: { fontSize: 12, color: '#7B8498', marginTop: 14 },
});