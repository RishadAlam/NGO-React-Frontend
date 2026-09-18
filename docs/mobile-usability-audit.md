# Mobile usability review — 18 September 2026

## Scope and safeguards

User-approved Impeccable refinement of the existing phone UI, below 768px. Preserve the current visual identity, original EN/BN menu names and grouping, removed search bars, permission checks, financial values, and mutation workflows. Tablet and desktop layouts are outside this change.

The review combined independent source audits of navigation/services, tables/collections, and forms/dialogs; a full-source design detector scan; live Chrome checks; regression tests; and an independent implementation review.

## Repairs

| Area                     | Issue addressed                                                                                                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Services                 | Labels previously shrank to about 9–10.5px with viewport height. Labels now remain readable and unclipped; narrow phones use three columns and wider phones four. Spacing/icons still adapt to height.                                                                                      |
| Dock and header          | Visible destination labels, readable language control, safe direct-entry Back fallback, original translated detail-page titles, and a profile popover that can grow/scroll.                                                                                                                 |
| Shared mobile typography | Small supporting text in tables, dashboard, calendar, and other common layouts raised to a 12px floor; body text is 14px. Dock captions remain compact to fit five destinations.                                                                                                            |
| Tables                   | Compact previous/page-position/next navigation; mobile sort controls with explicit nested member-name/collection-amount comparators; semantic record links; readable details and 44px row/disclosure controls. Unsupported object-valued sort choices are omitted. No search bars restored. |
| Collection sheets        | Full member names/account identifiers and financial figures can wrap instead of disappearing behind ellipses. Payment breakdowns reflow on narrow screens; values and collection actions are unchanged.                                                                                     |
| Data recovery            | Regular and pending loan/saving report pages distinguish initial loading failure from an empty result, offer retry, and retain previously loaded rows when refresh fails.                                                                                                                   |
| Dialogs                  | Dedicated phone-dialog styling avoids applying sizing to every nested MUI box. Close buttons, inputs, footer actions and editor tools have touch-sized controls. Short-screen bodies scroll while footer actions remain reachable.                                                          |
| Forms                    | Associated labels/errors, unique upload IDs and mobile radio names, keyboard-operable password reveal, named close controls, and contextual mobile approval-setting labels.                                                                                                                 |
| Dark mode                | Primary action text uses the dark surface color against pale primary fills. The observed registration button improved from 2.41:1 to 7.86:1 contrast.                                                                                                                                       |

## Verification

- Live review: services/group overlay, field list, registration dialog, and regular loan category/field/sheet navigation, using EN/BN and light/dark states. No real registration, collection, approval, deletion, upload, permission, or password change was submitted.
- Phone sizes: 320×640 and 390×844; short landscape dialog: 667×375. Tablet boundary checked at exactly 768px; desktop branch behavior covered by tests at 768/1024px.
- Measured dialog close/editor targets: 44×44px. Mobile sort controls: 44px high. Dialog text inputs: 16px. No horizontal document overflow in the sampled phone pages.
- Short landscape dialog: body scroll height exceeded its client height as expected, while footer remained within the viewport.
- Compiled each changed SCSS file before/after the patch, removed only media rules restricted below 768px, and compared the remaining CSS. Tablet/desktop CSS was unchanged in `_mobile.scss`, `table.scss`, and `collectionSheet.scss`.
- Regression suites cover mobile/tablet rendering boundaries, navigation, sorting, pagination, form accessibility, error/retry/stale-data handling, translations, permission gates, and mutation guards.
- Translation audit reported no missing literal keys or EN/BN catalog parity gaps.
- Final verification: `npm run test:mobile` passed 762 tests across 25 files; production Vite build passed; changed-file ESLint passed for 30 files; `git diff --check` passed. Independent re-review confirmed the nested sorting correction, including actual column-factory fixtures.

## Evidence limits and existing warnings

This is a source-wide/shared-component review plus representative live flows, not a claim that every account/role, record, browser, or physical device was manually exercised. Physical iOS/Android keyboard and touch behavior still require device testing. Large-value and error states are covered using controlled fixtures, not changes to real financial records.

The source detector examined 439 relevant files and reported 11 warnings, zero errors. Several warnings are prefixed duplicates, desktop-only transitions, or semantic collection-status decoration; these were not treated as proven mobile defects. No live detector overlay was injected because browser evaluation is read-only. Existing Sass legacy API, React Router future flags, ReactQuill `findDOMNode`, ModalPro `ownerState`, and mixed icon-import build warnings remain outside this mobile repair.

## Follow-up: compact mobile shell

After user approval, the phone shell now uses six evenly spaced, icon-only dock controls without an off-center raised Services button. Profile opens an upward account panel containing the existing profile/password/logout actions, identity, company name, and color-theme selector. The large top profile bar is unmounted below 768px; inner pages retain a single 44px title row without the group subtitle or separate card shell. Desktop/tablet keep the existing topbar and palette.

Live checks covered 320px/390px, EN/BN, light/dark, popup focus and Escape dismissal, and the 768px boundary. At 667×375 the popup fits between y=20 and y=299 and scrolls internally. No real account update or logout was submitted. Compiled tablet/desktop CSS remains unchanged.

Final verification passed 778 tests across 28 files, the production build, changed-file ESLint, and diff checks. Two previously order-dependent collection tests now explicitly initialize their Recoil viewport fixture to match the browser viewport; production collection behavior was not changed.

## Follow-up: five-control dock

Moved Dashboard from the mobile dock to the end of Quick Services, using its original EN/BN name and a Home icon. Existing service priorities and permission checks are unchanged; Dashboard remains available to signed-in users without business-service permissions, alongside an explanatory access message. The icon-only dock now reads Search, Theme, Services, Language, Profile, with Services centered.

Verified live at 320px and 390px in BN/EN and light/dark mode: no horizontal overflow, minimum 48px-high dock targets, Dashboard navigation and return to Services, and the Profile popup. At 768px the original navigation remains and mobile controls are hidden. All 783 tests across 28 files, production build, changed-file ESLint, and diff checks pass; compiled tablet/desktop CSS is unchanged.
