# D3-01 — E2E run 2 run sheet

Status: **PREPARED, NOT EXECUTED**. Run 1 (D2-34) was never executed, so every Run 1 cell below is `NOT RUN`. Do not invent a Run 1 result. If a real Run 1 result exists outside this repo, fill it in before starting Run 2.

## Goal

Re-run the 40 Day 2 scenarios against the fixed release candidate, record the Run 1 result and linked bug ID, verify fixes, and file new failures as ready-to-paste issues. A new P0/P1 goes to the lead immediately.

## Build and environment

Record exactly one environment for the whole run; do not mix staging and production.

| Field | Value |
|---|---|
| Build type | signed release / preview APK |
| APK/AAB version |  |
| Version code |  |
| Package |  |
| API environment | production / staging (circle one) |
| `EXPO_PUBLIC_API_URL` host |  |
| Build ID / commit |  |
| Run date |  |
| Lead |  |

## Preconditions

- [ ] Signed or fixed preview APK exists and installs.
- [ ] `USE_MOCK = false` for the tested build.
- [ ] API base URL is the intended environment; no placeholder/`localhost`/`10.0.2.2`.
- [ ] Backend health is 200 and the tested auth/Guide routes exist.
- [ ] Three physical Android devices are available (`adb devices` shows `device`).
- [ ] Synthetic accounts and a controlled OTP inbox are ready.
- [ ] D1-39 device script exists; if not, record the blocker and use this sheet.
- [ ] Run 1 data/bug links are available; if not, mark `NOT RUN` honestly.
- [ ] No real OTP, email, token, phone number, or message text is captured.

## Devices

| Run | Device | Android | Width | Font scale | APK version | Build ID | Tester |
|---:|---|---|---:|---:|---|---|---|
| 1 |  |  | 360 | 100% |  |  |  |
| 2 |  |  | 390 | 100% |  |  |  |
| 3 |  |  | 430 | 130% |  |  |  |

Use at least one 360dp device. Repeat a layout failure at 130% font scale before filing.

## Capture helper

```powershell
.\scripts\adb-capture.ps1 -Serial <serial> -Label d3-run2-home
```

Artifacts go outside the repo. Redact OTPs, emails, phone numbers, tokens, and message text before attaching anything.

## Run 2 sheet

Legend: `P` pass, `F` fail, `B` blocked, `NT` not tested. Run 1 result is `NOT RUN` unless a real prior result is supplied.

| # | Scenario | Expected | Run 1 result | Run 1 bug ID | Run 2 result | Run 2 bug ID | Evidence |
|---:|---|---|---|---|---|---|---|
| 1 | Install on device 1 | Installs; package/version correct | NOT RUN | — |  |  |  |
| 2 | Install on device 2 | Installs; package/version correct | NOT RUN | — |  |  |  |
| 3 | Install on device 3 | Installs; package/version correct | NOT RUN | — |  |  |  |
| 4 | Cold launch | No red screen, no mock banner | NOT RUN | — |  |  |  |
| 5 | Welcome | Get Started, Log in, language control work | NOT RUN | — |  |  |  |
| 6 | Create Account | Valid/invalid input; keyboard does not hide CTA; terms visible at 360dp | NOT RUN | — |  |  |  |
| 7 | OTP request | Request reaches the real backend once | NOT RUN | — |  |  |  |
| 8 | Verify OTP | Correct/wrong/expired code and resend cooldown behave | NOT RUN | — |  |  |  |
| 9 | Onboarding basics | DOB/gender validation; Continue gated correctly | NOT RUN | — |  |  |  |
| 10 | Onboarding languages | Select and deselect works | NOT RUN | — |  |  |  |
| 11 | Onboarding photo | Pick, replace, skip work | NOT RUN | — |  |  |  |
| 12 | Onboarding success | Both CTAs navigate correctly | NOT RUN | — |  |  |  |
| 13 | Home | Current connection, Continue, View all, Discover, bookmark, bell | NOT RUN | — |  |  |  |
| 14 | Connections | Tabs, search, clear, filter, card open, bookmark, accept/decline | NOT RUN | — |  |  |  |
| 15 | Chats list | Search, filter chips, open thread | NOT RUN | — |  |  |  |
| 16 | Guide entry | Opens; Ask Setu Guide and quick actions visible | NOT RUN | — |  |  |  |
| 17 | Profile | Photo/name/bio/edit entries, details, sign out | NOT RUN | — |  |  |  |
| 18 | Journey | Stages visible; current/paused/completed states correct | NOT RUN | — |  |  |  |
| 19 | Stage detail | Each stage opens; back works | NOT RUN | — |  |  |  |
| 20 | Reflect intro | Start works | NOT RUN | — |  |  |  |
| 21 | Reflect question | Single/multi/rating/free text/Other work | NOT RUN | — |  |  |  |
| 22 | Reflect privacy | Each privacy option works | NOT RUN | — |  |  |  |
| 23 | Reflect results | Filters, locked answers, success state | NOT RUN | — |  |  |  |
| 24 | Reflect done | Finishes and returns to Journey | NOT RUN | — |  |  |  |
| 25 | Guide chat | Greeting, quick actions, chips, free text, copy, safety note | NOT RUN | — |  |  |  |
| 26 | Guide real backend | Responses are not mock strings; intent/response recorded | NOT RUN | — |  |  |  |
| 27 | Chat thread | Send, receive, failed send/retry, View Journey banner | NOT RUN | — |  |  |  |
| 28 | Chat profile | Opens from header; media empty state; rows; See all | NOT RUN | — |  |  |  |
| 29 | Profile detail | Each tab; long values; back | NOT RUN | — |  |  |  |
| 30 | Edit profile | Change/save/reopen persists | NOT RUN | — |  |  |  |
| 31 | Profile builder | Steps, chips, add-your-own, skip, finish | NOT RUN | — |  |  |  |
| 32 | Family access | Members, resend invite, remove, confirm | NOT RUN | — |  |  |  |
| 33 | Add family member | Relation/contact/submit | NOT RUN | — |  |  |  |
| 34 | Family removed | Open and return | NOT RUN | — |  |  |  |
| 35 | Notifications | List, mark all read, each target | NOT RUN | — |  |  |  |
| 36 | Kill/relaunch | Session persists | NOT RUN | — |  |  |  |
| 37 | Airplane mode | Friendly error/retry on Home, Connections, Chats, Journey, Guide, Profile | NOT RUN | — |  |  |  |
| 38 | Log out/in | Returns to auth and signs in again | NOT RUN | — |  |  |  |
| 39 | Background/foreground | Chat and form state survive | NOT RUN | — |  |  |  |
| 40 | Rotation | Rotates or records portrait-only | NOT RUN | — |  |  |  |

