"use client";

import { useEffect, useRef } from "react";

const EMOJIS = [
    "😀",
    "😃",
    "😄",
    "😁",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
    "😏",
    "😒",
    "😞",
    "😔",
    "😟",
    "😕",
    "🙁",
    "☹️",
    "😣",
    "😖",
    "😫",
    "😩",
    "🥺",
    "😢",
    "😭",
    "😤",
    "😠",
    "😡",
    "🤬",
    "🤯",
    "😳",
    "🥵",
    "🥶",
    "😱",
    "😨",
    "😰",
    "😥",
    "😓",
    "🤗",
    "🤔",
    "🤭",
    "🤫",
    "🤥",
    "😶",
    "😐",
    "😑",
    "😬",
    "🙄",
    "😯",
    "😦",
    "😧",
    "😮",
    "😲",
    "🥱",
    "😴",
    "🤤",
    "😪",
    "😵",
    "🤐",
    "🥴",
    "🤢",
    "🤮",
    "🤧",
    "😷",
    "🤒",
    "🤕",
    "🤑",
    "🤠",
    "👻",
    "💀",
    "☠️",
    "👽",
    "👾",
    "🤖",
    "🎃",
    "😺",
    "😸",
    "😹",
    "😻",
    "😼",
    "😽",
    "🙀",
    "😿",
    "😾",
    "👏",
    "🙌",
    "👍",
    "👎",
    "👊",
    "✊",
    "🤛",
    "🤜",
    "🤞",
    "✌️",
    "🤟",
    "🤘",
    "👌",
    "🤌",
    "🤏",
    "👈",
    "👉",
    "👆",
    "👇",
    "☝️",
    "✋",
    "🤚",
    "🖐",
    "🖖",
    "👋",
    "🤙",
    "💪",
    "🦾",
    "🖕",
    "✍️",
    "🙏",
    "🦶",
    "🦵",
    "🦿",
    "💄",
    "💋",
    "👄",
    "🦷",
    "👅",
    "👂",
    "🦻",
    "👃",
    "👣",
    "👁",
    "👀",
    "🧠",
    "🗣",
    "👤",
    "👥",
    "🫂",
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❤️‍🔥",
    "❤️‍🩹",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
    "⛎",
    "♈",
    "♉",
    "♊",
    "♋",
    "♌",
    "🔥",
    "💧",
    "🌊",
    "⚡",
    "☄️",
    "💥",
    "✨",
    "🌟",
    "⭐",
    "🌠",
];

interface EmotePickerProps {
    onEmojiSelect: (emoji: string) => void;
    onClose: () => void;
}

export function EmotePicker({ onEmojiSelect, onClose }: EmotePickerProps) {
    const pickerRef = useRef<HTMLDivElement>(null);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={pickerRef}
            className="absolute bottom-full left-0 mb-2 w-80 max-h-80 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-50"
        >
            <div className="p-2 border-b bg-background">
                <h3 className="text-sm font-semibold">Emotes</h3>
            </div>

            <div className="overflow-y-auto max-h-72 p-2">
                <div className="grid grid-cols-8 gap-1">
                    {EMOJIS.map((emoji, index) => (
                        <button
                            key={index}
                            onClick={() => onEmojiSelect(emoji)}
                            className="text-2xl p-2 hover:bg-secondary rounded transition-colors"
                            type="button"
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
