# Login Page Test Plan

## Executive Summary

This test plan covers functional, negative, edge-case, persistence, security, and accessibility tests for the application's Login page. The login page at https://chaos-uat.mservice.com.vn/ uses LDAP authentication with email and password fields. The application supports session persistence via storage state management and includes integration with the home page/dashboard after successful authentication.

Key components tested:
- Email input field (id="email")
- Password input field (id="password") 
- Login button (id="btnSignIn")
- Authentication flow and redirection
- Error handling and validation
- Session storage management

## Test Scenarios

### 1. Successful Login with Valid Credentials

**Seed:** `e2e/tests/login-successful.spec.ts`

#### 1.1 Standard Login Flow
**Assumption:** Fresh browser state with no existing authentication

**Steps:**
1. Navigate to the login page at https://chaos-uat.mservice.com.vn/
2. Wait for the page to load and verify the presence of login form elements
3. Fill the email field with a valid username from test data (e.g., hieu.tran8@mservice.com.vn)
4. Fill the password field with the corresponding valid password
5. Click the login button (id="btnSignIn")
6. Wait for the page to navigate to the dashboard
7. Verify successful login by checking for dashboard elements

**Expected Results:**
- User is redirected to the home/dashboard page (URL contains base URL + dashboard route)
- Welcome message "Welcome to Chaos 🚀" is visible
- Profile image with src="/img/avatars/momo-avatar.png" is visible
- Storage state file (.auth/storageState.json) is created successfully
- No error messages are displayed

**Success Criteria:**
- Navigation to dashboard completes successfully
- Post-login elements are visible and accessible
- Session is properly established

#### 1.2 Login with Different Valid User
**Assumption:** Fresh browser state with no existing authentication

**Steps:**
1. Navigate to the login page
2. Fill the email field with a different valid user account
3. Fill the password field with the corresponding password
4. Click the login button
5. Verify successful navigation to dashboard

**Expected Results:**
- Alternative valid user can successfully authenticate
- Same post-login experience as primary user

### 2. Invalid Credentials Handling

**Seed:** `e2e/tests/login-invalid-credentials.spec.ts`

#### 2.1 Invalid Password
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Fill the email field with a valid username
3. Fill the password field with an incorrect password
4. Click the login button
5. Wait for error response
6. Verify error message display and page state

**Expected Results:**
- Login attempt is rejected
- Clear error message is displayed (containing terms like "invalid", "error", "failed", "incorrect", "credentials")
- User remains on the login page (URL does not change to dashboard)
- Login form fields remain accessible and populated
- No storage state file is created

#### 2.2 Invalid Username
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Fill the email field with a non-existent username
3. Fill the password field with any password
4. Click the login button
5. Verify error handling

**Expected Results:**
- Login attempt is rejected with appropriate error message
- User remains on login page
- Form remains accessible

#### 2.3 Non-existent User
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Fill the email field with completely invalid email format
3. Fill the password field with random text
4. Click the login button
5. Verify error response

**Expected Results:**
- System handles non-existent user gracefully
- Appropriate error message is shown
- No security-sensitive information is leaked

### 3. Input Validation and Boundary Testing

**Seed:** `e2e/tests/login-input-validation.spec.ts`

#### 3.1 Empty Fields Submission
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Leave both email and password fields empty
3. Click the login button
4. Verify client-side and/or server-side validation

**Expected Results:**
- Either client-side validation prevents submission or server returns validation errors
- Clear indication of required fields is provided
- No authentication attempt occurs

#### 3.2 Empty Email Field
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Leave email field empty
3. Fill password field with valid password
4. Click the login button

**Expected Results:**
- Proper validation message for email field
- No authentication attempt occurs

#### 3.3 Empty Password Field
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Fill email field with valid email
3. Leave password field empty
4. Click the login button

**Expected Results:**
- Proper validation message for password field
- No authentication attempt occurs

#### 3.4 Malformed Email Address
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Enter malformed email address (e.g., "invalid-email", "@domain", "user@", etc.)
3. Enter valid password
4. Click the login button

**Expected Results:**
- Either client-side validation rejects the format or server responds appropriately
- No authentication attempt with malformed email

#### 3.5 Extremely Long Inputs
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Enter extremely long string (>1000 characters) in email field
3. Enter extremely long string in password field
4. Click the login button

**Expected Results:**
- System handles long inputs gracefully
- No crashes or performance issues
- Appropriate validation or rejection occurs

### 4. Security Testing

**Seed:** `e2e/tests/login-security.spec.ts`

#### 4.1 SQL Injection Prevention
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Enter SQL injection payload in email field (e.g., "' OR '1'='1", "'; DROP TABLE --", etc.)
3. Enter SQL injection payload in password field
4. Click the login button

**Expected Results:**
- Injection attempts are safely handled
- No database errors or unauthorized access
- Proper error messages are displayed

#### 4.2 XSS Prevention
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Enter XSS payload in email field (e.g., "<script>alert(1)</script>", "javascript:alert(1)", etc.)
3. Enter XSS payload in password field
4. Click the login button

**Expected Results:**
- XSS attempts are safely handled
- No script execution occurs
- Proper error handling without information disclosure

