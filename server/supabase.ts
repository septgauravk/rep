import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;
  if (!client) {
    client = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}

export async function insertDeliveryToken(input: {
  tokenHash: string;
  email: string;
  storageKey: string;
  expiresAt: Date;
}) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("delivery_tokens").insert({
    token_hash: input.tokenHash,
    email: input.email,
    storage_key: input.storageKey,
    expires_at: input.expiresAt.toISOString(),
  });
  if (error) throw error;
}

export async function consumeDeliveryTokenRecord(tokenHash: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !tokenHash) return null;
  const { data, error } = await supabase
    .from("delivery_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("id, token_hash, email, storage_key, expires_at, used_at, created_at")
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createPdfSignedUrl(storageKey: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !storageKey) throw new Error("Supabase Storage is not configured");
  const bucket = process.env.SUPABASE_PDF_BUCKET || "dishprompt-pdfs";
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storageKey, 60 * 60);
  if (error || !data?.signedUrl) throw error || new Error("Unable to create PDF signed URL");
  return data.signedUrl;
}

export async function recordWebhookEvent(eventId: string, eventName: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("processed_webhook_events").insert({
    event_id: eventId,
    event_name: eventName,
  });
  if (!error) return { duplicate: false } as const;
  if (error.code === "23505") return { duplicate: true } as const;
  throw error;
}

export type PaymentRecordInput = {
  razorpayPaymentId: string;
  razorpayOrderId?: string | null;
  amount?: number | null;
  currency?: string | null;
  status: "captured";
  customerName?: string | null;
  customerEmail?: string | null;
  customerPhone?: string | null;
  paymentMethod?: string | null;
};

export async function upsertPaymentRecord(input: PaymentRecordInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("payments")
    .upsert(
      {
        razorpay_payment_id: input.razorpayPaymentId,
        razorpay_order_id: input.razorpayOrderId || null,
        amount: input.amount ?? null,
        currency: input.currency || "INR",
        status: input.status,
        customer_name: input.customerName || null,
        customer_email: input.customerEmail || null,
        customer_phone: input.customerPhone || null,
        payment_method: input.paymentMethod || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "razorpay_payment_id" },
    )
    .select("id, razorpay_payment_id, status")
    .single();
  if (error) throw error;
  return data;
}
