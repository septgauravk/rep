# DishPrompt

DishPrompt is a mobile-first Hinglish storefront for selling one ₹999 PDF to Indian restaurant owners. It is deployable on Vercel with Razorpay Payment Links, Supabase Postgres/Storage, and Resend email delivery.

## Start here

Read [`DEPLOYMENT_READINESS.md`](./DEPLOYMENT_READINESS.md) for the complete file structure, environment variables, Supabase SQL, Razorpay webhook setup, Resend setup, deployment order, customer flow, and launch validation.

Also available:

- [`VERCEL_ENVIRONMENT_TEMPLATE.md`](./VERCEL_ENVIRONMENT_TEMPLATE.md) — exact Vercel variable names and scope.
- [`ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md) — provider setup checklist.
- [`SECURE_DEPLOYMENT.md`](./SECURE_DEPLOYMENT.md) — security safeguards.
- [`RAZORPAY_PDF_DELIVERY.md`](./RAZORPAY_PDF_DELIVERY.md) — payment-to-email delivery details.
- [`DISHPROMPT_ASSETS.md`](./DISHPROMPT_ASSETS.md) — public image filenames and replacement instructions.
- [`supabase_schema.sql`](./supabase_schema.sql) — run once in Supabase SQL Editor.

## Local verification

```bash
pnpm install
pnpm check
pnpm test
pnpm build
```

The paid PDF is intentionally not included in the public project tree. Store it in the private Supabase Storage bucket configured through `DISHPROMPT_PDF_STORAGE_KEY`.
