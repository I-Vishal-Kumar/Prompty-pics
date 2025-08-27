"use client";

import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(null);

    const [credit, setCredit] = useState(0);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const navigate = useRouter();

    const isAuthenticated = !!token;

    const loadCreditsData = async () => {
        try {
            const { data } = await axios.get(backendUrl + "/api/credits");
            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(
                backendUrl + "/api/generate-image",
                { prompt }
            );

            if (data.success) {
                setCredit((prev) => prev - 1 || 0);
                return data.resultImage;
            } else {
                toast.error(data.message);
                if (data.creditBalance === 0) {
                    navigate.push("/buy");
                }
            }
        } catch (error) {
            console.log("here is error");
            toast.error(`${error.message} here is error`);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        navigate.push("/login");
    };

    useEffect(() => {
        loadCreditsData();
    }, []);

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditsData,
        logout,
        generateImage,
        isAuthenticated,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
