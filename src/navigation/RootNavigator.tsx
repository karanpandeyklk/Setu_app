import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportSafetyScreen from '../screens/Settings/ReportSafetyScreen';
import MatchProfileScreen from '../screens/Connections/MatchProfileScreen';
import ProfileTabsScreen from '../screens/Profile/ProfileTabsScreen';
import DailyRoutineScreen from '../screens/ProfileBuilder/DailyRoutineScreen';
import TravelScreen from '../screens/ProfileBuilder/TravelScreen';
import HobbiesScreen from '../screens/ProfileBuilder/HobbiesScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import FoodHabitsScreen from '../screens/ProfileBuilder/FoodHabitsScreen';
import NotificationSettingsScreen from '../screens/Settings/NotificationSettingsScreen';
import AIPrivacyScreen from '../screens/Settings/AIPrivacyScreen';
import { colors } from '../theme';
import LoginScreen from '../screens/Auth/LoginScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import BlockedUsersScreen from '../screens/Settings/BlockedUsersScreen';
import ComingSoonScreen from '../screens/Settings/ComingSoonScreen';
import PasswordSecurityScreen from '../screens/Settings/PasswordSecurityScreen';
import AccountScreen from '../screens/Settings/AccountScreen';
import FAQsScreen from '../screens/Settings/FAQsScreen';
import BottomTabBar from './BottomTabBar';
import ChatSettingsScreen from '../screens/Settings/ChatSettingsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import VerificationScreen from '../screens/Settings/VerificationScreen';
import PrivacySafetyScreen from '../screens/Settings/PrivacyVisibilityScreen';
import PreferencesBasicScreen from '../screens/Preferences/PreferencesBasicScreen';
import PreferencesBasic2Screen from '../screens/Preferences/PreferencesBasic2Screen';
import PreferencesLifestyleScreen from '../screens/Preferences/PreferencesLifestyleScreen';
import PreferencesValuesScreen from '../screens/Preferences/PreferencesValuesScreen';

import PreferencesFamilyScreen from '../screens/Preferences/PreferencesFamilyScreen';
import EditSectionScreen from '../screens/Profile/EditSectionScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import ReflectResultsScreen from '../screens/Journey/ReflectResultsScreen';
import CreateAccountScreen from '../screens/Auth/CreateAccountScreen';
import LanguageScreen from '../screens/Settings/LanguageScreen';
import AppearanceScreen from '../screens/Settings/AppearanceScreen';
import VerifyOtpScreen from '../screens/Auth/VerifyOtpScreen';
import OnboardingBasicsScreen from '../screens/Auth/OnboardingBasicsScreen';
import PrivacyVisibilityScreen from '../screens/Settings/PrivacyVisibilityScreen';
import DiscoverySettingsScreen from '../screens/Settings/DiscoverySettingsScreen';
import OnboardingLanguagesScreen from '../screens/Auth/OnboardingLanguagesScreen';
import OnboardingPhotoScreen from '../screens/Auth/OnboardingPhotoScreen';
import OnboardingSuccessScreen, { OPEN_BUILDER_KEY } from '../screens/Auth/OnboardingSuccessScreen';
import ProfileBuilderScreen from '../screens/ProfileBuilder/ProfileBuilderScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import HomeScreen from '../screens/Tabs/HomeScreen';
import ConnectionsScreen from '../screens/Tabs/ConnectionsScreen';
import JourneyScreen from '../screens/Journey/JourneyScreen';
import SetuGuideSettingsScreen from '../screens/Settings/SetuGuideSettingsScreen';
import StageScreen from '../screens/Journey/StageScreen';
import MusicScreen from '../screens/ProfileBuilder/MusicScreen';
import EntertainmentScreen from '../screens/ProfileBuilder/EntertainmentScreen';
import FitnessScreen from '../screens/ProfileBuilder/FitnessScreen';
import ReflectIntroScreen from '../screens/Journey/ReflectIntroScreen';
import ChangePhoneScreen from '../screens/Settings/ChangePhoneScreen';
import ChangeEmailScreen from '../screens/Settings/ChangeEmailScreen';
import LocationSettingsScreen from '../screens/Settings/LocationSettingsScreen';
import ManageAccountScreen from '../screens/Settings/ManageAccountScreen';
import ReflectPrivacyScreen from '../screens/Journey/ReflectPrivacyScreen';
import ChatThreadScreen from '../screens/Chats/ChatThreadScreen';
import ChatProfileScreen from '../screens/Chats/ChatProfileScreen';
import ReflectQuestionScreen from '../screens/Journey/ReflectQuestionScreen';
import ReflectDoneScreen from '../screens/Journey/ReflectDoneScreen';
import EditPersonalInfoScreen from '../screens/Settings/EditPersonalInfoScreen';
import PhoneNumberScreen from '../screens/Settings/PhoneNumberScreen';
import VerifyEmailScreen from '../screens/Settings/VerifyEmailScreen';
import EmailUpdatedScreen from '../screens/Settings/EmailUpdatedScreen';
import EmailAddressScreen from '../screens/Settings/EmailAddressScreen';
import DownloadDataScreen from '../screens/Settings/DownloadDataScreen';
import DataRequestSubmittedScreen from '../screens/Settings/DataRequestSubmittedScreen';
import GuideChatScreen from '../screens/Guide/GuideChatScreen';
import HelpScreen from '../screens/Settings/HelpScreen';
import AboutScreen from '../screens/Settings/AboutScreen';
import ChatsScreen from '../screens/Chats/ChatsScreen';
import ChangePasswordScreen from '../screens/Settings/ChangePasswordScreen';
import DevicesScreen from '../screens/Settings/DevicesScreen';
import DeleteAccountScreen from '../screens/Settings/DeleteAccountScreen';
import DeactivateAccountScreen from '../screens/Settings/DeactivateAccountScreen';
import ConfirmDeletionScreen from '../screens/Settings/ConfirmDeletionScreen';
import AccountDeletedScreen from '../screens/Settings/AccountDeletedScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ProfileDetailScreen from '../screens/Profile/ProfileDetailScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

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
   <NavigationContainer
  onStateChange={() => {
    // web only: drop focus from the screen we just left, so the browser doesn't warn about aria-hidden
    if (Platform.OS === 'web') (globalThis as any).document?.activeElement?.blur?.();
  }}
