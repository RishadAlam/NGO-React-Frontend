# Mobile permission and responsive audit

## Scope

This pass changes phone behavior below 768 CSS pixels only. Shared components
retain their existing tablet/desktop rendering and permission branches at 768px
and above. Backend authorization, role definitions, actual user grants and
financial records were not changed.

The existing `RequirePermissions` route policies are the source of truth. The
frontend remains a usability layer, not a substitute for API authorization.

## Fixes

- Mobile service menus now subscribe to current permissions. Independently
  authorized children are discoverable even when their unrelated sibling grants
  are absent. Group overlays disappear when their last permission is revoked.
- Fixed the quick-menu click handler receiving an array index instead of a
  callback. Existing React Router links are retained.
- Ordinary navigation keeps the Services instance mounted. Restoring Services
  no longer overwrites its saved scroll position before restoration.
- Mobile permission/identity changes discard stale forms, action closures and
  role-scoped SWR data. Name updates, equivalent reordered grants and ordinary
  route changes do not recreate this boundary. Missing permission data fails
  closed on mobile.
- Mobile table preferences cannot reveal permission-disabled action columns.
  Approval/status cells no longer replace or duplicate the row-action menu.
  Mobile column preferences are separate from desktop preferences.
- Savings and loan collection controls retain separate create, regular-update,
  pending-update, delete and approve grants. Mobile submit/approve handlers
  recheck their grant and busy state. A denied stale collection form is hidden.
- Collection dialogs mount on demand on mobile, avoiding an active-account
  request for every hidden row form. Invalid pending collection submissions
  keep the form open; desktop behavior is unchanged.
- Service overlays and the all-services drawer use modal focus containment,
  Escape dismissal and focus restoration. Fixed the portalled drawer's missing
  active CSS selector, which made it accessible but visually off-screen.
- Improved mobile profile-button semantics, disabled action handling, switch
  keyboard access, translated collection-dialog names/close buttons and list
  semantics for mobile table cards.
- Phone-only table CSS now respects hidden cells and rows. Scroll containers
  use available viewport height and allow vertical scroll chaining.

## Verification

Run the regression suite with `pnpm test:mobile` (or `npm run test:mobile`).

- **92 tests passed in seven files.** This is the new targeted mobile suite, not
  a claim that every historical project test has run.
- The menu-policy suite compares every discoverable mobile service against the
  actual route guards, with 51 independent permission-grant cases plus a
  complete-menu/no-permission check.
- Component checks cover permission grant/revocation, denied saved-column
  preferences, combined approvals/actions, collection grant distinctions,
  guarded collection forms, invalid pending submissions and disabled actions.
- Three consecutive Services → destination → header-back cycles preserve the
  same Services DOM element in the navigation regression.
- Desktop/tablet component checks at 768, 1024 and 1440px preserve native table
  rendering, serial/search controls and the existing access lifecycle.
- Production Vite build passed. Existing mixed static/dynamic icon-import and
  Sass legacy API warnings remain.
- ESLint passed for the changed UI modules and new tests; `git diff --check`
  passed.
- An independent bounded code review found no introduced critical/important
  issue. Its mobile-preference test-fixture gap was corrected: the regression
  now seeds both current and pre-revocation mobile keys and verifies the actual
  mobile preference key is read.

Live Chrome checks covered phone sizes 390×844 and 320×568: Services groups,
staff cards, mobile back/menu navigation, a populated saving collection sheet,
the collection dialog, the all-services drawer and Escape dismissal. The
320px collection page had no document-level horizontal overflow. A live 768px
check confirmed the original native table/sidebar layout. The temporary
browser viewport override was reset afterward.

No collections, deletions, approvals, permission changes or password changes
were submitted during live verification.

## Remaining verification and existing issues

- Real lower-privilege accounts and a staging API are still needed for complete
  end-to-end checks of every route, activity and server-side rejection. Fixture
  permissions do not prove backend enforcement or every combination of grants.
- Physical iOS/Android touch scrolling, virtual keyboards and screen readers
  have not been tested; desktop Chrome viewport checks cannot establish their
  behavior or performance.
- The existing profile menu links to `/change-password`, but `App.jsx` has no
  corresponding route. No password workflow or backend endpoint was invented
  in this mobile-only pass.
- The shared rich-text editor still has some unnamed toolbar controls. A full
  editor accessibility repair remains outside these verified fixes.
- This is not a claim that every unique page, modal, theme and language
  combination is fully audited. Shared mobile infrastructure and the listed
  high-risk collection/navigation paths are the verified coverage.
