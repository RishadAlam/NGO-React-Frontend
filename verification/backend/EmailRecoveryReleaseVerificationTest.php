<?php

use App\Mail\EmailVerifyMail;
use App\Models\User;
use App\Models\UsersVerify;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

/** Temporary, isolated application-contract checks; never proof of email delivery. */
final class EmailRecoveryReleaseVerificationTest extends TestCase
{
    use RefreshDatabase;

    private const OLD_PASSWORD = 'SyntheticOld7!';
    private const NEW_PASSWORD = 'SyntheticNew8!';

    public function createApplication(): Application
    {
        $app = parent::createApplication();
        // Runs before RefreshDatabase can migrate or access application records.
        if (!$app->environment('testing')
            || $app['config']->get('database.default') !== 'sqlite'
            || $app['config']->get('database.connections.sqlite.driver') !== 'sqlite'
            || $app['config']->get('database.connections.sqlite.database') !== ':memory:'
            || !empty($app['config']->get('database.connections.sqlite.url'))
            || $app['config']->get('mail.default') !== 'array'
            || $app['config']->get('cache.default') !== 'array'
            || $app['config']->get('session.driver') !== 'array') {
            throw new RuntimeException('Refusing verification outside isolated testing / SQLite memory / array mail, cache, session.');
        }

        return $app;
    }

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
        Carbon::setTestNow(Carbon::parse('2026-09-18 12:00:00'));
        $this->withHeaders(['Accept-Language' => 'en']);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function syntheticUser(string $label, bool $verified = true, bool $active = true): User
    {
        return User::factory()->create([
            'name' => 'Synthetic Recovery Verification',
            'email' => $label.'@example.test',
            'password' => Hash::make(self::OLD_PASSWORD),
            'status' => $active,
            'email_verified_at' => $verified ? now() : null,
        ]);
    }

    private function code(User $user, string $otp = '234567', int $secondsRemaining = 300): UsersVerify
    {
        return UsersVerify::create([
            'user_id' => $user->id,
            'otp' => $otp,
            'expired_at' => now()->addSeconds($secondsRemaining),
        ]);
    }

    private function resetPayload(User $user): array
    {
        return [
            'user_id' => $user->id,
            'new_password' => self::NEW_PASSWORD,
            'confirm_password' => self::NEW_PASSWORD,
        ];
    }

    public function test_recovery_request_generates_recipient_bound_mail_and_five_minute_code(): void
    {
        $user = $this->syntheticUser('recovery-request');
        $this->postJson('/api/forget-password', ['email' => $user->email])
            ->assertOk()->assertJsonPath('success', true)->assertJsonPath('id', $user->id);
        $otp = UsersVerify::where('user_id', $user->id)->sole();
        $this->assertMatchesRegularExpression('/^[0-9]{6}$/', $otp->otp);
        $this->assertSame('2026-09-18 12:05:00', $otp->expired_at);
        Mail::assertSent(EmailVerifyMail::class, function ($mail) use ($user, $otp) {
            return $mail->hasTo($user->email)
                && (string) $mail->otp === $otp->otp
                && $mail->name === $user->name;
        });
        Mail::assertSentCount(1);
    }

    public function test_unknown_email_does_not_generate_code_or_mail(): void
    {
        $this->postJson('/api/forget-password', ['email' => 'absent@example.test'])
            ->assertNotFound()->assertJsonPath('success', false);
        $this->assertDatabaseCount('users_verifies', 0);
        Mail::assertNothingSent();
    }

    public function test_inactive_account_does_not_generate_code_or_mail(): void
    {
        $user = $this->syntheticUser('inactive', true, false);
        $this->postJson('/api/forget-password', ['email' => $user->email])
            ->assertStatus(202)->assertJsonPath('success', false);
        $this->assertDatabaseCount('users_verifies', 0);
        Mail::assertNothingSent();
    }

    public function test_valid_otp_verifies_user_and_consumes_all_their_codes(): void
    {
        $user = $this->syntheticUser('valid-code', false);
        $this->code($user);
        $this->code($user, '345678');
        $this->postJson('/api/account-verification', ['otp' => '234567'])
            ->assertOk()->assertJsonPath('success', true);
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertDatabaseMissing('users_verifies', ['user_id' => $user->id]);
    }

    public function test_incorrect_otp_does_not_verify_user_or_consume_valid_code(): void
    {
        $user = $this->syntheticUser('incorrect-code', false);
        $otp = $this->code($user);
        $this->postJson('/api/account-verification', ['otp' => '999999'])
            ->assertStatus(202)->assertJsonPath('success', false);
        $this->assertNull($user->fresh()->email_verified_at);
        $this->assertDatabaseHas('users_verifies', ['id' => $otp->id]);
    }

