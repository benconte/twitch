"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StreamCardSkeleton } from "@/components/ui/Skeleton";

// Placeholder featured streams - in production these would come from an API
const featuredStreams = [
    {
        id: "1",
        title: "Late Night Gaming Session!",
        thumbnailUrl: null,
        username: "shroud",
        displayName: "shroud",
        isLive: true,
        viewerCount: 42000,
        category: "VALORANT",
    },
    {
        id: "2",
        title: "Just Chatting with Chat 💜",
        thumbnailUrl: null,
        username: "pokimane",
        displayName: "pokimane",
        isLive: true,
        viewerCount: 28000,
        category: "Just Chatting",
    },
    {
        id: "3",
        title: "Ranked Grind to Radiant",
        thumbnailUrl: null,
        username: "tarik",
        displayName: "tarik",
        isLive: true,
        viewerCount: 15000,
        category: "VALORANT",
    },
    {
        id: "4",
        title: "Minecraft Hardcore Day 100!",
        thumbnailUrl: null,
        username: "tubbo",
        displayName: "Tubbo",
        isLive: true,
        viewerCount: 12000,
        category: "Minecraft",
    },
];

const categories = [
    { name: "Just Chatting", viewers: 450000, image: null },
    { name: "VALORANT", viewers: 180000, image: null },
    { name: "League of Legends", viewers: 150000, image: null },
    { name: "Minecraft", viewers: 120000, image: null },
    { name: "Grand Theft Auto V", viewers: 100000, image: null },
    { name: "Fortnite", viewers: 95000, image: null },
];

function StreamCard({
    title,
    username,
    displayName,
    viewerCount,
    category,
}: {
    title: string;
    username: string;
    displayName: string;
    viewerCount: number;
    category: string;
}) {
    return (
        <Link href={`/${username}`} className="group block">
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-background-secondary mb-3">
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent/20 to-accent/5">
                    <svg
                        className="w-12 h-12 text-accent/50"
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
                </div>

                {/* Live Badge */}
                <div className="absolute top-2 left-2">
                    <Badge variant="live">LIVE</Badge>
                </div>

                {/* Viewer Count */}
                <div className="absolute bottom-2 left-2">
                    <span className="px-1.5 py-0.5 bg-black/75 text-white text-xs font-medium rounded">
                        {viewerCount >= 1000
                            ? `${(viewerCount / 1000).toFixed(1)}K`
                            : viewerCount}{" "}
                        viewers
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-accent">
                        {displayName[0].toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-accent transition-colors">
                        {title}
                    </h3>
                    <p className="text-sm text-foreground-secondary truncate">
                        {displayName}
                    </p>
                    <p className="text-sm text-foreground-secondary truncate">
                        {category}
                    </p>
                </div>
            </div>
        </Link>
    );
}

function CategoryCard({ name, viewers }: { name: string; viewers: number }) {
    return (
        <Link href={`/browse/${encodeURIComponent(name)}`} className="group block">
            <div className="aspect-3/4 rounded-lg overflow-hidden bg-background-secondary mb-2">
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-accent/30 to-accent/10">
                    <span className="text-4xl font-bold text-accent/50">{name[0]}</span>
                </div>
            </div>
            <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors truncate">
                {name}
            </h3>
            <p className="text-xs text-foreground-secondary">
                {viewers >= 1000 ? `${(viewers / 1000).toFixed(0)}K` : viewers} viewers
            </p>
        </Link>
    );
}

export default function BrowsePage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="mb-10">
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-accent to-accent-hover p-8 md:p-12">
                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Discover Live Streams
                        </h1>
                        <p className="text-white/80 text-lg mb-6 max-w-xl">
                            Watch your favorite streamers, join the conversation, and be part
                            of the community.
                        </p>
                        <Link href="/browse">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="bg-white text-accent hover:bg-white/90"
                            >
                                Browse All Streams
                            </Button>
                        </Link>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
                </div>
            </div>

            {/* Live Channels Section */}
            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">
                        Live channels we think you&apos;ll like
                    </h2>
                    <Link href="/browse" className="text-sm text-accent hover:underline">
                        Show more
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {featuredStreams.map((stream) => (
                        <StreamCard
                            key={stream.id}
                            title={stream.title}
                            username={stream.username}
                            displayName={stream.displayName}
                            viewerCount={stream.viewerCount}
                            category={stream.category}
                        />
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Categories</h2>
                    <Link
                        href="/browse/categories"
                        className="text-sm text-accent hover:underline"
                    >
                        Show more
                    </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.name}
                            name={category.name}
                            viewers={category.viewers}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
