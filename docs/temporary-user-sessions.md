# Temporary user visits

An authorized staff member can open the application as another active, email-verified user for 15 minutes. Visits are view only and use the target user's permissions. The visitor's original login and the target user's existing logins remain valid.

## Enable and use

1. Deploy the matching Laravel backend and run `php artisan migrate`. The migration registers `staff_impersonate` without granting it to existing users or roles.
2. In Staff Permissions or Role Permissions, grant **Visit as user (15 minutes, view only)** to the intended administrators. They also need `staff_list_view` to access the staff list.
3. Open Staff and choose **Visit as user** beside an eligible user.
4. The target profile opens with disabled editing, a countdown, and **Return to my account**. The session ends automatically after 15 minutes or can be ended early. The profile menu's return action also ends the temporary session.

The temporary token is stored in this tab's session storage. Other existing tabs continue using their own login. Starting and ending a visit reloads the application to discard cached API data and open forms. Refreshing preserves the visit's original deadline. A network failure during refresh leaves the countdown and return controls available, with a retry option.

## Backend enforcement and audit

- `POST /api/users/{id}/impersonation` requires `staff_impersonate` and an ordinary login token.
- `POST /api/impersonation/stop` ends the active temporary session.
- `GET /api/authorization` includes temporary-session metadata while a visit is active.
- The API rejects changes, credential operations, nested visits, utility endpoints, and the legacy GET transaction-approval endpoint. The POST category-configuration read remains allowed.
- Every temporary request checks the original login, administrator permission, both accounts' active/verified status, and expiry. The browser timer is not the security boundary.
- `user_impersonation_sessions` retains administrator, target, original/temporary token IDs (no plaintext credentials), start time (`created_at`), expiry, actual end time, and end reason.

Keep the existing Laravel scheduler running. It executes `impersonation:expire` every minute to revoke expired tokens and finalize audit records even when the browser was closed. It can also be run manually with `php artisan impersonation:expire`. Access expires at the server deadline regardless of whether the scheduler is running; finalized expiry audit timestamps use that deadline.

## Verification

Backend: `php artisan test --filter=ImpersonationTest`.

Frontend: `npm run test:mobile -- src/test/impersonation.test.jsx src/test/impersonationBootstrap.test.jsx`.

On Node versions with experimental global web storage, run Vitest with `NODE_OPTIONS=--no-experimental-webstorage` so jsdom supplies browser storage.

The feature was checked with synthetic users in an isolated SQLite database, including desktop/mobile rendering, starting a visit, refreshing, and returning to the original user. No real users, permissions, or production database were changed.
