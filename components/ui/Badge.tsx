"use client";

import { ReactNode } from "react";

type BadgeVariant =
    | "default"
    | "live"
    | "subscriber"
    | "mod"
    | "vip"
    | "success"
    | "warning"
    | "error"
    | "broadcaster"
    | "moderator"
    | "follower";

interface BadgeProps {
    variant?: BadgeVariant;
    children: ReactNode;
    className?: string;
    pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-foreground-secondary/20 text-foreground-secondary",
    live: "bg-red-600 text-white",
    subscriber: "bg-accent text-white",
    mod: "bg-green-600 text-white",
    vip: "bg-pink-500 text-white",
    success: "bg-green-500/20 text-green-500",
    warning: "bg-yellow-500/20 text-yellow-600",
    error: "bg-red-500/20 text-red-500",
    broadcaster: "bg-red-600 text-white",
    moderator: "bg-green-600 text-white",
    follower: "bg-purple-600 text-white",
};

export function Badge({
    variant = "default",
    children,
    className = "",
    pulse = false,
}: BadgeProps) {
    const shouldPulse = pulse || variant === "live";

    return (
        <span
            className={`
        inline-flex items-center gap-1
        px-2 py-0.5 text-xs font-semibold rounded
        uppercase tracking-wide
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {shouldPulse && (
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
                </span>
            )}
            {children}
        </span>
    );
}
