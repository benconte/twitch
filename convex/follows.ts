import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

// Get users that the current user is following
export const getMyFollowing = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return [];
        }

        const limit = args.limit || 10;

        const follows = await ctx.db
            .query("follows")
            .withIndex("by_followerId", (q) => q.eq("followerId", userId))
            .order("desc")
            .take(limit);

        // Get user details for each followed user
        const following = await Promise.all(
            follows.map(async (follow) => {
                const user = await ctx.db.get(follow.followingId);
                return {
                    ...follow,
                    user,
                };
            }),
        );

        return following;
    },
});

// Get followers of a user
export const getFollowers = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .withIndex("by_followingId", (q) => q.eq("followingId", args.userId))
            .collect();

        // Get user details for each follower
        const followers = await Promise.all(
            follows.map(async (follow) => {
                const user = await ctx.db.get(follow.followerId);
                return {
                    ...follow,
                    user,
                };
            }),
        );

        return followers;
    },
});

// Get users that a user is following
export const getFollowing = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .withIndex("by_followerId", (q) => q.eq("followerId", args.userId))
            .collect();

        // Get user details for each followed user
        const following = await Promise.all(
            follows.map(async (follow) => {
                const user = await ctx.db.get(follow.followingId);
                return {
                    ...follow,
                    user,
                };
            }),
        );

        return following;
    },
});

// Check if current user is following a specific user
export const isFollowing = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);
        if (!currentUserId) {
            return false;
        }

        const follow = await ctx.db
            .query("follows")
            .withIndex("by_follower_and_following", (q) =>
                q.eq("followerId", currentUserId).eq("followingId", args.userId),
            )
            .first();

        return !!follow;
    },
});

// Get follower count for a user
export const getFollowerCount = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .withIndex("by_followingId", (q) => q.eq("followingId", args.userId))
            .collect();

        return follows.length;
    },
});

// Get following count for a user
export const getFollowingCount = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const follows = await ctx.db
            .query("follows")
            .withIndex("by_followerId", (q) => q.eq("followerId", args.userId))
            .collect();

        return follows.length;
    },
});
