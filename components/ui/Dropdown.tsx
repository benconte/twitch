"use client";

import { useState, useRef, useEffect, ReactNode, KeyboardEvent } from "react";

interface DropdownItem {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    danger?: boolean;
    disabled?: boolean;
}

interface DropdownProps {
    trigger: ReactNode;
    items: (DropdownItem | "divider")[];
    align?: "left" | "right";
    className?: string;
}

export function Dropdown({
    trigger,
    items,
    align = "right",
    className = "",
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    // Filter out dividers for keyboard navigation
    const navigableItems = items.filter(
        (item): item is DropdownItem => item !== "divider",
    );

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close on escape
    useEffect(() => {
        function handleEscape(event: globalThis.KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            return () => document.removeEventListener("keydown", handleEscape);
        }
    }, [isOpen]);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev < navigableItems.length - 1 ? prev + 1 : 0,
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev > 0 ? prev - 1 : navigableItems.length - 1,
                );
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (focusedIndex >= 0 && !navigableItems[focusedIndex].disabled) {
                    navigableItems[focusedIndex].onClick();
                    setIsOpen(false);
                    setFocusedIndex(-1);
                }
                break;
        }
    };

    return (
        <div ref={dropdownRef} className={`relative inline-block ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                className="focus:outline-none"
            >
                {trigger}
            </button>

            {isOpen && (
                <div
                    ref={menuRef}
                    role="menu"
                    className={`
            absolute z-50 mt-2 min-w-48
            bg-background border border-border rounded-lg shadow-xl
            py-1.5 animate-in fade-in zoom-in-95 duration-150
            ${align === "right" ? "right-0" : "left-0"}
          `}
                >
                    {items.map((item, index) => {
                        if (item === "divider") {
                            return (
                                <div
                                    key={`divider-${index}`}
                                    className="my-1.5 border-t border-border"
                                />
                            );
                        }

                        const itemIndex = navigableItems.indexOf(item);
                        const isFocused = focusedIndex === itemIndex;

                        return (
                            <button
                                key={index}
                                role="menuitem"
                                onClick={() => {
                                    if (!item.disabled) {
                                        item.onClick();
                                        setIsOpen(false);
                                        setFocusedIndex(-1);
                                    }
                                }}
                                disabled={item.disabled}
                                className={`
                  w-full flex items-center gap-3 px-4 py-2 text-left
                  text-sm transition-colors
                  ${item.danger
                                        ? "text-red-500 hover:bg-red-500/10"
                                        : "text-foreground hover:bg-background-secondary"
                                    }
                  ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
                  ${isFocused ? "bg-background-secondary" : ""}
                `}
                            >
                                {item.icon && (
                                    <span className="w-4 h-4 shrink-0">{item.icon}</span>
                                )}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
