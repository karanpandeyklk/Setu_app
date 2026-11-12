import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme';

// What the centre (infinity) button does:
//   false = opens the Journey hub (stages, "Ask Setu Guide" button inside)
//   true  = opens the Setu Guide chat directly
const CENTER_OPENS_CHAT = true;

const CENTER = { icon: 'infinity', label: 'Setu Guide', center: true };

const TABS: Record<string, { icon: string; label: string; center?: boolean }> = {
  Home: { icon: 'home', label: 'Home' },
  Connections: { icon: 'people-outline', label: 'Connections' },
  Journey: CENTER, // your navigator names the centre tab Journey
  Guide: CENTER,
  Chats: { icon: 'chatbubble-ellipses-outline', label: 'Chats' },
  Profile: { icon: 'person-outline', label: 'Profile' },
};

export default function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.bar, shadow.card]}>
        {state.routes.map((route, index) => {
          const cfg = TABS[route.name];
          if (!cfg) return null; // unknown route: skipped instead of crashing
          const focused = state.index === index;

          const onPress = () => {
            // centre button: open the chat screen (a stack screen named "Guide")
            if (cfg.center && CENTER_OPENS_CHAT) {
              navigation.navigate('Guide' as never);
              return;
            }
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };

          const iconColor = focused ? '#fff' : colors.text;
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityLabel={cfg.label}
              accessibilityState={{ selected: focused }}
              style={styles.tab}
            >
              <View style={[
                styles.circle,
                cfg.center && { backgroundColor: focused ? colors.primary : colors.primarySoft },
                !cfg.center && focused && { backgroundColor: colors.primary },
              ]}>
                {cfg.icon === 'infinity' ? (
                  <MaterialCommunityIcons name="infinity" size={24} color={focused ? '#fff' : colors.primary} />
                ) : (
                  <Ionicons name={cfg.icon as any} size={22} color={iconColor} />
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
  outer: { backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 6 },
  bar: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 8, justifyContent: 'space-between' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 44 },
  circle: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});