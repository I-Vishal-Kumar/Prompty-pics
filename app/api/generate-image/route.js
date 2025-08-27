import { getUserId } from "@/app/context/decodeToken";
import { CONNECT, ImageModel, UserModel } from "@/app/modals/modal";
import axios from "axios";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

const IMAGE_KIT = () => {
    const imagekit = new ImageKit({
        publicKey: "public_iz6sM0TqQHI5bZ6dWzXmKIY2ciI=", // Replace with your ImageKit public key
        privateKey: "private_UQyekBIgdLrryoML/7eNiDvNQAM=", // Replace with your ImageKit private key
        urlEndpoint: "https://ik.imagekit.io/cxzryqyk6l", // Replace with your ImageKit endpoint
    });

    return imagekit;
};

export const POST = async (req, res) => {
    try {
        const { prompt } = await req.json();
        const userId = await getUserId();

        if (!prompt || prompt.split(" ").length > 100) {
            return res.json({
                success: false,
                message: "Prompt must be less than 100 words",
            });
        }
        await CONNECT();

        const user = await UserModel.findOne({
            _id: userId,
            creditBalance: { $gt: 0 },
        });

        if (!user) {
            const user = await UserModel.findOne({
                userId,
            });

            if (user.email === "admin@gmail.com" && user.creditBalance <= 0) {
                await UserModel.findOneAndUpdate({
                    $inc: {
                        creditBalance: 5,
                    },
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "No credit left or invalid user",
                    creditBalance: user?.creditBalance || 0,
                });
            }
        }

        const formData = new FormData();
        formData.append("prompt", prompt);

        const { data } = await axios.post(
            "https://clipdrop-api.co/text-to-image/v1",
            formData,
            {
                headers: {
                    "x-api-key": process.env.CLIPDROP_API,
                },
                responseType: "arraybuffer",
            }
        );

        const base64Image = Buffer.from(data, "binary").toString("base64");

        const kit = IMAGE_KIT();

        if (!kit) throw new Error("failed to upload file");

        const sanitizedFileName = `${crypto.randomUUID()}`;

        const uploaded = await kit.upload({
            file: base64Image,
            fileName: `${sanitizedFileName}`,
        });

        const fileURL = uploaded.url;

        // Update user credits
        await UserModel.findByIdAndUpdate(user._id, {
            $inc: {
                creditBalance: -1,
            },
        });

        // Save the generation to database
        const newGeneration = await ImageModel.create({
            userId: user._id,
            prompt,
            imageUrl: fileURL,
        });

        return NextResponse.json({
            success: true,
            message: "Image Generated",
            creditBalance: user.creditBalance - 1,
            resultImage: fileURL,
            generationId: newGeneration._id,
        });
    } catch (error) {
        console.error(
            "ClipDrop API Error:",
            error.response?.data || error.message
        );
        if (error.response?.status === 403) {
            return NextResponse.status(403).json({
                success: false,
                message:
                    "Invalid or revoked API key. Please check your ClipDrop API key configuration.",
            });
        }
        return NextResponse.status(500).json({
            success: false,
            message: "Error generating image",
        });
    }
};
