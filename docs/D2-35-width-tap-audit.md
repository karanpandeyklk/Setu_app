# D2-35 width and tap-target audit

Static audit of the frontend on `origin/dev`, 2026-11-17. This is a code and
style audit only. Device screenshots and runtime checks belong to D2-34 once the
preview APK exists.

## Scope and method

- Widths: 360, 375, 390, 412, 430 dp.
- Font scale: 100% and 130%.
- Tap target: minimum 44 x 44 dp. `hitSlop` is counted when it expands the
  actual touch area to at least 44 x 44.
- Screens/components checked: all files under `src/screens`, `src/navigation`,
  and `src/components`.
- Commands used: `git grep` for `Pressable`, `onPress`, `hitSlop`, `minHeight`,
  fixed `width`/`height`, `numberOfLines`, `flexWrap`, `maxWidth`; manual read of
  every finding below.
- Owner for every finding: `app` (Karan). No app code was changed by this audit.

## Summary

| Severity | Count | Meaning |
|---|---:|---|
| P0 | 0 | Release blocker / data loss / security |
| P1 | 1 | Core flow likely blocked on a supported screen size |
| P2 | 11 | Accessibility or responsive defect with a workaround |
| P3 | 4 | Minor/fragile layout or secondary control |

No `P0` issue was found in the static pass.

## Findings

### P1

| ID | File:line | Finding | Suggested fix |
|---|---|---|---|
| W-01 | `src/screens/Auth/CreateAccountScreen.tsx:57-84,98` | Sign-up screen is a fixed `SafeAreaView` with no `ScrollView`; the terms footer is `position: 'absolute'; bottom: 24`. At 360x640 with 130% font scale the social buttons and terms can overlap, and the content cannot scroll. | Wrap the form in a `ScrollView` with `contentContainerStyle={{ flexGrow: 1 }}`; put terms in normal flow with `paddingBottom`, not absolute positioning. |

### P2

| ID | File:line | Finding | Suggested fix |
|---|---|---|---|
| T-01 | `src/screens/ProfileBuilder/fields.tsx:168-177,279` | `ChipSelect` chips are `minHeight: 36` (below 44). These are primary controls in the profile builder. | Use `minHeight: 44` or `MIN_TAP`. |
| T-02 | `src/screens/Chats/ChatThreadScreen.tsx:157,184,198-204,255-262` | Composer controls are 40 x 40; the "View Journey" banner button is about 32 high. The plus button is 40 x 40 with no `hitSlop` and no `onPress`; call/video/mic are also tappable placeholders with no action. | Make all composer controls 44 x 44 or add `hitSlop`; give the banner button `minHeight: 44`; wire or remove dead controls. |
| T-03 | `src/components/ChatBubble.tsx:22-25,40` | Failed-message retry is `minHeight: 36` and has no `hitSlop`. | Set `minHeight: 44` or add vertical `hitSlop` 4+. |
| T-04 | `src/screens/Chats/ChatProfileScreen.tsx:64,129-131,180,209` | "Try again" is padding 8 + 13px text (about 32 high); "See all" has `hitSlop={8}` around a 13px label (about 31 high). | Give both `minHeight: 44` and horizontal padding. |
| T-05 | `src/screens/Tabs/ConnectionsScreen.tsx:211-213,261-273,523,529,544` | Bookmark is 36 x 36 with no `hitSlop`; row "more" is 40 wide; segmented control is 40 high; clear-search is 18 + `hitSlop` 10 = 38. | Bookmark 44 x 44; more 44 x 44; segmented control `minHeight: 44`; clear-search `hitSlop` 13+ or 44 box. |
| T-06 | `src/screens/Journey/ReflectResultsScreen.tsx:204-207` | Result filter segments are `minHeight: 40`. | Use `minHeight: 44`. |
| T-07 | `src/screens/Profile/ProfileScreen.tsx:88,96,127,149,107,123` | Photo edit is 28 + `hitSlop` 8 = 44 (borderline); name/bio pencils are 16/18 + `hitSlop` 10 = 36/38; "See all", "Add your location", and "Add a short bio" are inline text with no 44-high touch area. | Use a 44 x 44 pressable wrapper for each icon and text link. |
| T-08 | `src/screens/Auth/WelcomeScreen.tsx:70-75,95`; `src/screens/Auth/VerifyOtpScreen.tsx:99-110`; `src/screens/Auth/OnboardingPhotoScreen.tsx:60,83`; `src/screens/Notifications/NotificationsScreen.tsx:85,121` | Inline "Log in", "Resend", "Change photo", and "Mark all as read" controls are below 44 high. The language pill is a 36-high `View` and is not interactive. | Wrap inline links in 44-high pressables; make the language control a 44-high `Pressable` when it becomes interactive. |
| T-09 | `src/screens/Guide/GuideChatScreen.tsx:171-177,228-230,296` | Suggested-question row contains a nested `Pressable` copy button (32 + `hitSlop` 6 = 44, but nested pressables are fragile); emoji control is 40 wide. | Make the copy button a sibling of the row or stop the parent press; emoji 44 x 44. |
| T-10 | `src/screens/Tabs/HomeScreen.tsx:149,181,204,238,262`; `src/screens/Tabs/ConnectionsScreen.tsx:228,329,487,518`; `src/screens/Guide/GuideScreen.tsx:96,153` | "View all"/"See all" links use `paddingVertical: 8` around 13px text (about 29 high). | Add horizontal padding and `minHeight: 44`, or wrap in a 44-high pressable. |
| T-11 | `src/screens/Tabs/HomeScreen.tsx:152,154` | `Card` does not accept `onPress` or `accessibilityLabel`, so the "Current Connection" card is not tappable and the label is dropped; the inner `Continue` button is the only working path. `Avatar` also ignores the passed `label` and `shape` props. | Extend `Card`/`Avatar` types and forward props, or wrap the card content in a `Pressable` and stop passing unsupported props. |

