import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import BottomTabBar from './BottomTabBar';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import CreateAccountScreen from '../screens/Auth/CreateAccountScreen';
import VerifyOtpScreen from '../screens/Auth/VerifyOtpScreen';
import HomeScreen from '../screens/Tabs/HomeScreen';
import ConnectionsScreen from '../screens/Tabs/ConnectionsScreen';
import JourneyScreen from '../screens/Journey/JourneyScreen';
import StageScreen from '../screens/Journey/StageScreen';
import ReflectIntroScreen from '../screens/Journey/ReflectIntroScreen';
import ReflectPrivacyScreen from '../screens/Journey/ReflectPrivacyScreen';
import ReflectQuestionScreen from '../screens/Journey/ReflectQuestionScreen';
import ReflectDoneScreen from '../screens/Journey/ReflectDoneScreen';
import GuideChatScreen from '../screens/Guide/GuideChatScreen';
import ChatsScreen from '../screens/Chats/ChatsScreen';
import ChatThreadScreen from '../screens/Chats/ChatThreadScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ProfileDetailScreen from '../screens/Profile/ProfileDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(p) => <BottomTabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Connections" component={ConnectionsScreen} />
      <Tab.Screen name="Journey" component={JourneyScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}><ActivityIndicator color={colors.primary} /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Stage" component={StageScreen} />
            <Stack.Screen name="ReflectIntro" component={ReflectIntroScreen} />
            <Stack.Screen name="ReflectPrivacy" component={ReflectPrivacyScreen} />
            <Stack.Screen name="ReflectQuestion" component={ReflectQuestionScreen} />
            <Stack.Screen name="ReflectDone" component={ReflectDoneScreen} />
            <Stack.Screen name="Guide" component={GuideChatScreen} />
            <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
            <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
            <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}