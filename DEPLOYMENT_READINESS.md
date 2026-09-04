# DishPrompt deployment readiness

This package is a Vite React storefront with Vercel serverless API routes. It has no login, no admin dashboard, no application database outside Supabase, and no Manus-specific runtime or asset dependency.

## Complete project structure

```text
DishPrompt/
├── api/
│   ├── pdf-download.ts          # One-time token validation and signed PDF redirect
│   └── razorpay-webhook.ts      # Razorpay HMAC verification and fulfillment trigger
├── client/
│   ├── index.html               # Browser HTML shell and SEO/social metadata
│   ├── public/
│   │   └── assets/
│   │       └── dishprompt-assets/
│   │           ├── favicon.png
│   │           ├── hero.jpg
│   │           ├── logo.png
│   │           ├── og-image.jpg
│   │           ├── result-biryani.jpg
│   │           ├── result-masala-dosa.jpg
│   │           └── result-paneer-tikka.jpg
│   └── src/
│       ├── components/ErrorBoundary.tsx
│       ├── contexts/ThemeContext.tsx
│       ├── pages/Home.tsx
│       ├── pages/Results.tsx
│       ├── pages/PaymentSuccess.tsx
│       ├── pages/NotFound.tsx
│       ├── App.tsx               # /, /results, /payment-success, /404, fallback
│       ├── index.css
│       └── main.tsx
├── scripts/
│   └── optimize-public-assets.py # Optional local image compression helper
├── server/
│   ├── delivery.ts               # Webhook, token, email, and signed-URL logic
│   ├── delivery.test.ts          # HMAC, email, parsing, and duplicate tests
│   ├── supabase.ts               # Server-only Supabase service-role helpers
│   └── supabase.test.ts          # Server credential and payment-upsert tests
├── .gitignore
├── .prettierignore
├── .prettierrc
├── DISHPROMPT_ASSETS.md
├── ENVIRONMENT_SETUP.md
├── RAZORPAY_PDF_DELIVERY.md
├── SECURE_DEPLOYMENT.md
├── VERCEL_ENVIRONMENT_TEMPLATE.md
├── DEPLOYMENT_READINESS.md
├── package.json
├── pnpm-lock.yaml
├── supabase_schema.sql
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── vitest.config.ts
```

The paid PDF is intentionally not included in the public source tree. Upload it to the private Supabase Storage bucket described below.

## Required Vercel environment variables

Add these under **Vercel → Project → Settings → Environment Variables**. Use **Production** and use **Preview** if you will test preview deployments.

| Variable | Example or value | Server/public |
|---|---|---|
| `VITE_RAZORPAY_PAYMENT_LINK` | `https://rzp.io/l/your-payment-link` | Public browser value |
| `RAZORPAY_WEBHOOK_SECRET` | Secret generated in Razorpay webhook settings | Server-only |
| `SUPABASE_URL` | `https://your-project.supabase.co` | Server-only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key | Server-only; never expose |
| `SUPABASE_PDF_BUCKET` | `dishprompt-pdfs` | Server-only |
| `DISHPROMPT_PDF_STORAGE_KEY` | `dishprompt.pdf` | Server-only |
| `RESEND_API_KEY` | Resend API key | Server-only |
| `EMAIL_FROM` | `DishPrompt <hello@yourdomain.com>` | Server-only |
| `PUBLIC_APP_URL` | `https://your-project.vercel.app` | Server-only |

The current hosted Payment Link implementation does **not** require `RAZORPAY_KEY_ID` or `RAZORPAY_KEY_SECRET`. Those are only needed if the product is later changed to create Razorpay Orders or use an embedded Checkout integration.

## Setup order

First create the Vercel project from this repository or upload the ZIP contents to a new repository. The repository root must contain `package.json` and `vercel.json`. Use `pnpm build` as the build command and `dist/public` as the output directory.

Next create a Supabase project. Run `supabase_schema.sql` once in **SQL Editor**. Create a **private** Storage bucket called `dishprompt-pdfs`, upload the paid PDF, and copy the exact object path into `DISHPROMPT_PDF_STORAGE_KEY`.

Then create a ₹999 Razorpay Payment Link. Make customer email required. Set the callback URL to `https://YOUR_DOMAIN/payment-success`. Create a Razorpay webhook at `https://YOUR_DOMAIN/api/razorpay-webhook`, subscribe to `payment_link.paid`, and optionally `payment.captured`. Set the generated webhook secret in Vercel.

Create a Resend account, verify your sending domain, create an API key, and set `RESEND_API_KEY` and `EMAIL_FROM`. Keep `hey.dishprompt@zohomail.in` as the support/reply-to address.

Set `PUBLIC_APP_URL` to the exact production origin, save all Vercel variables, and redeploy. If a variable or domain changes, redeploy again because the new deployment must receive the updated configuration.

## Customer flow

The customer clicks the public Razorpay Payment Link from `/`. Razorpay collects payment and customer email. Razorpay redirects the browser to `/payment-success`, but the browser redirect is not treated as proof of payment. Razorpay separately calls `/api/razorpay-webhook`.

The webhook validates the raw request-body signature, accepts the configured success event, upserts the captured payment using the unique Razorpay payment ID, records the event ID for duplicate protection, creates a random hashed 72-hour delivery token, and asks Resend to send the secure link. The customer’s first request to `/api/pdf-download?token=...` atomically consumes the token and redirects to a one-hour Supabase signed URL. A second request returns an expired/already-used response.

## Validation before launch

Run these locally from the project root:

```bash
pnpm install
pnpm check
pnpm test
pnpm build
```

The expected current validation is **TypeScript passes, 8 tests pass, and the Vite production build passes**. In Vercel, confirm the deployment is using this cleaned repository rather than an older project revision. In the browser, directly open `/`, `/results`, `/payment-success`, and an unknown path to confirm the SPA fallback.

Use Razorpay Test Mode for the first transaction. Confirm the webhook is successful, one payment row is present in Supabase, one event row is present in `processed_webhook_events`, the Resend email arrives, and the download link works only once.

## Security rules

Never commit real secrets. Never use `VITE_` for a server secret. Never make the PDF bucket public. Never put the paid PDF in `client/public`. Never trust a payment ID supplied only by the browser. Never log webhook bodies, secrets, card data, CVV, or OTPs.