## Known issues to re-check (not Run 1 evidence)

| Issue | Area | Why it matters in Run 2 |
|---|---|---|
| frontend #8 | Sign-up | Scroll/terms overlap at 360dp; step 6. |
| Guide #15/#26 | Guide | Real-mode fallback; steps 25–26. |
| Guide #32 | Guide deploy | API-key default; verify real responses, step 26. |
| Guide #30 | Staging | Environment unconfirmed; record the host used. |
| auth/OTP missing | Backend | Steps 7–8 are blocked until routes exist. |
| `/guide/chat` missing | Backend | Steps 25–26 are blocked until deployed. |

## Pass/fail rules

- **Pass:** screen opens, real backend answers, primary action works, no P0/P1.
- **Fail:** crash, blank screen, mock data in real mode, dead CTA, unrecoverable network error, or clipped content at the tested width.
- **Blocked:** prerequisite missing. Record the exact missing item.
- A failure on one device must be recorded on that device; do not average it away.

## New bug issue template (ready to paste)

```text
Title: [P<severity>][<owner>] <short symptom> on <screen>

Build: <versionName> (<versionCode>), <package>
Environment: <production|staging>, <API host>
Device: <model>, Android <version>, <width>dp, font <scale>
Preconditions: <account state / data>

Steps:
1. ...
2. ...
3. ...

Expected:
...

Actual:
...

Frequency: <always|intermittent|once>
Evidence: <artifact name outside repo>
Run 1 link: <issue # or NOT RUN>
Severity rationale: <why P0/P1/P2/P3>
```

File with the helper after redacting evidence:

```powershell
.\scripts\new-e2e-bug.ps1 `
  -Severity P2 `
  -Owner app `
  -Title "Home View all link has a sub-44 tap target" `
  -Steps "Open Home. Tap View all next to Connections." `
  -Expected "Opens Connections." `
  -Actual "Tap target is about 29px high; hard to hit." `
  -Device "Pixel 6, 412dp" `
  -Evidence "artifacts\d3-run2\20261117-101500-home.png"
```

## Escalation

- **P0/P1:** message the lead immediately; do not wait for the end-of-run summary.
- **P2/P3:** file the issue and include it in the run summary.
- Do not fix another owner’s bug in this task; report severity and area owner (`app`, `backend`, `infra`, `guide`, `design`).
- Do not paste OTPs, email bodies, tokens, or private messages into issues or chat.

## Run summary

| Device | Attempted | Pass | Fail | Blocked | P0 | P1 | P2 | P3 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 |  |  |  |  |  |  |  |  |
| 2 |  |  |  |  |  |  |  |  |
| 3 |  |  |  |  |  |  |  |  |

## Done when

- [ ] All 40 rows attempted on all three devices, or explicitly blocked.
- [ ] Every failure has a ready-to-paste issue with severity/owner/build/device.
- [ ] Run 1 result and linked bug ID are recorded (or marked `NOT RUN`).
- [ ] New P0/P1 were escalated to the lead immediately.
- [ ] Suggestions work on the real backend, not mock strings.
- [ ] Artifacts are redacted and outside the repo.
- [ ] The E2E gate is green, or the remaining blockers are listed with owners.

## Current blockers

- Run 1 was never executed.
- No fixed signed build/APK yet (D3-15).
- No physical-device session in this environment.
- Auth/OTP routes and `/guide/chat` are missing in production.
- D1-39 device script is still missing.
