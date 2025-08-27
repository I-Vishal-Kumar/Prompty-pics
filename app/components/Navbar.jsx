"use client";

import { useContext, useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
    const { user, setShowLogin, logout, credit } = useContext(AppContext);

    const navigate = useRouter();

    const location = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Gallery", path: "/gallery" },
        { name: "Features", path: "/features" },
        { name: "Pricing", path: "/buy" },
    ];

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest('[aria-label="Toggle menu"]')
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e, action) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            action();
        }
    };

    // Toggle mobile menu
    const toggleMobileMenu = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setIsOpen(!isOpen);
    };

    // Close mobile menu
    const closeMobileMenu = () => {
        setIsOpen(false);
    };

    // Handle credit check
    const handleCreateImage = () => {
        if (credit > 0) {
            navigate.push("/result");
            closeMobileMenu();
        } else {
            toast.info(
                "You need credits to create new images. Redirecting to upgrade...",
                {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                }
            );
            setTimeout(() => {
                navigate.push("/buy");
                closeMobileMenu();
            }, 1000);
        }
    };

    return (
        <nav
            className="sticky md:top-2 md:rounded-full rounded-b-md z-40 bg-white/50 backdrop-blur-md shadow-[0px_0px_37px_3px_#bcbcbc]"
            id="nav-bar"
            role="navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Logo */}
                    <Link
                        href="/"
                        className="flex items-center flex-shrink-0"
                        aria-label="Propmpty Pics Home"
                    >
                        <img
                            src={assets.logo}
                            alt="Propmpty Pics Logo"
                            className="w-24 sm:w-28 lg:w-32 transition-transform hover:scale-105"
                        />
                    </Link>

                    {/* Center - Navigation Items */}
                    <nav
                        className="hidden md:flex items-center space-x-1"
                        aria-label="Main navigation"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-4 py-2 text-sm font-medium hover:scale-103 rounded-full transition-all  ${
                                    location === item.path
                                        ? "text-emerald-400 bg-blue-50/50"
                                        : "text-gray-600 hover:text-emerald-400 hover:bg-gray-50/50"
                                }`}
                                aria-current={
                                    location === item.path ? "page" : undefined
                                }
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side - Auth & Actions */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate.push("/result")}
                                    className="flex max-[890px]:hidden items-center space-x-2 px-4 py-2 bg-blue-50/50 text-blue-600 rounded-full hover:bg-blue-100/50 transition-colors duration-200"
                                    aria-label="Create new image"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                    <span className="text-sm font-medium">
                                        Create
                                    </span>
                                </button>

                                <div className="hidden sm:flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        Credits: {credit}
                                    </span>
                                </div>

                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() =>
                                            setIsProfileOpen(!isProfileOpen)
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, () =>
                                                setIsProfileOpen(!isProfileOpen)
                                            )
                                        }
                                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-50/50 transition-colors"
                                        aria-label="User menu"
                                        aria-expanded={isProfileOpen}
                                    >
                                        <img
                                            src={
                                                user.avatar ||
                                                assets.profile_icon
                                            }
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                        <svg
                                            className="hidden sm:block w-4 h-4 text-gray-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    <div
                                        className={`absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-xl py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                                            isProfileOpen
                                                ? "opacity-100 translate-y-0"
                                                : "opacity-0 translate-y-2 pointer-events-none"
                                        }`}
                                        role="menu"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                                            role="menuitem"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                                            role="menuitem"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={() =>
                                                navigate.push("/buy")
                                            }
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors"
                                            role="menuitem"
                                        >
                                            Upgrade Plan
                                        </button>
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors"
                                            role="menuitem"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowLogin(true)}
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, () =>
                                            setShowLogin(true)
                                        )
                                    }
                                    className="hidden md:block bg-emerald-400 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-200 hover:shadow-md hover:scale-105"
                                    aria-label="Login"
                                >
                                    Login
                                </button>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                onKeyDown={(e) =>
                                    handleKeyDown(e, toggleMobileMenu)
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-emerald-600 hover:bg-gray-50/50 transition-colors"
                                aria-label="Toggle menu"
                                aria-expanded={isOpen}
                                aria-controls="mobile-menu"
                                tabIndex={0}
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    {isOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                <div
                    ref={mobileMenuRef}
                    className={`md:hidden transition-all duration-300 ease-in-out ${
                        isOpen
                            ? "opacity-100 max-h-screen"
                            : "opacity-0 max-h-0 pointer-events-none"
                    }`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    location.pathname === item.path
                                        ? "text-emerald-500 bg-emerald-50/50"
                                        : "text-gray-600 hover:text-emerald-500 hover:bg-gray-50/50"
                                }`}
                                onClick={closeMobileMenu}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {user ? (
                            <>
                                <div className="flex items-center justify-between px-3 py-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        Credits: {credit}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCreateImage}
                                    className="w-full text-left px-3 py-2 text-base font-medium text-emerald-500 hover:bg-blue-50/50 rounded-md transition-colors"
                                >
                                    Create New Image
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    setShowLogin(true);
                                    closeMobileMenu();
                                }}
                                className="w-full text-left px-3 py-2 text-base font-medium text-emerald-500 hover:bg-blue-50/50 rounded-md transition-colors"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
