import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import ProfileClient from "./ProfileClient";

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ username: string }>;
}) {
    const { username } = await params;

    // Fetch user data
    const user = await fetchQuery(api.users.getByUsername, { username });

    if (!user) {
        // User not found, redirect to home
        redirect("/");
    }

    // Fetch active stream if user is live
    let activeStream = null;
    if (user.isLive) {
        const streams = await fetchQuery(api.streams.getByUserId, {
            userId: user._id,
        });
        activeStream = streams.find((s) => s.status === "live") || null;
    }

    return <ProfileClient user={user} activeStream={activeStream} />;
}
