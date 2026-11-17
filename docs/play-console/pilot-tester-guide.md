# Sambandh Setu — pilot tester guide

Status: **DRAFT**. Send only after the closed track is live and the build is real-backend ready.

## What you are testing

A closed Android pilot of Sambandh Setu. This is not the final public release. Features may break, and data may be reset.

## Before you start

- Use the Android phone you normally use.
- Use the Google account you gave the team for the closed test.
- Make sure you have a stable internet connection.
- Do not use real sensitive information in test chats or profile fields.

## Install steps

1. Open the opt-in link from your invitation on the Android phone.
2. Sign in with the same Google account.
3. Accept the invitation.
4. Tap **Download it on Google Play** or **Install**.
5. Open Sambandh Setu.
6. If Play says the app is unavailable, confirm the opt-in account matches the invited Google account, then contact the team.

## First-run checklist

- [ ] Welcome screen loads.
- [ ] Sign-up/onboarding completes.
- [ ] Home loads.
- [ ] Connections list loads.
- [ ] A connection request can be sent or received.
- [ ] A chat opens and a message sends.
- [ ] Setu Guide responds to a quick action and a typed question.
- [ ] Profile opens, edits, saves, and reopens with the change.

## How to report a bug

Use the agreed feedback form/channel: `<FEEDBACK_CHANNEL>`.

Include:

- What you did (steps).
- What you expected.
- What happened.
- Screenshot or short screen recording, if safe.
- Build number (Profile/Settings or Play Store → App info).
- Device model and Android version.
- Whether it happens every time.

Do **not** include:

- OTP codes.
- Email addresses or phone numbers.
- Private chat text or another person’s profile details.
- Passwords or account credentials.
- Screenshots showing someone else’s personal data.

## Severity guide

| Severity | Meaning | Example |
|---|---|---|
| P0 | Cannot use the app / data or security risk | App crashes on launch; another user’s private data is exposed. |
| P1 | Core flow blocked | Cannot sign up, cannot send a request, cannot chat. |
| P2 | Important but workaround exists | Guide fails but chat works; profile save error with retry. |
| P3 | Cosmetic/minor | Misaligned label, typo, spacing issue. |

P0/P1 reports should be sent to the team immediately, not only added to a form.

## APK fallback (only if Play is unavailable)

If Play installation is blocked, the team may provide a private APK link. Only install an APK from the team’s private link, never a public mirror. Uninstall the Play version first if Android reports a signature mismatch. Report the build number from the APK filename or the app’s profile/settings screen.

## Privacy reminder

- Use synthetic details for profile fields where possible.
- Do not upload someone else’s photo without permission.
- Do not share the opt-in link publicly.
- The pilot build may log diagnostics; do not enter passwords or OTPs into feedback.

## Feedback questions

1. Could you complete sign-up and onboarding without help?
2. Was it clear what to do on Home and Connections?
3. Did chat and Setu Guide work when you tried them?
4. What was the most confusing screen?
5. What was the most serious bug you saw?
6. Would you use this again after the pilot? Why or why not?

Thank you for helping test Sambandh Setu.
