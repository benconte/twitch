"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface ChatProps {
    streamId: Id<"streams">;
    streamerId: string;
}

export function Chat({ streamId, streamerId }: ChatProps) {
    const { userId } = useAuth();
    const [chatRoomId, setChatRoomId] = useState<Id<"chatRooms"> | null>(null);

    // Get chat room
    const chatRoom = useQuery(api.chat.getRoomByStreamId, { streamId });

    // Get messages
    const messages = useQuery(
        api.chat.getMessages,
        chatRoomId ? { chatRoomId } : "skip",
    );

    // Mutations
    const sendMessage = useMutation(api.chat.sendMessage);
    const deleteMessage = useMutation(api.chat.deleteMessage);

    useEffect(() => {
        if (chatRoom) {
            setChatRoomId(chatRoom._id);
        }
    }, [chatRoom]);

    const handleSendMessage = async (content: string) => {
        if (!chatRoomId) return;

        try {
            await sendMessage({
                chatRoomId,
                content,
            });
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    const handleDeleteMessage = async (messageId: Id<"chatMessages">) => {
        try {
            await deleteMessage({ messageId });
        } catch (error) {
            console.error("Failed to delete message:", error);
        }
    };

    const messagesWithUsers =
        messages?.map((message) => ({
            ...message,
            user: message.user,
        })) || [];

    const canModerate = userId === streamerId;

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Chat header */}
            <div className="p-4 border-b bg-secondary/30">
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <h2 className="font-semibold text-sm">Stream Chat</h2>
                </div>
                {chatRoom?.slowMode && (
                    <p className="text-xs text-muted-foreground mt-1">
                        Slow mode: {chatRoom.slowMode}s
                    </p>
                )}
            </div>

            {/* Messages */}
            <ChatMessageList
                messages={messagesWithUsers}
                streamerId={streamerId}
                currentUserId={userId}
                canModerate={canModerate}
                onDeleteMessage={handleDeleteMessage}
                isLoading={messages === undefined}
            />

            {/* Input */}
            <ChatInput
                onSendMessage={handleSendMessage}
                isAuthenticated={!!userId}
                disabled={!chatRoom?.isEnabled}
            />
        </div>
    );
}
