# D3-17 — closed test launch runbook

Status: **BLOCKED**. Do not create the track or upload until the signed AAB and Play Console prerequisites are ready.

## Preconditions

- [ ] D3-15: signed production AAB with the confirmed package name and version code.
- [ ] D3-16: listing, data safety, content rating, privacy policy, account deletion, and app access forms complete.
- [ ] D3-18: production URL, auth, Guide, and release checklist pass.
- [ ] Play Console account type confirmed (personal vs organization).
- [ ] Tester list supplied by the user; use only those Google-account emails.
- [ ] Feedback form/channel ready.
- [ ] Pilot tester guide ready.
- [ ] Optional APK fallback uploaded to a private location.

Do not put tester emails, opt-in links containing credentials, service-account JSON, or keystore material in this repository or chat.

## Numbered checklist (manual)

1. Sign in to Play Console with the release owner account.
2. Select the Sambandh Setu app. Confirm the package name matches the AAB.
3. Open **Testing → Closed testing**.
4. Create a closed track named `Pilot — <date>` or use the default closed track.
5. Open **Testers** and choose one method:
   - **Email list**: paste only the user-provided tester emails; or
   - **Google Group**: use a group controlled by the team and add the supplied testers there.
6. Save the tester list. Do not exceed the Play Console limit for the chosen method.
7. Open **Releases → Create new release**.
8. Upload the signed production **AAB** from D3-15. Do not upload the pilot APK.
9. Confirm the version code is higher than every previously uploaded build.
10. Add release notes using the template below.
11. Review the app bundle warnings/errors. Fix blocking errors; do not ignore a red upload.
12. Roll out to the closed track at 100% of the track.
13. Copy the **opt-in link** from the track’s testers page.
14. Send the opt-in link and tester guide to the supplied testers **outside the repo** (email/WhatsApp/team channel).
15. Ask each tester to open the opt-in link, accept the invite, and install from Play.
16. Confirm at least one tester successfully installs and opens the build.
17. Verify the tester count and track status in Play Console.
18. Keep the track active for the required closed-test period. For personal accounts, the historical requirement is 12 testers opted in for 14 continuous days; verify the current rule in Play Console Help.
19. Collect feedback through the agreed form/channel and triage P0/P1 immediately.
20. Only after the rule is satisfied, apply for production access (if required) or proceed to the production rollout with the lead’s approval.

## Release notes template

```text
Sambandh Setu closed pilot — build <versionName> (<versionCode>)

Please try:
• Sign-up and onboarding
• Home and discovery
• Sending/accepting a connection request
• Chat after a connection
• Setu Guide quick actions and free text
• Profile view/edit/save

Report bugs with the build number, device model, and steps. Do not include OTPs,
email addresses, phone numbers, or private message text in reports.
```

## Tester invitation copy

```text
Hi! You’re invited to the Sambandh Setu closed pilot.

1. Open this opt-in link on the Android phone you’ll use: <OPT_IN_LINK>
2. Sign in with the Google account you gave us.
3. Accept the invite, then install/update from Google Play.
4. Open the app and complete the pilot guide.

Please send feedback through <FEEDBACK_CHANNEL>. Include the build number and
device model. Do not send OTPs, emails, phone numbers, or private chat text.
```

The opt-in link is not a secret, but do not post it publicly or add real tester emails to the repo.

## Evidence to capture

- Play Console screenshot of the closed track and rollout status.
- Version name/code and package name.
- Tester count and opt-in status (redact emails).
- Opt-in link (store outside the repo if it includes a private group identifier).
- Feedback form link.
- First successful install note from a tester.

Do not paste screenshots containing tester emails or account details into the repo.

## Blockers / risks

- No signed AAB yet (D3-15).
- No privacy policy, deletion path, or reviewer login (D3-16).
- No tester list or feedback form supplied.
- Play account type and current closed-test rule unconfirmed.
- Production auth is not live; the app's Node `/guide/chat` gateway is 404 (the separate Guide service is reachable, but the app does not call it directly).
- If the build is mock-backed, the closed test cannot validate the production contract.

## Done when

- [ ] Closed track exists with the signed AAB available.
- [ ] Version/package confirmed.
- [ ] Testers are invited and at least one has installed.
- [ ] Opt-in link and tester guide sent.
- [ ] Feedback channel is live.
- [ ] Closed-test duration/tester rule is tracked.
- [ ] No tester email, credential, or secret is in the repo or chat.
