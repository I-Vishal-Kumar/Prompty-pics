import { CONNECT, UserModel } from "@/app/modals/modal";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SetCookie } from "@/app/context/decodeToken";

export const POST = async (req) => {
    try {
        const { name, email, password } = (await req.json()) || {};

        if (!name || !email || !password) {
            return NextResponse.json({
                success: false,
                message: "Missing details",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
        };
        await CONNECT();

        const newUser = new UserModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        await SetCookie(token);
        return NextResponse.json({
            success: true,
            token,
            user: { name: user.name },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
};
