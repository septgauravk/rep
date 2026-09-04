import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleRazorpayWebhook } from "../server/delivery";

export const config = { api: { bodyParser: false } };

async function readRawBody(req: VercelRequest) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  req.body = await readRawBody(req);
  return handleRazorpayWebhook(req, res);
}
