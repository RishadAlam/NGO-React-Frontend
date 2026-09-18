# Isolated release verification

These PHPUnit HTTP integration tests exercise the adjacent Laravel backend; they are not loaded by Vite or the mobile application. They intentionally assert safe financial/security behavior and currently expose existing backend defects. Do not weaken assertions to make a release pass.

Run from `NGO-Laravel-Backend-API` with its installed dependencies:

```sh
rtk proxy env APP_ENV=testing DB_CONNECTION=sqlite DB_DATABASE=:memory: DATABASE_URL= MAIL_MAILER=array CACHE_DRIVER=array SESSION_DRIVER=array QUEUE_CONNECTION=sync LOG_CHANNEL=stderr APP_CONFIG_CACHE=/private/tmp/ngo-release-verification.7QREOg/nonexistent-config.php php vendor/bin/phpunit --do-not-cache-result ../NGO-React-Frontend/verification/backend
```

The config-cache path above must not exist. For a fresh run, create an isolated directory with `rtk proxy mktemp -d /private/tmp/ngo-release-verification.XXXXXX` and set `APP_CONFIG_CACHE` to `<returned-directory>/nonexistent-config.php`.

The application factory refuses to continue before `RefreshDatabase` migrations unless the runtime is `testing`, SQLite is `:memory:` with no URL override, and mail/cache/session use array drivers. Use no real database, recipient, user, or credentials. Every fixture is synthetic and transient. Recovery tests fake mail; both harnesses require array mail. Successful mail tests prove generation, not SMTP delivery.

Collection cases verify savings/loan pending creation, unauthorized approval denial, single authorized approval, automatic approval, member/cash balances, installments, loan recovery, regular category/center queues, previous-day category queues, approved history and internal audit totals. Replay, savings-only approval, and loan-only denial tests are release gates.

Recovery cases verify mail generation, missing/inactive accounts, invalid/expired/reused OTPs, password validation, token revocation and old/new login behavior. Direct no-OTP reset and cross-account reset must be denied without changing credentials; both are release gates.

Known results and remaining physical-device/delivery requirements are recorded in `docs/release-workflow-verification-2026-09-18.md`.
