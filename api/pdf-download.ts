import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handlePdfDownload } from "../server/delivery";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).send("Method not allowed");
  return handlePdfDownload(req, res);
}
