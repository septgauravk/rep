# DishPrompt website tasks

- [x] Reframe the existing research project as the DishPrompt sales landing page.
- [x] Generate or select brand assets and food imagery using the requested saffron/cream/green palette.
- [x] Implement Hinglish hero, benefits, workflow, examples, pricing, FAQ, and mobile navigation.
- [x] Add a Razorpay Payment Link integration point for the ₹999 PDF purchase.
- [x] Add a thank-you/download handoff and clear setup instructions for the PDF delivery URL.
- [x] Verify desktop/mobile behavior, build, and Vercel compatibility.
- [x] Save a checkpoint and deliver the preview/project version.

Checkpoint note: DishPrompt storefront verified at desktop and mobile widths; build and TypeScript checks pass. Razorpay remains configured through the public Payment Link constant.

## Support and delivery update

- [x] Add hey.dishprompt@zohomail.in as the visible support contact.
- [x] Add a prewritten customer email template for payment or download help.
- [x] Document the secure Razorpay webhook-to-email/PDF delivery architecture.
- [x] Update the storefront copy to explain instant delivery and support fallback.
- [x] Verify the updated page and build.

## Results page and asset folder update

- [x] Add a dedicated results page with three image examples.
- [x] Create one clearly named public upload folder for logo, favicon, OG, hero, and result assets.
- [x] Update all website image references to use the centralized asset paths.
- [x] Add replacement instructions and an asset manifest.
- [x] Verify route navigation, mobile layout, and production build.

## Security and Vercel readiness

- [x] Read the full-stack implementation guidance before adding server-side webhook support.
- [x] Verify Razorpay webhook and signature requirements from official documentation.
- [x] Add a server-side webhook handler that validates signatures and prevents duplicate fulfillment.
- [x] Add PDF delivery/email provider configuration placeholders without exposing secrets.
- [x] Add Vercel deployment configuration and security headers.
- [x] Preview the site on mobile and test the checkout entry without a real transaction.
- [x] Save the verified checkpoint and deliver setup instructions. Checkpoint remains blocked by the expired project Git synchronization token; delivery instructions are documented.

## Post-payment options

- [x] Add a payment-success page with Download PDF and Email PDF choices.
- [x] Keep the download URL configurable and avoid exposing payment secrets in frontend code.
- [x] Add support fallback and mobile-friendly copy for the success page.
- [x] Verify the new route and production build.

## One-time protected delivery and Vercel deployment

- [x] Replace the typed-email success flow with no-typing, verified-payment delivery actions.
- [x] Add one-time expiring download tokens with server-side storage and replay protection.
- [x] Add server-side verified Razorpay webhook fulfillment and email delivery scaffolding.
- [x] Add Vercel-compatible API/deployment configuration and security headers.
- [x] Document the exact secret setup and PDF storage requirements.
- [x] Preview the entire site on mobile and test homepage to payment-success journey.
- [x] Diagnose and document the expired Git synchronization-token recovery path.

## Confirmed implementation scope

- [x] Implement one-time no-typing download and email choices.
- [x] Implement secure Razorpay webhook signature verification and idempotent fulfillment scaffolding.
- [x] Implement protected one-time PDF token issuance and consumption.
- [x] Add Vercel configuration and security headers.
- [x] Add manual secret setup documentation.
- [x] Test the homepage-to-payment-success journey on mobile.

## Vercel route fallback completion

- [x] Add direct-load SPA fallbacks for `/results`, `/payment-success`, and `/404` without intercepting API routes.
- [x] Document final Vercel deployment verification steps; live confirmation requires the user to connect the repository and deploy from their Vercel account.

## Email template review

- [x] Refine the Resend subject line and PDF delivery email for professional tone, clarity, mobile readability, and sender trust.
- [x] Add a plain-text alternative and reply-to support address.
- [x] Validate the updated email delivery code and tests.

## Resend review and Supabase migration

- [x] Review and refine the Resend subject line and transactional email body.
- [x] Replace delivery-token persistence with Supabase server-side storage.
- [x] Replace processed-webhook-event persistence with Supabase server-side storage.
- [x] Add Supabase schema/configuration documentation without exposing secrets.
- [x] Add or update tests for email payload and Supabase persistence boundaries.
- [x] Run TypeScript, unit tests, and production build.

## Environment-variable setup guide

- [x] Inventory every environment variable referenced by the current frontend, server, Vercel configuration, and delivery docs.
- [x] Create a single beginner-friendly Vercel environment-variable setup file with public/server-only labels.
- [x] Document Supabase, Razorpay, Resend, PDF storage, sender-domain, and callback setup steps.
- [x] Cross-check every documented variable against the code and run validation.

## Live Vercel production review

- [x] Replace `/manus-storage` image references that fail on Vercel with deployable public asset paths or externally hosted URLs.
- [x] Rebuild and validate the production asset paths locally.
- [x] Document the live Vercel recheck requirement; recheck is ready to run after the user redeploys the latest clean source and configures secrets.

- [x] Allow the stable `files.manuscdn.com` image host in the Vercel Content-Security-Policy so production images render correctly.
- [x] Rebuild and checkpoint the CSP fix for redeployment.

## Manus-free Vercel decoupling

- [x] Audit and remove Manus storage URLs, CDN references, image names, database/runtime dependencies, hosting assumptions, and Manus-only packages.
- [x] Move all site images into a local user-replaceable public asset folder with neutral filenames.
- [x] Keep only Vercel, Razorpay, email delivery, and Supabase integrations in deployment documentation and code.
- [x] Validate the clean project, tests, production build, and deployment configuration.
- [x] Create a new clean Vercel deployment ZIP with local assets and service-only integrations.

## Beginner deployment handoff

- [x] Provide a complete no-credentials-yet setup sequence for Vercel, Supabase, Razorpay, Resend, private PDF storage, webhook configuration, and live verification.
- [x] Explain the implemented security boundaries and clearly distinguish local validation from live payment/webhook verification.

## Live Vercel deployment review

- [x] Inspect the supplied Vercel URL and build log for old-source, Manus dependency, environment, and API deployment issues.
- [x] Report the exact redeployment correction path and live verification checklist.

## Template cleanup and payment integration update

- [x] Audit all project files and remove unused Drizzle/MySQL/template/Manus files without changing the storefront UI.
- [x] Verify or extend `/payment-success` with safe non-sensitive redirect details and correct customer messaging.
- [x] Verify or extend `/api/razorpay-webhook` with raw-body signature validation, captured-payment handling, idempotent Supabase payment records, and safe errors.
- [x] Update Supabase schema and environment documentation for payment records and required credentials.
- [x] Add tests for payment persistence, duplicate webhooks, invalid signatures, and client/server secret boundaries.
- [x] Run full TypeScript, test, build, and Vercel route validation before delivery.

## Final deployable package audit

- [ ] Audit every page, SPA fallback, API route, dependency, environment reference, and deploy file.
- [ ] Add or correct any missing deployment example/configuration files so setup is self-contained.
- [ ] Validate all routes, TypeScript, tests, production build, and secret/template audits.
- [ ] Rebuild the final ZIP without generated output, dependencies, internal metadata, or secrets.
- [ ] Deliver the complete file structure and exact Vercel/Supabase/Razorpay/Resend setup sequence.
