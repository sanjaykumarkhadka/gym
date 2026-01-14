import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const publicRoutes = ["/", "/login", "/register", "/api/auth"];
const authRoutes = ["/login", "/register"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if it's an auth route (login/register)
  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  // Check if it's an API route
  const isApiRoute = pathname.startsWith("/api");

  // Allow public API routes
  if (isApiRoute && pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth routes
  if (isAuthRoute && isLoggedIn) {
    const role = req.auth?.user?.role;
    let redirectPath = "/dashboard/member";

    if (role === "OWNER" || role === "SUPER_ADMIN") {
      redirectPath = "/dashboard/admin";
    } else if (role === "ASSISTANT") {
      redirectPath = "/dashboard/assistant";
    }

    return NextResponse.redirect(new URL(redirectPath, nextUrl));
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Role-based route protection
  if (isLoggedIn && pathname.startsWith("/dashboard")) {
    const role = req.auth?.user?.role;

    // Admin routes - only OWNER and SUPER_ADMIN
    if (pathname.startsWith("/dashboard/admin")) {
      if (role !== "OWNER" && role !== "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/dashboard/member", nextUrl));
      }
    }

    // Assistant routes - OWNER, ASSISTANT, SUPER_ADMIN
    if (pathname.startsWith("/dashboard/assistant")) {
      if (!["OWNER", "ASSISTANT", "SUPER_ADMIN"].includes(role || "")) {
        return NextResponse.redirect(new URL("/dashboard/member", nextUrl));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match all routes except static files and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
