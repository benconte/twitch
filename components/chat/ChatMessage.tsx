"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

interface ChatMessageProps {
    message: Doc<"chatMessages"> & {
        user?: Doc<"users"> | null;
    };
    isStreamer?: boolean;
    isModerator?: boolean;
    canModerate?: boolean;
    onDelete?: () => void;
}

export function ChatMessage({
    message,
    isStreamer,
    isModerator,
    canModerate,
    onDelete,
}: ChatMessageProps) {
    const username =
        message.user?.username || message.user?.displayName || "Anonymous";
    const displayName = message.user?.displayName || username;

    // Generate a color hash from username for consistency
    const getUserColor = (name: string) => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 70%, 60%)`;
    };

    return (
        <div className="group px-4 py-1.5 hover:bg-secondary/50 transition-colors">
            <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Badges */}
                        <div className="flex items-center gap-1">
                            {isStreamer && <Badge variant="broadcaster">Host</Badge>}
                            {isModerator && <Badge variant="moderator">Mod</Badge>}
                        </div>

                        {/* Username */}
                        <span
                            className="font-semibold text-sm truncate"
                            style={{ color: getUserColor(username) }}
                        >
                            {displayName}
                        </span>

                        {/* Timestamp */}
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(message.createdAt, { addSuffix: false })}
                        </span>
                    </div>

                    {/* Message content */}
                    <p className="text-sm text-foreground wrap-break-word mt-0.5">
                        {message.content}
                    </p>
                </div>

                {/* Moderation actions */}
                {canModerate && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onDelete}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                )}
            </div>
        </div>
    );
}
