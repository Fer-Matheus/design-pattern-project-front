"use server";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const cookies = request.cookies.get("access-token");


    if (cookies?.value === "" && request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (request.nextUrl.pathname.startsWith("/courses")) {
        if (cookies?.value === "") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (request.nextUrl.pathname.startsWith("/checkout")) {
        if (cookies?.value === "") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (request.nextUrl.pathname.startsWith("/login")) {
        if (cookies?.value !== "") {
            return NextResponse.redirect(new URL("/courses", request.url));
        }
    }

}