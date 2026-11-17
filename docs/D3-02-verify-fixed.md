# D3-02 — verify Fixed issues

Status: **NOT VERIFIED**. No app issue is marked Fixed. Only four Guide issues carry Fixed/rollout-pending in their titles, and none has user-confirmed verification.

Do not mark an issue Verified from a code review, a green unit test, or the author’s claim. Verification requires the named build/deployment and the user/lead confirmation.

## Scope

| Repo | Fixed candidates | Notes |
|---|---|---|
| frontend | None found | Open P1 #8 remains; not Fixed. |
| backend | None found | Do not infer from merged PRs. |
| setu-guide | #19, #20, #21, #32 | #19–#21 “Fixed in #18”; #32 code done, rollout pending. |

## Verification table

| Bug | Severity | Owner | Current status | Build/deploy tested | Evidence | Verified by/date |
|---|---|---|---|---|---|---|
| Guide #19 | Medium | DevOps 1 | Fixed in #18; not verified |  |  |  |
| Guide #20 | Medium | DevOps 1 | Fixed in #18; not verified |  |  |  |
| Guide #21 | High (scanner) | DevOps 1 | Fixed in #18; not verified |  |  |  |
| Guide #32 | Medium | Lead / DevOps 1 | Code done; rollout pending |  |  |  |

`Build/deploy tested` must be a commit SHA, image digest, or deployment ID — not “latest” or “dev”.

## Guide #19 — per-user rate-limit bypass

**Claim:** `user_id` is normalized with `.strip().casefold()` for rate-limit bucket keys, so case/whitespace variants share one quota; cache keys and stored IDs stay byte-exact.

Checklist:

- [ ] Check out the verified Guide commit and install test deps.
- [ ] Run the regression test:
  ```powershell
  python -m pytest tests/ratelimit/test_rate_limit_review.py::test_user_id_format_and_case_variants_share_the_same_quota -q
  ```
- [ ] Confirm the test fails on the pre-fix commit or demonstrate the pre-fix behavior in a scratch build.
- [ ] With `RATE_LIMIT_PER_USER=3/minute`, send 3 requests as `u1`; the next request as `U1` or `" u1"` must return 429, not 200.
- [ ] Confirm a genuinely different id (`u0001`) still gets its own quota.
- [ ] Record the deployment/build ID and evidence path.
- [ ] Ask the lead/user to confirm before changing the label.

Do not mark Verified if only the unit test passes but the deployed build is unknown.

## Guide #20 — limiter memory growth

**Claim:** after the day-old sweep, the limiter evicts least-recently-used buckets down to 90% of `_MAX_KEYS`; an active IP bucket still returns 429 after a high-cardinality flood.

Checklist:

- [ ] Run the regression test:
  ```powershell
  python -m pytest tests/ratelimit/test_rate_limit_review.py::test_limiter_memory_stays_bounded_under_distinct_user_ids -q
  ```
- [ ] Confirm the pre-fix behavior (11,001+ keys, sweep removed 0) in a scratch build or the issue evidence.
- [ ] Confirm the post-fix key count stays bounded and the active IP bucket still blocks.
- [ ] Record the build/deploy ID and evidence.
- [ ] Note the documented trade-off: above `_MAX_KEYS`, per-user limits are approximate.
- [ ] Do not claim Redis-backed exactness; the fix is in-memory.

## Guide #21 — build tools/CVEs in image

**Claim:** runtime image no longer ships pip/setuptools/wheel; Python-side Trivy findings are 0; container tests 3/3 pass.

Checklist:

- [ ] Build the exact release image and record the image digest.
- [ ] Confirm pip/setuptools/wheel are absent:
  ```powershell
  docker run --rm --entrypoint sh <image> -c "command -v pip || true; command -v pip3 || true; python -c 'import setuptools' 2>&1 || true"
  ```
  Expected: no pip path and a `ModuleNotFoundError` for setuptools.
- [ ] Run the container test suite the issue names (3/3 pass).
- [ ] Run Trivy on the exact digest; record Python HIGH/MEDIUM/LOW counts. The claim is 0 Python-side findings.
- [ ] Confirm `import app.api.main` succeeds.
- [ ] Record image digest, scan output path, and test output path.
- [ ] Do not mark Verified from a local build that is not the deployed image.

## Guide #32 — API-key auth rollout

**Claim:** `AUTH_METHOD` supports `none`, `api_key`, and `bearer`; missing/wrong keys return the same 401; `/health` stays open; the key never appears in responses or logs. Default remains `none` until the lead decides.

Checklist:

- [ ] Lead confirms final method (`X-API-Key` or Bearer), issuer/rotation owner, and environments.
- [ ] Confirm the deployment sets `AUTH_METHOD=api_key` and `API_KEY` from the secret store. Never put the key in the repo or chat.
- [ ] Without the header, `POST /v1/guide/chat` returns 401 with the standard envelope and `X-Request-Id`.
- [ ] With the header, the same request returns 200.
- [ ] `GET /health` returns 200 without a credential.
- [ ] In `bearer` mode, `X-API-Key` is rejected; in `api_key` mode, `Authorization: Bearer` is rejected.
- [ ] Search the deployment logs for the key value; it must not appear.
- [ ] Confirm startup fails fast when the method is on but the key is missing.
- [ ] Record the deployment ID and evidence.
- [ ] Do not mark Verified while the default is still `none` or while the rollout is pending.

Example shape (use a secret-store environment variable; do not paste the value):

```powershell
$body = @{ stage = "connect"; intent = "next_steps"; user_id = "synthetic-verify" } | ConvertTo-Json
Invoke-WebRequest -Method Post -Uri "https://<guide-host>/v1/guide/chat" `
  -ContentType "application/json" -Body $body
```

## Status transitions

Only after user/lead confirmation:

1. Add verification evidence to the issue.
2. Change status from Fixed/rollout-pending to Verified.
3. If the repo has no status labels, ask the maintainer before creating them; do not add labels unilaterally.
4. Do not close the issue if the fix is not deployed to the environment it affects.

Suggested labels (create only with maintainer approval):

- `status: fixed`
- `status: verified`
- `severity: P0` … `severity: P3`

## Open P0/P1 (current)

No open P0 found in the audit.

Open P1 / launch-blocking items:

- frontend #8 — sign-up scroll/terms overlap at 360dp.
- Guide #15/#26 — real-mode Guide fallback and deployment behavior.
- Guide #31 — unauthenticated deployment risk.
- Guide #32 — API auth default remains `none`; rollout pending.
- Guide #30 — staging environment unconfirmed.

Confirm severity/owner on each issue before publishing the final launch status.

## Done when

- [ ] Every Fixed issue has a named build/deploy and reproducible evidence.
- [ ] The user/lead confirms each verification.
- [ ] Status labels/tracker are updated only after confirmation.
- [ ] Open P0/P1 are listed with owner and next action.
- [ ] No secret, OTP, email, or message text is in any evidence.
