# Data safety — draft answers from the code audit

Status: **DRAFT — NOT SUBMISSION-READY**. Re-check every row against the signed release build and the final privacy policy. The current app is mock-backed (`USE_MOCK = true`), so the production data flow is not yet exercised.

## Play Console top-level answers (draft)

| Question | Draft answer | Evidence / caveat |
|---|---|---|
| Does your app collect or share required user data types? | **Yes** | Account, profile, chat, and Guide data are processed. |
| Is all collected data encrypted in transit? | **Yes, for HTTPS production traffic** | Production API is HTTPS. Cleartext is disabled in D3-18. Re-verify on device. |
| Do you provide a way for users to request that their data is deleted? | **No — must become Yes before launch** | No backend delete-account route and no in-app flow exist. |
| Do you have a privacy policy? | **No public URL yet** | D3-20 owns it. |
| Is your app directed to children? | **No — adults 18+** | Profile model enforces age 18–100; confirm onboarding and listing. |
| Does your app contain ads? | **No** | No ad SDK found. |
| Does your app use independent security review? | **No** | Do not claim one. |

## Data types

| Data type | Collected? | Required/optional | Purpose | Shared? | Notes |
|---|---|---|---|---|---|
| Name | Yes | Required | Account and profile | Processors only | User-entered at onboarding. |
| Email address | Yes | Required in backend model | Account/auth, OTP email if enabled | Brevo only if email OTP is enabled | Backend excludes email from normal serialization. |
| Phone number | Yes (client flow) | Required for phone OTP | Account/auth | SMS provider only if real OTP is enabled | No production OTP route exists yet. |
| Date of birth | Yes (client) | Required | Age eligibility and profile | No | Stored locally today; backend `Profile.age` is stored. |
| Gender | Yes | Required | Profile and discovery filters | No | Backend profile field. |
| Languages | Yes | Onboarding | Profile | No | Client profile preference. |
| Profile photo | Yes, optional | Optional | Profile | Processors only | User-selected image; no real photo in test data. |
| Other profile details (education, profession, bio, lifestyle, family, preferences) | Yes | Mostly optional | Matchmaking/profile | Visible to matched users per sharing rules | Confirm exact sharing rules with the product owner. |
| Chat messages | Yes | User-generated | Chat functionality | Processors only | Stored in MongoDB; not E2E encrypted. |
| Guide messages and prompts | Yes, when Guide is used | Optional | Guide functionality | Google Gemini if `USE_MOCK=false` and Gemini is enabled | Currently production Guide is mock/404. Must disclose before real AI launch. |
| Connection requests and connection status | Yes | App functionality | Matchmaking | No | Participants can see shared status. |
| Bookmarks/saved profiles | Yes | Optional | App functionality | No | Backend route missing today; client has mock/local behavior. |
| Journey/reflection answers | Yes | Optional | Guided journey | No | Stored on device and backend. |
| Notification read state | Yes | App functionality | Notifications | No | Backend notification state. |
| Crash logs/diagnostics | Conditional | Automatic if enabled | Stability | Sentry if DSN configured | Backend has optional Sentry with request scrubbing. Frontend has no Sentry dependency found. |
| IP address | Transiently | Automatic | Security/rate limiting | Hosting provider logs | Backend rate limiting uses IP; do not use for advertising. |
| Approximate/precise location | No | — | — | — | No location permission or SDK found. |
| Health/fitness, financial, contacts, calendar, SMS/call logs | No | — | — | — | No such collection found. |

## Sharing and service providers

List every third party that receives data in the release build; do not rely on this table alone.

| Provider | Data | When | Required action |
|---|---|---|---|
| Google Sign-In | Google account identity, email/name/photo if returned | If Google login is enabled | Disclose authentication sharing; confirm Google API disclosure. |
| Google Gemini | Guide free-text message, intent, stage/topic | Only if Guide `USE_MOCK=false` and Gemini is enabled | Disclose in privacy policy and data safety; do not launch real AI without it. |
| Brevo | Email address, OTP email content | Only if email OTP sender is implemented | Disclose; confirm sender identity and retention. |
| Render | Hosted API traffic and logs | Always | Hosting processor; confirm log retention. |
| MongoDB Atlas | Account, profile, chat, journey data | Always | Hosting/database processor; confirm region and retention. |
| Sentry | Crash/error diagnostics | Only if DSN is configured | Confirm request scrubbing; do not send message/email/OTP content. |

## Account deletion and retention

Current state:

- No `DELETE /users/me` (or equivalent) route.
- No in-app “Delete account” control.
- No public deletion-request page.
- Deleting local app data clears the device copy but not the backend account.

Required before Play submission:

1. In-app deletion path that explains what is deleted and what is retained (for example, legal/tax records).
2. Public web deletion-request URL, reachable without login.
3. Backend job/route that deletes or anonymizes the account, profile, chats, requests, notifications, journey answers, and bookmarks.
4. Confirmation screen and a short retention statement.
5. A test account deletion with evidence; do not mark “data deletion available” before this passes.

## Data safety form checklist

- [ ] Confirm the release build’s actual SDKs and network calls.
- [ ] Confirm the privacy policy matches this table.
- [ ] Confirm Gemini/Brevo/Google Sign-In are enabled or removed.
- [ ] Confirm deletion path and URL.
- [ ] Confirm encryption-in-transit claim on a device.
- [ ] Do not claim E2E encryption, anonymity, or “no data collection”.
- [ ] Have the privacy owner review the final answers.
