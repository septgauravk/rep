import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPdfSignedUrl, consumeDeliveryTokenRecord, insertDeliveryToken, recordWebhookEvent, upsertPaymentRecord } from "./supabase";

const TOKEN_TTL_MS = 72 * 60 * 60 * 1000;
const SUPPORT_EMAIL = "hey.dishprompt@zohomail.in";
const SUCCESS_EVENTS = new Set(["payment_link.paid", "payment.captured"]);

type RazorpayEntity = Record<string, any>;

type RazorpayEvent = {
  event?: string;
  payload?: {
    payment?: { entity?: RazorpayEntity };
    payment_link?: { entity?: RazorpayEntity };
  };
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

function header(req: VercelRequest, name: string) {
  const value = req.headers[name.toLowerCase()];
  return Array.isArray(value) ? value[0] : value;
}

export function verifyRazorpayWebhook(rawBody: Buffer, signature: string | undefined) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(signature, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function createDeliveryToken(email: string) {
  const storageKey = process.env.DISHPROMPT_PDF_STORAGE_KEY;
  if (!storageKey || !email) throw new Error("Delivery is not configured");
  const token = randomBytes(32).toString("base64url");
  await insertDeliveryToken({
    tokenHash: hashToken(token),
    email: email.toLowerCase().trim(),
    storageKey,
    expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
  });
  return token;
}

export async function consumeDeliveryToken(token: string) {
  return consumeDeliveryTokenRecord(hashToken(token));
}

export type DeliveryEmailPayload = {
  from: string;
  to: string[];
  reply_to: string;
  subject: string;
  html: string;
  text: string;
};

export function buildDeliveryEmail({ email, token, paymentId, appUrl, from }: { email: string; token: string; paymentId?: string; appUrl: string; from: string }): DeliveryEmailPayload {
  const downloadUrl = `${appUrl.replace(/\/$/, "")}/api/pdf-download?token=${encodeURIComponent(token)}`;
  const subject = "Your DishPrompt PDF is ready — secure download inside";
  const safePaymentId = paymentId ? escapeHtml(paymentId) : "";
  const paymentLine = safePaymentId ? `<p style="margin:0 0 18px;color:#5b5b5b;font-size:13px">Payment reference: <strong>${safePaymentId}</strong></p>` : "";
  const text = [
    "Namaste,",
    "",
    "Your DishPrompt PDF purchase was successful. Your secure download link is ready:",
    downloadUrl,
    "",
    "This link can be used once and expires in 72 hours.",
    paymentId ? `Payment reference: ${paymentId}` : "",
    "",
    `Need help? Email ${SUPPORT_EMAIL}.`,
    "",
    "Thank you,",
    "DishPrompt",
  ].filter(Boolean).join("\n");
  const html = `<!doctype html><html><body style="margin:0;background:#f8f3ed;font-family:Arial,sans-serif;color:#191919"><div style="max-width:560px;margin:32px auto;padding:0 16px"><div style="background:#ffffff;border:1px solid #e7ddd2;padding:32px"><p style="margin:0 0 22px;color:#276b50;font-weight:700;font-size:20px">DishPrompt</p><p style="margin:0 0 16px;font-size:16px">Namaste,</p><p style="margin:0 0 18px;color:#444;line-height:1.6">Your DishPrompt PDF purchase was successful. Your secure download link is ready.</p>${paymentLine}<p style="margin:24px 0"><a href="${downloadUrl}" style="display:inline-block;padding:14px 22px;background:#f05b0a;color:#ffffff;text-decoration:none;font-weight:700">Download your PDF</a></p><p style="margin:0 0 16px;color:#666;font-size:13px;line-height:1.6"><strong>One-time link:</strong> This link can be used once and expires in 72 hours.</p><p style="margin:22px 0 0;padding-top:18px;border-top:1px solid #eee5dc;color:#666;font-size:13px;line-height:1.6">Need help? Reply to this email or contact <a href="mailto:${SUPPORT_EMAIL}" style="color:#276b50">${SUPPORT_EMAIL}</a>.</p><p style="margin:22px 0 0;color:#444;font-size:13px">Thank you,<br /><strong>DishPrompt</strong></p></div></div></body></html>`;
  return { from, to: [email], reply_to: SUPPORT_EMAIL, subject, html, text };
}

export async function sendDeliveryEmail(email: string, token: string, paymentId?: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.PUBLIC_APP_URL;
  if (!apiKey || !appUrl) throw new Error("Email delivery is not configured");
  const payload = buildDeliveryEmail({ email, token, paymentId, appUrl, from: process.env.EMAIL_FROM || SUPPORT_EMAIL });
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(`Email provider failed: ${response.status}`);
}

export type PaymentDetails = {
  paymentId: string;
  orderId: string | null;
  amount: number | null;
  currency: string;
  email: string;
  name: string | null;
  phone: string | null;
  method: string | null;
};

export function paymentDetails(event: RazorpayEvent): PaymentDetails {
  const payment = event.payload?.payment?.entity || {};
  const paymentLink = event.payload?.payment_link?.entity || {};
  const customer = paymentLink.customer || {};
  const paymentId = typeof payment.id === "string" ? payment.id : "";
  return {
    paymentId,
    orderId: typeof payment.order_id === "string" ? payment.order_id : null,
    amount: typeof payment.amount === "number" ? payment.amount : typeof paymentLink.amount === "number" ? paymentLink.amount : null,
    currency: typeof payment.currency === "string" ? payment.currency : typeof paymentLink.currency === "string" ? paymentLink.currency : "INR",
    email: typeof customer.email === "string" ? customer.email : typeof payment.email === "string" ? payment.email : "",
    name: typeof customer.name === "string" ? customer.name : typeof payment.email === "string" ? payment.email : null,
    phone: typeof customer.contact === "string" ? customer.contact : typeof payment.contact === "string" ? payment.contact : null,
    method: typeof payment.method === "string" ? payment.method : null,
  };
}

type FulfillmentDeps = {
  upsertPaymentRecord: typeof upsertPaymentRecord;
  recordWebhookEvent: typeof recordWebhookEvent;
  createDeliveryToken: typeof createDeliveryToken;
  sendDeliveryEmail: typeof sendDeliveryEmail;
};

export async function fulfillVerifiedPayment(eventId: string, eventName: string, details: PaymentDetails, deps: FulfillmentDeps = { upsertPaymentRecord, recordWebhookEvent, createDeliveryToken, sendDeliveryEmail }) {
  await deps.upsertPaymentRecord({
    razorpayPaymentId: details.paymentId,
    razorpayOrderId: details.orderId,
    amount: details.amount,
    currency: details.currency,
    status: "captured",
    customerName: details.name,
    customerEmail: details.email || null,
    customerPhone: details.phone,
    paymentMethod: details.method,
  });

  const result = await deps.recordWebhookEvent(eventId, eventName);
  if (result.duplicate) return { duplicate: true as const, missingEmail: false as const };
  if (!details.email) return { duplicate: false as const, missingEmail: true as const };

  const token = await deps.createDeliveryToken(details.email);
  await deps.sendDeliveryEmail(details.email, token, details.paymentId);
  return { duplicate: false as const, missingEmail: false as const };
}

export async function handleRazorpayWebhook(req: VercelRequest, res: VercelResponse) {
  const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from("");
  if (!verifyRazorpayWebhook(rawBody, header(req, "x-razorpay-signature"))) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  let event: RazorpayEvent;
  try {
    event = JSON.parse(rawBody.toString("utf8")) as RazorpayEvent;
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  if (!event.event || !SUCCESS_EVENTS.has(event.event)) return res.status(200).json({ received: true, ignored: true });

  const eventId = header(req, "x-razorpay-event-id");
  if (!eventId) return res.status(400).json({ error: "Razorpay event ID is missing" });

  const details = paymentDetails(event);
  if (!details.paymentId) return res.status(422).json({ error: "Payment ID missing" });

  try {
    const result = await fulfillVerifiedPayment(eventId, event.event, details);
    if (result.duplicate) return res.status(200).json({ received: true, duplicate: true });
    if (result.missingEmail) return res.status(422).json({ error: "Payment email missing" });
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("[Delivery] Fulfillment failed", error instanceof Error ? error.message : "unknown error");
    return res.status(500).json({ error: "Fulfillment failed" });
  }
}

export async function handlePdfDownload(req: VercelRequest, res: VercelResponse) {
  const token = typeof req.query.token === "string" ? req.query.token : "";
  try {
    const delivery = await consumeDeliveryToken(token);
    if (!delivery) return res.status(410).send("This PDF link is expired or has already been used.");
    const signedUrl = await createPdfSignedUrl(delivery.storage_key);
    res.setHeader("Cache-Control", "no-store");
    return res.redirect(302, signedUrl);
  } catch {
    return res.status(500).send("Secure PDF delivery is temporarily unavailable.");
  }
}
