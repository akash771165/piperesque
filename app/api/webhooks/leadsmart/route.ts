import { NextRequest } from "next/server";
import { handleLeadSmartWebhook } from "@/lib/growth/closed-loop-handlers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handleLeadSmartWebhook(req);
}
