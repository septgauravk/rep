# DishPrompt Razorpay PDF delivery setup

## Support email

Use **hey.dishprompt@zohomail.in** as the customer-help address. The website now opens a prewritten message with these fields:

```text
Subject: DishPrompt PDF help — Payment ID / Download issue

Namaste DishPrompt team,

Maine DishPrompt PDF ke liye payment kiya hai, lekin mujhe download/access mein help chahiye.

Name:
Restaurant name:
Razorpay Payment ID:
Payment date:
Payment email/mobile:

Meri problem:

Kripya PDF download link share kar dijiye.

Thank you
```

## Recommended automated flow

The reliable flow is: **Razorpay Payment Link → Razorpay webhook → server-side verification → email with a secure download link → customer downloads the PDF**.

Razorpay officially supports Payment Link webhook events and redirect URLs. The webhook is the source of truth for fulfillment; the redirect is only the customer-facing success screen. Do not deliver the PDF solely because a visitor reaches a success URL.

| Approach | Tradeoffs | Cost | Setup complexity |
|---|---|---:|---:|
| **Recommended: Vercel serverless webhook + email provider** | Automatic, secure, scalable; requires a backend route, webhook secret, PDF storage, and transactional email provider | Vercel plan + email provider usage; often low at small volume | Medium |
| **Lighter alternative: Razorpay redirect + manual email fallback** | Fastest launch; payment is collected, but you manually verify Payment ID and send the PDF | Lowest setup cost | Low |

## Recommended implementation steps

First, create a Razorpay Payment Link for **₹999**. Configure its success redirect URL to a page such as `https://yourdomain.com/payment-success`. Keep the payment link public, but never place Razorpay Key Secret or webhook secrets in the frontend.

Next, create a server-side endpoint such as `/api/razorpay-webhook`. In Razorpay Dashboard, subscribe the endpoint to the relevant Payment Link paid event. Verify the webhook signature using the **raw request body** and your webhook secret before fulfilling any order. Record the Razorpay payment ID and customer email, then make the handler idempotent so Razorpay retries cannot send duplicate emails.

Store the PDF outside the public frontend bundle. The best options are private object storage or a file-delivery service that can create expiring links. The webhook handler should create a short-lived download URL, for example a link valid for 24–72 hours, and email it to the address collected by Razorpay.

For email delivery, use a transactional email provider with an authenticated sender such as `hey.dishprompt@zohomail.in`, or route through Zoho Mail SMTP/API if your Zoho plan supports the required sending method. The email should include the product name, payment ID, purchase date, one primary **Download PDF** button, the expiry time, and the support address.

Finally, use the redirect page only to say: “Payment successful. Check your email for the secure PDF download link.” Include the support email and the prewritten-help button as a fallback. This way, the customer can download from email immediately, while the website remains simple and mobile-friendly.

## Current implementation status

The clean Vercel-ready project now includes the required serverless backend routes: `/api/razorpay-webhook` verifies the raw Razorpay webhook signature, records processed events in Supabase for idempotency, issues one-time expiring download tokens, and sends the PDF email through Resend. `/api/pdf-download` consumes the token once and streams the PDF from a private Supabase Storage bucket. Automatic delivery becomes active after you add the documented Vercel environment variables, run `supabase_schema.sql`, upload the private PDF, configure the Razorpay webhook, and redeploy.

## Customer email template

The prewritten mailto link is already added to the website footer and support strip. Customers only need to fill in their name, restaurant, Razorpay Payment ID, payment date, and the problem they faced. They should not send card numbers, CVV, OTPs, or Razorpay secret information by email.

## Sources

1. [Razorpay Payment Links](https://razorpay.com/docs/payments/payment-links/)
2. [Razorpay Payment Link webhook events](https://razorpay.com/docs/webhooks/payment-links/)
3. [Razorpay webhook validation](https://razorpay.com/docs/webhooks/validate-test/)
4. [Razorpay Payment Link APIs and redirect configuration](https://razorpay.com/docs/payments/payment-links/apis/)
