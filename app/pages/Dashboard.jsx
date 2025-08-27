import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Dashboard = () => {
    const { user, token, backendUrl } = useContext(AppContext);
    const navigate = useRouter();
    const [stats, setStats] = useState({
        credits: 0,
        imagesGenerated: 0,
        favoriteStyles: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [creditsResponse, generationsResponse] =
                    await Promise.all([
                        axios.get(`${backendUrl}/api/credits`),
                        axios.get(`${backendUrl}/api/user-generations`),
                    ]);

                if (
                    creditsResponse.data.success &&
                    generationsResponse.data.success
                ) {
                    setStats({
                        credits: creditsResponse.data.credits || 0,
                        imagesGenerated:
                            generationsResponse.data.totalGenerations || 0,
                        favoriteStyles:
                            generationsResponse.data.uniqueStyles || 0,
                    });
                    setError(null);
                } else {
                    const errorMessage =
                        creditsResponse.data.message ||
                        generationsResponse.data.message ||
                        "Failed to fetch dashboard data";
                    setError(errorMessage);
                    if (
                        errorMessage.includes("Authentication") ||
                        errorMessage.includes("login")
                    ) {
                        navigate("/");
                    }
                    toast.error(errorMessage);
                }
            } catch (error) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to load dashboard data";
                setError(errorMessage);
                if (
                    error.response?.status === 401 ||
                    errorMessage.includes("Authentication") ||
                    errorMessage.includes("login")
                ) {
                    navigate.push("/");
                }
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, backendUrl, navigate]);

    const handleGenerateClick = () => {
        navigate.push("/result");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-red-600 mb-4">
                        Error Loading Dashboard
                    </h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Section with Quick Stats */}
                <div className=" bg-gray-900 rounded-xl shadow-[0px_0px_30px_5px_#9e9e9e] shadow-gray-500 p-8 md:mt-12 text-white mb-8 relative overflow-hidden">
                    <h1 className="text-3xl/normal font-bold relative">
                        <motion.span
                            className="inline-block cursor-default relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text"
                            whileHover={{
                                scale: 1.02,
                                textShadow: "0 0 8px rgba(255,255,255,0.3)",
                                backgroundSize: "200% 100%",
                            }}
                            animate={{
                                backgroundPosition: [
                                    "0% 50%",
                                    "100% 50%",
                                    "0% 50%",
                                ],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                                backgroundPosition: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                            }}
                        >
                            Welcome back, {user?.name?.toUpperCase()}
                        </motion.span>
                    </h1>

                    <motion.p
                        className="text-[1rem] opacity-90"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                    >
                        Your creative journey continues...
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 mt-10 gap-6">
                        <motion.div
                            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: "rgba(255,255,255,0.15)",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                            }}
                        >
                            <p className="text-sm popins-500 opacity-75">
                                Available Credits
                            </p>
                            <p className="text-3xl font-bold">
                                {stats.credits}
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: "rgba(255,255,255,0.15)",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                            }}
                        >
                            <p className="text-sm popins-500 opacity-75">
                                Images Created
                            </p>
                            <p className="text-3xl font-bold">
                                {stats.imagesGenerated}
                            </p>
                        </motion.div>
                        <motion.div
                            className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                            whileHover={{
                                scale: 1.02,
                                backgroundColor: "rgba(255,255,255,0.15)",
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 15,
                            }}
                        >
                            <p className="text-sm  popins-500 opacity-75">
                                Styles Used
                            </p>
                            <p className="text-3xl font-bold">
                                {stats.favoriteStyles}
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <button
                        onClick={handleGenerateClick}
                        className="bg-[#4198fff5] text-white text-start rounded-xl p-6 shadow-sm hover:shadow-[0px_0px_30px_3px_#bcbcbcbc] shadow-gray-400 transition-all hover:scale-101"
                    >
                        <div className="text-5xl mb-6">🎨</div>
                        <h3 className="text-xl font-bold popins-700 tracking-wider">
                            New Creation
                        </h3>
                        <p className="text-md popins-400 opacity-90 mt-1">
                            Start generating
                        </p>
                    </button>
                    <Link
                        href="/gallery"
                        className="bg-[#ff2f009c] text-white rounded-xl p-6 shadow-sm hover:shadow-[0px_0px_30px_3px_#bcbcbcbc] shadow-gray-400 transition-all hover:scale-101"
                    >
                        <div className="text-5xl mb-6">📸</div>
                        <h3 className="text-xl popins-700 font-bold tracking-wider">
                            Gallery
                        </h3>
                        <p className="text-md popins-400 opacity-90 mt-1">
                            View your work
                        </p>
                    </Link>
                    <Link
                        href="/buy"
                        className="bg-[#9b46e2b3] text-white rounded-xl p-6 shadow-sm hover:shadow-[0px_0px_30px_3px_#bcbcbcbc] shadow-gray-400 transition-all hover:scale-101"
                    >
                        <div className="text-5xl mb-6">⭐</div>
                        <h3 className="text-xl popins-700 font-bold tracking-wider">
                            Get Credits
                        </h3>
                        <p className="text-md popins-400 opacity-90 mt-1">
                            Power up
                        </p>
                    </Link>
                    <Link
                        href="/features"
                        className="bg-[#f16f8d] text-white rounded-xl p-6 shadow-sm hover:shadow-[0px_0px_30px_3px_#bcbcbcbc] shadow-gray-400 transition-all hover:scale-101"
                    >
                        <div className="text-5xl mb-6">✨</div>
                        <h3 className="text-xl popins-700 tracking-wider">
                            Features
                        </h3>
                        <p className="text-md opacity-90 popins-400 mt-1">
                            Learn more
                        </p>
                    </Link>
                </div>

                {/* AI Tips & Inspiration */}
                <div className="bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        AI Tips & Inspiration
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-teal-600 text-lg mb-3">
                                ✨ Prompt Engineering
                            </div>
                            <p className="text-gray-600 mb-3">
                                Be specific with details like style, mood,
                                lighting, and perspective for better results.
                            </p>
                            <button
                                onClick={handleGenerateClick}
                                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                            >
                                Try Now →
                            </button>
                        </div>

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-orange-500 text-lg mb-3">
                                🎨 Style Mixing
                            </div>
                            <p className="text-gray-600 mb-3">
                                Combine different art styles like "watercolor
                                meets cyberpunk" for unique creations.
                            </p>
                            <button
                                onClick={handleGenerateClick}
                                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
                            >
                                Try Now →
                            </button>
                        </div>

                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="text-purple-600 text-lg mb-3">
                                🌟 Pro Tips
                            </div>
                            <p className="text-gray-600 mb-3">
                                Use descriptive adjectives and reference
                                specific artists or time periods for
                                inspiration.
                            </p>
                            <button
                                onClick={handleGenerateClick}
                                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                            >
                                Try Now →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Resources & Help */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Quick Tutorial
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 flex-shrink-0">
                                    1
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Choose Your Style
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Browse through our collection of AI art
                                        styles
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 flex-shrink-0">
                                    2
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Write Your Prompt
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Describe what you want to create in
                                        detail
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                                    3
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Generate & Share
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Create your image and share it with the
                                        world
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            Need Help?
                        </h3>
                        <div className="space-y-4">
                            <Link
                                href="/features"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                            >
                                <div className="text-2xl">📚</div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Documentation
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Learn about all features
                                    </p>
                                </div>
                            </Link>
                            <a
                                href="#support"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                            >
                                <div className="text-2xl">💬</div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Support
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Get help when you need it
                                    </p>
                                </div>
                            </a>
                            <Link
                                href="/buy"
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                            >
                                <div className="text-2xl">⭐</div>
                                <div>
                                    <p className="font-medium text-gray-800">
                                        Premium Features
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Unlock more possibilities
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    100% {
                        background-position: 200% 50%;
                    }
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
