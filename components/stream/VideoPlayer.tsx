"use client";

import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    LiveKitRoom,
    VideoTrack,
    useTracks,
    RoomAudioRenderer,
    useRoomContext,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Track } from "livekit-client";
import { Loader2, VideoOff, AlertCircle, Volume2 } from "lucide-react";
import { Button } from "../ui/Button";

interface VideoPlayerProps {
    roomName: string;
    participantName: string;
    onCinemaModeToggle?: () => void;
    isCinemaMode?: boolean;
}

function VideoRenderer() {
    const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);

    // Prefer screen share over camera
    const videoTrack =
        tracks.find((track) => track.source === Track.Source.ScreenShare) ||
        tracks.find((track) => track.source === Track.Source.Camera);

    if (!videoTrack) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center">
                <div className="text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        Waiting for stream to start...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <VideoTrack
            trackRef={videoTrack}
            className="w-full aspect-video object-contain bg-black"
        />
    );
}

interface ViewerControlsProps {
    onCinemaModeToggle?: () => void;
    isCinemaMode?: boolean;
    showControls: boolean;
}

function ViewerControls({
    onCinemaModeToggle,
    isCinemaMode,
    showControls,
}: ViewerControlsProps) {
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        const audioElements = document.querySelectorAll("audio");
        audioElements.forEach((audio) => {
            audio.muted = !isMuted;
        });
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        const videoContainer = document.querySelector("[data-video-container]");
        if (!videoContainer) return;

        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className="absolute bottom-0 left-0 right-0 z-20">
            <div
                className={`
                flex items-center justify-between gap-2 p-4
                bg-gradient-to-t from-black/80 to-transparent
                transition-opacity duration-300
                ${showControls ? "opacity-100" : "opacity-0"}
            `}
            >
                {/* Left side - Volume */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/20 rounded-md transition-colors"
                        aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted ? (
                            <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Right side - Display modes */}
                <div className="flex items-center gap-2">
                    {onCinemaModeToggle && (
                        <button
                            onClick={onCinemaModeToggle}
                            className="p-2 hover:bg-white/20 rounded-md transition-colors"
                            aria-label={isCinemaMode ? "Exit Cinema Mode" : "Cinema Mode"}
                            title={isCinemaMode ? "Exit Cinema Mode" : "Cinema Mode"}
                        >
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <rect
                                    x="2"
                                    y="6"
                                    width="20"
                                    height="12"
                                    rx="2"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    )}
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/20 rounded-md transition-colors"
                        aria-label="Fullscreen"
                        title="Fullscreen"
                    >
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

function AudioControl() {
    const room = useRoomContext();
    const [audioEnabled, setAudioEnabled] = useState(false);

    const enableAudio = async () => {
        try {
            // Resume audio context if suspended
            if (room && room.remoteParticipants) {
                // Try to play any existing audio elements
                const audioElements = document.querySelectorAll("audio");
                for (const audio of audioElements) {
                    try {
                        await audio.play();
                    } catch (e) {
                        console.log("Audio play attempt:", e);
                    }
                }
            }
            setAudioEnabled(true);
        } catch (err) {
            console.error("Failed to enable audio:", err);
        }
    };

    if (audioEnabled) {
        return null;
    }

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-30">
            <div className="text-center p-6 bg-background/90 rounded-lg shadow-lg border">
                <Volume2 className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-semibold mb-2">Enable Audio</h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Click the button below to hear the stream
                </p>
                <Button onClick={enableAudio} variant="primary" size="lg">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Enable Audio
                </Button>
            </div>
        </div>
    );
}

export function VideoPlayer({
    roomName,
    participantName,
    onCinemaModeToggle,
    isCinemaMode,
}: VideoPlayerProps) {
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [showControls, setShowControls] = useState(false);

    const generateToken = useAction(api.livekit.generateViewerToken);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                setLoading(true);
                setError(null);
                const generatedToken = await generateToken({
                    roomName,
                    participantName,
                });
                setToken(generatedToken);
            } catch (err) {
                console.error("Failed to generate LiveKit token:", err);
                setError(
                    err instanceof Error ? err.message : "Failed to connect to stream",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, [roomName, participantName, generateToken]);

    const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (loading) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                        Connecting to stream...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg border-2 border-destructive/50">
                <div className="text-center p-4">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-destructive font-semibold mb-2">
                        Unable to connect to stream
                    </p>
                    <p className="text-xs text-muted-foreground">{error}</p>
                    {error.includes("credentials") && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Configure LIVEKIT_API_KEY and LIVEKIT_API_SECRET in Convex
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (!livekitUrl) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg border-2 border-destructive/50">
                <div className="text-center p-4">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <p className="text-sm text-destructive font-semibold">
                        LiveKit URL not configured
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Set NEXT_PUBLIC_LIVEKIT_URL in .env.local
                    </p>
                </div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg">
                <div className="text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        No stream token available
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full aspect-video rounded-lg overflow-hidden bg-black relative"
            data-video-container
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <LiveKitRoom
                video={false}
                audio={false}
                token={token}
                serverUrl={livekitUrl}
                data-lk-theme="default"
                className="h-full"
                connect={true}
            >
                <VideoRenderer />
                <RoomAudioRenderer />
                <AudioControl />
                <ViewerControls
                    onCinemaModeToggle={onCinemaModeToggle}
                    isCinemaMode={isCinemaMode}
                    showControls={showControls}
                />
            </LiveKitRoom>
        </div>
    );
}
