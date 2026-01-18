import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { auth } from "./auth";

// Get current authenticated user
export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null;
        }

        const user = await ctx.db.get(userId);
        return user;
    },
});

// Get user by ID
export const getById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.userId);
    },
});

// Get user by username
export const getByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();
    },
});

// Create or update user profile (called after auth)
export const createOrUpdateProfile = mutation({
    args: {
        username: v.string(),
        displayName: v.optional(v.string()),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const existingUser = await ctx.db.get(userId);

        if (existingUser) {
            // Update existing user
            await ctx.db.patch(userId, {
                ...args,
                updatedAt: Date.now(),
            });
            return userId;
        }

        // Create new user profile
        // Note: This won't work as users table expects an _id from auth
        // This is for updating the profile after account creation
        throw new Error("User not found");
    },
});

// Update user profile
export const updateProfile = mutation({
    args: {
        displayName: v.optional(v.string()),
        bio: v.optional(v.string()),
        avatarUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        await ctx.db.patch(userId, {
            ...args,
            updatedAt: Date.now(),
        });

        return userId;
    },
});

// Generate a new stream key for user
export const generateStreamKey = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // Generate a random stream key
        const streamKey = `live_${crypto.randomUUID().replace(/-/g, "")}`;

        await ctx.db.patch(userId, {
            streamKey,
            updatedAt: Date.now(),
        });

        return streamKey;
    },
});

// Check if username is available
export const isUsernameAvailable = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", args.username))
            .first();

        return !user;
    },
});

// Follow a user
export const follow = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);
        if (!currentUserId) {
            throw new Error("Not authenticated");
        }

        // Can't follow yourself
        if (currentUserId === args.userId) {
            throw new Error("Cannot follow yourself");
        }

        // Check if already following
        const existingFollow = await ctx.db
            .query("follows")
            .withIndex("by_follower_and_following", (q) =>
                q.eq("followerId", currentUserId).eq("followingId", args.userId),
            )
            .first();

        if (existingFollow) {
            throw new Error("Already following this user");
        }

        // Create follow relationship
        const followId = await ctx.db.insert("follows", {
            followerId: currentUserId,
            followingId: args.userId,
            createdAt: Date.now(),
        });

        return followId;
    },
});

// Unfollow a user
export const unfollow = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);
        if (!currentUserId) {
            throw new Error("Not authenticated");
        }

        // Find the follow relationship
        const follow = await ctx.db
            .query("follows")
            .withIndex("by_follower_and_following", (q) =>
                q.eq("followerId", currentUserId).eq("followingId", args.userId),
            )
            .first();

        if (!follow) {
            throw new Error("Not following this user");
        }

        // Delete the follow relationship
        await ctx.db.delete(follow._id);

        return true;
    },
});
