# Mobile Action Permission Repair Plan

> **For agentic workers:** Use test-driven development for each bounded task and review the integrated diff before completion.

**Goal:** Mobile viewers must see information, not mutation controls they cannot use.

**Architecture:** Reuse established permission names. Add a mobile-only permission wrapper and a read-only status fallback. Guard reviewed mutation endpoints using current authorization at dispatch, including confirmations that outlive a permission change. Preserve behavior at 768px and above.

**Tech Stack:** React 18, Recoil, MUI, Vitest, React Testing Library.

**Spec:** User's Fields/Center/Category screenshot and request to audit permission-based actions everywhere; existing `App.jsx` route guards and translated permission catalog define grants.

## Constraints

- Phone behavior only: `(max-width:767.98px)`.
- Do not alter backend authorization or grant permissions to users.
- Do not execute real financial, deletion, approval or credential mutations.
- Tests must render actual controls; mock only network/editor dependencies where necessary.
- Do not change existing environment configuration.

## 1. Shared gating and setup pages

Files: `src/hooks/useMobilePermission.js`, `src/components/mobile/MobilePermission.jsx`, `src/components/mobile/PermissionStatusSwitch.jsx`, Fields/Center/Category pages, translations and `src/test/mobileSetupPermissions.test.jsx`.

- [x] Render each real list page with its list-only grant at 390px. Assert `screen.queryByRole('checkbox')` is null and the registration button is absent. Run and observe failure.
- [x] Implement `useMobilePermission(permission)` returning true on desktop or when the current mobile permission array includes a required grant. `MobilePermission` renders children or its fallback. `PermissionStatusSwitch` renders translated Active/Inactive text without update permission, otherwise the existing switch.
- [x] Use `field_data_update`, `center_data_update`, `category_data_update` for status and the corresponding `*_registration` for creation.
- [x] Verify authorized actions work using mocked HTTP; verify 768/1024px preserve the old rendering.

## 2. Remaining visible mutation controls

Files: account-management list pages, pending client registrations, Staffs, AuditReportMeta, StaffFormModal/StaffUpdate, associated regression files.

- [x] Add list-only fixtures showing unauthorized switches/create buttons/password inputs; observe failures first.
- [x] Use the shared wrappers with the exact existing account/income/expense/staff/audit grants. Keep registration and update privileges separate.
- [x] In staff update mode, hide and omit password fields unless mobile user has `staff_reset_password`; preserve initial passwords during authorized registration and desktop behavior.
- [x] Verify denied controls are absent, authorized controls remain, and desktop rendering is unchanged.

## 3. Request-time defense

Files: `src/helper/mobileMutationPermissions.js`, `src/utilities/xFetch.js`, `src/test/mobileMutationPermissions.test.js`.

- [x] Enumerate mutation endpoints from actual xFetch callers and map only established action grants. Test denied dispatch produces no HTTP request, exact allowed grants work, and unrelated grants do not work.
- [x] Before mobile mutation dispatch, read current authorization and reject missing/revoked permissions for mapped actions. Keep public authentication/read endpoints and desktop calls unchanged.
- [x] Test permission changes before a delayed callback, ambiguous account-type payloads, and token/identity mismatch. Do not infer permission from route visibility.

## 4. Integrated verification and report

- [x] Run all mobile regressions and changed-file lint; run production build (621 tests, 15 files).
- [x] Inspect live authorized phone Fields without changing data. Fields/Center/Category restricted-user and desktop boundaries verified with actual-page fixtures; live restricted-role/API enforcement remains unverified.
- [x] Independent review of permission mappings and desktop isolation; no significant findings.
- [x] Update `docs/mobile-permission-audit.md` with exact coverage and limitations. Commit verified logical steps, excluding unrelated changes.
