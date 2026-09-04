# DishPrompt Vercel environment variables

Add the following variables in **Vercel → Project → Settings → Environment Variables**. Add them to **Production** and to **Preview** if you will test on preview deployments. The project does not require Razorpay Key ID or Key Secret because it uses Razorpay's hosted Payment Link flow.

| Variable | Value to enter | Scope |
|---|---|---|
| `VITE_RAZORPAY_PAYMENT_LINK` | Your public Razorpay Payment Link for ₹999 | Public browser value |
| `RAZORPAY_WEBHOOK_SECRET` | Secret generated when creating the Razorpay webhook | Server-only |
| `SUPABASE_URL` | Supabase project URL | Server-only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server/service-role key | Server-only; never expose |
| `SUPABASE_PDF_BUCKET` | `dishprompt-pdfs` | Server-only |
| `DISHPROMPT_PDF_STORAGE_KEY` | Exact private PDF path, such as `dishprompt.pdf` | Server-only |
| `RESEND_API_KEY` | Resend API key | Server-only |
| `EMAIL_FROM` | Verified sender, such as `DishPrompt <hello@yourdomain.com>` | Server-only |
| `PUBLIC_APP_URL` | Exact production URL, such as `https://dishprompt.vercel.app` | Server-only |

## Copy-ready key list

```text
VITE_RAZORPAY_PAYMENT_LINK
RAZORPAY_WEBHOOK_SECRET
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_PDF_BUCKET
DISHPROMPT_PDF_STORAGE_KEY
RESEND_API_KEY
EMAIL_FROM
PUBLIC_APP_URL
```

The correct PDF storage key is:

```text
DISHPROMPT_PDF_STORAGE_KEY
```

## Safe handling

Never put `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_WEBHOOK_SECRET`, or `RESEND_API_KEY` in client code, GitHub, screenshots, email, or any variable beginning with `VITE_`. If a secret is exposed, revoke it in the provider dashboard and create a replacement.

## Required external setup

Run `supabase_schema.sql` in Supabase SQL Editor. Create a **private** Supabase Storage bucket named `dishprompt-pdfs` and upload the paid PDF. Create the Razorpay Payment Link and require a customer email. Configure the Razorpay webhook at `/api/razorpay-webhook` for `payment_link.paid`; `payment.captured` may also be enabled. Verify a sender domain in Resend. After adding or changing variables, redeploy in Vercel.
