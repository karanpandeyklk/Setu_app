import React, { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/Button';
import ScreenHeader from '../../components/ScreenHeader';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile, saveMyProfile } from '../../services/myProfile';
import { PROFILES } from '../../services/profileData';
import { colors, fonts, radius, shadow, spacing } from '../../theme';

const BIO_MAX = 200;

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateName, updateAvatar } = useAuth();
  const isDemoUser = user?.id === 'u_aanya';
  const demo = PROFILES.u_aanya;

  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [height, setHeight] = useState('');
  const [education, setEducation] = useState('');
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [savedPhoto, setSavedPhoto] = useState<string | undefined>(); // the photo as it was when the screen opened
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Fill the form with what is already saved (the demo user starts from the seeded profile)
  useEffect(() => {
    (async () => {
      const p = await getMyProfile().catch(() => null);
      // the bio written in the profile builder, so saving here does not wipe it
      let builderBio = '';
      try {
        const raw = await AsyncStorage.getItem('setu_builder_answers');
        const a = raw ? JSON.parse(raw) : {};
        builderBio = typeof a.about === 'string' ? a.about : '';
      } catch { /* no builder answers */ }

      setName(user?.name ?? '');
      setBio(p?.bio ?? (builderBio || (isDemoUser ? demo.bio : '')));
      setHeight(p?.height ?? (isDemoUser ? demo.height : ''));
      setEducation(p?.education ?? (isDemoUser ? demo.education : ''));
      setProfession(p?.profession ?? (isDemoUser ? demo.profession : ''));
      setLocation(p?.location ?? (isDemoUser ? demo.location : ''));
      // fall back to the login user's photo so the current picture always shows here
      const current = p?.photoUri ?? (user as any)?.avatar;
      setPhotoUri(current);
      setSavedPhoto(current);
      setReady(true);
    })();
  }, []);

  const pickPhoto = async () => {
    try {
      const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.7 });
      if (!r.canceled) setPhotoUri(r.assets[0].uri);
    } catch {
      setError("Couldn't open your photos.");
    }
  };

  const valid = name.trim().length >= 2;

  const save = async () => {
    setBusy(true); setError('');
    try {
      // If the photo changed, save it permanently and attach it to the login user, so Home shows it too.
      // updateAvatar returns the permanent path, which the profile then stores as well.
      let finalPhoto = photoUri;
      if (photoUri && photoUri !== savedPhoto) {
        finalPhoto = await updateAvatar(photoUri);
      }

      await saveMyProfile({
        name: name.trim(), bio: bio.trim(), height: height.trim(), education: education.trim(),
        profession: profession.trim(), location: location.trim(), photoUri: finalPhoto,
      });
      if (name.trim() !== user?.name) await updateName(name.trim());
      navigation.goBack();
    } catch {
      setError("Couldn't save your changes. Try again.");
      setBusy(false);
    }
  };

  if (!ready) return <SafeAreaView style={styles.safe}><ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} /></SafeAreaView>;

  const field = (label: string, value: string, set: (v: string) => void, placeholder: string, extra: object = {}) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, shadow.card]} value={value} onChangeText={set} placeholder={placeholder} placeholderTextColor={colors.muted} accessibilityLabel={label} {...extra} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      {/* 'padding' on both platforms, so the keyboard never covers the fields on Android */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ padding: spacing.lg }} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center' }}>
            <Pressable onPress={pickPhoto} style={styles.photo} accessibilityRole="button" accessibilityLabel="Change photo">
              {photoUri ? <Image source={{ uri: photoUri }} style={{ width: '100%', height: '100%' }} /> : <Ionicons name="camera-outline" size={30} color={colors.primary} />}
            </Pressable>
            <Text style={styles.change} onPress={pickPhoto} accessibilityRole="button">{photoUri ? 'Change photo' : 'Add photo'}</Text>
          </View>

          {field('Full name', name, setName, 'Enter your name', { maxLength: 40 })}

          <Text style={styles.label}>About me</Text>
          <TextInput
            style={[styles.input, shadow.card, { height: 110, textAlignVertical: 'top', paddingTop: 14 }]}
            value={bio} onChangeText={setBio} multiline maxLength={BIO_MAX}
            placeholder="A few lines about you" placeholderTextColor={colors.muted} accessibilityLabel="About me"
          />
          <Text style={[styles.counter, bio.length >= BIO_MAX - 20 && { color: '#B45309' }]}>{bio.length}/{BIO_MAX}</Text>

          {field('Height', height, setHeight, `For example 5'4"`, { maxLength: 10 })}
          {field('Education', education, setEducation, 'For example MBA', { maxLength: 40 })}
          {field('Profession', profession, setProfession, 'For example Marketing Manager', { maxLength: 40 })}
          {field('City', location, setLocation, 'For example Mumbai', { maxLength: 40 })}
          {!!error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
        <View style={{ padding: spacing.lg }}>
          <Button title="Save changes" disabled={!valid} loading={busy} onPress={save} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  photo: { width: 100, height: 100, borderRadius: 50, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.primary, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  change: { fontFamily: fonts.semibold, fontSize: 13, color: colors.primary, padding: 12 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  input: { backgroundColor: '#fff', borderRadius: radius.md, paddingHorizontal: spacing.lg, minHeight: 52, fontFamily: fonts.regular, fontSize: 15, color: colors.text },
  counter: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, textAlign: 'right', marginTop: spacing.xs },
  error: { fontFamily: fonts.regular, fontSize: 13, color: colors.danger, marginTop: spacing.lg },
});