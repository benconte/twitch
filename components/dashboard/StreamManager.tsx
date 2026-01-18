"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatDuration(ms: number): string {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

export function StreamManager() {
    const { addToast } = useToast();
    const [showStreamKey, setShowStreamKey] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const user = useQuery(api.users.current);
    const myStreams = useQuery(api.dashboard.getMyStreams, { limit: 5 });
    const generateStreamKey = useMutation(api.users.generateStreamKey);

    const handleCopyStreamKey = async () => {
        if (user?.streamKey) {
            await navigator.clipboard.writeText(user.streamKey);
            addToast({
                message: "Stream key copied to clipboard",
                variant: "success",
            });
        }
    };

    const handleGenerateStreamKey = async () => {
        setIsGenerating(true);
        try {
            await generateStreamKey();
            addToast({
                message: "New stream key generated",
                variant: "success",
            });
        } catch (error) {
            addToast({
                message: "Failed to generate stream key",
                variant: "error",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Card padding="none">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                    Stream Manager
                </h2>
            </div>

            {/* Stream Key Section */}
            <div className="p-4 border-b border-border bg-background-secondary/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-foreground mb-1">
                            Stream Key
                        </h3>
                        <div className="flex items-center gap-2">
                            <code className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm font-mono text-foreground-secondary overflow-hidden">
                                {user?.streamKey ? (
                                    showStreamKey ? (
                                        user.streamKey
                                    ) : (
                                        "••••••••••••••••••••••••"
                                    )
                                ) : (
                                    <span className="text-foreground-secondary italic">
                                        No stream key generated
                                    </span>
                                )}
                            </code>
                            {user?.streamKey && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowStreamKey(!showStreamKey)}
                                        aria-label={
                                            showStreamKey ? "Hide stream key" : "Show stream key"
                                        }
                                    >
                                        {showStreamKey ? (
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
                                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                                />
                                            </svg>
                                        ) : (
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
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCopyStreamKey}
                                        aria-label="Copy stream key"
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
                                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleGenerateStreamKey}
                        isLoading={isGenerating}
                    >
                        {user?.streamKey ? "Reset Key" : "Generate Key"}
                    </Button>
                </div>
                <p className="text-xs text-foreground-secondary mt-2">
                    Keep your stream key private. Reset it if you believe it has been
                    compromised.
                </p>
            </div>

            {/* Past Streams */}
            <div className="divide-y divide-border">
                {myStreams === undefined ? (
                    // Loading state
                    <>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="p-4 flex items-center gap-4">
                                <Skeleton className="w-20 h-12" rounded="md" />
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        ))}
                    </>
                ) : myStreams.streams.length === 0 ? (
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
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-1">
                            No streams yet
                        </h3>
                        <p className="text-foreground-secondary">
                            Start your first stream to see it here
                        </p>
                    </div>
                ) : (
                    myStreams.streams.map((stream) => (
                        <div
                            key={stream._id}
                            className="p-4 flex items-center gap-4 hover:bg-background-secondary/50 transition-colors"
                        >
                            {/* Thumbnail */}
                            <div className="w-20 h-12 rounded-md bg-background-secondary overflow-hidden shrink-0">
                                {stream.thumbnailUrl ? (
                                    <img
                                        src={stream.thumbnailUrl}
                                        alt={stream.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent/20 to-accent/5">
                                        <svg
                                            className="w-6 h-6 text-accent/50"
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
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-foreground truncate">
                                        {stream.title}
                                    </h4>
                                    <Badge
                                        variant={stream.status === "live" ? "live" : "default"}
                                    >
                                        {stream.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-foreground-secondary mt-0.5">
                                    {formatDate(stream.createdAt)}
                                    {stream.endedAt && stream.startedAt && (
                                        <span className="ml-2">
                                            • Duration:{" "}
                                            {formatDuration(stream.endedAt - stream.startedAt)}
                                        </span>
                                    )}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="text-right shrink-0">
                                <p className="text-sm font-medium text-foreground">
                                    {stream.peakViewerCount?.toLocaleString() || 0}
                                </p>
                                <p className="text-xs text-foreground-secondary">
                                    peak viewers
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
