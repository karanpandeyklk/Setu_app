import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/Button';
import OnboardingHeader from '../../components/OnboardingHeader';
import { colors, fonts, spacing } from '../../theme';

export default function OnboardingPhotoScreen({ navigation, route }: any) {
  const [uri, setUri] = useState<string | undefined>();
  const [error, setError] = useState('');

  const pick = async () => {
    setError('');
    try {
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
      if (!r.canceled) setUri(r.assets[0].uri);
    } catch {
      setError("Couldn't open your photos. You can add a photo later from your profile.");
    }
  };

  const next = () => navigation.navigate('OnboardingSuccess', { ...route.params, photoUri: uri });

  return (
    <SafeAreaView style={styles.safe}>
      <OnboardingHeader step={3} total={3} onBack={() => navigation.goBack()} />
      <Text style={styles.title}>Add a profile photo</Text>
      <Text style={styles.sub}>A clear photo helps people get to know you better.</Text>

      <View style={styles.center}>
        <Pressable onPress={pick} style={styles.circle} accessibilityRole="button" accessibilityLabel={uri ? 'Change photo' : 'Add photo'}>
          {uri ? (
            <Image source={{ uri }} style={styles.photo} />
          ) : (
            <>
              <Ionicons name="camera-outline" size={30} color={colors.primary} />
              <Text style={styles.add}>Add Photo</Text>
            </>
          )}
        </Pressable>
        {!!uri && <Text style={styles.change} onPress={pick} accessibilityRole="button">Change photo</Text>}
        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.note}>
          <Ionicons name="person-outline" size={14} color={colors.primary} />
          <Text style={styles.noteText}>You control who can see your profile.</Text>
        </View>
      </View>

      <Button title="Continue" arrow onPress={next} />
      {!uri && <Button title="Skip for now" variant="text" onPress={next} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.text, marginTop: spacing.lg },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.muted, marginTop: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: { width: 190, height: 190, borderRadius: 95, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  photo: { width: '100%', height: '100%' },
  add: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, marginTop: 6 },
  change: { fontFamily: fonts.semibold, fontSize: 14, color: colors.primary, padding: 12 },
  error: { fontFamily: fonts.regular, fontSize: 12, color: colors.danger, textAlign: 'center', marginTop: spacing.md, paddingHorizontal: spacing.lg },
  note: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xl },
  noteText: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginLeft: 6 },
});