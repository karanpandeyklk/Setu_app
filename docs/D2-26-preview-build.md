# D2-26 preview APK runbook

This is the repo-side preview setup. The login, package-name decision, build,
and physical-device install are manual steps and are still blocked on the items
listed below.

## What is already in the repo

- `eas.json` has a `preview` profile with:
  - `distribution: internal`
  - `environment: preview`
  - `android.buildType: apk` (APK, not AAB)
- No URL, key, or token is stored in `eas.json`. The staging API URL is read
  from the EAS `preview` environment as `EXPO_PUBLIC_API_URL`, matching the
  client in `src/services/api.ts`.
- The app version is `1.0.0` from `app.json`.

## Blockers before the first build

1. **Real backend wiring (owner: Karan).**
   - `src/services/api.ts` still has `USE_MOCK = true` and
     `BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://REPLACE-WITH-STAGING-URL'`.
   - The preview APK will use mock data until Karan flips `USE_MOCK` to `false`
     for the preview build and confirms the staging endpoints.
   - Do not hardcode the staging URL in source. It must come from
     `EXPO_PUBLIC_API_URL`.

2. **Final Android package name (owner: Karan + lead).**
   - `app.json` has no `android.package`. EAS cannot produce a non-interactive
     APK without it.
   - Proposed value only: `com.sambandh.setu`. Confirm with Karan before writing
     it, because the Google sign-in Android client is keyed to package name and
     signing SHA-1.
   - After confirmation, add it under `expo.android.package` and update the
     Google OAuth Android client. Do not commit client secrets.

3. **EAS project link (owner: Ankit).**
   - `app.json` has no `extra.eas.projectId`.
   - Run `npx eas-cli@latest login` and `npx eas-cli@latest init` once. This
     writes the public project ID; it is not a secret.

4. **EAS preview environment (owner: Ankit + Karan).**
   - Set the public staging URL in the `preview` environment:
     ```sh
     npx eas-cli@latest env:set \
       --name EXPO_PUBLIC_API_URL \
       --value https://sambandh-setu-backend.onrender.com \
       --environment preview \
       --visibility plaintext
     ```
   - If Google sign-in is in scope for the preview, also set the public web
     client ID:
     ```sh
     npx eas-cli@latest env:set \
       --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID \
       --value <PUBLIC_WEB_CLIENT_ID> \
       --environment preview \
       --visibility plaintext
     ```
   - `EXPO_PUBLIC_*` values are bundled into the app. Never put a secret here.

## Build and install checklist

- [ ] Karan confirms `USE_MOCK = false` for preview and the staging API base.
- [ ] Lead confirms the final `android.package`.
- [ ] `npx eas-cli@latest login`
- [ ] `npx eas-cli@latest init` (once)
- [ ] Confirm `extra.eas.projectId` is present in `app.json`.
- [ ] Set the `preview` environment variables above.
- [ ] Confirm `eas.json` preview profile has `"buildType": "apk"`.
- [ ] Build: `npx eas-cli@latest build --platform android --profile preview`
- [ ] Download the artifact and verify the file extension is `.apk`, not `.aab`.
- [ ] Install on device 1: `adb install -r <path-to-apk>`
- [ ] Install on device 2: `adb install -r <path-to-apk>`
- [ ] Install on device 3: `adb install -r <path-to-apk>`
- [ ] On each device, confirm the app opens without a red screen.
- [ ] On each device, confirm the backend host in the app is staging, not mock.
- [ ] On each device, complete the D2-34 smoke pass.
- [ ] Record build ID, artifact URL, package name, version, and SHA-256 in the
      evidence table. Do not paste tokens or signing secrets.

## Evidence table

| Device | Android version | Width | APK version | Build ID | Install | Launch | Backend | Screenshot |
|---|---|---|---:|---|---|---|---|---|
| Device 1 |  |  | 1.0.0 |  |  |  |  |  |
| Device 2 |  |  | 1.0.0 |  |  |  |  |  |
| Device 3 |  |  | 1.0.0 |  |  |  |  |  |

## If the build fails

- `android.package` missing: finish blocker 2, then rerun.
- EAS project not linked: finish blocker 3, then rerun.
- API still returns mock data: `USE_MOCK` is still true; do not label the build
  as real-backend.
- Google sign-in fails: package name or signing SHA-1 does not match the
  Android OAuth client. This is a Karan/lead fix, not a CI fix.
- Do not add secrets to `eas.json`, `app.json`, the repo, logs, or this table.
