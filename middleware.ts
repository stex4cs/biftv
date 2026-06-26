import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-session";

type CookieToSet = { name: string; value: string; options: CookieOptions };

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  // 1. Refresh Supabase Auth session if needed.
  let res = NextResponse.next({ request: req });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (url && publishable) {
    const supabase = createServerClient(url, publishable, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          for (const { name, value, options } of cookiesToSet) {
            res.cookies.set(name, value, options);
          }
        },
      },
    });
    await supabase.auth.getUser();
  }

  // 2. Gate admin routes (login allowed unauthenticated).
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/admin") &&
    pathname !== "/admin/login" &&
    !pathname.startsWith("/admin/login/")
  ) {
    const adminCookie = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!(await verifyAdminSession(adminCookie))) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return res;
}
