"use client";
import React, { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function Main({ children }) {
    const { showLogin } = useContext(AppContext);

    if (showLogin) return <Login />;
    return (
        <div className="px-4 sm:px-10 md:px-14 lg:px-28 h-screen overflow-auto relative bg-gradient-to-b from-teal-50 to-orange-50">
            <ToastContainer position="top-right" />
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
