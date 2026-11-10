import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, fonts, radius, spacing } from '../../theme';

const features = [
  { icon: 'people-outline', label: 'People with\nshared values' },
  { icon: 'chatbubble-outline', label: 'Thoughtful\nconversations' },
  { icon: 'flower-outline', label: 'A guided journey\nforward' },
] as const;

// The photo must be saved as assets/welcome.png (next to App.tsx)
const heroImg = require('../../../assets/welcome.png');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        bounces={false}
      >
        {/* Header: logo badge, brand name, tagline, language pill */}
        <View style={styles.top}>
          <View style={styles.badge}>
            <Ionicons name="people" size={18} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.brand}>Sambandh Setu</Text>
            <Text style={styles.tagline}>PEOPLE · CONVERSATIONS · POSSIBILITIES</Text>
          </View>
          {/* TODO: language dropdown (19 languages in Figma) */}
          <View style={styles.lang}>
            <Text style={styles.langText}>English</Text>
            <Ionicons name="chevron-down" size={14} color={colors.muted} style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Photo: at least 300 tall, grows on taller screens */}
        <View style={styles.heroWrap}>
          <Image source={heroImg} style={{ position: 'absolute', width: '100%', height: '120%', top: '-10%' }} resizeMode="cover" />
        </View>

        {/* Headline and description */}
        <View style={styles.body}>
          <Text style={styles.headline}>Meaningful connections,</Text>
          <Text style={[styles.headline, { color: colors.primary }]}>at your own pace.</Text>
          <View style={styles.underline} />
          <Text style={styles.sub}>
            Discover people, understand each other, and take the next step when you're ready.
          </Text>

          <View style={styles.features}>
            {features.map((f, i) => (
              <View key={f.label} style={[styles.feature, i > 0 && styles.featureDivider]}>
                <View style={styles.iconWrap}>
                  <Ionicons name={f.icon} size={18} color={colors.primary} />
                </View>
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Button title="Get Started" arrow onPress={() => navigation.navigate('CreateAccount')} />
          <Text style={styles.login}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('CreateAccount')} accessibilityRole="link">
              Log in
            </Text>
          </Text>
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={13} color={colors.muted} />
            <Text style={styles.privacy}>Your information stays under your control.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  // flexGrow: 1 lets the photo stretch on tall screens; the page scrolls on short ones
  scroll: { flexGrow: 1, paddingHorizontal: spacing.lg },

  top: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  badge: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  brand: { fontFamily: fonts.display, fontSize: 17, color: colors.text },
  tagline: { fontFamily: fonts.medium, fontSize: 7.5, letterSpacing: 0.6, color: colors.primary, marginTop: 1 },
  lang: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, minHeight: 36, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  langText: { fontFamily: fonts.medium, fontSize: 13, color: colors.text },

  // Change minHeight to make the photo shorter or taller (try 260 to 360)
  heroWrap: { flex: 1, minHeight: 300, borderRadius: 24, overflow: 'hidden', backgroundColor: colors.primarySoft, marginTop: spacing.sm },

  body: { paddingTop: spacing.lg },
  headline: { fontFamily: fonts.display, fontSize: 27, lineHeight: 34, color: colors.text },
  underline: { width: 44, height: 3, borderRadius: 2, backgroundColor: colors.primary, marginTop: 4 },
  sub: { fontFamily: fonts.regular, fontSize: 13.5, lineHeight: 20, color: colors.muted, marginTop: spacing.md },

  features: { flexDirection: 'row', marginTop: spacing.lg },
  feature: { flex: 1, alignItems: 'center' },
  featureDivider: { borderLeftWidth: 1, borderLeftColor: colors.border },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  featureText: { fontFamily: fonts.regular, fontSize: 11, lineHeight: 15, color: colors.muted, textAlign: 'center' },

  footer: { paddingTop: spacing.lg, paddingBottom: spacing.lg },
  login: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.md },
  link: { fontFamily: fonts.semibold, color: colors.primary },
  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm },
  privacy: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginLeft: 6 },
});