import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/features/auth";

const PROTECTED_PREFIX = "/dashboard";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // if (!pathname.startsWith(PROTECTED_PREFIX)) {
  //   return NextResponse.next();
  // }

  // if (!request.cookies.has(ACCESS_TOKEN_COOKIE)) {
  //   const loginUrl = new URL("/login", request.url);
  //   loginUrl.searchParams.set("next", pathname);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
