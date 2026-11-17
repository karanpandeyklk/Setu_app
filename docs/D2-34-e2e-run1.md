# D2-34 E2E run 1 run sheet

Status: **prepared, not executed**. Execution is blocked on the D2-26 preview APK,
three physical Android devices, and the D1-39 device test script. Do not mark any
row pass until it has been run on a device against the staging backend.

## Goal

Prove that every screen opens on the real staging backend, the Setu Guide
suggestions work, and the preview APK is installed on three devices.

## Preconditions

- [ ] D2-26 APK exists and is an `.apk`, not `.aab`.
- [ ] `app.json` has the confirmed `android.package`; version is recorded.
- [ ] `src/services/api.ts` has `USE_MOCK = false` for this build.
- [ ] `EXPO_PUBLIC_API_URL` points at staging, not the placeholder.
- [ ] Staging health returns 200:
      `https://sambandh-setu-backend.onrender.com/health`.
- [ ] The app can reach staging; CORS/network errors are recorded as bugs.
- [ ] Three devices are available and `adb devices` shows them as `device`.
- [ ] Synthetic test accounts and controlled OTP inboxes are ready.
- [ ] `docs/e2e_scenarios.md` from D1-35 is available if merged.
- [ ] D1-39 device test script is available. If it is still missing, record that
      as a blocker and use this sheet as the fallback.
- [ ] No real secrets, OTPs, or email bodies are written to screenshots,
      logcat, issues, or chat.

## Devices

| Run | Device | Android | Width | Font scale | APK version | Build ID | Tester |
|---:|---|---|---:|---:|---|---|---|
| 1 |  |  | 360 | 100% | 1.0.0 |  |  |
| 2 |  |  | 390 | 100% | 1.0.0 |  |  |
| 3 |  |  | 430 | 130% | 1.0.0 |  |  |

Use at least one 360dp device. Repeat a failed screen at 130% font scale before
filing if the failure is layout-related.

## Capture helper

```powershell
.\scripts\adb-capture.ps1 -Serial <serial> -Label home
```

The helper saves a screenshot, a logcat tail, and a UI hierarchy dump under
`artifacts\d2-34\`. Redact OTPs and personal data before attaching anything.
Screenshots are evidence, not a substitute for the written steps.

## Execution order

### 1. Install and launch

1. Install on all three devices: `adb -s <serial> install -r <path-to-apk>`.
2. Confirm the package name and version in Android app info.
3. Launch with the backend reachable. Confirm no red screen and no mock banner.
4. Capture `launch` on each device.

### 2. Auth and onboarding

5. Welcome screen: Get Started, Log in, language control.
6. Create Account: valid synthetic phone/email path; invalid input; keyboard
   does not hide the CTA; terms visible at 360dp.
7. OTP request: submit once; confirm the network call goes to staging.
8. Verify OTP: enter the code from the controlled inbox; wrong code; expired
   code; resend cooldown.
9. Onboarding basics: date of birth, gender, validation.
10. Onboarding languages: select and deselect.
11. Onboarding photo: pick, replace, skip.
12. Onboarding success: Go to Home and Build my profile.

Do not capture the OTP itself. Capture only the redacted screen state.

### 3. Tabs and home

13. Home: current connection, Continue, View all, Discover cards, bookmark,
    notifications bell.
14. Connections: Recommended/Requests/Active filters, search, clear, filter,
    card open, bookmark, request accept/decline where applicable.
15. Chats: list, search, filter chips, open a thread.
16. Guide: open guide, Ask Setu Guide, quick-action tiles.
17. Profile: photo/name/bio edit entries, details, sign out.

### 4. Journey and Guide

18. Journey: all stages visible, current stage, paused/completed states.
19. Stage detail: open each stage; back.
20. Reflect intro: start.
21. Reflect question: single select, multi select, rating, free text, Other.
22. Reflect privacy: each privacy option.
23. Reflect results: filters, locked answers, success state.
24. Reflect done: finish and return to Journey.
25. Setu Guide chat: greeting, all quick actions, each suggestion chip,
    free-text question, copy reply, safety note.
26. Confirm suggestions return useful responses from the real backend, not mock
    strings. Record the intent and whether a response arrived.

### 5. Chat and profile

27. Chat thread: send, receive, failed send/retry, View Journey banner.
28. Chat profile: open from header, shared media empty state, rows, See all.
29. Profile detail: each tab, long values, back.
30. Edit profile: change a field, save, reopen, confirm persistence.
31. Profile builder: each step, chips, add-your-own, skip, finish.

### 6. Family, notifications, and negative paths

32. Family access: member list, resend invite, remove member, confirm.
33. Add family member: relation, contact, submit.
34. Family removed: open and return.
35. Notifications: list, mark all as read, tap each target.
36. Kill and relaunch: session persists.
37. Airplane mode: error state and retry on Home, Connections, Chats, Journey,
    Guide, Profile.
38. Log out and log in again.
39. Background/foreground on a chat and on a form.
40. Rotate if the app allows it; otherwise record portrait-only.

## Pass/fail

- Pass: the screen opens, the real backend answers, the primary action works,
  and no P0/P1 bug is visible.
- Fail: crash, blank screen, mock data in a real-backend run, dead primary CTA,
  unrecoverable network error, or content clipped at the tested width.
- Blocked: prerequisite missing. Record the exact missing item.

## Severity and owner

| Severity | Use for | Owner examples |
|---|---|---|
| P0 | Crash, data loss, auth bypass, secret exposure, unusable app | app/backend/infra |
| P1 | Core flow blocked on a supported device | app/backend |
| P2 | Flow works with an accessibility or responsive workaround | app/design |
| P3 | Minor visual/tap issue | app/design |

Owner is by area, not by person: `app`, `backend`, `infra`, `guide`, `design`.
Use `backend` for API/contract/email failures; `app` for client rendering and
navigation; `infra` for hosting/DNS/CI; `guide` for Guide content.

## Bug filing

```powershell
.\scripts\new-e2e-bug.ps1 `
  -Severity P2 `
  -Owner app `
  -Title "Home View all link has a sub-44 tap target" `
  -Steps "Open Home. Tap View all next to Connections." `
  -Expected "Opens Connections." `
  -Actual "Tap target is about 29px high; hard to hit." `
  -Device "Pixel 6, 412dp" `
  -Evidence "artifacts\d2-34\20261117-101500-home.png"
```

The script creates a `[P2][app]` issue with the `bug` label. Do not put OTPs,
email bodies, tokens, or full addresses in the title, steps, or evidence text.

## Run summary

| Device | Scenarios run | Pass | Fail | Blocked | P0 | P1 | P2 | P3 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |

## Exit criteria

- [ ] All 40 rows attempted on all three devices.
- [ ] Every failure has an issue with severity and owner.
- [ ] Suggestions work on the real backend.
- [ ] Preview APK is installed on all three devices.
- [ ] Screenshots/logs are redacted and stored outside the repo.
- [ ] Summary table is linked from the D2-34 task.

## Current blockers

- No preview APK yet (D2-26 is a draft PR; package name and EAS build are manual).
- No physical-device session in this environment.
- D1-39 device test script has not been found; D1-35 scenarios are not a
  substitute for it.
- Staging still has `access-control-allow-origin: *`; record CORS findings, do
  not change them here.
- OTP/email module is missing, so auth scenarios 7-8 cannot pass yet.
