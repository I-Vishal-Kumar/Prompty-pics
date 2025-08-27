import React from "react";
import { stepsData } from "../assets/assets";
import { motion } from "framer-motion";

const Steps = () => {
    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center my-32"
        >
            <h1 className="text-3xl sm:text-4xl popins-800 mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">
                How it Works
            </h1>

            <p className="text-lg mb-10 text-gray-600">
                Transform words Into Stunning Images
            </p>

            <div className="space-y-4 w-full max-w-3xl text-sm">
                {stepsData.map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center gap-4 p-5 px-8 bg-white/20 shadow-md border border-black/20 rounded-lg overflow-hidden relative group"
                        whileHover={{
                            scale: 1.02,
                            transition: { duration: 0.2 },
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-lime-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="relative z-10 bg-white/80 p-2 rounded-full transition-colors duration-300">
                            <img
                                src={item.icon}
                                alt=""
                                className="w-6 h-6 md:size-9"
                            />
                        </div>

                        <div className="relative z-10">
                            <motion.h2
                                className="text-xl font-medium bg-gradient-to-r from-[#059d7d] via-pink-800 to-red-600 bg-clip-text group-hover:from-emerald-500 group-hover:via-purple-500 group-hover:to-pink-500"
                                style={{
                                    WebkitTextFillColor: "transparent",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                {item.title}
                            </motion.h2>
                            <p className="text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Steps;
