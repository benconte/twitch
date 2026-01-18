import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Create a chat room for a stream
export const createRoom = mutation({
    args: {
        streamId: v.id("streams"),
        slowMode: v.optional(v.number()),
        followersOnly: v.optional(v.boolean()),
        subscribersOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Verify the stream belongs to the user
        const stream = await ctx.db.get(args.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }

        if (stream.userId !== userId) {
            throw new Error("Not authorized to create chat room for this stream");
        }

        // Check if chat room already exists
        const existingRoom = await ctx.db
            .query("chatRooms")
            .withIndex("by_streamId", (q) => q.eq("streamId", args.streamId))
            .first();

        if (existingRoom) {
            throw new Error("Chat room already exists for this stream");
        }

        const roomId = await ctx.db.insert("chatRooms", {
            streamId: args.streamId,
            isEnabled: true,
            slowMode: args.slowMode,
            followersOnly: args.followersOnly,
            subscribersOnly: args.subscribersOnly,
            createdAt: Date.now(),
        });

        return roomId;
    },
});

// Get chat room by stream ID
export const getRoomByStreamId = query({
    args: { streamId: v.id("streams") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chatRooms")
            .withIndex("by_streamId", (q) => q.eq("streamId", args.streamId))
            .first();
    },
});

// Send a chat message
export const sendMessage = mutation({
    args: {
        chatRoomId: v.id("chatRooms"),
        content: v.string(),
        type: v.optional(v.string()), // "message" | "emote"
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Verify chat room exists and is enabled
        const chatRoom = await ctx.db.get(args.chatRoomId);
        if (!chatRoom) {
            throw new Error("Chat room not found");
        }

        if (!chatRoom.isEnabled) {
            throw new Error("Chat is disabled for this stream");
        }

        // TODO: Add slow mode, followers-only, subscribers-only checks

        const messageId = await ctx.db.insert("chatMessages", {
            chatRoomId: args.chatRoomId,
            userId,
            content: args.content,
            type: args.type || "message",
            createdAt: Date.now(),
        });

        return messageId;
    },
});

// Get chat messages with pagination
export const getMessages = query({
    args: {
        chatRoomId: v.id("chatRooms"),
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 50;

        const messages = await ctx.db
            .query("chatMessages")
            .withIndex("by_chatRoomId_and_createdAt", (q) =>
                q.eq("chatRoomId", args.chatRoomId),
            )
            .order("desc")
            .take(limit);

        // Get user info for each message
        const messagesWithUsers = await Promise.all(
            messages.map(async (message) => {
                // Skip deleted messages
                if (message.isDeleted) {
                    return {
                        ...message,
                        content: "[Message deleted]",
                        user: null,
                    };
                }

                const user = await ctx.db.get(message.userId);
                return {
                    ...message,
                    user,
                };
            }),
        );

        // Return in chronological order
        return messagesWithUsers.reverse();
    },
});

// Delete a chat message (moderation)
export const deleteMessage = mutation({
    args: {
        messageId: v.id("chatMessages"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const message = await ctx.db.get(args.messageId);
        if (!message) {
            throw new Error("Message not found");
        }

        // Get the chat room to find the stream owner
        const chatRoom = await ctx.db.get(message.chatRoomId);
        if (!chatRoom) {
            throw new Error("Chat room not found");
        }

        const stream = await ctx.db.get(chatRoom.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }

        // Check if user is the stream owner or the message author
        const isStreamOwner = stream.userId === userId;
        const isMessageAuthor = message.userId === userId;

        // TODO: Add moderator role check

        if (!isStreamOwner && !isMessageAuthor) {
            throw new Error("Not authorized to delete this message");
        }

        await ctx.db.patch(args.messageId, {
            isDeleted: true,
            deletedBy: userId,
        });

        return true;
    },
});

// Update chat room settings
export const updateRoomSettings = mutation({
    args: {
        chatRoomId: v.id("chatRooms"),
        isEnabled: v.optional(v.boolean()),
        slowMode: v.optional(v.number()),
        followersOnly: v.optional(v.boolean()),
        subscribersOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const chatRoom = await ctx.db.get(args.chatRoomId);
        if (!chatRoom) {
            throw new Error("Chat room not found");
        }

        const stream = await ctx.db.get(chatRoom.streamId);
        if (!stream) {
            throw new Error("Stream not found");
        }

        if (stream.userId !== userId) {
            throw new Error("Not authorized to update this chat room");
        }

        const { chatRoomId, ...updates } = args;
        await ctx.db.patch(chatRoomId, {
            ...updates,
            updatedAt: Date.now(),
        });

        return chatRoomId;
    },
});
