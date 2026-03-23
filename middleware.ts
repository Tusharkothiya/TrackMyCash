import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const THEME_KEY = "_next_refresh_token_tmc_";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(THEME_KEY)?.value;
  const { pathname } = request.nextUrl;

  const protectedRoutes = [
    "/dashboard",
    "/transactions",
    "/reports",
    "/budgets",
    "/settings",
    "/test-query",
  ];
  const publicRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/otp-verification",
    "/change-password",
  ];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/reports/:path*",
    "/budgets/:path*",
    "/settings/:path*",
    "/test-query/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/otp-verification",
    "/change-password",
  ],
};