    public function test_expired_otp_cannot_verify_user(): void
    {
        $user = $this->syntheticUser('expired-code', false);
        $this->code($user, '234567', -1);
        $this->postJson('/api/account-verification', ['otp' => '234567'])
            ->assertStatus(202)->assertJsonPath('success', false);
        $this->assertNull($user->fresh()->email_verified_at);
    }

    public function test_consumed_otp_cannot_be_reused(): void
    {
        $user = $this->syntheticUser('reused-code', false);
        $this->code($user);
        $this->postJson('/api/account-verification', ['otp' => '234567'])
            ->assertOk()->assertJsonPath('success', true);
        $this->postJson('/api/account-verification', ['otp' => '234567'])
            ->assertStatus(202)->assertJsonPath('success', false);
    }

    public function test_synthetic_recovery_reset_revokes_tokens_and_allows_only_new_password_login(): void
    {
        $user = $this->syntheticUser('full-recovery');
        $tokenId = $user->createToken('synthetic-pre-reset')->accessToken->id;
        $this->postJson('/api/forget-password', ['email' => $user->email])
            ->assertOk()->assertJsonPath('success', true);
        $otp = UsersVerify::where('user_id', $user->id)->sole();
        $this->postJson('/api/account-verification', ['otp' => $otp->otp])
            ->assertOk()->assertJsonPath('success', true);
        $this->putJson('/api/reset-password', $this->resetPayload($user))
            ->assertOk()->assertJsonPath('success', true);
        $this->assertTrue(Hash::check(self::NEW_PASSWORD, $user->fresh()->password));
        $this->assertDatabaseMissing('personal_access_tokens', ['id' => $tokenId]);
        $this->postJson('/api/login', ['email' => $user->email, 'password' => self::OLD_PASSWORD])
            ->assertUnauthorized()->assertJsonPath('success', false);
        $this->postJson('/api/login', ['email' => $user->email, 'password' => self::NEW_PASSWORD])
            ->assertOk()->assertJsonPath('success', true)->assertJsonStructure(['access_token']);
        Mail::assertSentCount(1);
    }

    public function test_weak_reset_password_is_rejected_and_hash_preserved(): void
    {
        $user = $this->syntheticUser('weak-reset');
        $hash = $user->password;
        $this->putJson('/api/reset-password', [
            'user_id' => $user->id, 'new_password' => 'short', 'confirm_password' => 'short',
        ])->assertUnprocessable()->assertJsonValidationErrors(['new_password']);
        $this->assertSame($hash, $user->fresh()->password);
    }

    public function test_mismatched_reset_confirmation_is_rejected_and_hash_preserved(): void
    {
        $user = $this->syntheticUser('mismatched-reset');
        $hash = $user->password;
        $payload = $this->resetPayload($user);
        $payload['confirm_password'] = self::OLD_PASSWORD;
        $this->putJson('/api/reset-password', $payload)
            ->assertUnprocessable()->assertJsonValidationErrors(['confirm_password']);
        $this->assertSame($hash, $user->fresh()->password);
    }

    public function test_direct_reset_without_otp_must_be_denied_without_changing_credentials_or_tokens(): void
    {
        $user = $this->syntheticUser('direct-reset-victim');
        $hash = $user->password;
        $tokenId = $user->createToken('synthetic-preserved-token')->accessToken->id;
        $response = $this->putJson('/api/reset-password', $this->resetPayload($user));
        $actual = [
            'denied' => $response->status() >= 400 && $response->status() < 500,
            'password_preserved' => $hash === $user->fresh()->password,
            'token_preserved' => $user->tokens()->whereKey($tokenId)->exists(),
        ];
        $this->assertSame(['denied' => true, 'password_preserved' => true, 'token_preserved' => true], $actual,
            'SECURITY: unauthenticated reset without OTP must not change a synthetic account.');
    }

    public function test_one_accounts_verified_otp_must_not_authorize_resetting_another_account(): void
    {
        $owner = $this->syntheticUser('otp-owner');
        $victim = $this->syntheticUser('cross-account-victim');
        $hash = $victim->password;
        $tokenId = $victim->createToken('synthetic-cross-account-token')->accessToken->id;
        $this->code($owner);
        $this->postJson('/api/account-verification', ['otp' => '234567'])
            ->assertOk()->assertJsonPath('success', true);
        $response = $this->putJson('/api/reset-password', $this->resetPayload($victim));
        $actual = [
            'denied' => $response->status() >= 400 && $response->status() < 500,
            'password_preserved' => $hash === $victim->fresh()->password,
            'token_preserved' => $victim->tokens()->whereKey($tokenId)->exists(),
        ];
        $this->assertSame(['denied' => true, 'password_preserved' => true, 'token_preserved' => true], $actual,
            'SECURITY: OTP proof must be bound to the account whose password is reset.');
    }
}
