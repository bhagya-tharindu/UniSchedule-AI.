<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('mail:test {to : Recipient email address}', function (string $to) {
    $username = config('mail.mailers.smtp.username');
    $password = config('mail.mailers.smtp.password');

    if (blank($username) || blank($password)) {
        $this->error('Gmail SMTP is not configured.');
        $this->line('Set MAIL_USERNAME and MAIL_PASSWORD (Google App Password) in backend/.env');
        $this->line('Also set MAIL_FROM_ADDRESS to the same Gmail address, then run: php artisan config:clear');

        return 1;
    }

    if (blank(config('mail.from.address'))) {
        $this->error('Set MAIL_FROM_ADDRESS in backend/.env (usually the same as MAIL_USERNAME).');

        return 1;
    }

    try {
        Mail::raw(
            'UniSchedule AI mail test — if you received this, Gmail SMTP is working.',
            fn ($message) => $message->to($to)->subject('UniSchedule AI — test email'),
        );
    } catch (\Throwable $e) {
        $message = $e->getMessage();
        $this->error('Send failed: '.$message);

        if (str_contains($message, '535') || str_contains($message, 'BadCredentials')) {
            $this->newLine();
            $this->warn('Gmail rejected the login. Use a Google App Password, not your normal Gmail password.');
            $this->line('1. Enable 2-Step Verification on the Google account');
            $this->line('2. Create an App Password: https://myaccount.google.com/apppasswords');
            $this->line('3. Put the 16-character app password in MAIL_PASSWORD (no spaces, no quotes needed)');
            $this->line('4. Run: php artisan config:clear');
        }

        return 1;
    }

    $this->info("Test email sent to {$to}");

    return 0;
})->purpose('Send a test email via configured SMTP (Gmail)');
