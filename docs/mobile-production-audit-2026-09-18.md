# Mobile UI/UX verification — 18 September 2026

> **Release update:** The subsequent collection/recovery verification found critical shared-backend blockers. **Do not deploy.** See [release workflow verification](release-workflow-verification-2026-09-18.md) for failing tests and remaining inbox/physical-device checks. The UI results below are not full release sign-off.

## Scope

Impeccable guided the audit-first, accessibility, responsive-layout, and recovery work. The approved design, dock, original EN/BN menu names, permission grants, financial calculations, endpoints, and request payloads were retained. Visual/behavioral repairs are scoped below 768px. No deployment or push was performed.

Baseline: `ff349a1`, branch `refactor/mobile-reponsive`.

## Verified repair stages

| Commit    | Repair                                                                                                                                                                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `61d8bea` | Fresh route-specific approval/delete actions and workflow-specific creator filters; mobile repeated-request guards.                                                               |
| `257df9d` | Computed financial cells remain accessible, pagination clamps after data shrinks, pending collection dates cannot be cleared into a crash.                                        |
| `70019a1` | Submission pending/retry safety, no phone autofocus jump, meaningful translated names and radio error associations.                                                               |
| `6aade5e` | Compact image/signature previews, readable labels, full-width date ranges, compact permission context/table toolbars, complete money values and transparent native switch inputs. |
| `810b6b0` | Retry/error states on 15 primary data screens; auth/OTP recovery; Bengali OTP normalization; mobile login server-error sanitization; removal of a dead mobile password link.      |
| `9aff182` | Original regular/pending collection context in mobile headers; historical estimates no longer claim to be today's money.                                                          |
| `1c75464` | Compact truly empty collection centers, retaining their names/no-data messages. Populated or missing arrays are not treated as empty.                                             |

Unused nominee defaults were also removed; they had no consumers and caused the changed-file lint error. Temporary implementation notes accidentally tracked under `.superpowers` were removed; this report is the durable audit record.

## Chrome coverage

Inspected all 46 service-menu destinations, including the seven grouped-menu overlays, and discovered dynamic collection/account/permission pages from their real links. A rendered page was checked after loading; loading-only snapshots were not counted. Most initial page checks used 390px or 414px in Bengali. Representative repairs were rechecked at 320×740, 390×844, 667×375, 768×1024 and 1024×768, with English/Bengali and light/dark samples.

| Area                  | Rendered screens inspected                                                                                                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shell                 | Services, Dashboard, Analytics, Search, Profile; group overlays, profile menu, language and theme controls.                                                                                                      |
| Registration          | Member, savings-account, loan-account forms; compact uploads/signature and translated form labels.                                                                                                               |
| Collection            | All four regular/pending savings/loan category lists, their field lists, and their collection sheets. Populated regular and historical pending data inspected; collection form opened/cancelled without payment. |
| Setup                 | Fields, Centers, Categories, including view-only status presentation.                                                                                                                                            |
| Registered accounts   | All three account lists; member, savings and loan detail pages.                                                                                                                                                  |
| Finance               | Accounts, Transactions, Income, Expense, Transfers, Withdrawals, Income Categories, Expense Categories.                                                                                                          |
| Team                  | Staff, Staff Roles, role permission editor, staff permission viewer/editor. No existing grants changed.                                                                                                          |
| Audit/settings        | Audit Metadata, Internal Audit, Audit Report, App Settings, Approval Settings, Category Settings, Recycle Bin.                                                                                                   |
| Pending               | Pending Loans calendar; three registration queues; both withdrawal queues; all four transaction queues; both closing/deletion queues.                                                                            |
| Dashboard drill-downs | Loan Given, Loan Recovered, Loan Savings, Monthly Loan, Savings Collections, DPS Collections.                                                                                                                    |
| Public auth           | Login and Forgot Password layout; normal QA logins. OTP/reset failure paths verified in component tests, not by resetting a live password.                                                                       |

Some approval/audit/dashboard queues were empty in the development database. Their live empty states were checked; populated action states were covered by component tests rather than fabricated financial transactions.

### Observed post-repair checks

- 320px member registration: document width 320px, scroll position 0 on entry, 14px untransformed standard labels, compact photo/static signature.
- 390px analytics: complete date interval fits in a 366px filter; no horizontal document overflow.
- English dark services: original long labels wrap without clipping. Approved dock retained.
- Role/staff permission context: identity and all permission metadata retained, reduced spacing.
- Empty collection centers: about 141px each, compared with over 400px before repair.
- 667×375 collection dialog: 651×363 dialog, top 12px, close control and footer action visible with a scrollable form body.
- 768px/1024px Fields: original sidebar, topbar, serial-number table and desktop actions remain; mobile dock/header absent.

## Real-profile permission checks

Two temporary development users were explicitly approved, created with existing roles, activated, then explicitly approved for email verification. No existing user, role definition, global authentication setting or business record was changed.

- Field Worker (46 existing grants): registration/collection/setup menus available as granted; Fields and Centers showed static statuses with no mutation controls; Categories had no mutation controls. Staff, Analytics and App Settings direct routes denied access. A permitted collection form opened and was cancelled; no money collected.
- Manager (zero existing grants): services showed the no-other-services notice; Fields and collection direct routes denied access. Member search/details remained readable and mutation controls were absent. **The user explicitly confirmed read-only member access is intentional**, so the shared read policy was preserved.
- Temporary users 13 and 14 were deactivated after testing and their tokens revoked. Their database records remain recoverable. Administrator login was restored for final visual checks.

## Automated verification

- Full suite: **951 tests passed in 43 files** (`rtk npm run test:mobile`).
- Production Vite build: exit 0, output kept outside the repository under `/private/tmp/ngo-mobile-ux-build.tP8cqD`.
- Independent reviews approved every repair group and the aggregate `ff349a1..1c75464` changes with no critical/important findings.
- Non-phone compiled CSS is byte-identical to the pre-repair baseline after removing media blocks limited below 768px. Regression hash: `5a22dd69065838e2bf15fa16c2680c42a44c86d3146427a25f76031c28a409c1`.
- Changed-file ESLint passes after the unused-object cleanup, with the existing Analytics hook-dependency warning retained. Diff whitespace checks pass.

## Release limits

This is a verified mobile repair pass, not proof of every possible production state. No live financial mutation, email delivery, password reset, physical-device keyboard, assistive-technology session or exhaustive backend security penetration test was performed. Slow/offline/error states and duplicate submissions were exercised with test network boundaries. Existing ReactQuill/MUI/Router/Sass warnings and Vite mixed-import warnings remain; they did not fail the tests/build. Helper-option query failures are not given independent retry panels on every page; primary data failures are covered by this pass.
