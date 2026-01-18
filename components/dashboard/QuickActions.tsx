"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";

interface QuickAction {
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color: string;
}

const quickActions: QuickAction[] = [
    {
        title: "Start Streaming",
        description: "Go live and connect with your audience",
        href: "/dashboard/stream",
        icon: (
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
        ),
        color: "bg-red-500/10 text-red-500",
    },
    {
        title: "Edit Profile",
        description: "Update your bio, avatar, and settings",
        href: "/settings/profile",
        icon: (
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
            </svg>
        ),
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        title: "Stream Settings",
        description: "Configure your stream key and preferences",
        href: "/dashboard/settings",
        icon: (
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
            </svg>
        ),
        color: "bg-accent/10 text-accent",
    },
    {
        title: "View Analytics",
        description: "Track your growth and performance",
        href: "/dashboard/analytics",
        icon: (
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
            </svg>
        ),
        color: "bg-green-500/10 text-green-500",
    },
];

export function QuickActions() {
    return (
        <Card padding="none">
            <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
                {quickActions.map((action, index) => (
                    <Link
                        key={action.title}
                        href={action.href}
                        className={`
              flex items-start gap-4 p-4
              hover:bg-background-secondary transition-colors
              ${index < 2 ? "border-b border-border" : ""}
              ${index % 2 === 0 ? "sm:border-r" : ""}
            `}
                    >
                        <div className={`p-3 rounded-xl ${action.color}`}>
                            {action.icon}
                        </div>
                        <div>
                            <h3 className="font-medium text-foreground">{action.title}</h3>
                            <p className="text-sm text-foreground-secondary mt-0.5">
                                {action.description}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    );
}
