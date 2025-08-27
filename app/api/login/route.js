import { CONNECT, UserModel } from "@/app/modals/modal";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SetCookie } from "@/app/context/decodeToken";

export const POST = async (req, res) => {
    try {
        await CONNECT();

        const { email, password } = (await req.json()) || {};
        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user does not exists",
            });
        }
        console.log(user, password);
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            await SetCookie(token);
            return NextResponse.json({
                success: true,
                token,
                user: { name: user.name },
            });
        } else {
            return NextResponse.json({
                success: false,
                message: "invalid credentials",
            });
        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: error.message });
    }
};
