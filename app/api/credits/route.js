import { getUserId } from "@/app/context/decodeToken";
import { CONNECT, UserModel } from "@/app/modals/modal";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const userId = await getUserId();
        console.log(userId);
        if (!userId) {
            console.error("No user ID provided");
            return NextResponse.json({
                success: false,
                message: "User ID not found",
            });
        }
        await CONNECT();
        const user = await UserModel.findById(userId);

        if (!user) {
            console.error("User not found:", userId);
            return NextResponse.json({
                success: false,
                message: "User not found",
            });
        }

        // Initialize creditBalance if it doesn't exist
        if (user.creditBalance === undefined) {
            user.creditBalance = 0;
            await user.save();
        }

        return NextResponse.json({
            success: true,
            credits: user.creditBalance,
            user: { name: user.name },
        });
    } catch (error) {
        console.error("Error in userCredits:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
};
