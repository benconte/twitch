import { v } from "convex/values";
import { query } from "./_generated/server";

// Search users by username (case-insensitive prefix search)
export const searchUsers = query({
    args: {
        query: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (!args.query || args.query.length < 2) {
            return [];
        }

        const limit = args.limit || 10;
        const searchQuery = args.query.toLowerCase();

        // Get all users and filter by username
        // Note: For production, consider using a search index service
        const users = await ctx.db.query("users").collect();

        const matchedUsers = users
            .filter((user) => {
                const username = user.username?.toLowerCase() || "";
                const displayName = user.displayName?.toLowerCase() || "";
                return (
                    username.includes(searchQuery) || displayName.includes(searchQuery)
                );
            })
            .slice(0, limit);

        return matchedUsers;
    },
});

// Search streams by title
export const searchStreams = query({
    args: {
        query: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (!args.query || args.query.length < 2) {
            return [];
        }

        const limit = args.limit || 10;
        const searchQuery = args.query.toLowerCase();

        // Get all streams and filter by title
        const streams = await ctx.db.query("streams").collect();

        const matchedStreams = await Promise.all(
            streams
                .filter((stream) => {
                    const title = stream.title.toLowerCase();
                    const description = stream.description?.toLowerCase() || "";
                    const category = stream.category?.toLowerCase() || "";
                    return (
                        title.includes(searchQuery) ||
                        description.includes(searchQuery) ||
                        category.includes(searchQuery)
                    );
                })
                .slice(0, limit)
                .map(async (stream) => {
                    const streamer = await ctx.db.get(stream.userId);
                    return {
                        ...stream,
                        streamer,
                    };
                }),
        );

        return matchedStreams;
    },
});

// Search only live streams
export const searchLive = query({
    args: {
        query: v.string(),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        if (!args.query || args.query.length < 2) {
            return [];
        }

        const limit = args.limit || 10;
        const searchQuery = args.query.toLowerCase();

        // Get live streams
        const liveStreams = await ctx.db
            .query("streams")
            .withIndex("by_status", (q) => q.eq("status", "live"))
            .collect();

        const matchedStreams = await Promise.all(
            liveStreams
                .filter((stream) => {
                    const title = stream.title.toLowerCase();
                    const description = stream.description?.toLowerCase() || "";
                    const category = stream.category?.toLowerCase() || "";
                    return (
                        title.includes(searchQuery) ||
                        description.includes(searchQuery) ||
                        category.includes(searchQuery)
                    );
                })
                .slice(0, limit)
                .map(async (stream) => {
                    const streamer = await ctx.db.get(stream.userId);
                    return {
                        ...stream,
                        streamer,
                    };
                }),
        );

        return matchedStreams;
    },
});
