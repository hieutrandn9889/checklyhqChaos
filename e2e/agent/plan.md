# Login Page Test Plan

## Executive Summary
This test plan covers functional, negative, edge-case, persistence, security, and accessibility tests for the application's Login page (SSO / local auth entry point). The goal is to verify correct authentication, UI behaviour, storage persistence (including `.auth/storageState.json` creation), error handling, and resilience to invalid inputs. Tests assume a fresh state by default unless a scenario specifies otherwise.

**Assumptions / Starting state**
- Tests start from a blank/fresh browser profile unless `storageState` is intentionally set.
- Test environment is reachable and stable (test server URL configured in test runner).
- Test accounts with valid and invalid credentials are available.
- The `resetStorage(page)` utility can create `.auth/storageState.json` when required.
- Time-based behaviour (session timeout) tolerances are defined in environment docs.

**How to use**
- Each scenario is independent and can run in any order, unless explicitly marked as dependent.
- For tests that modify persistent state (e.g., `storageState`), cleanup steps are included.

---

## Scenarios

### 1) Happy path: Login with valid credentials
Assumption: No existing `storageState` (fresh state) unless `Remember me` scenario uses it.

Steps:
1. Navigate to the Login page.
2. Fill `Username` with a known valid username.
3. Fill `Password` with the valid password.
4. Click the `Login` button (or submit the form).

Expected Results:
- User is redirected to the dashboard/home page (e.g., URL contains `/Home/Index`).
- A visible indicator (logo or user avatar) confirms successful login.
- HTTP response for login request returns success (200/302 as per implementation).

Success criteria: Dashboard loads and key post-login UI element is visible.
Failure conditions: Login fails, shows error message, or blank page appears.

---

### 2) Invalid credentials (wrong password)
Assumption: Fresh state.

Steps:
1. Navigate to Login page.
2. Enter valid username and incorrect password.
3. Submit login.

Expected Results:
- Login is rejected with a clear, accessible error message (e.g., "Invalid credentials").
- No redirect to dashboard occurs.
- No `storageState` file is created.

Success criteria: Error is displayed and authentication is not granted.
Failure conditions: Silent failure, redirect with partial UI, or server error.

---

### 3) Empty fields validation
Assumption: Fresh state.

Steps:
1. Navigate to Login page.
2. Leave username and/or password empty and submit.

Expected Results:
- Client-side validation shows messages for required fields.
- No login request is sent (or server returns validation error handled gracefully).

Success criteria: Required field messages and no auth performed.
Failure: Form submits with empty fields and server throws unexpected error.

---

### 4) Password visibility toggle
Assumption: UI includes a show/hide password control.

Steps:
1. Enter a password in the password field.
2. Click/toggle the password visibility control.

Expected Results:
- Password field type toggles between `password` and `text`.
- Screen reader accessible label changes or proper ARIA attribute present.

Success: Toggle reveals/hides characters and remains accessible.

---

### 5) "Remember me" / storage persistence (creates `.auth/storageState.json`)
Assumption: The app supports a remember/SSO flow that persists session to a storage file.

Steps:
1. Ensure `.auth/storageState.json` does not exist (clean up prior if necessary).
2. Navigate to Login page.
3. Enter valid credentials and enable `Remember me` (or equivalent option).
4. Submit login and wait for dashboard.
5. Verify `.auth/storageState.json` exists in repository or expected storage location.
6. Close browser and launch again using Playwright with `storageState` pointing to the created file; verify automatic login.

Expected Results:
- After login with remember, `.auth/storageState.json` is created.
- Using that storageState in subsequent test runs logs the user in without entering credentials.

Success: File exists and enables session resume.
Failure: No file created or file does not enable session restore.

---

### 6) Logout clears session and (optionally) storageState
Assumption: User can logout from dashboard.

Steps:
1. Login successfully (with or without `Remember me`).
2. From dashboard, click `Logout`.
3. Verify redirect to Login page.
4. Check whether `.auth/storageState.json` was removed or invalidated as required by spec.

