# Client Setup Notes

## What You Need From the Client

- **Admin email address** — a dedicated email they're okay using for web and donation services (e.g., `admin@theirorg.org` or `info@theirorg.org`). This becomes the login for Vercel, Formspree, and Donorbox.
- **Domain access** — whoever manages their domain needs to add two DNS records. You get these from Vercel after connecting the domain in the dashboard.

---

## Accounts to Create (in Their Name, You Manage)

Use the client's admin email for all three:

- [ ] **Vercel** — vercel.com — hosting
- [ ] **Formspree** — formspree.io — contact form submissions
- [ ] **Donorbox** — donorbox.org — donation processing

Keep a copy of the credentials somewhere secure. The client doesn't need to touch any of these day-to-day.

---

## DNS Setup (Domain Host → Vercel)

After adding their custom domain in the Vercel project dashboard, Vercel shows you the exact records to add. Hand these to whoever controls the domain:

| Type  | Name  | Value                  |
| ----- | ----- | ---------------------- |
| A     | `@`   | `76.76.21.21`          |
| CNAME | `www` | `cname.vercel-dns.com` |

The UI varies by registrar (GoDaddy, Namecheap, Squarespace Domains, etc.) but the values are always the same. Propagation is usually under an hour, up to 48 in the worst case.

---

## Formspree Setup

1. Create account at formspree.io using the client email
2. Create a new form — name it something like "Contact Form"
3. Copy the form endpoint URL: `https://formspree.io/f/xxxxxxxx`
4. In Vercel: **Project Settings → Environment Variables**, add:
   - Key: `PUBLIC_FORMSPREE_URL`
   - Value: `https://formspree.io/f/xxxxxxxx`
5. Update `src/pages/contact.astro` to use that env var as the form `action`
6. Submit a test message and confirm it lands in the client's inbox

Free plan allows 50 submissions/month — more than enough. No payment info required.

---

## Donorbox Setup

1. Go to donorbox.org → **Sign Up** → use the client email
2. Enter organization name, confirm email

**Connect bank / payment processor:**

- Donorbox processes payments through **Stripe** and deposits directly to their bank
- During onboarding you'll be prompted to connect Stripe — click through and enter their bank account info (routing + account number) or connect an existing Stripe account if they have one
- Donorbox creates a Stripe Express account on their behalf if they don't have one

**Create a campaign:**

- Dashboard → **New Campaign**
- Set name, suggested donation amounts, optional goal
- Add logo or photo if they have one
- Set designation (e.g., "General Fund")

**Get the embed code:**

- Campaign → **Embed** tab
- Copy the snippet and paste it into `src/pages/donate.astro`

**Before going live:** use Donorbox's test mode to run a test donation end to end.

> Donorbox charges ~0.75–1.5% per donation (no monthly fee). Donors can optionally cover the fee themselves, which most do.

---

## How to Login / Update / Cancel

Share this with the client so it's not lost if you're ever unavailable:

| Service   | URL          | What it manages                               |
| --------- | ------------ | --------------------------------------------- |
| Vercel    | vercel.com   | Hosting, deployments, env vars                |
| Formspree | formspree.io | Contact form submissions, notification email  |
| Donorbox  | donorbox.org | Donations, campaign settings, bank connection |

To cancel any service: login → account or billing settings → cancel/delete. No long-term contracts on any of them.

---

## Why This Over Squarespace

For a client who needs a solid site, a contact form, and a donation option — and makes occasional updates a few times a year — this setup is the better long-term choice:

**No monthly platform fee.** Squarespace starts at ~$23/month ($276/year). This stack is free outside of Donorbox's small per-donation percentage.

**You own everything.** No lock-in to a platform that can raise prices, drop features, or shut down.

**Small updates are fast.** Five-plus years of clients emailing for changes shows this model works well. A text update takes minutes and keeps the cost of maintenance near zero for them.

**Better performance.** Astro ships near-zero JavaScript. Squarespace sites carry significant platform overhead.

Squarespace is the right call when a client wants to make frequent changes themselves — weekly updates, new pages, full redesigns — or needs a drag-and-drop editor they can use independently. If that's the case I can help set it up, but I'm not a Squarespace developer, so it takes me longer, and that added cost compounds over time for something most small non-profits and community sites genuinely don't need.

For most of my clients, "email me and I'll update it" works well, saves them money, and keeps the site fast and maintainable and allows me to have fun working in my favorite environment, code!