>
  {user ? (
    // Signed in
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={startRoute ?? 'Main'}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="ProfileBuilder" component={ProfileBuilderScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Stage" component={StageScreen} />
      <Stack.Screen name="Travel" component={TravelScreen} />
<Stack.Screen name="Hobbies" component={HobbiesScreen} />
<Stack.Screen name="Music" component={MusicScreen} />
<Stack.Screen name="Entertainment" component={EntertainmentScreen} />
<Stack.Screen name="DailyRoutine" component={DailyRoutineScreen} />
<Stack.Screen name="Fitness" component={FitnessScreen} />
      <Stack.Screen name="ReflectIntro" component={ReflectIntroScreen} />
      <Stack.Screen name="ReflectPrivacy" component={ReflectPrivacyScreen} />
      <Stack.Screen name="ReflectQuestion" component={ReflectQuestionScreen} />
      <Stack.Screen name="ReflectDone" component={ReflectDoneScreen} />
      <Stack.Screen name="ReflectResults" component={ReflectResultsScreen} />
      <Stack.Screen name="Guide" component={GuideChatScreen} />
      {/* alias: some screens navigate to 'GuideChat'. Remove once every call uses 'Guide'. */}
      <Stack.Screen name="GuideChat" component={GuideChatScreen} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
      <Stack.Screen name="ChatProfile" component={ChatProfileScreen} />
      <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ProfileTabs" component={ProfileTabsScreen} />
      <Stack.Screen name="FoodHabits" component={FoodHabitsScreen} />
      <Stack.Screen name="EditSection" component={EditSectionScreen} />
      <Stack.Screen name="PreferencesBasic" component={PreferencesBasicScreen} />
<Stack.Screen name="PreferencesBasic2" component={PreferencesBasic2Screen} />
<Stack.Screen name="PreferencesLifestyle" component={PreferencesLifestyleScreen} />
<Stack.Screen name="PreferencesFamily" component={PreferencesFamilyScreen} />
<Stack.Screen name="PreferencesValues" component={PreferencesValuesScreen} />
      <Stack.Screen name="MatchProfile" component={MatchProfileScreen} />

      {/* Settings and everything under it */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="ManageAccount" component={ManageAccountScreen} />
      <Stack.Screen name="DeactivateAccount" component={DeactivateAccountScreen} />
      <Stack.Screen name="ConfirmDeletion" component={ConfirmDeletionScreen} />
      <Stack.Screen name="AccountDeleted" component={AccountDeletedScreen} />
      <Stack.Screen name="DownloadData" component={DownloadDataScreen} />
      <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <Stack.Screen name="EmailUpdated" component={EmailUpdatedScreen} />
      <Stack.Screen name="DataRequestSubmitted" component={DataRequestSubmittedScreen} />
      <Stack.Screen name="EditPersonalInfo" component={EditPersonalInfoScreen} />
      <Stack.Screen name="ChangePhone" component={PhoneNumberScreen} />
      <Stack.Screen name="ChangeEmail" component={EmailAddressScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="PasswordSecurity" component={PasswordSecurityScreen} />
      <Stack.Screen name="PhoneChange" component={ChangePhoneScreen} />
      <Stack.Screen name="EmailChange" component={ChangeEmailScreen} />
      <Stack.Screen name="Devices" component={DevicesScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="PrivacyVisibility" component={PrivacyVisibilityScreen} />
      <Stack.Screen name="DiscoverySettings" component={DiscoverySettingsScreen} />
      <Stack.Screen name="WhoCanFindMe" component={ComingSoonScreen} />
      <Stack.Screen name="DistanceVisibility" component={ComingSoonScreen} />
      <Stack.Screen name="AgeVisibility" component={ComingSoonScreen} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="SetuGuideSettings" component={SetuGuideSettingsScreen} />
      <Stack.Screen name="AIPrivacy" component={AIPrivacyScreen} />
      <Stack.Screen name="AIHistory" component={ComingSoonScreen} />
      <Stack.Screen name="SensitiveTopics" component={ComingSoonScreen} />
      <Stack.Screen name="DataUsage" component={ComingSoonScreen} />
      <Stack.Screen name="ChatSettings" component={ChatSettingsScreen} />
      <Stack.Screen name="ReportSafety" component={ReportSafetyScreen} />
      <Stack.Screen name="ReportChat" component={ReportSafetyScreen} />
      <Stack.Screen name="LocationSettings" component={LocationSettingsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Appearance" component={AppearanceScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="FAQs" component={FAQsScreen} />
      <Stack.Screen name="SafetyResources" component={ComingSoonScreen} />
      <Stack.Screen name="CommunityGuidelines" component={ComingSoonScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="OurStory" component={ComingSoonScreen} />
      <Stack.Screen name="Licenses" component={ComingSoonScreen} />
    </Stack.Navigator>
  ) : (
    // Signed out: Welcome -> phone -> OTP -> onboarding. The app always starts on Welcome.
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
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