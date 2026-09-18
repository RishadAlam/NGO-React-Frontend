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

- [ ] Shared shells: card → form, form → card, direct card, nested permission cards.
- [ ] Collection forms, approval forms, setup forms, registration edits/read-only details, staff permissions.
- [ ] Editors, upload previews, signature drawing, report previews and action history.
- [ ] Date/date-range pickers, confirmation/password/error dialogs, menu overlays.
- [ ] Phone width and short landscape; desktop/tablet boundary unchanged.
- [ ] Tests, lint, build, desktop CSS comparison, safe visual verification and commits.
