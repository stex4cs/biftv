import { NextResponse } from "next/server";
import { heartbeat } from "@/lib/session-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { token?: string; device_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const token = (body.token ?? "").trim();
  const deviceId = (body.device_id ?? "").trim();
  if (!token || !deviceId) {
    return NextResponse.json(
      { error: "token i device_id su obavezni" },
      { status: 400 },
    );
  }
  const result = await heartbeat({ token, deviceId });
  const status =
    result.status === "ok"
      ? 200
      : result.status === "kicked"
        ? 409
        : 403;
  return NextResponse.json(result, { status });
}
