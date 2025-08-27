"use client";

import React from "react";
import { motion } from "framer-motion";
const Gallery = ({ details = [] }) => {
    return (
        <motion.div
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="min-h-[80vh] text-center pt-8 mb-10"
        >
            <h2 className="text-2xl font-semibold md:hidden popins-600 mb-12">
                Gallery
            </h2>

            <div className="grid grid-cols-1 md:mt-12 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8">
                {details.map((item) => (
                    <div
                        key={item._id}
                        className="bg-white rounded-xl shadow-[0_0_30px_5px_#9e9e9e] shadow-gray-300 overflow-hidden flex flex-col hover:shadow-lg transition"
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.style}
                            className="w-full max-w-sm h-full object-cover"
                        />

                        <div className="p-4 text-left">
                            <p className="text-sm text-gray-500">
                                {new Date(item.createdAt).toLocaleDateString()}{" "}
                                •{" "}
                                {new Date(item.createdAt).toLocaleTimeString()}
                            </p>
                            <p className="mt-1 text-base text-gray-800">
                                Style:{" "}
                                <span className="capitalize popins-600">
                                    {item.style}
                                </span>
                            </p>
                        </div>
                    </div>
                ))}
                {details.length <= 0 ? (
                    <motion.h2
                        initial={{ y: 100, opacity: 0.2 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="popins-700 text-3xl"
                    >
                        No Generations yet..
                    </motion.h2>
                ) : null}
            </div>
        </motion.div>
    );
};

export default Gallery;
