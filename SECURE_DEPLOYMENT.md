# DishPrompt secure deployment

## Customer journey

After a successful Razorpay Payment Link payment, Razorpay sends the `payment_link.paid` webhook to the Vercel API function. The function validates `X-Razorpay-Signature` over the raw request body, rejects duplicate `x-razorpay-event-id` values, creates a random one-time token whose SHA-256 hash is stored in Supabase, and emails the customer a secure link with Resend. The customer does not type an email address.

The link points to `/api/pdf-download?token=...`, expires after 72 hours, and becomes unusable after the first successful consumption. The endpoint then creates a short-lived signed URL from private Supabase Storage.

## Razorpay setup

Create a Payment Link for exactly ₹999 and set its success callback to:

```text
https://YOUR_DOMAIN/payment-success
```

Create a Razorpay webhook at:

```text
https://YOUR_DOMAIN/api/razorpay-webhook
```

Subscribe to `payment_link.paid`, use a strong random webhook secret, and test in Razorpay Test Mode first. Signature verification and event-id idempotency are handled server-side.

## Supabase setup

Run `supabase_schema.sql` once in the Supabase SQL Editor. Create a private Storage bucket named `dishprompt-pdfs`, upload the PDF, and configure `SUPABASE_PDF_BUCKET` and `DISHPROMPT_PDF_STORAGE_KEY`. Row Level Security is enabled and the service-role key is used only by Vercel API functions.

## Resend setup

Create a Resend API key and verify the sending domain or address used by `EMAIL_FROM`. The delivery email uses the subject `Your DishPrompt PDF is ready — secure download inside`, includes a branded download CTA, payment reference, one-time/72-hour expiry language, a plain-text fallback, and `reply_to: hey.dishprompt@zohomail.in`.

## Vercel environment variables

Add the variables listed in `ENVIRONMENT_SETUP.md` under **Vercel → Project → Settings → Environment Variables** for Preview and Production. Only `VITE_RAZORPAY_PAYMENT_LINK` is public browser configuration. Keep Supabase, Razorpay webhook, Resend, PDF storage, and sender values server-only.

## Local image replacement

All site images live in `client/public/assets/dishprompt-assets/`. Replace `logo.png`, `favicon.png`, `og-image.jpg`, `hero.jpg`, `result-paneer-tikka.jpg`, `result-biryani.jpg`, and `result-masala-dosa.jpg` with your own files while keeping the same filenames.

## Deployment

Connect this repository to Vercel. The included `vercel.json` builds the Vite frontend, serves the local public assets, provides SPA fallbacks, routes the API functions, and applies security headers. Add the environment variables, deploy, then verify `/`, `/results`, `/payment-success`, `/api/razorpay-webhook`, and `/api/pdf-download`.

## Safety

Never commit secrets or put them in React code. Never publish the master PDF in the public asset folder. Never trust a payment-success redirect as proof of payment; fulfillment must come from the verified Razorpay webhook. If a secret is exposed, revoke it immediately and create a replacement.

## References

- [Razorpay Payment Link webhooks](https://razorpay.com/docs/webhooks/payment-links/)
- [Razorpay webhook validation](https://razorpay.com/docs/webhooks/validate-test/)
- [Supabase Storage signed URLs](https://supabase.com/docs/reference/javascript/storage-from-createsignedurl)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Resend email API](https://resend.com/docs/api-reference/emails/send-email)
