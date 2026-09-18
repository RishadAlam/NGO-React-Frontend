# English and Bangladesh-friendly Bengali localization

**Goal:** All application-owned UI text supports EN/BN, using clear Bangladeshi সমিতি terminology.

**Architecture:** Keep the existing i18next catalogs and runtime language switch. Translate display text only; preserve data, payload enums, permissions, routing, responsive layouts and branding/proper names. User-requested project-wide text translation applies to shared views without redesigning desktop/tablet.

## Work areas

- [x] Audit every production JS/JSX file for literal UI text and missing translation references. Add catalog parity/interpolation tests before corrections.
- [x] Pages: replace hardcoded labels, action tooltips, validation text and titles with existing or new i18next keys. Verify EN/BN with actual components.
- [x] Domain components: cover account, collection, registration, report, audit, staff and approval forms, tooltips, summaries and empty states.
- [x] Shared components: translate dialogs, inputs, accessibility labels, third-party picker/editor text, shell and loading/error states. Preserve behavior.
- [x] Catalogs/helpers: repair missing/incorrect keys, interpolate variable messages, localize client-generated network errors and display dates without changing API date payloads.
- [x] Review Bengali copy for natural Bangladesh terminology; preserve distinctions between regular/pending collections and savings/loans.
- [x] Run full regression tests, audit checks, changed-file lint and build. Verify live EN/BN without submitting real mutations.
- [x] Independently review, document actual coverage/remaining server-data limits and commit logical verified steps.

## Verification examples

`common.edit` renders “Edit” in EN and “সম্পাদনা করুন” in BN; switching language updates mounted action controls. Every catalog key exists in both languages with matching interpolation variables. User-entered names and descriptions remain untouched. API-format dates such as `2026-09-18` remain ASCII in both languages.

Run: `rtk proxy node_modules/.bin/vitest run --silent`, `rtk proxy node scripts/audit-i18n.mjs`, changed-file ESLint and `rtk proxy node_modules/.bin/vite build` (output outside repository).

Completed verification and scope notes: [localization audit](../../en-bn-localization-audit.md).
