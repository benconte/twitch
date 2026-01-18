"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";

interface SidebarChannelProps {
    username: string;
    displayName?: string;
    avatarUrl?: string | null;
    isLive?: boolean;
    viewerCount?: number;
    category?: string;
    collapsed: boolean;
}

function SidebarChannel({
    username,
    displayName,
    avatarUrl,
    isLive,
    viewerCount,
    category,
    collapsed,
}: SidebarChannelProps) {
    return (
        <Link
            href={`/${username}`}
            className={`
        flex items-center gap-3 px-3 py-2 rounded-lg
        hover:bg-background-secondary transition-colors
        ${collapsed ? "justify-center" : ""}
      `}
        >
            <Avatar
                src={avatarUrl}
                fallback={displayName || username}
                size="sm"
                isLive={isLive}
            />
            {!collapsed && (
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground truncate">
                            {displayName || username}
                        </span>
                        {isLive && viewerCount !== undefined && (
                            <span className="text-xs text-red-500 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500" />
                                {viewerCount >= 1000
                                    ? `${(viewerCount / 1000).toFixed(1)}K`
                                    : viewerCount}
                            </span>
                        )}
                    </div>
                    {isLive && category && (
                        <p className="text-xs text-foreground-secondary truncate">
                            {category}
                        </p>
                    )}
                </div>
            )}
        </Link>
    );
}

function SidebarSkeleton({ collapsed }: { collapsed: boolean }) {
    return (
        <div
            className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}
        >
            <Skeleton className="w-8 h-8 shrink-0" rounded="full" />
            {!collapsed && (
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16" />
                </div>
            )}
        </div>
    );
}

export function Sidebar() {
    const pathname = usePathname();
    const { isAuthenticated } = useConvexAuth();

    // Persist collapsed state
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("sidebar-collapsed");
        if (stored) {
            setCollapsed(JSON.parse(stored));
        }
    }, []);

    const toggleCollapsed = () => {
        const newValue = !collapsed;
        setCollapsed(newValue);
        localStorage.setItem("sidebar-collapsed", JSON.stringify(newValue));
    };

    // Get followed channels
    const following = useQuery(
        api.follows.getMyFollowing,
        isAuthenticated ? { limit: 10 } : "skip",
    );

    // For now, we'll show recommended channels as a static list
    // In a real app, this would come from an API
    const recommendedChannels = [
        {
            username: "shroud",
            displayName: "shroud",
            isLive: true,
            viewerCount: 42000,
            category: "VALORANT",
        },
        {
            username: "pokimane",
            displayName: "pokimane",
            isLive: true,
            viewerCount: 28000,
            category: "Just Chatting",
        },
        {
            username: "xqc",
            displayName: "xQc",
            isLive: false,
        },
    ];

    // Hide sidebar on certain pages
    const hiddenPaths = ["/login", "/register", "/verify"];
    if (hiddenPaths.some((path) => pathname.startsWith(path))) {
        return null;
    }

    return (
        <aside
            className={`
        hidden lg:flex flex-col shrink-0 h-[calc(100vh-3.5rem)] sticky top-14
        bg-background border-r border-border
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16" : "w-60"}
      `}
        >
            {/* Collapse Toggle */}
            <div className="p-3">
                <button
                    onClick={toggleCollapsed}
                    className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-background-secondary transition-colors"
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    <svg
                        className={`w-5 h-5 text-foreground-secondary transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                        />
                    </svg>
                </button>
            </div>

            {/* Followed Channels */}
            {isAuthenticated && (
                <div className="flex-1 overflow-y-auto">
                    {!collapsed && (
                        <div className="px-3 py-2">
                            <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                                Followed Channels
                            </h3>
                        </div>
                    )}

                    <div className="space-y-0.5">
                        {following === undefined ? (
                            <>
                                <SidebarSkeleton collapsed={collapsed} />
                                <SidebarSkeleton collapsed={collapsed} />
                                <SidebarSkeleton collapsed={collapsed} />
                            </>
                        ) : following.length === 0 ? (
                            !collapsed && (
                                <p className="px-3 py-2 text-sm text-foreground-secondary">
                                    No channels followed yet
                                </p>
                            )
                        ) : (
                            following.map((follow) => (
                                <SidebarChannel
                                    key={follow._id}
                                    username={follow.user?.username || "unknown"}
                                    displayName={follow.user?.displayName}
                                    avatarUrl={follow.user?.avatarUrl}
                                    collapsed={collapsed}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Recommended Channels */}
            <div className={isAuthenticated ? "border-t border-border" : "flex-1"}>
                {!collapsed && (
                    <div className="px-3 py-2">
                        <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wide">
                            Recommended Channels
                        </h3>
                    </div>
                )}

                <div className="space-y-0.5">
                    {recommendedChannels.map((channel) => (
                        <SidebarChannel
                            key={channel.username}
                            {...channel}
                            collapsed={collapsed}
                        />
                    ))}
                </div>
            </div>

            {/* Footer spacer */}
            <div className="p-3" />
        </aside>
    );
}
