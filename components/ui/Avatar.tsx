"use client";

import { useState } from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: AvatarSize;
    isOnline?: boolean;
    isLive?: boolean;
    className?: string;
}

const sizeStyles: Record<
    AvatarSize,
    { container: string; text: string; indicator: string }
> = {
    xs: { container: "w-6 h-6", text: "text-xs", indicator: "w-2 h-2 border" },
    sm: {
        container: "w-8 h-8",
        text: "text-sm",
        indicator: "w-2.5 h-2.5 border",
    },
    md: {
        container: "w-10 h-10",
        text: "text-base",
        indicator: "w-3 h-3 border-2",
    },
    lg: {
        container: "w-14 h-14",
        text: "text-lg",
        indicator: "w-3.5 h-3.5 border-2",
    },
    xl: {
        container: "w-20 h-20",
        text: "text-2xl",
        indicator: "w-4 h-4 border-2",
    },
};

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export function Avatar({
    src,
    alt = "Avatar",
    fallback,
    size = "md",
    isOnline = false,
    isLive = false,
    className = "",
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);
    const styles = sizeStyles[size];
    const showFallback = !src || imageError;
    const initials = fallback
        ? getInitials(fallback)
        : alt
            ? getInitials(alt)
            : "?";

    return (
        <div className={`relative inline-flex ${className}`}>
            <div
                className={`
          ${styles.container}
          rounded-full overflow-hidden
          bg-accent/20 flex items-center justify-center
          ${isLive ? "ring-2 ring-red-500 ring-offset-2 ring-offset-background" : ""}
        `}
            >
                {showFallback ? (
                    <span className={`${styles.text} font-semibold text-accent`}>
                        {initials}
                    </span>
                ) : (
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>
            {(isOnline || isLive) && (
                <span
                    className={`
            absolute bottom-0 right-0
            ${styles.indicator}
            rounded-full border-background
            ${isLive ? "bg-red-500" : "bg-green-500"}
          `}
                />
            )}
        </div>
    );
}
