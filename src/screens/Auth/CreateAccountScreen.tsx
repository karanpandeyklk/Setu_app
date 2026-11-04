import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme';

export default function CreateAccountScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const { signIn } = useAuth();
  const valid = phone.length === 10;

  // Google / Apple: no real OAuth in this build. Both use dev login so the flow is testable.
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.brand}>Sambandh Setu</Text>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.sub}>Let's start with your mobile number.</Text>

      <View style={{ marginTop: spacing.xl }}>
        <PhoneInput value={phone} onChangeText={setPhone} />
        <Button
          title="Continue"
          disabled={!valid}
          style={{ marginTop: spacing.lg }}
          onPress={() => navigation.navigate('VerifyOtp', { phone })}
        />
      </View>

      <View style={styles.orRow}>
        <View style={styles.line} /><Text style={styles.or}>or</Text><View style={styles.line} />
      </View>

      <Button variant="outline" title="Continue with Google" onPress={signIn} style={styles.social} />
      <Button variant="outline" title="Continue with Apple" onPress={signIn} style={[styles.social, { marginTop: spacing.md }]} />

      <Text style={styles.terms}>
        By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg },
  brand: { fontFamily: fonts.display, fontSize: 16, color: colors.text, marginTop: spacing.sm },
  title: { fontFamily: fonts.display, fontSize: 26, textAlign: 'center', color: colors.text, marginTop: spacing.xl },
  sub: { fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', color: colors.muted, marginTop: spacing.sm },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { marginHorizontal: 12, fontFamily: fonts.regular, color: colors.muted },
  social: { borderColor: colors.border },
  terms: { position: 'absolute', bottom: 24, left: spacing.lg, right: spacing.lg, textAlign: 'center', fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  link: { color: colors.primary },
});
