import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Row, S, SettingsScreenLayout } from '../../components/settings/SettingsUI';
import { useAuth } from '../../context/AuthContext';

export default function AccountScreen({ navigation }: any) {
  const { user } = useAuth() as any;

  // Adjust these to match the fields on your real user object
  const name: string = user?.name ?? 'Aanya K';
  const phone: string = user?.phone ?? '+91 98765 43210';
  const email: string = user?.email ?? 'aanya.k@example.com';
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <SettingsScreenLayout
      title="Account"
      subtitle="Manage your personal information and account details."
      onBack={() => navigation.goBack()}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <Card>
          <Pressable style={styles.profile} onPress={() => navigation.navigate('EditProfile')}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.sub}>View and manage your profile information</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A0AEC0" />
          </Pressable>
        </Card>

        <Card style={{ marginTop: 16 }}>
          <Row
            icon="person"
            title="Edit Personal Information"
            subtitle="Name, date of birth, gender, marital status"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <Row
            icon="call"
            title="Phone Number"
            subtitle={phone}
            onPress={() => navigation.navigate('ChangePhone')}
          />
          <Row
            icon="mail"
            title="Email Address"
            subtitle={email}
            onPress={() => navigation.navigate('ChangeEmail')}
          />
          <Row
            icon="location"
            title="Location"
            subtitle="Add or update your current location"
            onPress={() => navigation.navigate('LocationSettings')}
          />
          <Row
            icon="settings"
            title="Manage Account"
            subtitle="Download your data, deactivate account"
            onPress={() => navigation.navigate('ManageAccount')}
            last
          />
        </Card>
      </ScrollView>
    </SettingsScreenLayout>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: S.primarySoft, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: S.primary },
  name: { fontSize: 15, fontWeight: '700', color: S.text },
  sub: { fontSize: 12, color: S.muted, marginTop: 2 },
});