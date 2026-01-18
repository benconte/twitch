import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    // Convex Auth tables
    ...authTables,

    // Custom users table extending auth - stores additional profile data
    // Note: username and createdAt are optional because @convex-dev/auth creates
    // users with minimal data initially (just email). These are populated during profile setup.
    users: defineTable({
        // Authentication
        email: v.optional(v.string()),
        emailVerified: v.optional(v.boolean()),

        // Profile
        username: v.optional(v.string()),
        displayName: v.optional(v.string()),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),

        // Streaming
        streamKey: v.optional(v.string()),
        isLive: v.optional(v.boolean()),

        // Role: "user" | "admin" | "moderator"
        role: v.optional(v.string()),

        // Timestamps
        createdAt: v.optional(v.number()),
        updatedAt: v.optional(v.number()),
    })
        .index("by_username", ["username"])
        .index("email", ["email"])
        .index("by_streamKey", ["streamKey"]),

    // Streams table
    streams: defineTable({
        userId: v.id("users"),

        // Stream info
        title: v.string(),
        description: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        category: v.optional(v.string()),

        // Status: "offline" | "live" | "ended"
        status: v.string(),

        // LiveKit room/session info
        livekitRoomName: v.optional(v.string()),

        // Stats
        viewerCount: v.optional(v.number()),
        peakViewerCount: v.optional(v.number()),

        // Timestamps
        startedAt: v.optional(v.number()),
        endedAt: v.optional(v.number()),
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    })
        .index("by_userId", ["userId"])
        .index("by_status", ["status"])
        .index("by_status_and_createdAt", ["status", "createdAt"])
        .index("by_livekitRoomName", ["livekitRoomName"]),

    // Chat rooms - one per stream
    chatRooms: defineTable({
        streamId: v.id("streams"),

        // Settings
        isEnabled: v.boolean(),
        slowMode: v.optional(v.number()), // seconds between messages
        followersOnly: v.optional(v.boolean()),
        subscribersOnly: v.optional(v.boolean()),

        // Timestamps
        createdAt: v.number(),
        updatedAt: v.optional(v.number()),
    }).index("by_streamId", ["streamId"]),

    // Chat messages
    chatMessages: defineTable({
        chatRoomId: v.id("chatRooms"),
        userId: v.id("users"),

        // Message content
        content: v.string(),

        // Type: "message" | "system" | "emote"
        type: v.string(),

        // Moderation
        isDeleted: v.optional(v.boolean()),
        deletedBy: v.optional(v.id("users")),

        // Timestamps
        createdAt: v.number(),
    })
        .index("by_chatRoomId", ["chatRoomId"])
        .index("by_chatRoomId_and_createdAt", ["chatRoomId", "createdAt"])
        .index("by_userId", ["userId"]),

    // Follow relationships
    follows: defineTable({
        followerId: v.id("users"),
        followingId: v.id("users"),

        // Timestamps
        createdAt: v.number(),
    })
        .index("by_followerId", ["followerId"])
        .index("by_followingId", ["followingId"])
        .index("by_follower_and_following", ["followerId", "followingId"]),

    // Active stream viewers
    streamViewers: defineTable({
        streamId: v.id("streams"),
        userId: v.optional(v.id("users")), // Optional for anonymous viewers

        // Session info
        sessionId: v.string(),

        // Timestamps
        joinedAt: v.number(),
        lastActiveAt: v.number(),
    })
        .index("by_streamId", ["streamId"])
        .index("by_userId", ["userId"])
        .index("by_stream_and_user", ["streamId", "userId"])
        .index("by_sessionId", ["sessionId"]),
});

export default schema;
