import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import BottomTabBar from './BottomTabBar';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import CreateAccountScreen from '../screens/Auth/CreateAccountScreen';
import VerifyOtpScreen from '../screens/Auth/VerifyOtpScreen';
import OnboardingBasicsScreen from '../screens/Auth/OnboardingBasicsScreen';
import OnboardingLanguagesScreen from '../screens/Auth/OnboardingLanguagesScreen';
import OnboardingPhotoScreen from '../screens/Auth/OnboardingPhotoScreen';
import OnboardingSuccessScreen, { OPEN_BUILDER_KEY } from '../screens/Auth/OnboardingSuccessScreen';
import ProfileBuilderScreen from '../screens/ProfileBuilder/ProfileBuilderScreen';
import HomeScreen from '../screens/Tabs/HomeScreen';
import ConnectionsScreen from '../screens/Tabs/ConnectionsScreen';
import JourneyScreen from '../screens/Journey/JourneyScreen';
import StageScreen from '../screens/Journey/StageScreen';
import ReflectIntroScreen from '../screens/Journey/ReflectIntroScreen';
import ReflectPrivacyScreen from '../screens/Journey/ReflectPrivacyScreen';
import ReflectQuestionScreen from '../screens/Journey/ReflectQuestionScreen';
import ReflectDoneScreen from '../screens/Journey/ReflectDoneScreen';
import GuideScreen from '../screens/Guide/GuideScreen';
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
  // Where the signed-in stack opens: the profile builder right after onboarding, otherwise Home.
  const [startRoute, setStartRoute] = useState<'Main' | 'ProfileBuilder' | null>(null);

  useEffect(() => {
    if (!user) {
      setStartRoute(null);
      return;
    }
    AsyncStorage.getItem(OPEN_BUILDER_KEY)
      .then((v) => setStartRoute(v === '1' ? 'ProfileBuilder' : 'Main'))
      .catch(() => setStartRoute('Main'));
  }, [user]);

  if (loading || (user && !startRoute)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        // Signed in
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={startRoute ?? 'Main'}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ProfileBuilder" component={ProfileBuilderScreen} />
          <Stack.Screen name="Stage" component={StageScreen} />
          <Stack.Screen name="ReflectIntro" component={ReflectIntroScreen} />
          <Stack.Screen name="ReflectPrivacy" component={ReflectPrivacyScreen} />
          <Stack.Screen name="ReflectQuestion" component={ReflectQuestionScreen} />
          <Stack.Screen name="ReflectDone" component={ReflectDoneScreen} />
          <Stack.Screen name="Guide" component={GuideScreen} />
          <Stack.Screen name="GuideChat" component={GuideChatScreen} />
          <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
          <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        </Stack.Navigator>
      ) : (
        // Signed out: Welcome -> phone -> OTP -> onboarding. The app always starts on Welcome.
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
          <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
          <Stack.Screen name="OnboardingBasics" component={OnboardingBasicsScreen} />
          <Stack.Screen name="OnboardingLanguages" component={OnboardingLanguagesScreen} />
          <Stack.Screen name="OnboardingPhoto" component={OnboardingPhotoScreen} />
          <Stack.Screen name="OnboardingSuccess" component={OnboardingSuccessScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}