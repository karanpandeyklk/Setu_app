import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import { colors, fonts, radius, spacing } from '../../theme';

const features = [
  { icon: 'people-outline', label: 'People with shared values' },
  { icon: 'chatbubble-outline', label: 'Thoughtful conversations' },
  { icon: 'flower-outline', label: 'A guided journey forward' },
] as const;

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.top}>
        <Text style={styles.brand}>Sambandh Setu</Text>
        {/* TODO: language dropdown (19 languages in Figma) */}
        <Text style={styles.lang}>English ▾</Text>
      </View>

      {/* TODO: replace with the Figma hero photo: <Image source={require('../../../assets/welcome.jpg')} /> */}
      <View style={styles.hero} />

      <View style={styles.body}>
        <Text style={styles.headline}>Meaningful connections,</Text>
        <Text style={[styles.headline, { color: colors.primary }]}>at your own pace.</Text>
        <Text style={styles.sub}>
          Discover people, understand each other, and take the next step when you're ready.
        </Text>

        <View style={styles.features}>
          {features.map((f) => (
            <View key={f.label} style={styles.feature}>
              <View style={styles.iconWrap}><Ionicons name={f.icon} size={18} color={colors.primary} /></View>
              <Text style={styles.featureText}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Get Started" arrow onPress={() => navigation.navigate('CreateAccount')} />
        <Text style={styles.login}>
          Already have an account?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('CreateAccount')} accessibilityRole="link">Log in</Text>
        </Text>
        <Text style={styles.privacy}>Your information stays under your control.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  brand: { fontFamily: fonts.display, fontSize: 18, color: colors.text },
  lang: { fontFamily: fonts.medium, fontSize: 13, color: colors.text, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: '#fff' },
  hero: { height: 280, borderRadius: radius.lg, backgroundColor: colors.primarySoft, marginTop: spacing.sm },
  body: { flex: 1, paddingTop: spacing.lg },
  headline: { fontFamily: fonts.display, fontSize: 28, lineHeight: 36, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 21, color: colors.muted, marginTop: spacing.md },
  features: { flexDirection: 'row', marginTop: spacing.lg },
  feature: { flex: 1, alignItems: 'center' },
  iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  featureText: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, textAlign: 'center' },
  footer: { paddingBottom: spacing.md },
  login: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.lg },
  link: { fontFamily: fonts.semibold, color: colors.primary },
  privacy: { textAlign: 'center', fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: spacing.md },
});
