import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* =====================================================
     1. NORMALIZE TRAILING SLASH
     Example:
     /services/ → /services
     /about/    → /about
  ===================================================== */

  if (
    pathname !== "/" &&
    pathname.endsWith("/") &&
    !pathname.startsWith("/api/")
  ) {
    const url = request.nextUrl.clone();

    url.pathname = pathname.replace(/\/+$/, "");

    return NextResponse.redirect(url, 308);
  }

  /* =====================================================
     2. LEGACY URL REDIRECTS
  ===================================================== */

  const redirects: Record<string, string> = {
    "/home": "/",

    "/plumbing": "/services",
    "/plumbing-services": "/services",

    "/emergency-plumber": "/services/emergency-plumbing",
    "/emergency-plumbing": "/services/emergency-plumbing",

    "/drain-cleaning": "/location/houston/drain-cleaning",
    "/sewer-repair": "/location/houston/sewer-line-repair",
    "/sewer-line-repair": "/location/houston/sewer-line-repair",
    "/leak-detection": "/location/houston/leak-detection",
    "/water-heater-repair": "/location/houston/water-heater-repair",
  };

  const redirectTarget = redirects[pathname];

  if (redirectTarget) {
    const url = request.nextUrl.clone();

    url.pathname = redirectTarget;

    return NextResponse.redirect(url, 308);
  }

  /* =====================================================
     3. CONTINUE REQUEST
  ===================================================== */

  return NextResponse.next();
}

/* =========================================================
   MIDDLEWARE MATCHER
========================================================= */

export const config = {
  matcher: [
    /*
     * Run middleware only on application routes.
     *
     * Excludes:
     * - _next/static
     * - _next/image
     * - favicon
     * - images
     * - common static files
     * - API routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2)$).*)",
  ],
};