"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { StreamManager } from "@/components/dashboard/StreamManager";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Spinner } from "@/components/ui/Spinner";

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
    const user = useQuery(api.users.current);
    const stats = useQuery(api.dashboard.getStats);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    Welcome back{user?.displayName ? `, ${user.displayName}` : ""}!
                </h1>
                <p className="text-foreground-secondary mt-1">
                    Here&apos;s what&apos;s happening with your channel
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8">
                <StatsCards
                    followerCount={stats?.followerCount}
                    followingCount={stats?.followingCount}
                    streamCount={stats?.streamCount}
                    totalViews={stats?.totalViews}
                    isLoading={stats === undefined}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Quick Actions + Stream Manager */}
                <div className="lg:col-span-2 space-y-6">
                    <QuickActions />
                    <StreamManager />
                </div>

                {/* Right Column - Recent Activity */}
                <div>
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
}
