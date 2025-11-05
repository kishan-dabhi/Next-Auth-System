// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const publicPaths = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/verify-otp",
    "/auth/forgot-password",
    "/auth/change-password",
    "/_next",
    "/api",
  ];

  // allow NEXT internals and API
  if (publicPaths.some((p) => req.nextUrl.pathname.startsWith(p)))
    return NextResponse.next();

  if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
  try {
    jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

