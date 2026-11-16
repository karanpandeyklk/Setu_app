# D1-35 — Setu App E2E Scenarios

**Branch:** `d1-35-e2e-scenarios`  
**App:** Setu Expo / React Native  
**Purpose:** Cover the user-facing app journey from sign-up through core launch flows.

## Test execution notes

- The current app configuration has `USE_MOCK = true`; the scenarios below validate the app's mock-backed user journeys unless explicitly run against a configured staging backend.
- `BASE_URL` is currently a placeholder (`https://REPLACE-WITH-STAGING-URL`). Do not report backend/staging coverage until a real staging URL is configured and the backend contract is confirmed.
- Use synthetic/test accounts and fictional profile data only. Do not use real personal data.
- Record each result as **PASS**, **FAIL**, or **BLOCKED** with device/OS, build, date, and evidence.
- For destructive actions, use disposable test data.

## Scenario index

| ID | Area | Scenario | Priority |
|---|---|---|---|
| E2E-01 | Authentication | Welcome screen loads | P1 |
| E2E-02 | Authentication | Continue with phone number | P1 |
| E2E-03 | Authentication | Reject invalid phone number | P1 |
| E2E-04 | Authentication | OTP is sent and displayed in demo mode | P1 |
| E2E-05 | Authentication | Reject incorrect OTP | P1 |
| E2E-06 | Authentication | Verify correct OTP and create session | P1 |
| E2E-07 | Authentication | Restore an existing session after app restart | P1 |
| E2E-08 | Authentication | Sign out and clear local session | P1 |
| E2E-09 | Onboarding | Complete basic profile details | P1 |
| E2E-10 | Onboarding | Validate required name/details | P1 |
| E2E-11 | Onboarding | Select preferred languages | P2 |
| E2E-12 | Onboarding | Add a profile photo | P1 |
| E2E-13 | Onboarding | Skip or deny photo permission gracefully | P2 |
| E2E-14 | Onboarding | Complete onboarding and reach success/home | P1 |
| E2E-15 | Profile | View own profile | P1 |
| E2E-16 | Profile | Edit and save profile details | P1 |
| E2E-17 | Profile | Build profile using profile builder fields | P1 |
| E2E-18 | Home | Home screen loads with current connection state | P1 |
| E2E-19 | Connections | Browse discovery profiles | P1 |
| E2E-20 | Connections | Send interest in a profile | P1 |
| E2E-21 | Connections | Skip a discovery profile | P2 |
| E2E-22 | Connections | View received requests | P1 |
| E2E-23 | Connections | Accept a received request | P1 |
| E2E-24 | Connections | Decline a received request | P1 |
| E2E-25 | Connections | View and withdraw a sent request | P2 |
| E2E-26 | Connections | Open a match/connection profile | P1 |
| E2E-27 | Connections | Bookmark and remove a bookmark | P2 |
| E2E-28 | Chats | View chat list and filter chats | P1 |
| E2E-29 | Chats | Search chats by participant name | P2 |
| E2E-30 | Chats | Open a chat and load message history | P1 |
| E2E-31 | Chats | Send a message and update conversation preview | P1 |
| E2E-32 | Chats | Mark a conversation as read | P2 |
| E2E-33 | Journey | View journey stages for an active connection | P1 |
| E2E-34 | Journey | Complete the current eligible stage | P1 |
| E2E-35 | Reflection | Review privacy information and choose sharing default | P1 |
| E2E-36 | Reflection | Answer questions, save progress, and resume | P1 |
| E2E-37 | Family | View family access and add a family member | P2 |
| E2E-38 | Setu Guide | Open Guide and use each quick action | P1 |
| E2E-39 | Notifications | View notifications and mark one/all as read | P1 |
| E2E-40 | Reliability | Handle slow/failing Guide response and preserve usable UI | P1 |

---

## Detailed test cases

### E2E-01 — Welcome screen loads
**Priority:** P1  
**Preconditions:** App installed; user signed out.  
**Steps:**
1. Launch the app.
2. Wait for fonts and initial loading to finish.
3. Observe the welcome screen and available sign-in options.  
**Expected:** Welcome screen renders without crash, loading indicator eventually disappears, and sign-in actions are visible.

### E2E-02 — Continue with phone number
**Priority:** P1  
**Preconditions:** User is on the welcome screen.  
**Steps:**
1. Choose the phone sign-up/sign-in path.
2. Enter a valid synthetic phone number.
3. Continue.  
**Expected:** App accepts the valid input and proceeds to the OTP flow.

### E2E-03 — Reject invalid phone number
**Priority:** P1  
**Preconditions:** User is on the phone entry screen.  
**Steps:**
1. Enter a malformed or incomplete phone number.
2. Attempt to continue.  
**Expected:** Input is rejected with clear validation; no OTP is issued and the user remains on the phone entry screen.

