import { NextRequest } from "next/server";
import { processReferralLeadSubmission } from "@/lib/leads/intake-handler";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return processReferralLeadSubmission(req);
}
