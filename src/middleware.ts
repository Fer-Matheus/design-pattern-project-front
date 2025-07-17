"use server";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies.get("access-token");
  const hasToken = cookies?.value && cookies.value !== "";

  if (!hasToken && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/courses")) {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/checkout")) {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/course")) {
    if (!hasToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith("/login")) {
    if (hasToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
