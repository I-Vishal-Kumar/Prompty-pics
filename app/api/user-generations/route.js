import { getUserId } from "@/app/context/decodeToken";
import { CONNECT, ImageModel } from "@/app/modals/modal";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
    try {
        const userId = await getUserId();
        await CONNECT();

        // Get total number of generations
        const totalGenerations = await ImageModel.countDocuments({ userId });
        console.log(totalGenerations, userId);
        // Get recent generations (last 5)
        const recentGenerations = await ImageModel.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .select("prompt createdAt _id imageUrl");

        // Get unique styles used
        const uniqueStyles = await ImageModel.distinct("style", { userId });

        return NextResponse.json({
            success: true,
            totalGenerations,
            recentGenerations,
            uniqueStyles: uniqueStyles.length,
        });
    } catch (error) {
        console.error("Error in getUserGenerations:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
};
