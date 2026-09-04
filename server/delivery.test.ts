import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { buildDeliveryEmail, fulfillVerifiedPayment, paymentDetails, verifyRazorpayWebhook } from "./delivery";

afterEach(() => {
  delete process.env.RAZORPAY_WEBHOOK_SECRET;
});

describe("Razorpay webhook verification", () => {
  it("accepts an HMAC-SHA256 signature over the raw body", () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = "test-secret";
    const body = Buffer.from('{"event":"payment_link.paid"}');
    const signature = createHmac("sha256", "test-secret").update(body).digest("hex");
    expect(verifyRazorpayWebhook(body, signature)).toBe(true);
  });

  it("rejects missing or incorrect signatures", () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = "test-secret";
    const body = Buffer.from('{"event":"payment_link.paid"}');
    expect(verifyRazorpayWebhook(body, undefined)).toBe(false);
    expect(verifyRazorpayWebhook(body, "not-valid")).toBe(false);
  });
});

describe("Resend delivery email", () => {
  it("builds a professional, mobile-friendly payload with a one-time link", () => {
    const payload = buildDeliveryEmail({
      email: "owner@example.com",
      token: "secure-token",
      paymentId: "pay_123",
      appUrl: "https://dishprompt.example/",
      from: "DishPrompt <hello@dishprompt.example>",
    });

    expect(payload.subject).toBe("Your DishPrompt PDF is ready — secure download inside");
    expect(payload.to).toEqual(["owner@example.com"]);
    expect(payload.reply_to).toBe("hey.dishprompt@zohomail.in");
    expect(payload.html).toContain("Download your PDF");
    expect(payload.html).toContain("expires in 72 hours");
    expect(payload.html).toContain("pay_123");
    expect(payload.text).toContain("https://dishprompt.example/api/pdf-download?token=secure-token");
    expect(payload.text).toContain("This link can be used once");
  });
});

describe("Razorpay payment details", () => {
  it("extracts captured payment fields in paise without trusting browser input", () => {
    expect(paymentDetails({
      event: "payment.captured",
      payload: {
        payment: { entity: { id: "pay_123", order_id: "order_123", amount: 99900, currency: "INR", email: "owner@example.com", contact: "+919999999999", method: "upi" } },
        payment_link: { entity: { customer: { name: "Restaurant Owner" } } },
      },
    })).toEqual({
      paymentId: "pay_123",
      orderId: "order_123",
      amount: 99900,
      currency: "INR",
      email: "owner@example.com",
      name: "Restaurant Owner",
      phone: "+919999999999",
      method: "upi",
    });
  });

  it("returns an empty payment ID when the trusted webhook entity is incomplete", () => {
    expect(paymentDetails({ event: "payment.captured", payload: { payment: { entity: {} } } }).paymentId).toBe("");
  });
});

describe("Verified payment fulfillment", () => {
  it("skips token creation and email delivery for duplicate webhook events", async () => {
    const createDeliveryToken = vi.fn();
    const sendDeliveryEmail = vi.fn();
    const recordWebhookEvent = vi.fn().mockResolvedValue({ duplicate: true });
    const upsertPaymentRecord = vi.fn().mockResolvedValue({ id: 1 });
    const result = await fulfillVerifiedPayment("evt_123", "payment.captured", {
      paymentId: "pay_123",
      orderId: "order_123",
      amount: 99900,
      currency: "INR",
      email: "owner@example.com",
      name: "Owner",
      phone: null,
      method: "upi",
    }, { upsertPaymentRecord, recordWebhookEvent, createDeliveryToken, sendDeliveryEmail });

    expect(result.duplicate).toBe(true);
    expect(upsertPaymentRecord).toHaveBeenCalledOnce();
    expect(recordWebhookEvent).toHaveBeenCalledWith("evt_123", "payment.captured");
    expect(createDeliveryToken).not.toHaveBeenCalled();
    expect(sendDeliveryEmail).not.toHaveBeenCalled();
  });
});
