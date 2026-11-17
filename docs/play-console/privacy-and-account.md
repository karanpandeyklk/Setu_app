# Privacy policy, terms, and account deletion

Status: **MISSING**. D3-20 owns the public policy/terms page. This file is the checklist and the minimum content Play review will expect.

## Public URLs

| Item | Draft value | Status |
|---|---|---|
| Privacy policy | `https://<public-domain>/privacy` | Missing |
| Terms of use | `https://<public-domain>/terms` | Missing |
| Account deletion request | `https://<public-domain>/delete-account` | Missing |
| Support contact | `<support-email-provided-by-owner>` | Missing |
| Website | `https://<public-domain>` | Missing |

Requirements:

- Publicly reachable without login or region blocking.
- Stable URL (no expiring preview link).
- Uses the same app name and developer identity as the Play listing.
- Accessible from the app and the Play listing.
- No real secrets, tester emails, or internal hostnames in the page.

## Privacy policy minimum contents

1. Who operates the app and how to contact them.
2. What data is collected: account (name, email, phone), profile (DOB, gender, languages, photo, education/profession/bio), connections, chat, Guide prompts, journey/reflection answers, bookmarks, notifications, diagnostics.
3. Why each category is collected.
4. Legal basis / consent language, if applicable.
5. Who receives data: Render, MongoDB Atlas, Google Sign-In, Brevo (if email OTP), Google Gemini (if real Guide), Sentry (if configured).
6. Whether data is sold or used for advertising: **no**, if that remains true.
7. Retention periods and deletion process.
8. Security measures and the limits of those measures. Do not claim E2E encryption.
9. Children’s privacy: 18+ only.
10. User rights and how to exercise them.
11. International transfers, if applicable.
12. Policy version and change notice.

Do not publish the policy until the data-safety table and the release build agree.

## Account deletion — Play requirement

Play requires apps that allow account creation to provide:

1. An **in-app** deletion path.
2. A **web** deletion-request path that works without reinstalling the app.

Current code: **neither exists**. There is no delete-account route in the backend and no delete control in the app. Local sign-out/clear-data does not delete the server account.

### Required in-app flow

- Settings/Profile → “Delete account”.
- Explain what will be deleted and what must be retained (for example, fraud/legal records).
- Require a fresh authentication step.
- Offer a short grace period only if the policy clearly states it.
- Delete/anonymize: user, profile, connections, requests, chats/messages, notifications, journey answers, bookmarks, and local session.
- Show a confirmation and a support contact.
- Test with a synthetic account; record the evidence.

### Required web page copy (draft)

```text
Delete your Sambandh Setu account

Use this page to request deletion of your Sambandh Setu account and associated
data. You do not need to install the app.

We will verify ownership using the email or phone number on the account. We will
delete [list categories] within [retention period], except where we must retain
records for legal, security, or fraud-prevention reasons. [Describe any grace
period.]

Contact: <support-email-provided-by-owner>
```

Do not collect an OTP or password on the public deletion page unless the flow is designed and secured. Prefer a verified email link or a support-mediated request.

## Terms of use minimum contents

- Eligibility (18+).
- Acceptable use: no harassment, impersonation, spam, illegal content, or sharing another person’s private data.
- User content ownership and licence.
- Moderation/reporting/blocking process (must exist if UGC is enabled).
- Account suspension/deletion.
- Disclaimers and limitation of liability (legal review required).
- Governing law and contact.

## Checklist

- [ ] Privacy policy live at a stable public URL.
- [ ] Terms live at a stable public URL.
- [ ] Policy matches data-safety answers and release SDKs.
- [ ] In-app delete-account flow implemented and tested.
- [ ] Public web deletion request page implemented and tested.
- [ ] Deletion covers backend records, not just local storage.
- [ ] Support inbox is monitored.
- [ ] No real user data in examples or logs.
