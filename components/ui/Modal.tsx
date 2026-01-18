"use client";

import { useEffect, useRef, ReactNode, useCallback } from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
}

const sizeStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
};

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    closeOnOverlayClick = true,
    showCloseButton = true,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    // Handle escape key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose],
    );

    // Focus trap and body scroll lock
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";

            // Focus the modal
            setTimeout(() => {
                modalRef.current?.focus();
            }, 0);

            return () => {
                document.removeEventListener("keydown", handleKeyDown);
                document.body.style.overflow = "";
                // Restore focus
                if (previousActiveElement.current instanceof HTMLElement) {
                    previousActiveElement.current.focus();
                }
            };
        }
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={closeOnOverlayClick ? onClose : undefined}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "modal-title" : undefined}
                tabIndex={-1}
                className={`
          relative z-10 w-full ${sizeStyles[size]} mx-4
          bg-background border border-border rounded-xl shadow-2xl
          animate-in fade-in zoom-in-95 duration-200
        `}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        {title && (
                            <h2
                                id="modal-title"
                                className="text-lg font-semibold text-foreground"
                            >
                                {title}
                            </h2>
                        )}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-background-secondary transition-colors"
                                aria-label="Close modal"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="px-6 py-4">{children}</div>
            </div>
        </div>
    );
}
