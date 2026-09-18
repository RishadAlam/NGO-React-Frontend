# Mobile production usability repair plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox syntax for tracking.

**Goal:** Repair confirmed mobile usability and permission defects, with honest Chrome coverage.

**Architecture:** Preserve the existing mobile design and route/permission model. Gate behavioral changes below 768px and keep tablet/desktop behavior unchanged. Exercise real components with mocked network boundaries before implementation.

**Tech Stack:** React, Recoil, React Router, MUI, React Table, Vitest, Sass, Chrome.

**Spec:** User-approved repair direction in this conversation: preserve current identity/dock; repair confirmed usability/accessibility defects; add permission regression tests; commit verified stages. Review other development user profiles where credentials are available.

## Global constraints

- Mobile means width below 768px. Desktop/tablet means width at least 768px and must remain unchanged.
- Keep current menus, original translated names, permission grants, endpoints, payloads, dock and business workflows.
- No real financial transactions, credential resets or permission grants during verification. Do not infer test coverage from admin-only access.
- Work in the existing `refactor/mobile-reponsive` checkout used by the running Chrome app; do not switch branches or create another development server.
- Use `rtk` for shell and `apply_patch` for edits. Commit each verified repair group; do not push.

## Task 1: Route-safe approval actions

Files: `src/pages/pendingClientTransactions/PendingClientTransactions.jsx`, `src/pages/pendingWithdrawals/PendingWithdrawal.jsx`, `src/pages/pendingClosings/PendingClosing.jsx`, new regression tests in the existing test directory.

- [x] Test real components across same-component route changes, using literal endpoint assertions: saving-to-saving then loan-to-loan row 12 must approve `transactions/approve-transactions/12/loan_to_loan`.
- [x] Test withdrawal routes both ways with asymmetric delete/update/approval grants. An action allowed only for savings must disappear on loan savings.
- [x] Test workflow-admin creator filters without unrelated registration-admin permissions; ordinary viewers see only themselves.
- [x] Run targeted tests and verify expected failures.
- [x] Include mobile route identity in column memo dependencies, e.g. `windowWidth < 768 ? type : null`, and the equivalent `prefix`. Select the corresponding existing workflow-admin grant only on mobile.
- [x] Guard mobile repeated approval/deletion dispatch with actual loading keys and a synchronous pending latch. Preserve desktop behavior.
- [x] Run tests, lint changed files, review and commit.

## Task 2: Mobile form safety and accessibility

Files: `src/pages/registration/ClientRegistration.jsx`, `src/pages/staffProfile/StaffProfile.jsx`, `src/components/utilities/TextInputField.jsx`, `RadioInputGroup.jsx`, `src/pages/searchAccount/SearchAccount.jsx`, nominee/guarantor controls, category configuration row.

- [x] Write deferred/rejected request tests for member/profile submission: repeated taps produce one request, controls disable while pending, rejection restores retry.
- [x] Test phone autofocus does not focus the account field on mount, while 768px retains current autofocus.
- [x] Test phone search, add/remove nominee/guarantor and category-specific switches have meaningful translated accessible names; radio errors associate with their group.
- [x] Observe failures, then implement phone-only pending state/ref guards, error cleanup, accessible names and autofocus suppression.
- [x] Run targeted tests and lint, review and commit.

## Task 3: Data navigation and recovery

Files: shared ReactTable component; `LoanReportSheet.jsx`, `SavingReportSheet.jsx`; login/recovery and approval/category settings components where confirmed errors are present.

- [x] Test mobile page 2 with 11 rows, then 10 rows: real remaining data must remain reachable and not display a false empty state. Preserve 768px behavior.
- [x] Test computed financial cells from full loan report factories remain accessible even when their raw accessor value is undefined; preserve permission-hidden columns. Include audit computed amounts and dashboard metadata.
- [x] Test clearing pending collection date does not throw for savings/loan sheets; preserve required date selection on mobile.
- [x] Test login retry after generic server errors, failed recovery requests releasing pending state, Bengali OTP input normalization, and settings fetch errors presenting retry rather than skeleton/empty data on mobile.
- [x] Test failed initial dashboard/analytics/list requests do not masquerade as true zero financial totals/empty data; retain stale successful data with a visible retry warning.
- [x] Watch expected failures, then implement minimal mobile guards/recovery using existing translated copy. No changed API contracts.
- [x] Run targeted tests/lint, review and commit.

## Task 4: Chrome confirmation and coverage report

- [x] Visit all visible service destinations, then discover dynamic account/collection/permission destinations from actual links. Record pages blocked by empty data or unavailable credentials.
- [x] Inspect 390px BN/EN layouts; check small 320px and short landscape on representative shared structures, light/dark and >=768 regressions.
- [x] Open/cancel representative forms, menus and dialogs. Do not submit mutations to claim verification.
- [x] Confirm no page overflow, readable labels, reachable actions, preserved data and safe navigation. Repair only concrete additional findings with test-first coverage.
- [x] Run full mobile tests, build, changed-file lint, diff checks and independent final review. Document exact results and release limits.

## Progress

- Baseline `ff349a1`, clean tree. Existing baseline: 812 passing mobile tests.
- User approved repair direction and stated the connected database is development data.
- Chrome menu inventory: 46 visible destinations. Audit ongoing; no exhaustive production claim.

## Completion and limits

- Repairs committed in seven independently reviewed stages; see `docs/mobile-production-audit-2026-09-18.md` for commit mapping and Chrome coverage.
- 951 tests / 43 files passed; production build passed. Representative 320/390/414/667/768/1024px checks and non-phone CSS parity completed.
- Two explicitly approved QA accounts exercised Field Worker (46 existing grants) and Manager (zero grants). User confirmed read-only member access is intentional. Both QA users were deactivated and their tokens revoked after testing; existing roles/users unchanged.
- Primary data recovery applies to 15 screens. Real financial mutations, real password reset/email delivery and physical-device keyboard testing were deliberately not performed; populated approval states lacking development data are covered by component tests.
- Additional Chrome-confirmed repairs: compact previews/permission summaries/empty collection centers, full date range, readable labels, regular/pending workflow titles and historical estimate copy.
- Existing source hook/deprecation/build warnings are documented. No claim of exhaustive production-state or backend security certification.
