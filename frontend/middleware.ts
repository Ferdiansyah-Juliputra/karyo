import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/home",
  "/history",
  "/profile",
];

const authRoutes = [
  "/login",
  "/register",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  // Root
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(token ? "/home" : "/login", request.url)
    );
  }

  // Protected pages
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // Auth pages
  const isAuthPage = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/home", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/home/:path*",
    "/history/:path*",
    "/profile/:path*",
  ],
};