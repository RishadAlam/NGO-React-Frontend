# Task 4 — mobile recovery hardening

## Scope and behavior

- Login, forgot-password, reset-password, OTP verification/resend: mobile rejected requests release pending state, preserve entered data, and remain retryable. Generic message/status/success metadata no longer disables valid mobile forms; field-validation errors remain blocking. Ref guards prevent same-tick duplicate primary submissions.
- Bengali OTP input and paste normalize `১২৩৪৫৬` to literal ASCII `123456` only below 768px. Six-digit length and verification payload/endpoint/method remain unchanged.
- Approval/transfer settings generic errors now allow retry on phones; pending guards remain blocking.
- MobileFetchBoundary accepts optional error/stale translation keys, retaining collection defaults. Fifteen data screens use existing mutate functions for explicit retry: Dashboard, Analytics, ApprovalsConfig, CategoriesConfig, all three registered account lists, and all eight accountManagement lists (Accounts, Income, Expense, IncomeCategories, ExpenseCategories, Transfers, Transactions, Withdrawal).
- Initial failure hides misleading empty tables/zero dashboard totals/skeletons. Previously successful data remains beside a stale warning. Successful empty approval-settings response has a distinct empty state rather than endless skeletons.
- Added three narrowly scoped EN/BN recovery strings; no unrelated labels or styles changed.
- Per root extension: ProfileBox hides unregistered `/change-password` link on phones only; desktop link unchanged. Updated old dock tests that explicitly required the broken route.
- Per root extension: Login replaces 5xx/native transport exception form text with existing friendly error copy. xFetch sanitization is limited to mobile `login` 5xx toast and request-setup exception messages; other endpoints, 4xx messages (including validation/inactive-account), desktop, and permission policy remain unchanged.

## RED evidence

- Initial real-component/network-boundary suite: 21 failed / 1 passed; failures reproduced missing recovery on 15 data screens, generic login/forgot-password lockout, rejected recovery pending state, and Bangla OTP stripping. Log: `/tmp/mobile-recovery-red.log`.
- Settings retry: 2 expected failures for approval and transfer components (`/tmp/mobile-recovery-settings-red.log`).
- Successful empty approvals: 1 expected skeleton failure (`/tmp/mobile-recovery-empty-red.log`).
- Same-tick login: 1 expected duplicate-dispatch failure (`/tmp/mobile-recovery-guard-red.log`).
- Mobile form exception sanitization: 1 fail / 1 desktop pass (`/tmp/mobile-recovery-sanitize-red.log`).
- Real xFetch/axios boundary: 1 mobile login 5xx failure / 3 preserved-branch passes (`/tmp/mobile-recovery-transport-red.log`).
- Profile mobile route removal failed before implementation; desktop companion passed (`/tmp/mobile-recovery-extra-red.log`).

## Verification and limitations

- Focused run: `npx vitest run src/test/mobileAuditRecovery.test.jsx src/test/mobileLoginTransport.test.jsx src/test/mobileCollectionRecovery.test.jsx src/test/mobileDockProfile.test.jsx src/test/mobileMutationPermissions.test.js`.
- Final result: 5 files passed, 481 tests passed, exit 0 (`/tmp/mobile-recovery-verified-final.log`). New suites contribute 46 recovery + 4 transport tests; existing regression suites contribute 431 tests. A transient cross-suite toast residue in the added transport test was fixed with test-only before/after cleanup before this final verification.
- New recovery suite covers mobile initial failure/retry and 768px unchanged branch for all 15 data screens, cached-data retention, generic auth/settings retries, rejected recovery requests, field validation and duplicate guard, literal typed/pasted OTP payload, profile link scope, and server-error sanitization.
- ESLint on all owned files: exit 0; one existing Analytics exhaustive-deps warning remains. `git diff --check`: exit 0.
- Existing test warnings include Sass legacy API deprecation, React Router future flags, and pre-existing MUI/ref warnings in permission tests. No live requests, submissions, browser actions, credential provisioning, or backend changes were performed by this agent. Root owns browser checks and full-suite/build verification.
- Helper endpoint failures (Analytics filter option lists and Transactions account dropdown) are not expanded into independent recovery panels; recovery applies to each page's primary data query. No new automatic requests or route remount logic were introduced.
