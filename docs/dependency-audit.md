# Frontend Dependency Security Audit — D2-33

**Audit date:** 20 November 2026  
**Repository:** `karanpandeyklk/Setu_app`  
**Base branch:** `dev`

## 1. Dependency audit

### Full dependency audit

Command:

```bash
npm audit
```

Result: **5 moderate severity vulnerabilities.**

### Production dependency audit

Command:

```bash
npm audit --omit=dev
```

Result: **5 moderate severity vulnerabilities.**

### Identified dependency findings

- `glob`: AbortSignal cancellation bypass allowing post-timeout filesystem traversal.
  - Advisory: GHSA-3g3m-2fjr-6pw4
  - Severity: Moderate
- `minimatch`: Potential denial of service through globparts amplification.
  - Advisory: GHSA-g3hv-75wg-m249
  - Severity: Moderate
- `@expo/fingerprint`: Depends on vulnerable versions of `glob` and `minimatch`.
- `@expo/cli`: Depends on vulnerable versions of `glob`.
- `expo`: Dependency chain includes vulnerable packages.

**Status: Known, pending lead review/decision.**

The suggested `npm audit fix --force` would install `expo@52.0.49`, which is a potentially breaking change.

No forced dependency updates were applied.

## 2. Frontend test results

Command:

```bash
npm test
```

Result:

```text
tests 2
pass 2
fail 0
skipped 0
```

**Result: 2 tests passed, 0 failed.**

## 3. Additional validation

### TypeScript check

Command:

```bash
npm run typecheck
```

Result:

```text
sh: 1: tsc: not found
```

Status: Not completed because the TypeScript executable was unavailable.

### Lint check

Command:

```bash
npm run lint
```

Result:

```text
sh: 1: expo: not found
```

Status: Not completed because the Expo CLI executable was unavailable.

### Production build

Command:

```bash
npm run build
```

Result:

```text
npm ERR! Missing script: "build"
```

The repository does not define a `build` script. Available scripts were inspected using `npm run`.

## 4. Conclusion

- Full dependency audit: 5 moderate vulnerabilities.
- Production dependency audit: 5 moderate vulnerabilities.
- Frontend tests: 2 passed, 0 failed.
- TypeScript validation: Not completed; `tsc` unavailable.
- Lint validation: Not completed; `expo` unavailable.
- Production build: No build script defined.

The dependency findings are known and pending lead review/decision. No forced dependency updates were applied.

This is a documentation-only change. No dependencies, lockfiles, application code, or CI configuration are changed.


