"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/Badge";
import { StreamCardSkeleton } from "@/components/ui/Skeleton";

function StreamCard({
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
            {/* Thumbnail */}
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

                {/* Live Badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant="live">LIVE</Badge>
                </div>

                {/* Viewer Count */}
                <div className="absolute bottom-2 left-2">
                    <span className="px-1.5 py-0.5 bg-black/75 text-white text-xs font-medium rounded">
                        {viewerCount >= 1000
                            ? `${(viewerCount / 1000).toFixed(1)}K`
                            : viewerCount}{" "}
                        viewers
                    </span>
                </div>
            </div>

            {/* Info */}
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

export default function DiscoverPage() {
    // Fetch all live streams
    const liveStreams = useQuery(api.streams.getLive, { limit: 50 });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Discover Live Streams
                </h1>
                <p className="text-foreground-secondary">
                    Browse all live channels and find your next favorite streamer
                </p>
            </div>

            {/* Live Streams Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        Live Now
                        {liveStreams && liveStreams.length > 0 && (
                            <span className="text-foreground-secondary font-normal text-base">
                                ({liveStreams.length}{" "}
                                {liveStreams.length === 1 ? "channel" : "channels"})
                            </span>
                        )}
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {liveStreams === undefined ? (
                        <>
                            <StreamCardSkeleton />
                            <StreamCardSkeleton />
                            <StreamCardSkeleton />
                            <StreamCardSkeleton />
                            <StreamCardSkeleton />
                            <StreamCardSkeleton />
                            <StreamCardSkeleton />
                            <StreamCardSkeleton />
                        </>
                    ) : liveStreams.length === 0 ? (
                        <div className="col-span-full text-center py-20">
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
                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No live streams at the moment
                            </h3>
                            <p className="text-foreground-secondary">
                                Check back soon! Streamers are always going live.
                            </p>
                        </div>
                    ) : (
                        liveStreams.map((stream) => (
                            <StreamCard
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
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
