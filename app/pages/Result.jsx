"use client";

import { useContext, useEffect, useState, useRef } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ChevronIcon = ({ open }) => (
    <svg
        className={` h-5 transition-transform ${open ? "rotate-180" : ""}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
        />
    </svg>
);

//Custom Dropdown
const CustomDropdown = ({
    format = "",
    setFormat = () => {},
    formats = [],
}) => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="bg-transparent w-40 border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer  text-center"
            >
                <div className="flex justify-between">
                    <p>{format}</p>
                    <ChevronIcon open={open}></ChevronIcon>{" "}
                </div>
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute rounded-xl z-5 mt-1 w-40 bg-white border border-zinc-250 shadow-lg"
                >
                    {formats.map((fmt) => (
                        <div
                            key={fmt}
                            role="menuitem"
                            tabIndex={0}
                            onClick={() => {
                                setFormat(fmt);
                                setOpen(false);
                            }}
                            className="text-black px-8 py-3 rounded-xl hover:bg-zinc-200 cursor-pointer text-center"
                        >
                            {fmt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Result = () => {
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [format, setFormat] = useState("PNG");
    const { generateImage } = useContext(AppContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (typeof input === "string") {
            if (input.split(" ").length > 100) {
                toast("Max 100 words are allowed", {
                    type: "warning",
                });
                return;
            }
            const image = await generateImage(input);
            if (image) {
                setIsImageLoaded(true);
                setImage(image);
            }
        }
        setLoading(false);
    };
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    //Convert Image into different formats [JPEG, PNG, SVG, WebP]
    const convertImage = async (input, format) => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = "anonymous"; // allow cross-origin
            image.src = input;

            image.onload = () => {
                const extension = format.toLowerCase();
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                canvas.width = image.width;
                canvas.height = image.height;

                // Draw main image
                ctx.drawImage(image, 0, 0);

                // Load watermark (local file)
                const watermark = new Image();
                watermark.src = assets.logo;

                watermark.onload = () => {
                    const wmWidth = image.width * 0.2; // 20% of main image width
                    const wmHeight =
                        (watermark.height / watermark.width) * wmWidth;

                    // Position top-right corner with 10px margin
                    const x = image.width - wmWidth - 10;
                    const y = 10;

                    ctx.globalAlpha = 1; // transparency (0.0 to 1.0)
                    ctx.drawImage(watermark, x, y, wmWidth, wmHeight);
                    ctx.globalAlpha = 1.0; // reset alpha

                    // download helper
                    const downloadImage = (blob) => {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `image.${extension}`;
                        link.click();
                        URL.revokeObjectURL(url);
                        resolve();
                    };

                    if (extension === "svg") {
                        const dataUrl = canvas.toDataURL("image/png");
                        const svgContent = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="${image.width}" height="${image.height}">
                          <image href="${dataUrl}" width="${image.width}" height="${image.height}" />
                        </svg>`;
                        const blob = new Blob([svgContent], {
                            type: "image/svg+xml",
                        });
                        downloadImage(blob);
                    } else {
                        canvas.toBlob((blob) => {
                            if (blob) downloadImage(blob);
                            else reject("Failed to convert canvas to blob.");
                        }, `image/${extension}`);
                    }
                };

                watermark.onerror = () =>
                    reject("Failed to load watermark image.");
            };

            image.onerror = () =>
                reject("Failed to load input image. Check CORS permissions.");
        });
    };

    return (
        <motion.form
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={onSubmitHandler}
            className="flex flex-col min-h-[90vh] justify-center items-center"
        >
            <div className="relative w-full max-w-sm">
                {/* Image wrapper */}
                <div className="relative w-full rounded overflow-hidden">
                    {!loading ? (
                        <img
                            src={image}
                            alt=""
                            className="w-full h-full object-cover rounded"
                        />
                    ) : (
                        // shimmer placeholder
                        <div className="w-full h-72 rounded bg-gray-300 relative overflow-hidden">
                            <img
                                src={assets.logo_icon}
                                alt=""
                                className="size-18 animate-bounce object-contain absolute top-1/2 left-1/2 z-1 -translate-1/2 rounded"
                            />
                            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300"></div>
                        </div>
                    )}
                </div>
            </div>

            {!isImageLoaded && (
                <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        type="text"
                        placeholder="Describe what you want to generate"
                        className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
                    />
                    <button
                        type="submit"
                        className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full"
                    >
                        Generate
                    </button>
                </div>
            )}

            {isImageLoaded && (
                <div className="flex flex-col">
                    <div className="flex gap-5 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
                        <p
                            onClick={() => {
                                setIsImageLoaded(false);
                            }}
                            className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
                        >
                            Generate Another
                        </p>
                        <CustomDropdown
                            format={format}
                            setFormat={setFormat}
                            formats={["JPEG", "PNG", "WebP", "SVG"]}
                        ></CustomDropdown>
                    </div>
                    <div className="flex sm:justify-end justify-center mt-5 p-0.5 text-white">
                        <div
                            onClick={async (e) => {
                                e.preventDefault();
                                await convertImage(image, format);
                            }}
                            className="w-40 bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
                        >
                            Download
                        </div>
                    </div>
                </div>
            )}
        </motion.form>
    );
};

export default Result;
