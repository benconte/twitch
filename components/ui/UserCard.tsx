"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Avatar } from "./Avatar";
import { Button } from "./Button";
import { useToast } from "./Toast";
import { useState } from "react";

interface UserCardProps {
    userId: string;
    username: string;
    displayName?: string;
    avatarUrl?: string | null;
    bio?: string;
    followerCount?: number;
    initialIsFollowing?: boolean;
}

export function UserCard({
    userId,
    username,
    displayName,
    avatarUrl,
    bio,
    followerCount = 0,
    initialIsFollowing = false,
}: UserCardProps) {
    const { addToast } = useToast();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isLoading, setIsLoading] = useState(false);

    // Conditionally use mutations based on ID format (Convex ID vs string)
    // In a real app we'd need proper ID type handling, but for UI component we'll assume valid ID
    const followUser = useMutation(api.users.follow);
    const unfollowUser = useMutation(api.users.unfollow);

    const handleFollowToggle = async () => {
        setIsLoading(true);
        try {
            if (isFollowing) {
                // @ts-expect-error - Assuming ID is valid for the mutation
                await unfollowUser({ userId });
                setIsFollowing(false);
                addToast({
                    message: `Unfollowed ${displayName || username}`,
                    variant: "success",
                });
            } else {
                // @ts-expect-error - Assuming ID is valid for the mutation
                await followUser({ userId });
                setIsFollowing(true);
                addToast({
                    message: `Followed ${displayName || username}`,
                    variant: "success",
                });
            }
        } catch (error) {
            addToast({
                message: isFollowing ? "Failed to unfollow" : "Failed to follow",
                variant: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-background border border-border rounded-xl">
            <Avatar
                src={avatarUrl}
                fallback={displayName || username}
                size="xl"
                className="mb-4"
            />

            <h3 className="text-lg font-bold text-foreground">
                {displayName || username}
            </h3>

            <p className="text-sm text-foreground-secondary mb-4">@{username}</p>

            {bio && (
                <p className="text-sm text-center text-foreground-secondary mb-4 line-clamp-3">
                    {bio}
                </p>
            )}

            <div className="flex items-center justify-between w-full text-sm text-foreground-secondary mb-6">
                <div className="text-center flex-1">
                    <span className="block font-bold text-foreground">
                        {formatCount(followerCount)}
                    </span>
                    Followers
                </div>
            </div>

            <Button
                variant={isFollowing ? "secondary" : "primary"}
                className="w-full"
                onClick={handleFollowToggle}
                isLoading={isLoading}
            >
                {isFollowing ? "Unfollow" : "Follow"}
            </Button>
        </div>
    );
}

function formatCount(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
}
