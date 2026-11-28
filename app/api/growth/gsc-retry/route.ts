import { NextRequest } from "next/server";
import {
  handleGetGscHealth,
  handlePostGscManualRetry,
} from "@/lib/growth/gsc-retry-handler";

export const runtime = "nodejs";

export async function GET() {
  return handleGetGscHealth();
}

export async function POST(req: NextRequest) {
  return handlePostGscManualRetry(req);
}
