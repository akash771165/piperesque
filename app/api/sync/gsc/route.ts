import { NextRequest } from "next/server";
import {
  handleGscSyncGet,
  handleGscSyncPost,
} from "@/lib/growth/closed-loop-handlers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return handleGscSyncGet(req);
}

export async function POST(req: NextRequest) {
  return handleGscSyncPost(req);
}
