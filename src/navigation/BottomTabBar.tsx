import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadow } from '../theme';

// What the centre (infinity) button does:
//   false = opens the Journey page (stages, with Ask Setu Guide inside). This is the Figma flow.
//   true  = opens the Setu Guide chat directly
const CENTER_OPENS_CHAT = false;

type Tab = { icon: string; active: string; label: string; center?: boolean };
const CENTER: Tab = { icon: 'infinity', active: 'infinity', label: 'Setu Guide', center: true };

// icon = outline (not selected), active = solid (selected)
const TABS: Record<string, Tab> = {
  Home: { icon: 'home-outline', active: 'home', label: 'Home' },
  Connections: { icon: 'people-outline', active: 'people', label: 'Connections' },
  Journey: CENTER,
  Guide: CENTER,
  Chats: { icon: 'chatbubble-ellipses-outline', active: 'chatbubble-ellipses', label: 'Chats' },
  Profile: { icon: 'person-outline', active: 'person', label: 'Profile' },
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
            if (cfg.center && CENTER_OPENS_CHAT) {
              navigation.navigate('Guide' as never);
              return;
            }
            const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
          };

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
                {cfg.center ? (
                  <MaterialCommunityIcons name="infinity" size={26} color={focused ? '#fff' : colors.primary} />
                ) : (
                  // solid when selected, outline when not
                  <Ionicons name={(focused ? cfg.active : cfg.icon) as any} size={22} color={focused ? '#fff' : colors.text} />
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