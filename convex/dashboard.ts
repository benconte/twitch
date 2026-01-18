import { v } from "convex/values";
import { query } from "./_generated/server";
import { auth } from "./auth";

// Get dashboard statistics for the current user
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null;
        }

        // Get follower count
        const followers = await ctx.db
            .query("follows")
            .withIndex("by_followingId", (q) => q.eq("followingId", userId))
            .collect();

        // Get following count
        const following = await ctx.db
            .query("follows")
            .withIndex("by_followerId", (q) => q.eq("followerId", userId))
            .collect();

        // Get stream count
        const streams = await ctx.db
            .query("streams")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        // Calculate total views from all streams
        const totalViews = streams.reduce((sum, stream) => {
            return sum + (stream.peakViewerCount || 0);
        }, 0);

        return {
            followerCount: followers.length,
            followingCount: following.length,
            streamCount: streams.length,
            totalViews,
        };
    },
});

// Get the current user's streams
export const getMyStreams = query({
    args: {
        limit: v.optional(v.number()),
        cursor: v.optional(v.id("streams")),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return { streams: [], nextCursor: null };
        }

        const limit = args.limit || 10;

        let streamsQuery = ctx.db
            .query("streams")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc");

        const streams = await streamsQuery.take(limit + 1);

        const hasMore = streams.length > limit;
        const results = hasMore ? streams.slice(0, -1) : streams;
        const nextCursor = hasMore ? results[results.length - 1]._id : null;

        return {
            streams: results,
            nextCursor,
        };
    },
});

// Get recent activity for the current user
export const getRecentActivity = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return { recentFollowers: [], recentStreams: [] };
        }

        const limit = args.limit || 5;

        // Get recent followers
        const recentFollows = await ctx.db
            .query("follows")
            .withIndex("by_followingId", (q) => q.eq("followingId", userId))
            .order("desc")
            .take(limit);

        const recentFollowers = await Promise.all(
            recentFollows.map(async (follow) => {
                const user = await ctx.db.get(follow.followerId);
                return {
                    followedAt: follow.createdAt,
                    user,
                };
            }),
        );

        // Get recent streams
        const recentStreams = await ctx.db
            .query("streams")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc")
            .take(limit);

        return {
            recentFollowers,
            recentStreams,
        };
    },
});