### P3

| ID | File:line | Finding | Suggested fix |
|---|---|---|---|
| W-02 | `src/screens/Profile/ProfileScreen.tsx:134-136,201-204` | Three info cards across at 360dp leave about 52dp for the value text; values such as `28 years` truncate with `numberOfLines={1}` at 130% font scale. | Use two columns at <=360 or allow the value to wrap to two lines. |
| W-03 | `src/screens/Connections/MatchProfileScreen.tsx:154-165,274-277` | Three info chips across at 360dp truncate long profession/education/location values because each has `numberOfLines={1}`. | Stack to two columns below 375dp, or allow two lines. |
| W-04 | `src/screens/Journey/JourneyScreen.tsx:163-169,219-220` | `width: '48%'` plus `gap: 12` leaves only about 1.1dp of slack at 360dp after 32dp page padding. Rounding or a wider gap will wrap the grid to one column. | Use `flexBasis: '48%'` with `gap`, or `width: '47%'`. |
| W-05 | `src/screens/Guide/GuideChatScreen.tsx:152-158,270-274` | Help chips are 48% wide inside a card that is already inset 36dp; labels are `numberOfLines={1}`, so "Privacy & safety" truncates at 130% font scale on 360dp. | Allow two lines or use a vertical list below 375dp. |

## Screen coverage

The following screens were screened and had no separate 360-430 overflow or
sub-44 target finding beyond the items above:

- Auth: `WelcomeScreen`, `CreateAccountScreen`, `VerifyOtpScreen`,
  `OnboardingBasicsScreen`, `OnboardingLanguagesScreen`,
  `OnboardingPhotoScreen`, `OnboardingSuccessScreen`.
- Tabs: `HomeScreen`, `ConnectionsScreen`, `ChatsScreen`, `GuideScreen`,
  `ProfileScreen`.
- Chats: `ChatThreadScreen`, `ChatProfileScreen`.
- Journey: `JourneyScreen`, `StageScreen`, `ReflectIntroScreen`,
  `ReflectQuestionScreen`, `ReflectPrivacyScreen`, `ReflectResultsScreen`,
  `ReflectDoneScreen`.
- Profile/family: `ProfileDetailScreen`, `EditProfileScreen`,
  `ProfileBuilderScreen`, `FamilyAccessScreen`, `AddFamilyMemberScreen`,
  `FamilyRemovedScreen`, `NotificationsScreen`.
- Shared: `Button`, `Card`, `Avatar`, `ChatBubble`, `ChatInput`, `Chip`,
  `EmptyState`, `Keypad`, `OnboardingHeader`, `OptionChip`, `OtpInput`,
  `PhoneInput`, `ProgressBar`, `ScreenHeader`, `Skeleton`, `Stepper`,
  `BottomTabBar`.

## Manual matrix for D2-34

Run once on each width below, at 100% and 130% font scale:

| Width | Device profile | Check |
|---:|---|---|
| 360 | small Android | Signup, chat composer, profile builder chips, result filters |
| 375 | iPhone SE/13 mini | Same |
| 390 | iPhone 13/14 | Same |
| 412 | Pixel 6/7 | Same |
| 430 | iPhone Pro Max | Same |

For each run, record: screen, scroll position, element, measured target size,
screenshot, and pass/fail. Do not mark a row pass from the static audit alone.

## Related blocker

`npx tsc --noEmit` currently reports 19 errors in app code, including the
`Card`/`Avatar` prop mismatches above. That is tracked separately as a P2
frontend typecheck issue. It is why `frontend tests (Node 20)` and not
`frontend typecheck` is the blocking CI check for D2-27.
