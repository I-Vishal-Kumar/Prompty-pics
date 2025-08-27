"use client";

import { useContext, useRef } from "react";
import { assets } from "../assets/assets";
import { motion, useInView } from "motion/react";
import { AppContext } from "../context/AppContext";
import { GeneratedImages } from "./GeneratedImages";
import { useRouter } from "next/navigation";

const Header = () => {
    const { user, setShowLogin } = useContext(AppContext);
    const navigate = useRouter();
    const topTextRef = useRef();

    const isInView = useInView(topTextRef, {
        initial: 1,
    });

    const onClickHandler = () => {
        if (user) {
            navigate.push("/result");
        } else {
            setShowLogin(true);
        }
    };

    return (
        <>
            <motion.div className="flex relative z-10 flex-col justify-center items-center text-center pt-20">
                <motion.div
                    initial={{ opacity: 0.2, y: 100 }}
                    transition={{ duration: 1 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="z-[10]"
                >
                    <motion.div
                        className="text-stone-500 inline-flex text-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500 mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <p ref={topTextRef}>Best Text to image generator</p>
                        <img src={assets.star_icon} alt="" />
                    </motion.div>

                    <motion.h1 className="text-5xl sm:text-7xl mx-auto text-center poppins-black leading-tight sm:leading-[1.1]">
                        Turn prompts to <br />
                        <span className="text-emerald-400 poppins-black">
                            Promty Pics
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-center max-w-xl mx-auto mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Unleash your creativity with AI. Transform simple
                        prompts into breathtaking visual art in seconds — just
                        type your idea and watch the magic unfold.
                    </motion.p>

                    <motion.button
                        onClick={onClickHandler}
                        className="sm:text-lg text-white bg-gray-800 w-auto mt-8 px-12 py-2.5 flex items-center gap-2 rounded-full cursor-pointer mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            default: { duration: 0.5 },
                            opacity: { delay: 0.8, duration: 1 },
                        }}
                    >
                        Generate Images
                        <img className="h-6" src={assets.star_group} alt="" />
                    </motion.button>
                </motion.div>
            </motion.div>
            <div className="absolute h-screen w-full top-0 left-0 overflow-hidden ">
                {/* Emerald Decorative Blob */}
                <motion.div
                    className="absolute top-10 left-20 w-72 h-72 rounded-full bg-emerald-500 opacity-15 blur-3xl shadow-[0_0_60px_rgba(16,185,129,0.6)]"
                    animate={{
                        x: [0, 30, -20, 10, -10],
                        y: [0, -20, 30, -10, 15],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />

                {/* Purple Decorative Blob */}
                <motion.div
                    className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-purple-500 opacity-15 blur-3xl shadow-[0_0_80px_rgba(168,85,247,0.5)]"
                    animate={{
                        x: [0, -40, 20, -30, 15],
                        y: [0, 25, -15, 30, -20],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />
            </div>
            {isInView && (
                <div className="md:block hidden">
                    <GeneratedImages />
                </div>
            )}
        </>
    );
};

export default Header;
