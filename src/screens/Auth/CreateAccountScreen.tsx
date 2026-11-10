import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { useAuth } from '../../context/AuthContext';
import { sendOtp } from '../../services/api';
import { colors, fonts, spacing } from '../../theme';

export default function CreateAccountScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const valid = phone.length === 10;

  const onContinue = async () => {
    setLoading(true); setError('');
    try {
      const r = await sendOtp(phone);
      navigation.navigate('VerifyOtp', { phone, demoCode: r.demoCode });
    } catch {
      setError("Couldn't send the code. Check your connection and try again.");
    }
    setLoading(false);
  };

  // Google / Apple: no real OAuth in this build. Both use dev login so the flow is testable.
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.brand}>Sambandh Setu</Text>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.sub}>Let's start with your mobile number.</Text>

      <View style={{ marginTop: spacing.xl }}>
        <PhoneInput value={phone} onChangeText={setPhone} />
        {!!error && <Text style={styles.error}>{error}</Text>}
        <Button
          title="Continue"
          disabled={!valid}
          loading={loading}
          style={{ marginTop: spacing.lg }}
          onPress={onContinue}
        />
      </View>

      <View style={styles.orRow}>
        <View style={styles.line} /><Text style={styles.or}>or</Text><View style={styles.line} />
      </View>

      <Button variant="outline" title="Continue with Google" onPress={() => signIn()} style={styles.social} />
<Button variant="outline" title="Continue with Apple" onPress={() => signIn()} style={[styles.social, { marginTop: spacing.md }]} />
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
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, textAlign: 'center', marginTop: spacing.md },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xl },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  or: { marginHorizontal: 12, fontFamily: fonts.regular, color: colors.muted },
  social: { borderColor: colors.border },
  terms: { position: 'absolute', bottom: 24, left: spacing.lg, right: spacing.lg, textAlign: 'center', fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
  link: { color: colors.primary },
});