Expected Results:
- User redirected to login page.
- Local/session storage cleared.
- If spec requires, persistent storage/state file is removed or no longer grants access.

Success: Logout fully terminates session.

---

### 7) Session timeout behaviour
Assumption: Session timeout is configured (define value in test config).

Steps:
1. Login successfully.
2. Simulate idle time equal to session timeout plus small buffer.
3. Try to access a protected page or perform an authenticated action.

Expected Results:
- User is prompted to re-authenticate or redirected to Login.
- Any sensitive actions are blocked.

Success: Session expiry enforced.

---

### 8) Concurrent sessions / same account multi-login
Assumption: System allows or restricts concurrent sessions (clarify expected behaviour).

Steps:
1. Login with account A in Browser instance 1.
2. Login with same account A in Browser instance 2 (fresh profile).
3. Observe system behaviour (session in instance 1 should remain active, get invalidated, or show warning depending on spec).

Expected Results:
- Behaviour conforms to spec (either multiple sessions permitted or previous session invalidated with clear messaging).

Success: System follows documented concurrency policy.

---

### 9) Input length and boundary tests
Assumption: Username and password fields have length limits.

Steps:
1. Enter extremely long username/password (e.g., 5k chars) and submit.
2. Enter max-length values and verify handling.

Expected Results:
- System handles overly long input safely (server rejects with validation, no crash).
- Max-length values accepted or properly validated.

Success: No server crash or injection opportunity.

---

### 10) Injection / XSS / SQL injection tests (negative security tests)
Assumption: App performs server-side input validation and escaping.

Steps:
1. Use common SQL injection payloads in username/password fields and submit.
2. Use XSS payloads (e.g., `<script>alert(1)</script>`) in fields.

Expected Results:
- Payloads are sanitized or rejected; no unexpected behaviour or stored execution occurs.
- No stack traces or sensitive server errors returned to client.

Success: No injection succeeds.

---

### 11) Accessibility and keyboard navigation
Assumption: Login page needs to conform to a11y basics (tab order, labels, role attributes).

Steps:
1. Navigate to Login page.
2. Use keyboard (Tab / Shift+Tab) to access username, password, remember checkbox, and submit.
3. Verify form labels are associated with inputs and ARIA roles exist where necessary.
4. Run an automated a11y check (axe-core) for critical violations.

Expected Results:
- All interactive elements reachable and operable by keyboard.
- Screen reader friendly labels and minimal critical a11y violations.

Success: Keyboard-only users can authenticate.

---

### 12) Network offline/retry behaviour
Assumption: Intermittent network behavior should be handled gracefully.

Steps:
1. While on Login page, disable network or simulate offline.
2. Attempt to login.
3. Re-enable network and retry.

Expected Results:
- App shows appropriate offline error messaging.
- On network recovery, retry succeeds without corrupting state.

Success: Resilient to transient network failures.

---

## Test Data / Accounts
- Valid account: use test account maintained by QA team.
- Invalid account: non-existent username and known wrong password.
- Edge inputs: extremely long strings, SQL/XSS payload samples.

## Cleanup / Teardown
- Remove any created `.auth/storageState.json` files when tests require clean state.
- Clear localStorage / sessionStorage between tests.
- Ensure test accounts are reset by backend test utilities if tests change account state.

## Success / Failure Summary
- Success: Each scenario's success criteria are met and no unexpected behaviour occurs.
- Failure: Any crash, sensitive data leak, improper persistence, or deviation from expected flow must be logged as a bug with steps to reproduce, screenshots, and network logs.

---

## Notes & Next Steps
- I can convert these scenarios into Playwright tests (`.spec.ts`) for automated execution.
- I can also add example test data and a checklist CSV if you want to run manual exploratory sessions.


*Generated by agent — saved to `e2e/agent_plan.md`*
