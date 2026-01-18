"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "../ui/Badge";
import { Eye, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface StreamInfoProps {
    stream: Doc<"streams">;
    viewerCount: number;
}

export function StreamInfo({ stream, viewerCount }: StreamInfoProps) {
    return (
        <div className="mt-4 space-y-3">
            {/* Title and status */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground">{stream.title}</h1>
                    {stream.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                            {stream.description}
                        </p>
                    )}
                </div>

                {stream.status === "live" && (
                    <Badge variant="live" className="shrink-0">
                        LIVE
                    </Badge>
                )}
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {/* Category */}
                {stream.category && (
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-foreground">
                            {stream.category}
                        </span>
                    </div>
                )}

                {/* Viewer count */}
                <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>
                        {viewerCount.toLocaleString()} viewer
                        {viewerCount !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Started time */}
                {stream.startedAt && (
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                            Started{" "}
                            {formatDistanceToNow(stream.startedAt, { addSuffix: true })}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
