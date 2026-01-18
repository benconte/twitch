"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";

function formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ago`;
    }
    if (hours > 0) {
        return `${hours}h ago`;
    }
    if (minutes > 0) {
        return `${minutes}m ago`;
    }
    return "Just now";
}

export function RecentActivity() {
    const activity = useQuery(api.dashboard.getRecentActivity, { limit: 5 });

    const isLoading = activity === undefined;
    const hasNoActivity =
        activity &&
        activity.recentFollowers.length === 0 &&
        activity.recentStreams.length === 0;

    return (
        <Card padding="none">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Recent Activity
                </h2>
            </div>

            {isLoading ? (
                <div className="divide-y divide-border">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 flex items-center gap-3">
                            <Skeleton className="w-10 h-10 shrink-0" rounded="full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : hasNoActivity ? (
                <div className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-accent"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">
                        No recent activity
                    </h3>
                    <p className="text-foreground-secondary">
                        Your activity feed will appear here
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {/* Recent Followers */}
                    {activity.recentFollowers.map((follower) => (
                        <Link
                            key={follower.user?._id || follower.followedAt}
                            href={`/${follower.user?.username || ""}`}
                            className="p-4 flex items-center gap-3 hover:bg-background-secondary/50 transition-colors"
                        >
                            <Avatar
                                src={follower.user?.avatarUrl}
                                fallback={
                                    follower.user?.displayName || follower.user?.username || "?"
                                }
                                size="sm"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">
                                    <span className="font-medium">
                                        {follower.user?.displayName || follower.user?.username}
                                    </span>
                                    <span className="text-foreground-secondary">
                                        {" "}
                                        started following you
                                    </span>
                                </p>
                                <p className="text-xs text-foreground-secondary mt-0.5">
                                    {formatTimeAgo(follower.followedAt)}
                                </p>
                            </div>
                            <div className="shrink-0">
                                <svg
                                    className="w-5 h-5 text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                            </div>
                        </Link>
                    ))}

                    {/* Recent Streams */}
                    {activity.recentStreams.map((stream) => (
                        <div key={stream._id} className="p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                <svg
                                    className="w-5 h-5 text-accent"
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
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-foreground">
                                    <span className="text-foreground-secondary">
                                        You streamed{" "}
                                    </span>
                                    <span className="font-medium">{stream.title}</span>
                                </p>
                                <p className="text-xs text-foreground-secondary mt-0.5">
                                    {formatTimeAgo(stream.createdAt)}
                                    {stream.peakViewerCount !== undefined &&
                                        stream.peakViewerCount > 0 && (
                                            <span> • Peak: {stream.peakViewerCount} viewers</span>
                                        )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
