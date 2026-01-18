"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { StatCardSkeleton } from "@/components/ui/Skeleton";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

function StatCard({ label, value, icon, trend }: StatCardProps) {
    return (
        <Card className="flex items-start gap-4" hover>
            <div className="p-3 rounded-xl bg-accent/10 text-accent">{icon}</div>
            <div className="flex-1">
                <p className="text-sm text-foreground-secondary">{label}</p>
                <p className="text-2xl font-bold text-foreground mt-0.5">
                    {typeof value === "number" ? value.toLocaleString() : value}
                </p>
                {trend && (
                    <p
                        className={`text-sm mt-1 ${trend.isPositive ? "text-green-500" : "text-red-500"
                            }`}
                    >
                        {trend.isPositive ? "+" : "-"}
                        {Math.abs(trend.value)}%
                        <span className="text-foreground-secondary ml-1">
                            vs last month
                        </span>
                    </p>
                )}
            </div>
        </Card>
    );
}

interface StatsCardsProps {
    followerCount?: number;
    followingCount?: number;
    streamCount?: number;
    totalViews?: number;
    isLoading?: boolean;
}

export function StatsCards({
    followerCount = 0,
    followingCount = 0,
    streamCount = 0,
    totalViews = 0,
    isLoading = false,
}: StatsCardsProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Followers"
                value={followerCount}
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                }
            />
            <StatCard
                label="Following"
                value={followingCount}
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                }
            />
            <StatCard
                label="Total Streams"
                value={streamCount}
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                    </svg>
                }
            />
            <StatCard
                label="Total Views"
                value={totalViews}
                icon={
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                    </svg>
                }
            />
        </div>
    );
}
