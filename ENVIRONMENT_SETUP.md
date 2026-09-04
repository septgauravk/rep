# DishPrompt environment setup

This project is designed for deployment on Vercel. It uses local public assets, Razorpay for payment collection, Supabase for delivery records and private PDF storage, and Resend for transactional email. No login, hosted database template, or platform-specific runtime is required for the public purchase flow.

## Where to add values

In Vercel, open **Project → Settings → Environment Variables** and add each value for **Preview** and **Production**. Add secrets only to the server/API environment. Never commit a real secret to GitHub, place it in `client/src`, or prefix a secret with `VITE_`.

## Required values

| Variable | Visibility | Purpose |
|---|---|---|
| `VITE_RAZORPAY_PAYMENT_LINK` | Public browser value | Your public ₹999 Razorpay Payment Link. The current flow uses Razorpay's hosted Payment Link, so browser checkout does not need a Key Secret. |
| `RAZORPAY_WEBHOOK_SECRET` | Server-only | Verifies the raw Razorpay webhook signature. Required for the webhook. |
| `SUPABASE_URL` | Server-only | URL of your Supabase project. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Private Supabase server key. Never expose it to the browser. |
| `SUPABASE_PDF_BUCKET` | Server-only | Private Storage bucket name, normally `dishprompt-pdfs`. |
| `DISHPROMPT_PDF_STORAGE_KEY` | Server-only | PDF object path inside the private Supabase bucket, such as `dishprompt.pdf`. |
| `RESEND_API_KEY` | Server-only | Private Resend API key used to send the delivery email. |
| `EMAIL_FROM` | Server-only | Verified sender, for example `DishPrompt <hello@yourdomain.com>`. |
| `PUBLIC_APP_URL` | Server-only | Full Vercel URL, for example `https://your-site.vercel.app`. |

## Setup order

Create a Razorpay Payment Link for ₹999 and paste its public URL into `VITE_RAZORPAY_PAYMENT_LINK`. Create a Razorpay webhook pointing to `https://your-domain.vercel.app/api/razorpay-webhook`, subscribe to `payment_link.paid`, and optionally enable `payment.captured` if your Razorpay flow emits that event. Copy the webhook secret into `RAZORPAY_WEBHOOK_SECRET`. The server stores verified captured payments in the Supabase `payments` table; it does not trust the browser redirect as proof of payment.

Create a private Supabase Storage bucket named `dishprompt-pdfs`, upload the PDF, and set `SUPABASE_PDF_BUCKET` plus `DISHPROMPT_PDF_STORAGE_KEY`. Run `supabase_schema.sql` in the Supabase SQL Editor. The schema creates `payments`, `delivery_tokens`, and `processed_webhook_events`; the server creates one-use delivery records and short-lived signed URLs after a verified payment.

Create a Resend API key, verify the sender domain or sender address, and set `RESEND_API_KEY` and `EMAIL_FROM`. Set `PUBLIC_APP_URL` to the exact deployed Vercel origin. Redeploy after adding or changing environment variables.

## Local image folder

Replace site images only in `client/public/assets/dishprompt-assets/`, keeping these neutral filenames: `logo.png`, `favicon.png`, `og-image.jpg`, `hero.jpg`, `result-paneer-tikka.jpg`, `result-biryani.jpg`, and `result-masala-dosa.jpg`. Vercel serves them at `/assets/dishprompt-assets/...`. You can overwrite these files with your own real images before deployment.

## Delivery safeguards

The webhook verifies the Razorpay signature over the raw request body before processing, upserts the captured payment by unique Razorpay payment ID, and records the Razorpay event ID to prevent duplicate fulfillment. PDF tokens are hashed in Supabase, expire after 72 hours, and are consumed once. The PDF remains in a private Supabase Storage bucket and is exposed only through a short-lived signed URL.

## Safety rules

Never email or paste card numbers, CVV, OTPs, Razorpay API secrets, Supabase service-role keys, or Resend API keys. If any secret is exposed, revoke it immediately and create a replacement.

## Official references

- [Supabase API keys](https://supabase.com/docs/guides/api/api-keys)
- [Supabase Storage signed URLs](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Razorpay Payment Link webhooks](https://razorpay.com/docs/webhooks/payment-links/)
- [Razorpay webhook validation](https://razorpay.com/docs/webhooks/validate-test/)
- [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