#### 4.3 Rate Limiting Check
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Perform multiple rapid login attempts with invalid credentials (e.g., 10 attempts in quick succession)
3. Monitor for rate limiting responses

**Expected Results:**
- System implements appropriate rate limiting
- No denial of service occurs
- Proper error messages indicate rate limiting if applicable

### 5. Session and Storage Management

**Seed:** `e2e/tests/login-session-management.spec.ts`

#### 5.1 Storage State Creation
**Assumption:** Fresh browser state with no existing storage

**Steps:**
1. Verify that .auth/storageState.json does not exist
2. Perform successful login with valid credentials
3. Wait for authentication to complete
4. Verify that .auth/storageState.json is created

**Expected Results:**
- Storage state file is created after successful login
- File contains valid authentication tokens/session data
- Subsequent visits use stored authentication when available

#### 5.2 Authentication Persistence
**Assumption:** Valid storage state exists

**Steps:**
1. Ensure valid .auth/storageState.json exists from previous successful login
2. Launch new browser instance with stored authentication
3. Navigate to base URL
4. Verify automatic login occurs

**Expected Results:**
- User is automatically authenticated without re-entering credentials
- Dashboard/home page loads immediately
- Authentication state is properly restored

#### 5.3 Failed Login Does Not Create Storage
**Assumption:** Fresh browser state with no existing storage

**Steps:**
1. Verify .auth/storageState.json does not exist
2. Attempt login with invalid credentials
3. Verify login failure
4. Check that .auth/storageState.json still does not exist

**Expected Results:**
- No storage state file is created after failed authentication
- Authentication state remains unmodified

### 6. User Experience and Accessibility

**Seed:** `e2e/tests/login-ux-accessibility.spec.ts`

#### 6.1 Page Load Verification
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Verify all form elements are visible and accessible
3. Check for the presence of "Please sign-in to your LDAP account to continue" text
4. Verify form fields have proper labels and attributes

**Expected Results:**
- All login form elements are visible and functional
- Sign-in instruction text is displayed
- Form fields are properly labeled for accessibility

#### 6.2 Keyboard Navigation
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Use Tab key to navigate between email field, password field, and login button
3. Verify all interactive elements are reachable via keyboard
4. Use Enter key to submit the form after filling credentials

**Expected Results:**
- All form elements are accessible via keyboard navigation
- Tab order is logical (email → password → button)
- Form can be submitted using keyboard alone

#### 6.3 Loading States and Feedback
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Fill credentials and click login button
3. Observe loading states or visual feedback during authentication
4. Wait for either success or error response

**Expected Results:**
- Visual feedback is provided during authentication process
- No UI blocking issues occur
- Clear feedback is provided for both success and failure

### 7. Cross-browser Compatibility
*Manual/Automation Extension*

#### 7.1 Different Browsers
**Assumption:** Test infrastructure supports multiple browsers

**Steps:**
1. Execute successful login scenario on Chrome
2. Execute successful login scenario on Firefox
3. Execute successful login scenario on Safari/Edge (if applicable)
4. Compare results and behavior

**Expected Results:**
- Consistent login behavior across supported browsers
- No browser-specific issues with authentication flow

### 8. Error Recovery and Edge Cases

**Seed:** `e2e/tests/login-error-recovery.spec.ts`

#### 8.1 Network Interruption During Login
**Assumption:** Fresh browser state

**Steps:**
1. Navigate to the login page
2. Fill credentials
3. Simulate network interruption just before clicking login
4. Restore network connectivity
5. Attempt login again

**Expected Results:**
- Application handles network interruptions gracefully
- User can retry login after connection restoration
- No corrupted state is left behind

#### 8.2 Page Refresh During Login Process
**Assumption:** In-progress login attempt

**Steps:**
1. Start login process
2. Refresh the page during authentication
3. Verify application state is properly reset

**Expected Results:**
- Page refresh resets the login form
- No partial authentication state remains
- User can start fresh login attempt

## Test Data Requirements

### Valid User Accounts
- Primary test user: `hieu.tran8@mservice.com.vn` (from .env)
- Password: `Gaidnggoi@2` (from .env)

### Invalid/Credentials for Testing
- Invalid user: `invalid_user`
- Invalid password: `invalid_pass`
- Malformed emails: `invalid-email`, `@domain.com`, `user@`, etc.
- SQL injection payloads: `' OR '1'='1`, `'; DROP TABLE --`, etc.
- XSS payloads: `<script>alert(1)</script>`, `javascript:alert(1)`, etc.

## Pre-requisites
- Access to test environment at https://chaos-uat.mservice.com.vn/
- Valid test user credentials
- Network connectivity to the application
- Playwright test environment properly configured

## Environment Configuration
- BASE_URL: https://chaos-uat.mservice.com.vn/
- USERNAME: hieu.tran8@mservice.com.vn (from .env)
- PASSWORD: Gaidnggoi@2 (from .env)

## Success Criteria
- All positive test scenarios complete successfully
- All negative test scenarios properly reject invalid inputs
- Error handling is consistent and informative
- Session management works as expected
- Security measures prevent unauthorized access
- No crashes or unexpected behaviors occur

## Failure Conditions
- Successful authentication with invalid credentials
- Application crashes during normal operation
- Sensitive information disclosure in error messages
- Storage state created after failed authentication
- Bypass of validation or security measures