# Other Play Console requirements

Status: **BLOCKED**. Complete these only after the signed release and real backend are testable.

## App access

All app functionality is behind authentication. Play reviewers need a working way in.

Current state:

- The client uses phone OTP with a mock/demo code while `USE_MOCK = true`.
- The production backend has only `/auth/dev-login`; there is no `/auth/send-otp` or `/auth/verify-otp`.
- A reviewer cannot receive an OTP on a real device.

Required:

1. A production-capable reviewer path that does not depend on a personal phone number.
2. Instructions in Play Console → App content → App access.
3. No credentials in this repository, PR, issue, or chat. Enter them only in the Play Console field.
4. A test account with enough content to exercise discovery, requests, chat, Guide, and profile.

### App access instructions template

```text
Sambandh Setu requires an account.

1. Open the app and choose Sign in.
2. Use the reviewer account below.
3. Complete the OTP step using the reviewer flow described here.
4. On Home, open Connections, send a request, open an accepted connection,
   send a chat message, and open Setu Guide.

Reviewer account: [enter only in Play Console]
OTP/reviewer flow: [enter only in Play Console]
```

Do not use a real employee account or a real phone number.

## Target audience and content

- Age: **18+ only**.
- Do not select “Designed for Families” or include children in the target audience.
- Confirm the onboarding date-of-birth check rejects under-18 users.
- Content rating must match the 18+ audience.
- If the app is positioned as dating/matchmaking, confirm the category and policy implications with the lead.

## Ads and purchases

- Ads: **none found**.
- In-app purchases: **none found**.
- If either changes before submission, the listing, data safety, and content rating must be updated.

## Target API level

Do not guess the target SDK from this document. Before submission:

1. Open the signed AAB metadata in Play Console or the EAS build page.
2. Record `targetSdkVersion` and `compileSdkVersion`.
3. Compare with the current Play target-API requirement in Play Console Help.
4. If the requirement changes during the launch window, rebuild with the supported Expo SDK/build-properties rather than editing native files by hand.
5. Confirm 64-bit native libraries are present if any native module requires them.

## Permissions and sensitive access

Audit the signed manifest, not just `app.json`:

- Photo library / image picker: used for profile photos.
- Camera: verify whether the image picker requests it and whether it is optional.
- Notifications: verify the runtime prompt and whether it is required.
- Internet: required.
- No location, contacts, SMS, call-log, microphone, or health permissions should be present unless a feature truly needs them.
- Every sensitive permission needs a clear in-app rationale and a Play declaration if applicable.

## Closed-testing rules

These rules change; verify in Play Console Help at submission time.

- Personal developer accounts created after the published cutoff have historically needed a closed test with at least **12 testers who opted in for at least 14 continuous days** before applying for production access.
- Organization accounts may be exempt; confirm the account type.
- Testers must be real Google accounts and must opt in through the track link.
- The track must be active and the AAB must be available to those testers.
- Keep the tester list and opt-in evidence; do not publish tester emails in the repo.
- A closed test is not a substitute for the D3-18 release checklist.

Operational steps are in `docs/play-console/closed-test.md`.

## User-generated content and moderation

The app has profiles, photos, and chat. Play expects a safety process for UGC. Current code has no report/block flow found.

Before submission, decide and document:

- How users report a profile or message.
- How users block another user.
- How reports are reviewed and how quickly.
- How abusive content is removed.
- How the policy is shown in-app.
- Whether any automated moderation exists.

Do not claim moderation in the listing or content rating unless it is implemented.

## Store listing and policy declarations

- [ ] Privacy policy URL live.
- [ ] Account deletion URL live.
- [ ] Data safety form matches the release build.
- [ ] Content rating completed.
- [ ] App access instructions tested by someone outside the team.
- [ ] Target audience 18+ confirmed.
- [ ] Ads/purchases declarations match the build.
- [ ] Target API level verified.
- [ ] UGC report/block process decided.
- [ ] No real user data or secrets in any Play Console field or asset.
