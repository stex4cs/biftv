import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSession,
} from "@/lib/admin-session";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function csvEscape(v: string): string {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

export async function GET() {
  const cookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(cookie))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("email_subscribers")
    .select("email, source, subscribed_at")
    .order("subscribed_at", { ascending: false });

  const rows = data ?? [];
  const lines = [
    "email,source,subscribed_at",
    ...rows.map((r) =>
      [csvEscape(r.email), csvEscape(r.source ?? ""), csvEscape(r.subscribed_at ?? "")].join(","),
    ),
  ];
  const body = lines.join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="biftv-subscribers-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
