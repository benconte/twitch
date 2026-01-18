"use client";

import { useEffect, useRef } from "react";
import { Doc } from "@/convex/_generated/dataModel";
import { ChatMessage } from "./ChatMessage";
import { Loader2 } from "lucide-react";

interface ChatMessageListProps {
    messages: Array<
        Doc<"chatMessages"> & {
            user?: Doc<"users"> | null;
        }
    >;
    streamerId?: string;
    currentUserId?: string;
    canModerate?: boolean;
    onDeleteMessage?: (messageId: Doc<"chatMessages">["_id"]) => void;
    isLoading?: boolean;
}

export function ChatMessageList({
    messages,
    streamerId,
    currentUserId,
    canModerate,
    onDeleteMessage,
    isLoading,
}: ChatMessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isAtBottomRef = useRef(true);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current && isAtBottomRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Track if user is at bottom
    const handleScroll = () => {
        if (!scrollRef.current) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        isAtBottomRef.current = distanceFromBottom < 50;
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-sm text-muted-foreground text-center">
                    Welcome to the chat! Be the first to say something.
                </p>
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scroll-smooth"
        >
            <div className="flex flex-col gap-0.5 py-2">
                {messages.map((message) => (
                    <ChatMessage
                        key={message._id}
                        message={message}
                        isStreamer={message.userId === streamerId}
                        isModerator={false} // TODO: Add moderator check
                        canModerate={canModerate}
                        onDelete={() => onDeleteMessage?.(message._id)}
                    />
                ))}
            </div>
        </div>
    );
}
