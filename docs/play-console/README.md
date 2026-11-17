# D3-16 — Play Console submission pack

Status: **NOT SUBMISSION-READY**. These are paste-ready templates with explicit placeholders and blockers. Do not submit claims that have not been verified against the release build.

## Files

| File | Purpose |
|---|---|
| `listing.md` | Store listing fields and asset checklist |
| `data-safety.md` | Data safety draft answers from the current code audit |
| `content-rating.md` | Content-rating questionnaire draft |
| `privacy-and-account.md` | Privacy-policy URL and account-deletion requirements |
| `other-requirements.md` | App access, target audience, ads, target API, and closed-test rules |

## Owners

| Area | Owner | Status |
|---|---|---|
| Store listing copy and brand assets | Bhaivhav | Missing |
| Play Console submission | Sakshi | Blocked on D3-15/D3-16/D3-17 |
| Privacy policy and terms URL | Tanushree (D3-20) | Missing |
| App access/reviewer path | Sakshi + Karan | Missing; OTP login is not testable by a reviewer |
| Data safety technical audit | Ankit/DevOps 2 | Drafted below; release verification required |
| Signed AAB | Ankit (D3-15) | Blocked |

## Hard blockers

1. **No public privacy-policy URL.** A Play listing cannot go live without it.
2. **No account-deletion path.** The backend has no delete-account route and the app has no in-app deletion flow. Play requires both an in-app path and a web deletion request path for apps with accounts.
3. **Reviewer cannot log in.** The app uses phone OTP with a mock code; the production backend has only `/auth/dev-login`. A reviewer cannot receive an OTP. This is a submission blocker.
4. **Store listing copy/assets are missing.** Do not invent the app name, descriptions, screenshots, or contact details.
5. **Production app is still mock-backed.** `USE_MOCK = true`; the data-safety answers must be based on the real release build.
6. **Guide provider disclosure.** If Setu Guide is switched to real Gemini, free-text Guide messages are sent to Google. That must be reflected in the privacy policy and data safety before launch.
7. **Target API level and closed-test rules must be checked live.** Requirements change; verify in Play Console Help at submission time.

## Submission order

1. Confirm package name, signing, and signed AAB (D3-15).
2. Confirm production URL, auth, Guide, and real-backend release build (D3-18).
3. Publish privacy policy and terms (D3-20).
4. Implement and test account deletion (app + backend).
5. Provide a reviewer login path that works in production without a real OTP.
6. Finalize listing copy and assets with Bhaivhav.
7. Complete every Play Console form using the files above.
8. Upload the AAB to the closed track (D3-17).

## Verification rule

Every answer must be re-checked against the exact signed build that is uploaded. A code audit is not a substitute for a device test.
