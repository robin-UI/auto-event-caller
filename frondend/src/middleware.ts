import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check for the JWT token cookie set by the backend after Google OAuth login
  const token = request.cookies.get("token")?.value;

  // If no token exists, redirect to the login page
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the original URL so we can redirect back after login (optional but nice UX)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token exists — allow the request to proceed
  return NextResponse.next();
}

// Apply this middleware to all routes EXCEPT /login and Next.js internals
export const config = {
  matcher: [
    /*
     * Match every request path EXCEPT:
     * - /login (the login page itself)
     * - /_next/static  (Next.js static assets)
     * - /_next/image   (Next.js image optimization)
     * - /favicon.ico   (favicon)
     * - /api/          (API routes — protected separately by the Express backend)
     */
    "/((?!login|_next/static|_next/image|favicon.ico|api/).*)",
  ],
};
