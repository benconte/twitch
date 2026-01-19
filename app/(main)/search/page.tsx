"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useState } from "react";

function UserResultCard({
    username,
    displayName,
    avatarUrl,
    bio,
    isLive,
}: {
    username: string;
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string;
    isLive?: boolean;
}) {
    return (
        <Link
            href={`/${username}`}
            className="flex items-center gap-4 p-4 rounded-lg hover:bg-background-secondary transition-colors"
        >
            <Avatar
                src={avatarUrl}
                fallback={displayName || username}
                size="lg"
                isLive={isLive}
            />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground truncate">
                        {displayName || username}
                    </h3>
                    {isLive && <Badge variant="live">LIVE</Badge>}
                </div>
                <p className="text-sm text-foreground-secondary">@{username}</p>
                {bio && (
                    <p className="text-sm text-foreground-secondary truncate mt-1">
                        {bio}
                    </p>
                )}
            </div>
        </Link>
    );
}

function StreamResultCard({
    title,
    username,
    displayName,
    viewerCount,
    category,
    streamId,
    avatarUrl,
}: {
    title: string;
    username: string;
    displayName: string;
    viewerCount: number;
    category: string;
    streamId: string;
    avatarUrl?: string | null;
}) {
    return (
        <Link href={`/stream/${streamId}`} className="group block">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-background-secondary mb-3">
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent/20 to-accent/5">
                    <svg
                        className="w-12 h-12 text-accent/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <div className="absolute top-2 left-2">
                    <Badge variant="live">LIVE</Badge>
                </div>

                <div className="absolute bottom-2 left-2">
                    <span className="px-1.5 py-0.5 bg-black/75 text-white text-xs font-medium rounded">
                        {viewerCount >= 1000
                            ? `${(viewerCount / 1000).toFixed(1)}K`
                            : viewerCount}{" "}
                        viewers
                    </span>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-sm font-semibold text-accent">
                            {displayName[0].toUpperCase()}
                        </span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-foreground-secondary truncate">
                        {displayName}
                    </p>
                    <p className="text-sm text-foreground-secondary truncate">
                        {category}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [filter, setFilter] = useState<"all" | "live">("all");

    // Search users
    const userResults = useQuery(
        api.search.searchUsers,
        query.length >= 2 ? { query, limit: 10 } : "skip",
    );

    // Search streams based on filter
    const streamResults = useQuery(
        filter === "live" ? api.search.searchLive : api.search.searchStreams,
        query.length >= 2 ? { query, limit: 20 } : "skip",
    );

    const isLoading = userResults === undefined || streamResults === undefined;
    const hasResults =
        (userResults && userResults.length > 0) ||
        (streamResults && streamResults.length > 0);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Search Results
                    {query && (
                        <>
                            {" "}
                            for &quot;<span className="text-accent">{query}</span>&quot;
                        </>
                    )}
                </h1>
                {!query && (
                    <p className="text-foreground-secondary">
                        Enter a search query to find channels and streams
                    </p>
                )}
            </div>

            {query.length >= 2 && (
                <>
                    {/* Filters */}
                    <div className="mb-6 flex gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all"
                                    ? "bg-accent text-white"
                                    : "bg-background-secondary text-foreground hover:bg-background-secondary/80"
                                }`}
                        >
                            All Streams
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

                    {/* Results */}
                    {isLoading ? (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-4">
                                    Channels
                                </h2>
                                <div className="space-y-2">
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                    <Skeleton className="h-20 w-full" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-4">
                                    Live Channels
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    <Skeleton className="h-48 w-full" />
                                    <Skeleton className="h-48 w-full" />
                                    <Skeleton className="h-48 w-full" />
                                    <Skeleton className="h-48 w-full" />
                                </div>
                            </div>
                        </div>
                    ) : !hasResults ? (
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
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No results found
                            </h3>
                            <p className="text-foreground-secondary">
                                Try different keywords or check your spelling
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* User Results */}
                            {userResults && userResults.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-foreground mb-4">
                                        Channels ({userResults.length})
                                    </h2>
                                    <div className="space-y-2">
                                        {userResults.map((user) => (
                                            <UserResultCard
                                                key={user._id}
                                                username={user.username!}
                                                displayName={user.displayName}
                                                avatarUrl={user.avatarUrl}
                                                bio={user.bio}
                                                isLive={user.isLive}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stream Results */}
                            {streamResults && streamResults.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                                        {filter === "live" && (
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        )}
                                        {filter === "live" ? "Live " : ""}Streams (
                                        {streamResults.length})
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {streamResults.map((stream) => (
                                            <StreamResultCard
                                                key={stream._id}
                                                streamId={stream._id}
                                                title={stream.title}
                                                username={stream.streamer?.username || "unknown"}
                                                displayName={
                                                    stream.streamer?.displayName ||
                                                    stream.streamer?.username ||
                                                    "Unknown"
                                                }
                                                viewerCount={stream.viewerCount || 0}
                                                category={stream.category || "No category"}
                                                avatarUrl={stream.streamer?.avatarUrl}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {query.length > 0 && query.length < 2 && (
                <div className="text-center py-12">
                    <p className="text-foreground-secondary">
                        Please enter at least 2 characters to search
                    </p>
                </div>
            )}
        </div>
    );
}
