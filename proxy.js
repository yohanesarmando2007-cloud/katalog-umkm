import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getCleanUrl() {
  const rawUrl = process.env.SUPABASE_URL || "";
  return rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = getCleanUrl();
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || "";

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Ambil user dari Supabase Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // Semua rute /admin kecuali /admin/login wajib login
  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

export default proxy;

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