### E2E-04 — OTP is sent and displayed in demo mode
**Priority:** P1  
**Preconditions:** `USE_MOCK = true`; valid synthetic phone number entered.  
**Steps:**
1. Request an OTP.
2. Observe the verification screen.
3. Capture the demo code shown by the app for this test run.  
**Expected:** App proceeds to OTP verification and displays the generated demo code in mock mode. This is not evidence of real SMS delivery.

### E2E-05 — Reject incorrect OTP
**Priority:** P1  
**Preconditions:** OTP verification screen is open and a demo OTP has been generated.  
**Steps:**
1. Enter a different six-digit code.
2. Submit verification.  
**Expected:** Verification fails, no authenticated session is created, and the user can retry.

### E2E-06 — Verify correct OTP and create session
**Priority:** P1  
**Preconditions:** Valid synthetic phone number and current demo OTP available.  
**Steps:**
1. Enter the correct demo OTP.
2. Submit verification.
3. Continue through any required name/profile onboarding.  
**Expected:** A session is created, token and user are stored locally, and the app proceeds to the appropriate onboarding/home flow.

### E2E-07 — Restore an existing session after app restart
**Priority:** P1  
**Preconditions:** User successfully signed in and local session exists.  
**Steps:**
1. Fully close the app.
2. Relaunch it.
3. Wait for session restoration.  
**Expected:** Stored user session is restored and the user is not unnecessarily sent back to sign-in.

### E2E-08 — Sign out and clear local session
**Priority:** P1  
**Preconditions:** User is signed in.  
**Steps:**
1. Open the profile/settings area.
2. Choose sign out.
3. Relaunch the app.  
**Expected:** Session token and user-specific local profile/onboarding keys are cleared; the app returns to the signed-out entry flow.

### E2E-09 — Complete basic profile details
**Priority:** P1  
**Preconditions:** New user has authenticated and is on basic onboarding.  
**Steps:**
1. Enter the required basic details using synthetic values.
2. Continue.  
**Expected:** Valid details are accepted and the user advances to the next onboarding step.

### E2E-10 — Validate required name/details
**Priority:** P1  
**Preconditions:** Basic onboarding screen is open.  
**Steps:**
1. Leave a required field blank or enter invalid data.
2. Attempt to continue.  
**Expected:** App prevents progression and identifies the field requiring correction.

### E2E-11 — Select preferred languages
**Priority:** P2  
**Preconditions:** User is on language onboarding.  
**Steps:**
1. Select one language.
2. Select an additional language if supported.
3. Continue.  
**Expected:** Selected language choices remain selected and onboarding advances without losing them.

### E2E-12 — Add a profile photo
**Priority:** P1  
**Preconditions:** User is on photo onboarding; device has a test image.  
**Steps:**
1. Grant photo-library permission.
2. Pick a test image.
3. Confirm the selection.  
**Expected:** Selected image is previewed and associated with the user's profile; the app handles the selected image URI without crashing.

### E2E-13 — Skip or deny photo permission gracefully
**Priority:** P2  
**Preconditions:** User is on photo onboarding.  
**Steps:**
1. Deny photo-library permission or choose the skip path if available.
2. Continue onboarding.  
**Expected:** App remains usable, explains/handles the unavailable photo path, and does not crash or become stuck.

### E2E-14 — Complete onboarding and reach success/home
**Priority:** P1  
**Preconditions:** Required onboarding steps completed.  
**Steps:**
1. Complete the final onboarding step.
2. Continue from the success screen.  
**Expected:** Success state appears and the user reaches the authenticated app experience.

### E2E-15 — View own profile
**Priority:** P1  
**Preconditions:** User is signed in.  
**Steps:**
1. Open the profile tab.
2. View profile details and avatar.  
**Expected:** The signed-in user's saved profile information is displayed consistently.

### E2E-16 — Edit and save profile details
**Priority:** P1  
**Preconditions:** User is signed in and profile has editable fields.  
**Steps:**
1. Open edit profile.
2. Change one or more supported fields.
3. Save and reopen the profile.  
**Expected:** Updated values are displayed after save and remain available after navigating away and back.

### E2E-17 — Build profile using profile builder fields
**Priority:** P1  
**Preconditions:** Profile builder is accessible.  
**Steps:**
1. Open the profile builder.
2. Complete several configured fields.
3. Save/continue.
4. Reopen the builder.  
**Expected:** Inputs are accepted according to field configuration and saved answers are retained. Do not assume fields not present in the current configuration.

