import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme';

type Props = { navigation: any; active?: 'Home' | 'Connections' | 'Journey' | 'Chats' | 'Profile' };

const ITEMS: { route: Props['active']; icon: string; solid: string; label: string; center?: boolean }[] = [
  { route: 'Home', icon: 'home-outline', solid: 'home', label: 'Home' },
  { route: 'Connections', icon: 'people-outline', solid: 'people', label: 'Connections' },
  { route: 'Journey', icon: 'infinity', solid: 'infinity', label: 'Setu Guide', center: true },
  { route: 'Chats', icon: 'chatbubble-ellipses-outline', solid: 'chatbubble-ellipses', label: 'Chats' },
  { route: 'Profile', icon: 'person-outline', solid: 'person', label: 'Profile' },
];

// Same look as BottomTabBar, for screens that are not inside the tabs
export default function FloatingNav({ navigation, active }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, shadow.card]}>
        {ITEMS.map((it) => {
          const focused = it.route === active;
          return (
            <Pressable
              key={it.label}
              onPress={() => navigation.navigate('Main', { screen: it.route })}
              accessibilityRole="tab"
              accessibilityLabel={it.label}
              accessibilityState={{ selected: focused }}
              style={styles.tab}
            >
              <View style={[
                styles.circle,
                it.center && { backgroundColor: focused ? colors.primary : colors.primarySoft },
                !it.center && focused && { backgroundColor: colors.primary },
              ]}>
                {it.center ? (
                  <MaterialCommunityIcons name="infinity" size={26} color={focused ? '#fff' : colors.primary} />
                ) : (
                  <Ionicons name={(focused ? it.solid : it.icon) as any} size={22} color={focused ? '#fff' : colors.text} />
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 16, paddingTop: 6 },
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 8, justifyContent: 'space-between' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});