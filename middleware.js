import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserId } from "./app/context/decodeToken";

export async function middleware(req) {
    const { pathname } = req.nextUrl;

    // check for public path
    const isPublic =
        pathname.includes("/api/login") ||
        pathname.includes("/api/register") ||
        pathname.includes("/login") ||
        pathname.startsWith("/");

    if (isPublic) return NextResponse.next();

    const token = req?.cookies?.get("token")?.value || "";

    if (!token) {
        if (isPublic) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    try {
        const userId = getUserId();
        if (!userId) throw new Error();
    } catch {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};
