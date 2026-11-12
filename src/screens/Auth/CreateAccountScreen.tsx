import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import PhoneInput from '../../components/PhoneInput';
import { useAuth } from '../../context/AuthContext';
import { sendOtp } from '../../services/api';
import { getGoogleProfile, googleLogin } from '../../services/googleAuth';
import { colors, fonts, spacing } from '../../theme';

export default function CreateAccountScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const onGoogle = async () => {
    if (googleLoading) return;
    setGoogleLoading(true); setError('');
    try {
      const g = await getGoogleProfile();      // opens the Google account picker
      if (g) {
        const session = await googleLogin(g);  // turns it into an app session
        await signIn(session);                 // the navigator moves to the app after this
      }
    } catch (e: any) {
      if (e?.code === 'GOOGLE_UNAVAILABLE') {
        // Expo Go (or a missing client ID): keep testing with the old dev login while developing
        if (__DEV__) {
          console.log('GOOGLE UNAVAILABLE, using dev login:', e.message);
          await signIn(await googleLogin({ idToken: 'dev', name: 'Karan', email: 'karan@example.com' }));
        } else {
          setError('Google sign-in is not available right now. Use your mobile number instead.');
        }
      } else {
        console.log('GOOGLE SIGN-IN FAILED', e);
        setError("Couldn't sign in with Google. Try again.");
      }
    }
    setGoogleLoading(false);
  };

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

      <Button variant="outline" title="Continue with Google" loading={googleLoading} onPress={onGoogle} style={styles.social} />
      {/* Apple: no real sign-in yet. Uses the dev login so the flow stays testable. */}
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