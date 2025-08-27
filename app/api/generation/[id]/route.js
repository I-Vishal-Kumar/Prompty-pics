import { getUserId } from "@/app/context/decodeToken";
import { CONNECT, ImageModel } from "@/app/modals/modal";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = await getUserId();

        if (!userId || !id) {
            console.error("Missing userId or id:", { userId, id });
            return NextResponse.json({
                success: false,
                message: "Missing required parameters",
            });
        }
        await CONNECT();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid generation ID:", id);
            return NextResponse.json({
                success: false,
                message: "Invalid generation ID",
            });
        }

        console.log("Looking for generation with:", { _id: id, userId });
        const generation = await ImageModel.findOne({ _id: id, userId });
        console.log("Generation query result:", generation);

        if (!generation) {
            console.error("Generation not found for:", { id, userId });
            return NextResponse.json({
                success: false,
                message: "Generation not found",
            });
        }

        return NextResponse.json({
            success: true,
            generation: {
                _id: generation._id,
                prompt: generation.prompt,
                imageUrl: generation.imageUrl,
                createdAt: generation.createdAt,
            },
        });
    } catch (error) {
        console.error("Error in getGeneration:", error);
        return NextResponse.json({ success: false, message: error.message });
    }
};
