import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Join a stream as a viewer
export const joinStream = mutation({
    args: {
        streamId: v.id("streams"),
        sessionId: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);

        // Check if stream exists and is live
        const stream = await ctx.db.get(args.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }

        if (stream.status !== "live") {
            throw new Error("Stream is not live");
        }

        // Check if already joined with this session
        const existingViewer = await ctx.db
            .query("streamViewers")
            .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
            .first();

        if (existingViewer) {
            // Update last active time
            await ctx.db.patch(existingViewer._id, {
                lastActiveAt: Date.now(),
            });
            return existingViewer._id;
        }

        // Create new viewer record
        const viewerId = await ctx.db.insert("streamViewers", {
            streamId: args.streamId,
            userId: userId || undefined,
            sessionId: args.sessionId,
            joinedAt: Date.now(),
            lastActiveAt: Date.now(),
        });

        // Update stream viewer count
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        const viewers = await ctx.db
            .query("streamViewers")
            .withIndex("by_streamId", (q) => q.eq("streamId", args.streamId))
            .collect();
        const viewerCount = viewers.filter(
            (v) => v.lastActiveAt > fiveMinutesAgo,
        ).length;

        await ctx.db.patch(args.streamId, {
            viewerCount,
            peakViewerCount: Math.max(stream.peakViewerCount || 0, viewerCount),
        });

        return viewerId;
    },
});

// Leave a stream
export const leaveStream = mutation({
    args: {
        sessionId: v.string(),
    },
    handler: async (ctx, args) => {
        const viewer = await ctx.db
            .query("streamViewers")
            .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
            .first();

        if (!viewer) {
            return false;
        }

        const streamId = viewer.streamId;
        await ctx.db.delete(viewer._id);

        // Update stream viewer count
        const stream = await ctx.db.get(streamId);
        if (stream) {
            const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
            const viewers = await ctx.db
                .query("streamViewers")
                .withIndex("by_streamId", (q) => q.eq("streamId", streamId))
                .collect();
            const viewerCount = viewers.filter(
                (v) => v.lastActiveAt > fiveMinutesAgo,
            ).length;

            await ctx.db.patch(streamId, {
                viewerCount,
            });
        }

        return true;
    },
});

// Get viewer count for a stream
export const getViewerCount = query({
    args: { streamId: v.id("streams") },
    handler: async (ctx, args) => {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

        const viewers = await ctx.db
            .query("streamViewers")
            .withIndex("by_streamId", (q) => q.eq("streamId", args.streamId))
            .collect();

        // Count only active viewers
        return viewers.filter((v) => v.lastActiveAt > fiveMinutesAgo).length;
    },
});

// Heartbeat - update last active timestamp
export const heartbeat = mutation({
    args: {
        sessionId: v.string(),
    },
    handler: async (ctx, args) => {
        const viewer = await ctx.db
            .query("streamViewers")
            .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
            .first();

        if (!viewer) {
            return false;
        }

        await ctx.db.patch(viewer._id, {
            lastActiveAt: Date.now(),
        });

        return true;
    },
});
