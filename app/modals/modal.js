import mongoose, { models } from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        prompt: {
            type: String,
            required: true,
        },
        style: {
            type: String,
            default: "default",
        },
        imageUrl: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        creditBalance: { type: Number, default: 3 },
    },
    {
        timestamps: true, // Add timestamps for better tracking
    }
);

export const UserModel = models?.["user"] || mongoose.model("user", userSchema);

export const ImageModel =
    models?.["image"] || mongoose.model("image", imageSchema);

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
    throw new Error("uri not defined");
}

let CACHED_CONNECTION = null;

export const CONNECT = async () => {
    // check for existing connection
    if (CACHED_CONNECTION) return CACHED_CONNECTION;

    try {
        // create a new connection.
        CACHED_CONNECTION = await mongoose.connect(MONGODB_URI);
        console.log("connected");
        return CACHED_CONNECTION;
    } catch (error) {
        console.log({
            error: error,
            message: "Error connecting to MongoDB",
        });
        throw new Error("Error while connection");
    }
};
