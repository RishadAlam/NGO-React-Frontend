# Release workflow verification — 18 September 2026

## Decision: do not deploy

The follow-up verification found three shared-backend release blockers: recovery without proof, non-idempotent money approval, and a wrong approval permission. These are not mobile styling defects. Shared-backend repair approval has been requested; no backend implementation was changed during this verification.

The previous mobile audit's passing UI tests and build do not establish financial or recovery security. This report supersedes any inference that the project is ready to deploy.

## Fresh test results

| Suite | Result | Evidence |
| --- | --- | --- |
| New release HTTP integration suite | **21 tests, 349 assertions; 15 pass, 6 fail, 0 errors** | `verification/backend/CollectionReleaseVerificationTest.php` and `EmailRecoveryReleaseVerificationTest.php` |
| Existing backend suite | **36 tests, 183 assertions; 35 pass, 1 fail** | Existing permission parent-category expectation mismatch |
| PHP syntax | Both new test files pass | `php -l` |

Execution used PHP 8.3.30 / PHPUnit 10.5.60 against the adjacent Laravel project. The exact isolated command is recorded in `verification/backend/README.md`. No production-readiness assertion should be made while these release gates fail.

## Confirmed blockers

### 1. Critical: password reset does not require recovery proof

The public reset route accepts the user ID and replacement password without OTP proof or an account-bound recovery credential. Both a direct unauthenticated reset and an account-A OTP followed by an account-B reset succeeded on synthetic users, changed the password, and revoked existing tokens. Both should have been denied without mutation.

Backend references: `routes/api.php:96`, `app/Http/Controllers/AuthController.php:455`, `app/Http/Requests/ResetPasswordRequest.php:22`. The OTP handler at `AuthController.php:418` consumes a code but issues no account-bound reset authorization.

Required repair: enforce a server-validated, short-lived, single-use recovery proof bound to the target account; retain validation and session revocation. Review the shared frontend recovery payload together with the backend contract. Repeat denial, expiry, replay, cross-account, normal recovery and new/old login checks afterward.

### 2. High: approving an already approved collection credits it again

Repeated approval changed a savings balance from the correct 500 to 1,000 and a loan account's savings component from the correct 100 to 200. The controllers select requested IDs without restricting them to pending rows, then increment balances on every call. Selection also occurs outside the transaction. These findings came from sequential repeat requests; concurrent MySQL approval was not tested.

Backend references: `app/Http/Controllers/Collections/SavingCollectionController.php:323` and `app/Http/Controllers/Collections/LoanCollectionController.php:246`.

Required repair: make approval atomic and idempotent, including concurrent requests; reconcile all member/cash/loan/installment counters and report totals after both first approval and replay. A disabled mobile button is not sufficient protection.

### 3. High: savings approval checks a loan permission

A user with only `regular_saving_collection_approval` received 403. Conversely, a user with only `regular_loan_collection_approval` received 200, approved a savings record, and changed both member and cash balances to 500. The middleware uses the wrong permission name.

Backend reference: `app/Http/Controllers/Collections/SavingCollectionController.php:38`.

Required repair: align the permission with the savings grant and rerun both allowed and denied tests, preserving the user's intentional read-only member access policy.

## Passing contracts and coverage limits

- Savings and loan collection creation remains pending without changing balances when manual approval is configured.
- A collector with no approval grant cannot approve. One authorized approval updates member/cash totals, installments and loan recovery, moves the record out of regular category and center/account collection sheets, adds approved history, and agrees with short summaries and internal audit totals.
- Automatic approval reconciles savings and loan balances/reports. Previous-day pending category queues include unapproved records and remove approved ones. Pending-date center sheets were not separately exercised in this suite.
- Recovery mail generation includes the correct recipient and a six-digit code with five-minute expiry. Unknown/inactive accounts, invalid/expired/reused OTPs, and password validation paths were checked.
- A synthetic normal recovery flow permits the new password, rejects the old password, and revokes old tokens. This happy path does **not** compensate for the bypass above.

The existing backend suite has a separate source/test contract mismatch: `tests/Unit/Support/PermissionParentCategoryResolverTest.php:12` expects `resolve('field')` to return `fields`, but `app/Support/Permissions/PermissionParentCategoryResolver.php:19` maps it to `field` (returned at line 90). The intended category key must be confirmed before changing either assertion or implementation. This is not a newly introduced regression.

## Email delivery and physical devices: not signed off

Recovery tests use `Mail::fake()`; they do not prove real SMTP delivery or inbox receipt. Read-only TLS transport probes were inconclusive: one showed certificate-chain verification before exiting with a poll error; a separate verified TLS connection timed out. No SMTP authentication or message send was attempted. A user-controlled test inbox has been requested and is still required to verify delivery, message usability, expiry, and recovery from that message.

Only Mac applications and browsers were exposed by the available device inventory. No connected Android/iPhone or remote physical-device session was available. Prior Chrome viewport checks are browser emulation, not physical-device verification. Access has been requested.

Remaining phone checks must include Android Chrome and iPhone Safari: login/recovery autofill and keyboard, collection amount entry, modal scrolling and sticky actions, safe-area dock clearance, Back navigation, EN/BN text, authorized/unauthorized actions, and slow-network retry/double-tap behavior. Do not mark these complete from desktop resizing alone.

## Isolation and unchanged scope

- Both harnesses refuse to proceed before migrations unless runtime is testing, the database driver is SQLite with `:memory:` and no URL override, and mail/cache/session drivers are arrays. Recovery mail is additionally faked.
- Only synthetic transient accounts, permissions, collections and money values were used. No existing account password, development balance, role, or configuration was changed.
- Backend checkout remained clean. This turn adds test evidence and documentation only; no mobile, desktop or tablet runtime files changed.
- No push or deployment was performed. Temporary QA users from the earlier Chrome audit remain inactive; this verification did not reactivate them.

Verification-before-completion and systematic-debugging skills guided the failing regression checks and the separation of measured results from unverified delivery/device behavior.
