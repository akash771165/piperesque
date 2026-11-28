import { NextRequest } from "next/server";
import { handleLeadSmartWebhook } from "@/lib/growth/closed-loop-handlers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return handleLeadSmartWebhook(req);
}

export async function POST(req: NextRequest) {
  return handleLeadSmartWebhook(req);
}
