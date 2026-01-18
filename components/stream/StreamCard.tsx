"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

interface StreamCardProps {
    streamId: string;
    title: string;
    thumbnailUrl?: string | null;
    username: string;
    displayName?: string;
    avatarUrl?: string | null;
    isLive?: boolean;
    viewerCount?: number;
    category?: string;
    startedAt?: number;
}

function formatViewerCount(count: number): string {
    if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
}

function formatDuration(startedAt: number): string {
    const now = Date.now();
    const diff = now - startedAt;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, "0")}:00`;
    }
    return `${minutes}:00`;
}

export function StreamCard({
    streamId,
    title,
    thumbnailUrl,
    username,
    displayName,
    avatarUrl,
    isLive = false,
    viewerCount = 0,
    category,
    startedAt,
}: StreamCardProps) {
    return (
        <Link href={`/stream/${streamId}`} className="group block">
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-background-secondary mb-3">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
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
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {isLive && (
                    <>
                        {/* Live Badge */}
                        <div className="absolute top-2 left-2">
                            <Badge variant="live">LIVE</Badge>
                        </div>

                        {/* Viewer Count */}
                        <div className="absolute bottom-2 left-2">
                            <span className="px-1.5 py-0.5 bg-black/75 text-white text-xs font-medium rounded">
                                {formatViewerCount(viewerCount)} viewers
                            </span>
                        </div>

                        {/* Duration */}
                        {startedAt && (
                            <div className="absolute bottom-2 right-2">
                                <span className="px-1.5 py-0.5 bg-black/75 text-white text-xs font-medium rounded">
                                    {formatDuration(startedAt)}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Info */}
            <div className="flex gap-3">
                <Avatar
                    src={avatarUrl}
                    fallback={displayName || username}
                    size="md"
                    isLive={isLive}
                />
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-foreground-secondary truncate">
                        {displayName || username}
                    </p>
                    {category && (
                        <p className="text-sm text-foreground-secondary truncate">
                            {category}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
