"use client";

import { useState, useEffect, useRef } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
    LiveKitRoom,
    useLocalParticipant,
    useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import {
    Video,
    VideoOff,
    Mic,
    MicOff,
    Monitor,
    Loader2,
    Radio,
    StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface StreamPublisherProps {
    streamId: Id<"streams">;
    streamTitle: string;
}

function PublisherControls({ streamId }: { streamId: Id<"streams"> }) {
    const { localParticipant } = useLocalParticipant();
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isMicOn, setIsMicOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);

    const endStream = useMutation(api.streams.endStream);

    const toggleCamera = async () => {
        if (!localParticipant) return;
        const enabled = !isCameraOn;
        await localParticipant.setCameraEnabled(enabled);
        setIsCameraOn(enabled);
    };

    const toggleMic = async () => {
        if (!localParticipant) return;
        const enabled = !isMicOn;
        await localParticipant.setMicrophoneEnabled(enabled);
        setIsMicOn(enabled);
    };

    const toggleScreenShare = async () => {
        if (!localParticipant) return;
        const enabled = !isScreenSharing;
        await localParticipant.setScreenShareEnabled(enabled);
        setIsScreenSharing(enabled);
    };

    const handleEndStream = async () => {
        if (confirm("Are you sure you want to end the stream?")) {
            await endStream({ streamId });
            window.location.href = "/dashboard/stream";
        }
    };

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg p-3 flex items-center gap-2 shadow-lg border">
            <Button
                variant={isCameraOn ? "secondary" : "danger"}
                size="sm"
                onClick={toggleCamera}
            >
                {isCameraOn ? (
                    <Video className="h-4 w-4" />
                ) : (
                    <VideoOff className="h-4 w-4" />
                )}
            </Button>
            <Button
                variant={isMicOn ? "secondary" : "danger"}
                size="sm"
                onClick={toggleMic}
            >
                {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
            <Button
                variant={isScreenSharing ? "primary" : "secondary"}
                size="sm"
                onClick={toggleScreenShare}
            >
                <Monitor className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button variant="danger" size="sm" onClick={handleEndStream}>
                <StopCircle className="h-4 w-4 mr-1" />
                End Stream
            </Button>
        </div>
    );
}

function StreamPreview() {
    const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

    const videoTrack =
        tracks.find((track) => track.source === Track.Source.ScreenShare) ||
        tracks.find((track) => track.source === Track.Source.Camera);

    if (!videoTrack) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center">
                <div className="text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera not active</p>
                </div>
            </div>
        );
    }

    return (
        <video
            ref={(el) => {
                if (el && videoTrack.publication?.track) {
                    el.srcObject = new MediaStream([
                        videoTrack.publication.track.mediaStreamTrack,
                    ]);
                }
            }}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
        />
    );
}

export function StreamPublisher({
    streamId,
    streamTitle,
}: StreamPublisherProps) {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isLive, setIsLive] = useState(false);

    const generateToken = useAction(api.livekit.generateStreamerToken);
    const startStreamMutation = useMutation(api.streams.startStream);

    const roomName = `stream_${streamId}`;

    const handleGoLive = async () => {
        try {
            setLoading(true);
            setError(null);

            // Generate LiveKit token
            const generatedToken = await generateToken({
                roomName,
                participantName: streamTitle,
            });
            setToken(generatedToken);

            // Mark stream as live in database
            await startStreamMutation({
                streamId,
                livekitRoomName: roomName,
            });

            setIsLive(true);
        } catch (err) {
            console.error("Failed to start stream:", err);
            setError(err instanceof Error ? err.message : "Failed to start stream");
        } finally {
            setLoading(false);
        }
    };

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (error) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg border-2 border-destructive/50">
                <div className="text-center p-4">
                    <p className="text-sm text-destructive font-semibold mb-2">{error}</p>
                    {error.includes("credentials") && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Configure LIVEKIT_API_KEY and LIVEKIT_API_SECRET in Convex
                            environment
                        </p>
                    )}
                    <Button
                        variant="secondary"
                        size="sm"
                        className="mt-4"
                        onClick={() => setError(null)}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (!isLive) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg">
                <div className="text-center p-6">
                    <Radio className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Ready to go live?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        Click the button below to start streaming
                    </p>
                    <Button variant="primary" onClick={handleGoLive} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Starting...
                            </>
                        ) : (
                            <>
                                <Radio className="h-4 w-4 mr-2" />
                                Go Live
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    if (!livekitUrl || !token) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg border-2 border-destructive/50">
                <div className="text-center p-4">
                    <p className="text-sm text-destructive font-semibold">
                        LiveKit not configured
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Set NEXT_PUBLIC_LIVEKIT_URL in .env.local
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden relative">
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={livekitUrl}
                data-lk-theme="default"
                className="w-full h-full"
                connect={true}
            >
                <div className="relative w-full h-full">
                    <StreamPreview />
                    <PublisherControls streamId={streamId} />

                    {/* Live indicator */}
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        LIVE
                    </div>
                </div>
            </LiveKitRoom>
        </div>
    );
}
