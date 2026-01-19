"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { Id } from "@/convex/_generated/dataModel";

interface ProfileClientProps {
    user: {
        _id: Id<"users">;
        username?: string;
        displayName?: string;
        bio?: string;
        avatarUrl?: string | null;
        isLive?: boolean;
    };
    activeStream: {
        _id: Id<"streams">;
        title: string;
        category?: string;
        viewerCount?: number;
    } | null;
}

export default function ProfileClient({
    user,
    activeStream,
}: ProfileClientProps) {
    const router = useRouter();
    const { addToast } = useToast();
    const { isAuthenticated } = useConvexAuth();
    const currentUser = useQuery(api.users.current);
    const followMutation = useMutation(api.users.follow);
    const unfollowMutation = useMutation(api.users.unfollow);

    const isFollowing = useQuery(
        api.follows.isFollowing,
        currentUser ? { userId: user._id } : "skip",
    );
    const followerCount = useQuery(api.follows.getFollowerCount, {
        userId: user._id,
    });
    const followingCount = useQuery(api.follows.getFollowingCount, {
        userId: user._id,
    });

    const isOwnProfile = currentUser?._id === user._id;

    const handleFollow = async () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }

        try {
            if (isFollowing) {
                await unfollowMutation({ userId: user._id });
                addToast({
                    message: `Unfollowed ${user.displayName || user.username}`,
                    variant: "success",
                });
            } else {
                await followMutation({ userId: user._id });
                addToast({
                    message: `Now following ${user.displayName || user.username}`,
                    variant: "success",
                });
            }
        } catch (error) {
            addToast({
                message: "Failed to update follow status",
                variant: "error",
            });
        }
    };

    return (
        <div className="min-h-screen">
            {/* If live, show stream */}
            {user.isLive && activeStream && (
                <div className="bg-background-secondary border-b border-border">
                    <div className="max-w-7xl mx-auto p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-1">
                                    {activeStream.title}
                                </h2>
                                <div className="flex items-center gap-3">
                                    <Badge variant="live">LIVE</Badge>
                                    {activeStream.category && (
                                        <span className="text-sm text-foreground-secondary">
                                            {activeStream.category}
                                        </span>
                                    )}
                                    <span className="text-sm text-red-500 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        {activeStream.viewerCount || 0} viewers
                                    </span>
                                </div>
                            </div>
                            <Link href={`/stream/${activeStream._id}`}>
                                <Button variant="primary" size="lg">
                                    Watch Stream
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Info */}
            <div className="max-w-7xl mx-auto p-6">
                <div className="flex items-start gap-6 mb-8">
                    <Avatar
                        src={user.avatarUrl}
                        fallback={user.displayName || user.username || "?"}
                        size="xl"
                        isLive={user.isLive}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-foreground">
                                {user.displayName || user.username}
                            </h1>
                            {user.isLive && <Badge variant="live">LIVE</Badge>}
                        </div>
                        <p className="text-foreground-secondary mb-4">@{user.username}</p>
                        {user.bio && <p className="text-foreground mb-4">{user.bio}</p>}
                        <div className="flex items-center gap-6 text-sm text-foreground-secondary mb-4">
                            <div>
                                <span className="font-semibold text-foreground">
                                    {followerCount || 0}
                                </span>{" "}
                                followers
                            </div>
                            <div>
                                <span className="font-semibold text-foreground">
                                    {followingCount || 0}
                                </span>{" "}
                                following
                            </div>
                        </div>
                        {!isOwnProfile && (
                            <Button
                                onClick={handleFollow}
                                variant={isFollowing ? "secondary" : "primary"}
                                size="lg"
                            >
                                {isFollowing ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                        {isOwnProfile && (
                            <Link href="/dashboard">
                                <Button variant="secondary" size="lg">
                                    Edit Profile
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Offline State */}
                {!user.isLive && (
                    <div className="text-center py-20 bg-background-secondary rounded-lg">
                        <div className="w-20 h-20 rounded-full bg-background mx-auto mb-4 flex items-center justify-center">
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
                            {user.displayName || user.username} is offline
                        </h3>
                        <p className="text-foreground-secondary">
                            Follow to get notified when they go live
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
