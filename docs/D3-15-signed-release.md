# D3-15 — signed production AAB and pilot APK

Status: **BLOCKED**. Build profiles and ignore rules are prepared; the build cannot be signed correctly until the package name, EAS project, and signing method are confirmed.

## What changed in this PR

- Added `production` (Play AAB) and `pilot-apk` (direct-install APK) profiles to `eas.json`.
- Set `cli.appVersionSource` to `remote` and `autoIncrement` on both release profiles.
- Added ignore rules for `*.jks`, `*.keystore`, `*.p12`, `*.key`, `credentials.json`, and local env files.
- Added this runbook.

No keystore, password, `credentials.json`, or real secret is included.

## Decisions still required

| Decision | Options | Recommendation / impact |
|---|---|---|
| Package name | `com.edurank.sambandhsetu` (provisional in repo docs) or `com.sambandh.setu` (other docs) | **Confirm before the first upload.** Changing it after Play publication creates a new app; Google OAuth Android client and SHA-1 must be redone. |
| Signing | EAS-managed credentials or own keystore | EAS-managed is fastest for launch. Own keystore gives direct control but needs backup and upload-key handling. |
| Play App Signing | Enrol on first AAB upload | Recommended. Google holds the app-signing key; the upload key can be reset if lost. |
| EAS project | `extra.eas.projectId` is missing | Run `eas init` once, then commit the generated project ID (public, not a secret). |
| Version code | Remote auto-increment in this profile | Build `production` first, then `pilot-apk`; do not upload the pilot APK to Play. |

Do not generate a keystore or start a release build until the package and signing choices are confirmed by the lead.

## Prerequisites

1. `android.package` is present in `app.json` with the confirmed value.
2. `extra.eas.projectId` exists for the Setu app.
3. EAS `production` environment contains `EXPO_PUBLIC_API_URL`; see D3-18.
4. Backend auth and `/guide/chat` work in production (D3-18).
5. `USE_MOCK` is false and the real backend path is tested.
6. D3-18 cleartext config is merged (`usesCleartextTraffic: false`).
7. Signing method is chosen and the credential owner is named.

## Signing option A — EAS-managed (recommended for launch)

EAS generates and stores the Android keystore. The first Play upload enrols it in Play App Signing.

```powershell
npx eas-cli@latest login
npx eas-cli@latest init
npx eas-cli@latest credentials --platform android
```

In the interactive menu, choose the EAS-managed keystore path. Record only the public certificate fingerprint in the release notes; never paste a password or keystore file.

Account safety:

- Enable 2FA on the Expo account.
- Name at least two project owners.
- Confirm the team can still run `eas credentials` if the original builder is unavailable.
- Do not export the keystore into the repository or chat.

## Signing option B — own keystore

Generate outside the repository, for example in an encrypted local folder. Use a strong password from the password manager; do not type it into a tracked file.

```powershell
keytool -genkeypair -v `
  -storetype JKS `
  -keystore "$env:USERPROFILE\secure\setu-upload.jks" `
  -alias setu-upload `
  -keyalg RSA -keysize 2048 -validity 10000
```

Then upload/select it through the interactive EAS credentials flow or a local `credentials.json` that is ignored by git. Never commit `credentials.json`.

Backup checklist:

- [ ] Two encrypted copies in separate locations (password manager + offline encrypted storage).
- [ ] Password stored separately from the keystore.
- [ ] Restore tested on a second machine or clean folder.
- [ ] Access list and owner recorded in the launch tracker.
- [ ] Public SHA-1/SHA-256 fingerprint recorded; private material never shared.
- [ ] If the upload key is lost, use the Play Console upload-key reset flow; do not create a new app.

## Build commands (manual)

Set the production URL only in the EAS environment, never in `eas.json`.

```powershell
npx eas-cli@latest env:list --environment production
npx eas-cli@latest build --platform android --profile production
```

The `production` profile builds an **AAB** for Play. Wait for it to finish, then build the pilot artifact:

```powershell
npx eas-cli@latest build --platform android --profile pilot-apk
```

The `pilot-apk` profile builds an **APK** with the same production environment. Because both profiles auto-increment, build the Play AAB first. Do not upload the pilot APK to Play.

List and download artifacts:

```powershell
npx eas-cli@latest build:list --platform android --limit 5
```

Download from the EAS build page. Keep artifacts outside the repository.

## Artifact verification (manual)

```powershell
jarsigner -verify -verbose -certs .\setu-release.aab
jarsigner -verify -verbose -certs .\setu-pilot.apk
Get-FileHash .\setu-release.aab -Algorithm SHA256
Get-FileHash .\setu-pilot.apk -Algorithm SHA256
```

If Android build-tools are installed, also run:

```powershell
apksigner verify --print-certs .\setu-pilot.apk
aapt dump badging .\setu-pilot.apk
```

`adb`, `apksigner`, and `bundletool` are not currently on PATH on this machine; install Android SDK build-tools outside the repo or use the EAS dashboard metadata. Confirm the package name and version code from the build page and the device install.

## Security rules

- Never commit a keystore, `credentials.json`, password, or Play service-account JSON.
- Never paste a keystore password, upload key, service-account JSON, or tester email into chat, a PR, an issue, or a log.
- Do not put `EXPO_PUBLIC_*` secrets in the app; those values are public in the bundle.
- Do not share the AAB/APK via a public link containing account credentials.
- Stop and report if a secret is found in a branch, commit, log, or artifact.

## Manual checklist

- [ ] Confirm package name and record the decision.
- [ ] Confirm signing method and owner.
- [ ] Add `android.package` and EAS project ID.
- [ ] Confirm `EXPO_PUBLIC_API_URL` in EAS `production`.
- [ ] Build `production` AAB; verify signature and package/version.
- [ ] Build `pilot-apk`; verify signature and package/version.
- [ ] Install the pilot APK on a physical device.
- [ ] Upload the AAB only after D3-16/D3-17 closed-test setup is ready.
- [ ] Record artifact SHA-256 and build IDs in the launch tracker.

## Done when

- [ ] Signed AAB exists with the confirmed package name and an incremented version code.
- [ ] Pilot APK installs on a physical device and uses the production API.
- [ ] Artifact signatures verify.
- [ ] No signing material exists in git, logs, PRs, or chat.
- [ ] Keystore backup/restore is confirmed (own-keystore path) or EAS credential ownership is confirmed (EAS-managed path).

## Current blockers

- Package name unconfirmed.
- EAS project ID missing.
- Signing method and credential owner unconfirmed.
- `USE_MOCK` is still true; real backend auth and Guide are not live.
- D3-18 production URL and redeploy are not confirmed.
