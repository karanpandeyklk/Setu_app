# D3-18 — production base URL and release-build test

Status: **BLOCKED**. Repo-side config is prepared; the release build cannot pass yet.

## What changed in this PR

- Added the `expo-build-properties` config plugin with
  `android.usesCleartextTraffic: false`, so production Android builds are
  HTTPS-only.
- Added this runbook with the hardcoded-URL audit, production environment
  setup, and the real-device release checklist.

No staging or production URL is stored in this repository. `EXPO_PUBLIC_API_URL`
is read at build time from the EAS `production` environment.

## Production URL

Aditya's deployment doc names:

- Node API: `https://sambandh-setu-api-prod.onrender.com`
- Setu Guide: `https://setu-guide-prod.onrender.com`

The Node URL is the intended `EXPO_PUBLIC_API_URL`. **Confirm with Aditya before
building.** Do not put a secret in either value; both are public.

## Hardcoded-URL audit

Checked `src/` and `app.json` on `origin/dev`:

| Pattern | Result |
|---|---|
| `http://` or `https://` API URLs | Only the placeholder in `src/services/api.ts` |
| `localhost` | None |
| `10.0.2.2` | None |
| Staging domain | None |
| `picsum.photos` | Mock avatar images only, not an API endpoint |
| Google client ID | Read from `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, not hardcoded |

The fallback `https://REPLACE-WITH-STAGING-URL` is not a real service. A release
build must fail visibly rather than silently use mock data; that wiring is owned
by Karan.

## Blockers that prevent a working release build

1. **`USE_MOCK = true` in `src/services/api.ts`.** The app never reaches the
   backend even if the base URL is correct. Owner: Karan.
2. **Auth contract mismatch.** The client uses phone OTP
   (`/auth/send-otp`, `/auth/verify-otp`); the backend has only
   `/auth/dev-login` and no OTP route. Owner: Karan + Sakshi/Bharath.
3. **Google login route.** Real mode calls `/auth/google`; the backend does not
   implement it.
4. **Guide route.** The client calls `POST /guide/chat`; the backend does not
   implement it. Production returns 404. Owner: backend.
5. **Production deployment is stale.** `/health` is 200, but production has no
   Helmet headers, OTP is 404, and `/guide/chat` is 404. Owner: Aditya/backend.
6. **Android package and signing inputs are missing.** `app.json` has no
   `android.package`, no `versionCode`, and no `extra.eas.projectId`. Owner:
   Karan/lead + Ankit (D3-15).
7. **Production API.** Do not mark D3-18 done until the real auth and Guide calls
   work from the signed build.

## EAS environment setup (manual)

Set public values only. Never put a secret in an `EXPO_PUBLIC_*` variable.

```powershell
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest env:list --environment production
```

If the variable does not exist yet:

```powershell
npx eas-cli@latest env:create `
  --name EXPO_PUBLIC_API_URL `
  --value https://sambandh-setu-api-prod.onrender.com `
  --environment production `
  --visibility plaintext
```

If the public Google web client ID is needed in the release:

```powershell
npx eas-cli@latest env:create `
  --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID `
  --value <PUBLIC_WEB_CLIENT_ID> `
  --environment production `
  --visibility plaintext
```

Do not add `EXPO_PUBLIC_*` values to `app.json`, `eas.json`, or this file.

## Cleartext verification

Config now contains:

```json
[
  "expo-build-properties",
  {
    "android": {
      "usesCleartextTraffic": false
    }
  }
]
```

After a production build, confirm on the device that an `http://` request fails
and the app only uses `https://`. The web development server may still use
localhost; that is not a release build.

## Release-build test checklist (manual, real device)

Install the signed production build and complete this in order.

- [ ] Install the signed APK/AAB build and confirm the package/version.
- [ ] Cold launch with Wi-Fi; no red screen, no mock banner.
- [ ] Sign up with the production OTP email path; confirm the sender and that
      the OTP arrives from the production identity. **Currently blocked.**
- [ ] Onboarding: basics, languages, photo, success.
- [ ] Home loads; current connection and suggestions are from the backend.
- [ ] Connections: recommended, requests, active, search, open a profile.
- [ ] Chat: send, receive, failed-send/retry, View Journey banner.
- [ ] Setu Guide: all four quick actions, free-text, and the friendly fallback
      when the backend is unavailable. **Currently blocked by `/guide/chat`.**
- [ ] Profile: view, edit, save, reopen, confirm persistence.
- [ ] Wrong connection ID returns 403 (backend contract).
- [ ] Airplane mode: friendly error and retry on each main tab.
- [ ] Kill/relaunch: session persists.
- [ ] Sign out and sign in again.

## Log privacy check (manual)

Capture logcat to a file **outside the repository**:

```powershell
adb logcat -c
adb logcat > "$env:TEMP\setu-release-logcat.txt"
```

Reproduce signup, chat, Guide, and profile edit. Then inspect the file for
tokens, email addresses, OTPs, or message text. Do not paste any matching line
into chat, a PR, or an issue; report only the category and file:line.

The frontend still has release-visible `console.log` calls in
`CreateAccountScreen`, `AuthContext`, `OnboardingPhotoScreen`, and `HomeScreen`.
They must be checked in the release build; this is an app-owner fix, not a
DevOps code change.

## Done when

- [ ] Production URL is confirmed and set on EAS.
- [ ] Backend auth and `/guide/chat` work in production.
- [ ] Signed release build installs and completes the checklist.
- [ ] Logcat contains no token, email, OTP, or message text.
- [ ] No staging URL is hardcoded in the release source.

## Current status

**BLOCKED** on Karan's real-backend wiring, backend auth/Guide routes, Aditya's
production redeploy, and the signed build from D3-15. Do not mark this task done.
