"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Users } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/useAuth";
import { useState } from "react";

interface StreamerCardProps {
    streamer: Doc<"users">;
}

export function StreamerCard({ streamer }: StreamerCardProps) {
    const { userId } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Check if following
    const isFollowing = useQuery(
        api.follows.isFollowing,
        userId ? { userId: streamer._id } : "skip",
    );

    // Get follower count
    const followers = useQuery(api.follows.getFollowers, {
        userId: streamer._id,
    });

    // Follow/unfollow mutations
    const follow = useMutation(api.users.follow);
    const unfollow = useMutation(api.users.unfollow);

    const handleFollowToggle = async () => {
        if (!userId) return;

        setIsLoading(true);
        try {
            if (isFollowing) {
                await unfollow({ userId: streamer._id });
            } else {
                await follow({ userId: streamer._id });
            }
        } catch (error) {
            console.error("Failed to toggle follow:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const followerCount = followers?.length || 0;
    const isOwnProfile = userId === streamer._id;

    return (
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            {/* Streamer info */}
            <div className="flex items-center gap-3">
                <Avatar
                    src={streamer.avatarUrl}
                    alt={streamer.displayName || streamer.username}
                    size="lg"
                    isLive={streamer.isLive}
                />

                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                        {streamer.displayName || streamer.username}
                    </h3>
                    {/* Follower count */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>
                            {followerCount.toLocaleString()} follower
                            {followerCount !== 1 ? "s" : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bio */}
            {streamer.bio && (
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {streamer.bio}
                </p>
            )}

            {/* Follow button */}
            {!isOwnProfile && (
                <Button
                    onClick={handleFollowToggle}
                    disabled={!userId || isLoading}
                    variant={isFollowing ? "secondary" : "primary"}
                    className="w-full"
                >
                    {isFollowing ? "Following" : "Follow"}
                </Button>
            )}
        </div>
    );
}
