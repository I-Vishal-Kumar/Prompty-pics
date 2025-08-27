import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

export function GeneratedImages() {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);

    return (
        <motion.div
            transition={{ duration: 2, ease: "circInOut" }}
            className="relative overflow-visible md:fixed md:left-1 md:top-[20%] not-md:flex flex-wrap justify-center gap-3 md:space-y-1"
        >
            {Array(6)
                .fill("")
                .map((_, index) => {
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={index}
                            className="relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Thumbnail */}
                            <motion.img
                                whileHover={{ scale: 1.02, duration: 0.1 }}
                                className="rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10"
                                src={
                                    index % 2 === 0
                                        ? assets.sample_img_2
                                        : assets.sample_img_1
                                }
                                alt="generated image"
                                width={70}
                            />

                            {/* Hover Modal */}
                            <motion.div
                                initial={{ opacity: 0.1, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    display: isHovered ? "block" : "none",
                                }}
                                className="absolute top-0 left-[120%] min-h-[350%] min-w-[350%] z-50"
                            >
                                {/* Arrow */}
                                <div className="absolute top-[15%] left-0 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 -z-1 bg-gray-300 border border-neutral-300"></div>

                                {/* Enlarged Image */}
                                <div className="bg-white rounded-lg shadow-lg border border-neutral-300 p-1">
                                    <img
                                        src={
                                            index % 2 === 0
                                                ? assets.sample_img_2
                                                : assets.sample_img_1
                                        }
                                        alt="preview"
                                        className="rounded-md"
                                        width={800}
                                        height={800}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
        </motion.div>
    );
}