### E2E-18 — Home screen loads with current connection state
**Priority:** P1  
**Preconditions:** User is signed in; mock data is available.  
**Steps:**
1. Open Home.
2. Observe attention items, unread notification count, current connection, and journey stage area.  
**Expected:** Home renders without crash and reflects the current mock store state; empty states appear where there is no data.

### E2E-19 — Browse discovery profiles
**Priority:** P1  
**Preconditions:** User is signed in; mock discovery profiles available.  
**Steps:**
1. Open Connections/discovery.
2. Browse the available profile cards.
3. Open a profile detail if available.  
**Expected:** Profiles render with their available synthetic details and navigation to profile detail works.

### E2E-20 — Send interest in a profile
**Priority:** P1  
**Preconditions:** At least one discovery profile is available.  
**Steps:**
1. Select a profile.
2. Send an interest request.
3. Revisit sent requests.  
**Expected:** The selected profile is removed from the discovery list and appears in sent requests with a pending/waiting status.

### E2E-21 — Skip a discovery profile
**Priority:** P2  
**Preconditions:** At least one discovery profile is available.  
**Steps:**
1. Skip a profile.
2. Continue browsing.  
**Expected:** Skipped profile is removed from the current mock discovery list and the next available profile is shown.

### E2E-22 — View received requests
**Priority:** P1  
**Preconditions:** Mock received requests exist.  
**Steps:**
1. Open Connections/requests.
2. Select the received requests view.  
**Expected:** Received requests render with available profile details and accept/decline actions.

### E2E-23 — Accept a received request
**Priority:** P1  
**Preconditions:** At least one received request exists.  
**Steps:**
1. Accept a received request.
2. Refresh or revisit active connections.  
**Expected:** Request is removed from received requests and a new active connection appears, starting at the Connect stage in mock mode.

### E2E-24 — Decline a received request
**Priority:** P1  
**Preconditions:** At least one received request exists.  
**Steps:**
1. Decline a received request.
2. Revisit received requests.  
**Expected:** Declined request is removed from the received list and is not added to active connections.

### E2E-25 — View and withdraw a sent request
**Priority:** P2  
**Preconditions:** At least one sent request exists.  
**Steps:**
1. Open sent requests.
2. Select a pending request and withdraw it.
3. Revisit the sent list.  
**Expected:** Withdrawn request is removed from the sent list.

### E2E-26 — Open a match/connection profile
**Priority:** P1  
**Preconditions:** At least one active connection exists.  
**Steps:**
1. Open the active connection.
2. Open its profile detail.  
**Expected:** Correct connection profile is displayed and back navigation returns to the previous connection context.

### E2E-27 — Bookmark and remove a bookmark
**Priority:** P2  
**Preconditions:** A discoverable/profile card is available.  
**Steps:**
1. Bookmark the profile.
2. Verify bookmarked state.
3. Toggle bookmark again.  
**Expected:** Bookmark state toggles on and off; repeated action does not create duplicate bookmark entries.

### E2E-28 — View chat list and filter chats
**Priority:** P1  
**Preconditions:** Mock chats are available.  
**Steps:**
1. Open Chats.
2. View All, Active, New, and Muted filters.  
**Expected:** Each filter displays only chats matching its defined state; switching filters does not crash or retain stale results.

### E2E-29 — Search chats by participant name
**Priority:** P2  
**Preconditions:** Chat list contains multiple synthetic participants.  
**Steps:**
1. Enter a full or partial participant name in chat search.
2. Clear the search query.  
**Expected:** Results are filtered case-insensitively by participant name; clearing the query restores the filtered chat list.

### E2E-30 — Open a chat and load message history
**Priority:** P1  
**Preconditions:** At least one chat exists.  
**Steps:**
1. Open a chat.
2. Review the message thread.
3. Navigate back to the chat list.  
**Expected:** Correct conversation history is shown and back navigation returns to the chat list.

### E2E-31 — Send a message and update conversation preview
**Priority:** P1  
**Preconditions:** Chat thread is open.  
**Steps:**
1. Enter a non-empty test message.
2. Send the message.
3. Return to the chat list.  
**Expected:** Message appears in the thread and the chat preview/time updates. In mock mode, the seeded `ch1` conversation may show a simulated reply.

### E2E-32 — Mark a conversation as read
**Priority:** P2  
**Preconditions:** A chat has an unread count greater than zero.  
**Steps:**
1. Open the unread chat.
2. Return to the chat list.  
**Expected:** The conversation's unread count is cleared in mock mode.

### E2E-33 — View journey stages for an active connection
**Priority:** P1  
**Preconditions:** At least one active connection exists.  
**Steps:**
1. Open Journey.
2. Review the stage sequence and current stage.  
**Expected:** Journey displays the stages associated with the active connection; no-connection state is handled without crash.

