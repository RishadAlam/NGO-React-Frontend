# Release workflow verification plan

> **For agentic workers:** Verification-only work in the existing checkout. Use systematic debugging and verification-before-completion. Do not implement shared/backend fixes without resolving the user's mobile-only constraint.

**Goal:** Verify the remaining collection/approval/accounting and recovery contracts, and clearly distinguish physical-device evidence from emulation.

**Architecture:** Run Laravel HTTP feature tests against forced SQLite `:memory:` with synthetic fixtures and mail fakes. Guard runtime database identity before migrations. Leave development records, role definitions and existing credentials unchanged. Actual email receipt and physical devices require an accessible user-controlled inbox/device.

**Spec:** User request to finish remaining release verification after the mobile-only repair pass. Earlier permission for disposable development data does not authorize changing existing credentials or production records.

## Task 1 — collection and reconciliation

- [x] Read controller/request/model/report contracts and compare mobile payloads.
- [x] Write standalone `CollectionReleaseVerificationTest.php` using synthetic savings/loan/cash accounts; retain the reproducible harness in `verification/backend`.
- [x] Verify pending creation, denied collector approval, allowed approver action, account/cash balance and report reconciliation.
- [x] Assert repeat approval does not add money twice and regular-savings-only permission matches the frontend grant. **Failed:** replay duplicates balances, savings-only permission denies, and loan-only permission improperly allows savings approval.
- [x] Run against forced SQLite memory, empty URL override, array mail/cache/session and a nonexistent config-cache path; exact command in `verification/backend/README.md`.

## Task 2 — recovery

- [x] Write standalone `EmailRecoveryReleaseVerificationTest.php` with guarded in-memory fixtures and `Mail::fake()`; retain in `verification/backend`.
- [x] Verify mail generation, invalid/expired/reused OTPs, successful recovery and new/old login behavior on synthetic users only.
- [x] Assert no-OTP and cross-account reset requests fail without changing credentials. **Failed:** both reset another synthetic credential without recovery authorization.
- [ ] Verify actual mail delivery only after a user-controlled recipient/inbox is available; fake mail is not delivery evidence.

## Task 3 — device access and decision

- [x] Inspect available automation surfaces; only Mac applications/Chrome are currently exposed, no physical mobile device.
- [x] Ask for a test inbox and physical/remote-device session while tests run.
- [x] Record test results, unresolved blockers, unchanged-runtime status and the resulting release recommendation in `docs/release-workflow-verification-2026-09-18.md`.
- [ ] Perform physical Android/iPhone verification after device access is available. Chrome emulation is not physical evidence.
- [ ] Fix shared-backend defects only after explicit approval resolving the mobile-only boundary; then rerun release gates.

**Current outcome:** 21 release tests / 349 assertions: 15 pass and 6 fail. Existing backend suite: 35 pass and 1 source/test contract mismatch. Actual email delivery and physical devices remain unverified. Release recommendation: do not deploy.

## Constraints

- No configuration changes, global permission changes, live money operations, existing-password resets, push or deployment.
- No migrations against `ngo_db`; tests must refuse any database other than SQLite `:memory:`.
- Preserve intentional read-only member access, confirmed by the user.
- A failing test must remain a failure until the underlying defect is separately authorized and fixed; do not weaken expected security/accounting behavior to make verification green.
