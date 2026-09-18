# EN/BN localization audit — 2026-09-18

## Scope

Project-wide application-owned display text, using clear Bangladeshi Bengali and familiar সমিতি terminology. The frontend hardening pass covered visible copy, accessibility names, empty/error states, reports and third-party controls. No responsive layout rules, routes, authorization policies, financial calculations or mutation payloads were redesigned.

Shared translation changes apply wherever the existing component is used. The only new CSS replaces Quill's generated English tooltip text; it does not change layout or styling.

## Changes

- Reconciled both catalogs to **1,277 matching keys**; repaired missing keys and incorrect casing.
- Translated page/table action tooltips, report headings, validation text, image labels, close controls, loaders, pagination, calendar and rich-text controls.
- Improved Bengali grammar, accounting terminology and instructions. Examples: “সম্পাদনা করুন”, “নতুন ভূমিকা যোগ করুন”, “পরিশোধিত শেয়ার” and an accurate OTP resend countdown.
- Fixed stale translated analytics selections, calendar event titles and auth validation messages during language changes.
- Translated known gender/religion/default-role labels while preserving stored enum values and custom names.
- Added unique IDs to selects so each translated label is associated with its own input.
- Localized displayed date names/periods; numeric API date formats remain ASCII.
- Kept Bangladesh taka in English and Bengali amount displays. Numeric amounts, calculations and explicit input normalization are unchanged.
- Localized client-generated permission/network errors; retained the existing Accept-Language request header.

## Verification

- **676 tests pass across 20 test files**, including existing mobile permission, request-boundary and desktop-behavior regression tests.
- Five new i18n test files use real catalogs for parity, interpolation, language switching, auth/report text, dates, pickers, editor labels and data preservation.
- Source audit scans **319 production JS/JSX files** and resolves **706 distinct statically identifiable translation keys**, with no missing keys or catalog parity gaps.
- Detected raw UI literals are limited to intentionally preserved product/author proper names: “আমার সমিতি” and “RISHAD ALAM”.
- Dynamic-key review covered form-field labels, permission/action combinations, defaults, table columns and menu/theme labels.
- Changed-file ESLint: no errors; two existing hook-dependency warnings remain in StoreAccountCheck and Analytics.
- Production Vite build passes. Existing Sass, mixed icon-import and Quill deprecation warnings were not expanded into unrelated refactoring.
- Live Chrome checks at 390×844: services/group navigation; field table and action labels in both languages; unchanged field/member names; analytics language switching; Bengali calendar presets/navigation; separate dropdown accessibility labels. No console errors were captured.
- Browser language restored to Bengali, verification tab closed and viewport override reset. No real financial, permission, approval or deletion mutations were submitted.

## Boundaries

Customer names, descriptions, custom categories/roles, company names and official location data are records, not UI translation keys. They remain unchanged.

Server-supplied success/validation/error messages still require the API to honor `Accept-Language: en` or `bn`. Arbitrary backend prose is not guessed or rewritten in the frontend. Browser-native messages depend on the browser's own locale.

The source scanner is a regression aid, not a proof about every possible runtime/server string. It checks JSX prose and attributes, direct expression/conditional text, toast literals, table headers, route titles and finite translation-key expressions. Dynamic data and third-party-generated text also require the component tests and manual review described above.

## Repeatable checks

```sh
rtk proxy node scripts/audit-i18n.mjs
rtk proxy node scripts/audit-i18n.mjs --dynamic
rtk proxy node_modules/.bin/vitest run --silent
```

Keep translations paired in both catalogs, preserve interpolation placeholders, and test mounted EN/BN switching when adding new UI text.
