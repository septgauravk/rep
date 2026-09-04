import { afterEach, describe, expect, it, vi } from "vitest";

const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient }));

import { getSupabaseAdmin, upsertPaymentRecord } from "./supabase";

afterEach(() => {
  delete process.env.SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  createClient.mockReset();
});

describe("Supabase server configuration", () => {
  it("does not create a client when server credentials are absent", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(getSupabaseAdmin()).toBeNull();
  });
});

describe("Supabase payment persistence", () => {
  it("upserts by unique Razorpay payment ID and stores amount in paise", async () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "server-only-test-key";

    const single = vi.fn().mockResolvedValue({ data: { id: 1, razorpay_payment_id: "pay_123", status: "captured" }, error: null });
    const select = vi.fn(() => ({ single }));
    const upsert = vi.fn(() => ({ select }));
    const from = vi.fn(() => ({ upsert }));
    createClient.mockReturnValue({ from });

    await upsertPaymentRecord({
      razorpayPaymentId: "pay_123",
      razorpayOrderId: "order_123",
      amount: 99900,
      currency: "INR",
      status: "captured",
      customerEmail: "owner@example.com",
    });

    expect(from).toHaveBeenCalledWith("payments");
    expect(upsert).toHaveBeenCalledWith(expect.objectContaining({
      razorpay_payment_id: "pay_123",
      amount: 99900,
      status: "captured",
    }), { onConflict: "razorpay_payment_id" });
    expect(single).toHaveBeenCalledOnce();
  });
});
