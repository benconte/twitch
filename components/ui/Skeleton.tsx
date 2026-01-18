"use client";

interface SkeletonProps {
    className?: string;
    rounded?: "none" | "sm" | "md" | "lg" | "full";
}

const roundedStyles = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
};

export function Skeleton({ className = "", rounded = "md" }: SkeletonProps) {
    return (
        <div
            className={`
        bg-background-secondary animate-pulse
        ${roundedStyles[rounded]}
        ${className}
      `}
        />
    );
}

export function StreamCardSkeleton() {
    return (
        <div className="space-y-3">
            {/* Thumbnail */}
            <Skeleton className="w-full aspect-video" rounded="lg" />
            <div className="flex gap-3">
                {/* Avatar */}
                <Skeleton className="w-10 h-10 shrink-0" rounded="full" />
                <div className="flex-1 space-y-2">
                    {/* Title */}
                    <Skeleton className="h-4 w-full" />
                    {/* Username */}
                    <Skeleton className="h-3 w-24" />
                    {/* Category */}
                    <Skeleton className="h-3 w-32" />
                </div>
            </div>
        </div>
    );
}

export function UserCardSkeleton() {
    return (
        <div className="flex items-center gap-3 p-3">
            <Skeleton className="w-10 h-10" rounded="full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
            </div>
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="p-4 bg-background border border-border rounded-xl space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-24" />
        </div>
    );
}
