"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/Button";

export function MobileNav() {
    const pathname = usePathname();
    const { isAuthenticated, isLoading } = useConvexAuth();
    const { signOut } = useAuthActions();
    const [isOpen, setIsOpen] = useState(false);

    // Close on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Hide on auth pages
    const hiddenPaths = ["/login", "/register", "/verify"];
    if (hiddenPaths.some((path) => pathname.startsWith(path))) {
        return null;
    }

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-background-secondary hover:bg-border transition-colors"
                aria-label="Open navigation menu"
            >
                <svg
                    className="w-5 h-5 text-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                </div>
            )}

            {/* Drawer */}
            <div
                className={`
          fixed top-0 left-0 bottom-0 z-50 w-72
          bg-background border-r border-border
          transform transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <Link href="/" className="flex items-center gap-2">
                        <svg
                            className="w-8 h-8 text-twitch-purple"
                            viewBox="0 0 256 268"
                            fill="currentColor"
                        >
                            <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263h192.02v128.029l-40.739 40.741H128L93.098 226.935v-34.902H40.717V23.263zm64.008 116.405h23.275V69.803H104.725v69.865zm63.997 0h23.27V69.803h-23.27v69.865z" />
                        </svg>
                        <span className="text-xl font-bold text-foreground">Twitch</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
                        aria-label="Close navigation menu"
                    >
                        <svg
                            className="w-5 h-5 text-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1">
                    <Link
                        href="/"
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${pathname === "/" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-background-secondary"}
            `}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        Home
                    </Link>

                    <Link
                        href="/browse"
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
              ${pathname === "/browse" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-background-secondary"}
            `}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                            />
                        </svg>
                        Browse
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link
                                href="/following"
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${pathname === "/following" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-background-secondary"}
                `}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                                Following
                            </Link>

                            <div className="border-t border-border my-4" />

                            <Link
                                href="/dashboard"
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${pathname === "/dashboard" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-background-secondary"}
                `}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                    />
                                </svg>
                                Dashboard
                            </Link>

                            <Link
                                href="/settings"
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${pathname === "/settings" ? "bg-accent/10 text-accent" : "text-foreground hover:bg-background-secondary"}
                `}
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                Settings
                            </Link>
                        </>
                    )}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                    {isLoading ? (
                        <div className="h-10 bg-background-secondary rounded-lg animate-pulse" />
                    ) : isAuthenticated ? (
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => signOut()}
                        >
                            Sign Out
                        </Button>
                    ) : (
                        <div className="space-y-2">
                            <Link href="/login" className="block">
                                <Button variant="secondary" className="w-full">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register" className="block">
                                <Button variant="primary" className="w-full">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
