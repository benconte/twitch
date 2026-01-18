"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { Video, Copy, Check, AlertCircle } from "lucide-react";

export default function StreamManagementPage() {
    const router = useRouter();
    const { userId, user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [copiedStreamKey, setCopiedStreamKey] = useState(false);

    // Get user's active stream if any
    const myStreams = useQuery(api.dashboard.getMyStreams, userId ? {} : "skip");

    const activeStream = myStreams?.streams?.find((s) => s.status === "live");

    const createStream = useMutation(api.streams.create);
    const startStream = useMutation(api.streams.startStream);
    const endStream = useMutation(api.streams.endStream);

    const handleCopyStreamKey = async () => {
        if (user?.streamKey) {
            await navigator.clipboard.writeText(user.streamKey);
            setCopiedStreamKey(true);
            setTimeout(() => setCopiedStreamKey(false), 2000);
        }
    };

    const handleCreateAndStart = async () => {
        if (!title.trim()) {
            alert("Please enter a stream title");
            return;
        }

        setIsCreating(true);
        try {
            // Create the stream
            const streamId = await createStream({
                title: title.trim(),
                description: description.trim() || undefined,
                category: category.trim() || undefined,
            });

            // Generate room name from stream ID
            const roomName = `stream_${streamId}`;

            // Start the stream
            await startStream({
                streamId,
                livekitRoomName: roomName,
            });

            // Redirect to the stream page
            router.push(`/stream/${streamId}`);
        } catch (error) {
            console.error("Failed to create stream:", error);
            alert("Failed to create stream. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEndStream = async () => {
        if (!activeStream) return;

        try {
            await endStream({ streamId: activeStream._id });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to end stream:", error);
            alert("Failed to end stream. Please try again.");
        }
    };

    if (!userId) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (activeStream) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Stream Management
                </h1>

                <Card>
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-red-500/10 text-red-500">
                            <Video className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-lg">
                                You're currently live!
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {activeStream.title}
                            </p>
                            <div className="flex gap-3 mt-4">
                                <Button
                                    onClick={() => router.push(`/stream/${activeStream._id}`)}
                                    variant="primary"
                                >
                                    View Stream
                                </Button>
                                <Button onClick={handleEndStream} variant="danger">
                                    End Stream
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Start Streaming
            </h1>
            <p className="text-muted-foreground mb-6">
                Configure your stream and go live directly from your browser
            </p>

            <div className="space-y-6">
                {/* Stream Settings */}
                <Card>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Stream Settings
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Stream Title *
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a catchy stream title"
                                maxLength={100}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Tell viewers what you'll be doing"
                                rows={3}
                                maxLength={500}
                                className="w-full px-3 py-2 bg-secondary border border-border rounded-md resize-none focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">
                                Category
                            </label>
                            <Input
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="e.g., Gaming, Music, Just Chatting"
                                maxLength={50}
                            />
                        </div>
                    </div>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={handleCreateAndStart}
                        disabled={!title.trim() || isCreating}
                        variant="primary"
                        className="w-full sm:w-auto"
                    >
                        {isCreating ? (
                            <>
                                <Spinner size="sm" className="mr-2" />
                                Setting up...
                            </>
                        ) : (
                            <>
                                <Video className="h-4 w-4 mr-2" />
                                Continue to Stream Setup
                            </>
                        )}
                    </Button>
                    <Button onClick={() => router.push("/dashboard")} variant="secondary">
                        Cancel
                    </Button>
                </div>

                {/* Information Notice */}
                <Card>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Browser-Based Streaming
                    </h2>
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-foreground font-medium">
                                Stream directly from your browser
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Click "Continue to Stream Setup" to access your camera and
                                microphone. No external software needed! You can also share your
                                screen to stream gameplay or presentations.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
