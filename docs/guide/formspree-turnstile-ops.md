# Formspree and Turnstile Operations

This guide documents required production-side controls that are not fully enforceable from repository code alone.

## Purpose

Reduce abuse risk for the contact form by ensuring challenge validation and provider-side protections are enabled.

## Required provider settings

1. Formspree form hardening

- Enable spam filtering for the production form.
- Enable submission rate limiting at the strictest level compatible with expected traffic.
- Enable email/domain allow or deny rules if needed for abuse trends.

2. Cloudflare Turnstile enforcement

- Ensure the production site key and secret key are configured in Cloudflare.
- Ensure Formspree integration verifies Turnstile tokens for form submissions.
- Verify token validation failure blocks submission processing.

3. Environment handling

- Local development may use preview behavior for CAPTCHA.
- Production must set `PUBLIC_TURNSTILE_SITE_KEY` to the live site key.
- Do not expose secret keys in client code or committed files.

## Verification checklist before release

1. Submit a valid message with a solved Turnstile challenge and confirm success.
2. Submit without a valid challenge and confirm rejection.
3. Trigger multiple rapid submissions and confirm rate-limiting behavior.
4. Verify Formspree dashboard logs include rejected attempts for invalid challenge scenarios.

## Ownership

- Engineering owner: maintain env wiring and client integration behavior.
- Operations owner: maintain provider dashboard security settings and periodic review cadence.

## Monitoring cadence

- Weekly review of spam/rejection trends for the first month after launch.
- Monthly review thereafter, or immediately after suspicious spikes.
