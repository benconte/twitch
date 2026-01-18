"use client";

import { use } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { StreamInfo } from "@/components/stream/StreamInfo";
import { StreamerCard } from "@/components/stream/StreamerCard";
import { VideoPlayer } from "@/components/stream/VideoPlayer";
import { StreamPublisher } from "@/components/stream/StreamPublisher";
import { Chat } from "@/components/chat/Chat";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";

interface StreamPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function StreamPage(props: StreamPageProps) {
    const params = use(props.params);
    const { userId } = useAuth();
    const [sessionId] = useState(
        `session_${Math.random().toString(36).substring(7)}`,
    );

    // Get stream data
    const stream = useQuery(api.streams.getById, {
        streamId: params.id as Id<"streams">,
    });

    // Get current user data for participant name
    const currentUser = useQuery(api.users.current, userId ? undefined : "skip");

    // Get viewer count
    const viewerCount = useQuery(api.viewers.getViewerCount, {
        streamId: params.id as Id<"streams">,
    });

    // Mutations
    const joinStream = useMutation(api.viewers.joinStream);
    const leaveStream = useMutation(api.viewers.leaveStream);
    const heartbeat = useMutation(api.viewers.heartbeat);

    // Track if we've joined to prevent duplicate joins
    const [hasJoined, setHasJoined] = useState(false);
    const [isCinemaMode, setIsCinemaMode] = useState(false);
    const streamId = params.id as Id<"streams">;
    const streamStatus = stream?.status;

    // Join stream when it goes live
    useEffect(() => {
        if (!streamStatus || streamStatus !== "live" || hasJoined) return;

        const join = async () => {
            try {
                await joinStream({
                    streamId,
                    sessionId,
                });
                setHasJoined(true);

                // TODO: Generate LiveKit token when credentials are configured
            } catch (error) {
                console.error("Failed to join stream:", error);
            }
        };

        join();
    }, [streamStatus, streamId, sessionId, joinStream, hasJoined]);

    // Heartbeat to keep session alive
    useEffect(() => {
        if (!hasJoined) return;

        const heartbeatInterval = setInterval(() => {
            heartbeat({ sessionId }).catch(console.error);
        }, 30000);

        return () => {
            clearInterval(heartbeatInterval);
        };
    }, [hasJoined, sessionId, heartbeat]);

    // Leave stream on unmount
    useEffect(() => {
        return () => {
            if (hasJoined) {
                leaveStream({ sessionId }).catch(console.error);
            }
        };
    }, [hasJoined, sessionId, leaveStream]);

    // Loading state
    if (stream === undefined) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // Not found
    if (stream === null) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6">
                <div
                    className={`grid grid-cols-1 gap-6 ${isCinemaMode ? "lg:grid-cols-1" : "lg:grid-cols-[1fr_400px]"}`}
                >
                    {/* Left column - Video and info */}
                    <div className="space-y-4">
                        {/* Video player */}
                        {stream.status === "live" && stream.livekitRoomName ? (
                            // Show StreamPublisher if user owns this stream
                            userId === stream.userId ? (
                                <StreamPublisher
                                    streamId={params.id as Id<"streams">}
                                    streamTitle={stream.title}
                                />
                            ) : (
                                // Show VideoPlayer for viewers
                                <VideoPlayer
                                    roomName={stream.livekitRoomName}
                                    participantName={
                                        currentUser?.username ||
                                        currentUser?.displayName ||
                                        "Viewer"
                                    }
                                    onCinemaModeToggle={() => setIsCinemaMode(!isCinemaMode)}
                                    isCinemaMode={isCinemaMode}
                                />
                            )
                        ) : (
                            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg">
                                <div className="text-center p-4">
                                    <p className="text-muted-foreground">Stream is offline</p>
                                </div>
                            </div>
                        )}

                        {/* Stream info */}
                        <StreamInfo stream={stream} viewerCount={viewerCount || 0} />

                        {/* Streamer card */}
                        {stream.streamer && <StreamerCard streamer={stream.streamer} />}
                    </div>

                    {/* Right column - Chat */}
                    {!isCinemaMode && (
                        <div className="lg:h-[calc(100vh-6rem)] h-[600px]">
                            <div className="h-full rounded-lg overflow-hidden border">
                                <Chat
                                    streamId={params.id as Id<"streams">}
                                    streamerId={stream.userId}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
