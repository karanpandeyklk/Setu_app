import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts } from '../../theme';

// Temporary screen for every tab. Replace one by one: Home, Connections, Journey, Chats, Profile.
export default function PlaceholderScreen({ route }: any) {
  const { user, signOut } = useAuth();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.title}>{route.name}</Text>
        <Text style={styles.sub}>Signed in as {user?.name}. Screen coming next.</Text>
        {route.name === 'Profile' && <Button variant="outline" title="Sign out" onPress={signOut} style={{ marginTop: 24 }} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontFamily: fonts.bold, fontSize: 24, color: colors.text },
  sub: { fontFamily: fonts.regular, fontSize: 14, color: colors.muted, marginTop: 8, textAlign: 'center' },
});
