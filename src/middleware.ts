import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const publicPaths = ["/login", "/api", "/_next", "/images", "/favicon.ico"];
  const isPublicPath = publicPaths.some(
    (path) =>
      req.nextUrl.pathname === path ||
      req.nextUrl.pathname.startsWith(path + "/")
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  const authCookie = req.cookies.get("auth");

  if (
    !authCookie ||
    authCookie.value !== process.env.NEXT_PUBLIC_SITE_PASSWORD
  ) {
    const url = new URL("/login", req.url);
    url.searchParams.set("returnUrl", req.nextUrl.pathname);

    const response = NextResponse.redirect(url);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  if (req.nextUrl.pathname === "/report") {
    const adminCookie = req.cookies.get("admin-auth");

    if (
      !adminCookie ||
      adminCookie.value !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      const url = new URL("/admin-login", req.url);
      url.searchParams.set("returnUrl", req.nextUrl.pathname);

      const response = NextResponse.redirect(url);
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      response.headers.set("Expires", "0");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
