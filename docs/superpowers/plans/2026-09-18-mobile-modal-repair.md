# Mobile modal repair

Approved direction: preserve the current identity, dock, permissions, translations, and all financial workflows. Only phone layouts below 768px change; tablet and desktop remain unchanged.

## Architecture

Use the shared `ModalPro` mobile scope for all existing card/form nesting patterns. The outer dialog owns the viewport boundary; only the body scrolls, leaving its title and actions reachable. Keep MUI focus management and existing form submission behavior. Compact Quill formatting through a reversible disclosure, never by deleting formats or changing saved content. Treat date pickers, alerts, signatures, and report previews as explicit exceptions.

Stack: React, MUI, Sass, ReactQuill, RSuite, SweetAlert, Vitest/Testing Library.

## Steps and ownership

1. Shared shells (main agent): regression coverage for card-first, form-first, nested content, read-only, short-screen, and >=768 boundaries; normalize width and body scrolling; compact field spacing, collection summaries, uploads, and signature geometry.
2. Editors (editor agent): mobile-modal-only basic toolbar with expandable complete formatting, translated disclosure, preserved contents and readonly behavior; regression tests and lint.
3. Custom overlays (overlay agent): narrow-screen calendar/date-range sizing and actionable mobile errors; preserve desktop behavior, endpoints, and confirmation decisions; regression tests and lint.
4. Consumers (consumer agent): translated accessible names for every ModalPro consumer; mobile report close/title and correct read-only titles; preserve all permission gates; coverage tests and lint.
5. Verify: targeted tests, complete mobile suite, production build, compiled non-mobile CSS comparison, safe live browser checks at narrow/tall/short sizes, EN/BN and light/dark. Do not submit real financial transactions or modify account data.
6. Review changes, fix confirmed defects in one batch, confirm once, and commit verified logical steps. No push or deployment.

## Coverage checklist

- [x] Shared shells: card → form, form → card, direct card, nested permission cards.
- [x] All 36 ModalPro consumers reviewed and explicitly named; existing permission gates retained.
- [x] Editors, upload previews, signature geometry, report title/close and action history reviewed.
- [x] Date/date-range pickers, confirmation/password/error dialogs, menu overlays reviewed.
- [x] Phone width and short landscape; desktop/tablet boundary unchanged.
- [x] Tests, lint, build, desktop CSS comparison, safe visual verification and step commits.

## Verification results

- Full suite: 812 tests in 34 files pass. Changed JavaScript: zero ESLint errors (one existing StoreAccountCheck hook warning). Production build passes with existing dependency/chunk warnings.
- Compiled app and collection styles outside media queries below 768px match baseline 9d82ab5 exactly. DatePicker tests cover phone fine-pointer behavior and the unchanged 768px desktop boundary.
- Live checks: 320×568, 390×844, 430×932 and 667×375; EN/BN and light/dark collection forms; standard income form, date/date-range overlays, signature pad. No financial submissions or record changes.
- Collection modal inner/outer widths now match (374px at390). Basic toolbar reduced from approximately250px to54px. Short-screen collection form has one body scroller and a visible footer.
- Fixed calendar issues found during live checks: trigger-positioned popup below viewport/dock, wrong MUI action-bar selector, and shrinking calendar content clipping the last date rows. Final short-screen body scrolls364px of content in223px, with44px Cancel/OK controls fully visible.
- Report list contained no records. Report preview close/title and desktop branches verified in component tests/source review, not a live report. Real phone keyboards and drawing precision require physical-device confirmation; no biometric signature was entered.
- Independent final review found no blocking source issues. Browser appearance/language restored and temporary viewport reset.
