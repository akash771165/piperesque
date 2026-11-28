import { NextRequest } from "next/server";
import { handleOptimizeSitePost } from "@/lib/growth/closed-loop-handlers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  return handleOptimizeSitePost(req);
}
