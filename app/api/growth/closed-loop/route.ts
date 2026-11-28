import { NextRequest } from "next/server";
import {
  handleDashboardClosedLoopAction,
  handleDashboardClosedLoopGet,
} from "@/lib/growth/closed-loop-handlers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  return handleDashboardClosedLoopGet(req);
}

export async function POST(req: NextRequest) {
  return handleDashboardClosedLoopAction(req);
}