### E2E-34 — Complete the current eligible stage
**Priority:** P1  
**Preconditions:** Active connection is at a completable stage.  
**Steps:**
1. Open the current stage.
2. Complete the stage action.
3. Return to Journey/Home.  
**Expected:** In mock mode, completing the current stage advances the connection to the next stage; unrelated or out-of-order stages do not advance it.

### E2E-35 — Review privacy information and choose sharing default
**Priority:** P1  
**Preconditions:** Reflection flow is available.  
**Steps:**
1. Start reflection.
2. Review the privacy information screen.
3. Choose a sharing default (including the keep-private option).
4. Continue.  
**Expected:** Privacy choice is saved locally and reflected when the reflection flow is reopened.

### E2E-36 — Answer questions, save progress, and resume
**Priority:** P1  
**Preconditions:** Reflection questions are available.  
**Steps:**
1. Start the reflection questions.
2. Answer at least one question.
3. Use Save & Exit.
4. Reopen reflection.  
**Expected:** Previously saved answers are restored from local storage and the user can continue without losing progress.

### E2E-37 — View family access and add a family member
**Priority:** P2  
**Preconditions:** User is signed in and family access screens are reachable.  
**Steps:**
1. Open Family Access.
2. Review current access state.
3. Open Add Family Member and enter synthetic test details.
4. Submit if the UI permits.  
**Expected:** Family screens render and validation/confirmation feedback is shown. Do not treat mock UI confirmation as proof of a real invitation or permission change.

### E2E-38 — Open Guide and use each quick action
**Priority:** P1  
**Preconditions:** User is signed in; Guide screen is reachable.  
**Steps:**
1. Open Setu Guide.
2. Select Conversation ideas.
3. Repeat for Help me understand, Tips for next steps, and Privacy & safety.
4. Enter a short synthetic free-text message.  
**Expected:** Each quick action returns a relevant response and the chat remains usable. In mock mode, responses are canned mock replies, not live AI output.

### E2E-39 — View notifications and mark one/all as read
**Priority:** P1  
**Preconditions:** Mock notifications exist.  
**Steps:**
1. Open Notifications.
2. Open/mark one unread notification as read.
3. Use Mark all as read.
4. Revisit the list and Home unread indicator.  
**Expected:** Read state updates and unread count becomes consistent with the notification list.

### E2E-40 — Handle slow/failing Guide response and preserve usable UI
**Priority:** P1  
**Preconditions:** Guide chat is open; use a controlled network delay/failure only in a suitable test environment.  
**Steps:**
1. Submit a short test message.
2. Simulate a timeout or failed Guide request when running against a configured backend.
3. Observe the response and attempt another message.  
**Expected:** App shows the friendly fallback response, remains responsive, and allows retry. In mock mode, this specifically validates the mock response path; it does not validate backend timeout behavior.

---

## Execution result template

| ID | Result (PASS/FAIL/BLOCKED) | Device / OS | Build / Commit | Evidence / Defect |
|---|---|---|---|---|
| E2E-01 |  |  |  |  |
| E2E-02 |  |  |  |  |
| E2E-03 |  |  |  |  |
| E2E-04 |  |  |  |  |
| E2E-05 |  |  |  |  |
| E2E-06 |  |  |  |  |
| E2E-07 |  |  |  |  |
| E2E-08 |  |  |  |  |
| E2E-09 |  |  |  |  |
| E2E-10 |  |  |  |  |
| E2E-11 |  |  |  |  |
| E2E-12 |  |  |  |  |
| E2E-13 |  |  |  |  |
| E2E-14 |  |  |  |  |
| E2E-15 |  |  |  |  |
| E2E-16 |  |  |  |  |
| E2E-17 |  |  |  |  |
| E2E-18 |  |  |  |  |
| E2E-19 |  |  |  |  |
| E2E-20 |  |  |  |  |
| E2E-21 |  |  |  |  |
| E2E-22 |  |  |  |  |
| E2E-23 |  |  |  |  |
| E2E-24 |  |  |  |  |
| E2E-25 |  |  |  |  |
| E2E-26 |  |  |  |  |
| E2E-27 |  |  |  |  |
| E2E-28 |  |  |  |  |
| E2E-29 |  |  |  |  |
| E2E-30 |  |  |  |  |
| E2E-31 |  |  |  |  |
| E2E-32 |  |  |  |  |
| E2E-33 |  |  |  |  |
| E2E-34 |  |  |  |  |
| E2E-35 |  |  |  |  |
| E2E-36 |  |  |  |  |
| E2E-37 |  |  |  |  |
| E2E-38 |  |  |  |  |
| E2E-39 |  |  |  |  |
| E2E-40 |  |  |  |  |
