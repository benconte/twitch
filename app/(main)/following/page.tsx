"use client";

import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState } from "react";

function ChannelCard({
    username,
    displayName,
    avatarUrl,
    bio,
    isLive,
    streamId,
    viewerCount,
    category,
}: {
    username: string;
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string;
    isLive?: boolean;
    streamId?: string;
    viewerCount?: number;
    category?: string;
}) {
    const href = isLive && streamId ? `/stream/${streamId}` : `/${username}`;

    return (
        <Link
            href={href}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-background-secondary transition-colors border border-border"
        >
            <Avatar
                src={avatarUrl}
                fallback={displayName || username}
                size="lg"
                isLive={isLive}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-foreground truncate">
                        {displayName || username}
                    </h3>
                    {isLive && <Badge variant="live">LIVE</Badge>}
                </div>
                <p className="text-sm text-foreground-secondary mb-1">@{username}</p>
                {isLive && viewerCount !== undefined && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        {viewerCount >= 1000
                            ? `${(viewerCount / 1000).toFixed(1)}K`
                            : viewerCount}{" "}
                        viewers
                        {category && ` • ${category}`}
                    </p>
                )}
                {!isLive && bio && (
                    <p className="text-sm text-foreground-secondary truncate">{bio}</p>
                )}
            </div>
        </Link>
    );
}

export default function FollowingPage() {
    const { isAuthenticated } = useConvexAuth();
    const [filter, setFilter] = useState<"all" | "live">("all");

    // Get all followed channels (no limit)
    const following = useQuery(
        api.follows.getMyFollowing,
        isAuthenticated ? { limit: 100 } : "skip",
    );

    if (!isAuthenticated) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-background-secondary mx-auto mb-4 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-foreground-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        Sign in to see your followed channels
                    </h3>
                    <p className="text-foreground-secondary">
                        Follow channels to see them here
                    </p>
                </div>
            </div>
        );
    }

    const filteredFollowing = following
        ? filter === "live"
            ? following.filter((f) => f.user?.isLive)
            : following
        : [];

    const liveCount = following
        ? following.filter((f) => f.user?.isLive).length
        : 0;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Following</h1>
                <p className="text-foreground-secondary">
                    Channels you follow{" "}
                    {liveCount > 0 && (
                        <span className="text-red-500">• {liveCount} live now</span>
                    )}
                </p>
            </div>

            {/* Filters */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all"
                            ? "bg-accent text-white"
                            : "bg-background-secondary text-foreground hover:bg-background-secondary/80"
                        }`}
                >
                    All Channels
                </button>
                <button
                    onClick={() => setFilter("live")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "live"
                            ? "bg-accent text-white"
                            : "bg-background-secondary text-foreground hover:bg-background-secondary/80"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        Live Only
                    </span>
                </button>
            </div>

            {/* Channels List */}
            {following === undefined ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            ) : filteredFollowing.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-background-secondary mx-auto mb-4 flex items-center justify-center">
                        <svg
                            className="w-10 h-10 text-foreground-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        {filter === "live"
                            ? "No live channels"
                            : "No followed channels yet"}
                    </h3>
                    <p className="text-foreground-secondary">
                        {filter === "live"
                            ? "None of the channels you follow are live right now"
                            : "Follow some channels to see them here"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFollowing
                        .filter(
                            (follow) =>
                                follow.user &&
                                (follow.user.username || follow.user.displayName),
                        )
                        .map((follow) => (
                            <ChannelCard
                                key={follow._id}
                                username={
                                    follow.user!.username ||
                                    follow.user!.displayName ||
                                    follow.user!._id
                                }
                                displayName={follow.user?.displayName}
                                avatarUrl={follow.user?.avatarUrl}
                                bio={follow.user?.bio}
                                isLive={follow.user?.isLive}
                                streamId={follow.activeStream?._id}
                                viewerCount={follow.activeStream?.viewerCount}
                                category={follow.activeStream?.category}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
