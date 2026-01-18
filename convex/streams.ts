import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Create a new stream
export const create = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const streamId = await ctx.db.insert("streams", {
            userId,
            title: args.title,
            description: args.description,
            category: args.category,
            thumbnailUrl: args.thumbnailUrl,
            status: "offline",
            viewerCount: 0,
            peakViewerCount: 0,
            createdAt: Date.now(),
        });

        return streamId;
    },
});

// Update stream metadata
export const update = mutation({
    args: {
        streamId: v.id("streams"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        category: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const stream = await ctx.db.get(args.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }

        if (stream.userId !== userId) {
            throw new Error("Not authorized to update this stream");
        }

        const { streamId, ...updates } = args;
        await ctx.db.patch(streamId, {
            ...updates,
            updatedAt: Date.now(),
        });

        return streamId;
    },
});

// Get stream by ID with streamer info
export const getById = query({
    args: { streamId: v.id("streams") },
    handler: async (ctx, args) => {
        const stream = await ctx.db.get(args.streamId);
        if (!stream) {
            return null;
        }

        const streamer = await ctx.db.get(stream.userId);

        return {
            ...stream,
            streamer,
        };
    },
});

// Get all streams for a user
export const getByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("streams")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Get all live streams
export const getLive = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 50;

        const streams = await ctx.db
            .query("streams")
            .withIndex("by_status", (q) => q.eq("status", "live"))
            .take(limit);

        // Get streamer info for each stream
        const streamsWithStreamers = await Promise.all(
            streams.map(async (stream) => {
                const streamer = await ctx.db.get(stream.userId);
                return {
                    ...stream,
                    streamer,
                };
            }),
        );

        return streamsWithStreamers;
    },
});

// Start a stream (set to live)
export const startStream = mutation({
    args: {
        streamId: v.id("streams"),
        livekitRoomName: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const stream = await ctx.db.get(args.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }

        if (stream.userId !== userId) {
            throw new Error("Not authorized to start this stream");
        }

        await ctx.db.patch(args.streamId, {
            status: "live",
            livekitRoomName: args.livekitRoomName,
            startedAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Update user's isLive status
        await ctx.db.patch(userId, {
            isLive: true,
            updatedAt: Date.now(),
        });

        // Create chat room if it doesn't exist
        const existingChatRoom = await ctx.db
            .query("chatRooms")
            .withIndex("by_streamId", (q) => q.eq("streamId", args.streamId))
            .first();

        if (!existingChatRoom) {
            await ctx.db.insert("chatRooms", {
                streamId: args.streamId,
                isEnabled: true,
                createdAt: Date.now(),
            });
        }

        return args.streamId;
    },
});

// End a stream
export const endStream = mutation({
    args: {
        streamId: v.id("streams"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const stream = await ctx.db.get(args.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }

        if (stream.userId !== userId) {
            throw new Error("Not authorized to end this stream");
        }

        await ctx.db.patch(args.streamId, {
            status: "ended",
            endedAt: Date.now(),
            updatedAt: Date.now(),
        });

        // Update user's isLive status
        await ctx.db.patch(userId, {
            isLive: false,
            updatedAt: Date.now(),
        });

        return args.streamId;
    },
});

// Get stream by LiveKit room name
export const getByLivekitRoomName = query({
    args: { roomName: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("streams")
            .withIndex("by_livekitRoomName", (q) =>
                q.eq("livekitRoomName", args.roomName),
            )
            .first();
    },
});
