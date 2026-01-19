"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/Button";

// Twitch Icon Component
function TwitchIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 256 268" fill="currentColor">
            <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263h192.02v128.029l-40.739 40.741H128L93.098 226.935v-34.902H40.717V23.263zm64.008 116.405h23.275V69.803H104.725v69.865zm63.997 0h23.27V69.803h-23.27v69.865z" />
        </svg>
    );
}

export function Header() {
    const { isAuthenticated, isLoading } = useConvexAuth();

    return (
        <header className="sticky top-0 z-40 bg-background/65 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border">
            <div className="flex items-center justify-between h-14 px-4">
                {/* Left Section - Logo and Nav */}
                <div className="flex items-center gap-6">
                    <Link
                        href={isAuthenticated ? `/dashboard` : "/"}
                        className="flex items-center gap-2"
                    >
                        <TwitchIcon className="w-8 h-8 text-twitch-purple" />
                        <span className="text-xl font-bold text-foreground hidden sm:block">
                            Twitch
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        <Link
                            href="/discover"
                            className="px-3 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-md transition-colors"
                        >
                            Discover
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/following"
                                className="px-3 py-2 text-sm font-medium text-foreground-secondary hover:text-foreground hover:bg-background-secondary rounded-md transition-colors"
                            >
                                Following
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Center Section - Search */}
                <div className="flex-1 flex justify-center px-4 max-w-2xl">
                    <SearchBar />
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />

                    {isLoading ? (
                        <div className="w-8 h-8 rounded-full bg-background-secondary animate-pulse" />
                    ) : isAuthenticated ? (
                        <>
                            {/* Notifications Placeholder */}
                            <button
                                className="p-2 rounded-lg bg-background-secondary hover:bg-border transition-colors"
                                aria-label="Notifications"
                            >
                                <svg
                                    className="w-5 h-5 text-foreground-secondary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>
                            </button>

                            <UserMenu />
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Log In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button variant="primary" size="sm">
                                    Sign Up
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
