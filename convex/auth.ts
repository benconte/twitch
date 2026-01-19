import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Password({
            profile(params) {
                return {
                    email: params.email as string,
                    name: params.name as string,
                };
            },
        }),
    ],
    callbacks: {
        async afterUserCreatedOrUpdated(ctx, args) {
            // Log everything to see what data we have access to
            // console.log("Full args:", JSON.stringify(args, null, 2));

            // Get the user ID - either newly created or existing
            const userId = args.userId;

            const user = await ctx.db.get(userId);
            if (!user) return;

            // Get name from profile
            const name = args.profile?.name as string | undefined;

            // If user doesn't have a username but name was provided
            if (!user.username && name) {
                // Generate username from name
                // Remove spaces and special characters, convert to lowercase
                let username = name.toLowerCase().replace(/[^a-z0-9_]/g, "");

                // Ensure username is at least 3 characters
                if (username.length < 3) {
                    username = `user${Math.random().toString(36).substring(2, 8)}`;
                }

                // Check if username is taken, add number suffix if needed
                let finalUsername = username;
                let counter = 1;
                while (true) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const existing = await (ctx.db as any)
                        .query("users")
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .withIndex("by_username", (q: any) =>
                            q.eq("username", finalUsername),
                        )
                        .first();
                    if (!existing || existing._id === userId) {
                        break;
                    }

                    finalUsername = `${username}${counter}`;
                    counter++;
                }

                await ctx.db.patch(userId, {
                    username: finalUsername,
                    displayName: name,
                });
            }
        },
    },
});
