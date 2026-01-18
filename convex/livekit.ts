"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { auth } from "./auth";
import { AccessToken } from "livekit-server-sdk";

// Generate a viewer token for LiveKit
export const generateViewerToken = action({
    args: {
        roomName: v.string(),
        participantName: v.string(),
    },
    handler: async (ctx, args) => {
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error("LiveKit credentials not configured");
        }

        const userId = await auth.getUserId(ctx);

        // Fetch user data to get actual username
        let participantName = args.participantName;
        let identity = `guest_${Math.random().toString(36).substring(7)}`;

        if (userId) {
            const user = await ctx.runQuery(api.users.getById, { userId });

            if (user) {
                participantName = user.username || user.displayName || participantName;
                identity = userId;
            }
        }

        const token = new AccessToken(apiKey, apiSecret, {
            identity,
            name: participantName,
        });

        token.addGrant({
            room: args.roomName,
            roomJoin: true,
            canPublish: false,
            canSubscribe: true,
        });

        return await token.toJwt();
    },
});

// Generate a streamer token for LiveKit
export const generateStreamerToken = action({
    args: {
        roomName: v.string(),
        participantName: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error("LiveKit credentials not configured");
        }

        const token = new AccessToken(apiKey, apiSecret, {
            identity: userId,
            name: args.participantName,
        });

        token.addGrant({
            room: args.roomName,
            roomJoin: true,
            roomAdmin: true,
            canPublish: true,
            canPublishData: true,
            canSubscribe: true,
        });

        return await token.toJwt();
    },
});
