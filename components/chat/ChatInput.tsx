"use client";

import { useState, useRef } from "react";
import { Smile, Send } from "lucide-react";
import { Button } from "../ui/Button";
import { EmotePicker } from "./EmotePicker";

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
    isAuthenticated: boolean;
}

export function ChatInput({
    onSendMessage,
    disabled,
    isAuthenticated,
}: ChatInputProps) {
    const [message, setMessage] = useState("");
    const [showEmotePicker, setShowEmotePicker] = useState(false);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedMessage = message.trim();
        if (!trimmedMessage || disabled) return;

        onSendMessage(trimmedMessage);
        setMessage("");

        // Reset textarea height
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        const cursorPosition = inputRef.current?.selectionStart || message.length;
        const newMessage =
            message.slice(0, cursorPosition) + emoji + message.slice(cursorPosition);
        setMessage(newMessage);
        setShowEmotePicker(false);

        // Focus back on input
        setTimeout(() => {
            inputRef.current?.focus();
            const newPosition = cursorPosition + emoji.length;
            inputRef.current?.setSelectionRange(newPosition, newPosition);
        }, 0);
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);

        // Auto-resize textarea
        e.target.style.height = "auto";
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    };

    if (!isAuthenticated) {
        return (
            <div className="p-4 border-t bg-secondary/30">
                <p className="text-sm text-muted-foreground text-center">
                    Please <span className="text-primary font-semibold">log in</span> to
                    chat
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
            <div className="flex gap-2">
                {/* Emote picker button */}
                <div className="relative">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEmotePicker(!showEmotePicker)}
                        className="h-10 w-10 p-0"
                    >
                        <Smile className="h-5 w-5" />
                    </Button>

                    {showEmotePicker && (
                        <EmotePicker
                            onEmojiSelect={handleEmojiSelect}
                            onClose={() => setShowEmotePicker(false)}
                        />
                    )}
                </div>

                {/* Message input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Send a message..."
                        disabled={disabled}
                        rows={1}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-md resize-none focus:outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        maxLength={500}
                    />

                    {/* Character count */}
                    {message.length > 400 && (
                        <span className="absolute bottom-1 right-2 text-xs text-muted-foreground">
                            {message.length}/500
                        </span>
                    )}
                </div>

                {/* Send button */}
                <Button
                    type="submit"
                    size="sm"
                    disabled={!message.trim() || disabled}
                    className="h-10 w-10 p-0"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
