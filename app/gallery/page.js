import React from "react";
import Gallery from "../pages/Gallery";
import { CONNECT, ImageModel } from "../modals/modal";
import { getUserId } from "../context/decodeToken";
import Login from "../components/Login";

export default async function Page() {
    await CONNECT();
    const userId = await getUserId();
    if (!userId) {
        return <Login />;
    }
    const details = await ImageModel.find({ userId });
    return <Gallery details={JSON.parse(JSON.stringify(details))} />;
}
