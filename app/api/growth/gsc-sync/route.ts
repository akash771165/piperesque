import { NextRequest } from "next/server";
import { handlePostGscManualSync } from "@/lib/growth/gsc-sync-handler";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handlePostGscManualSync(req);
}
