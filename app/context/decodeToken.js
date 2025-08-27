"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getUserId = async () => {
    try {
        const cookie = await cookies();
        const token = cookie.get("token")?.value || "1";
        const tokenDecode = jwt.verify(token, `${process.env.JWT_SECRET}`);
        if (!tokenDecode) return null;
        return tokenDecode.id;
    } catch (error) {
        return null;
    }
};

export const SetCookie = async (sess_token) => {
    const cookie = await cookies();

    cookie.set("token", `${sess_token}`, {
        // httpOnly: true,
        maxAge: Date.now() + 60 * 60 * 24, // one day in seconds
        // secure: true
    });
};
