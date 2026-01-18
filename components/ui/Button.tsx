"use client";

import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-accent text-white hover:bg-accent-hover active:bg-twitch-purple-dark shadow-sm",
    secondary:
        "bg-background-secondary text-foreground border border-border hover:bg-border active:bg-border/80",
    ghost:
        "bg-transparent text-foreground hover:bg-background-secondary active:bg-border",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    link: "bg-transparent text-accent hover:text-accent-hover underline-offset-4 hover:underline p-0",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            className = "",
            disabled,
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                className={`
          inline-flex items-center justify-center font-semibold rounded-md
          transition-all duration-150 ease-in-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${variant !== "link" ? sizeStyles[size] : ""}
          ${className}
        `}
                disabled={isDisabled}
                {...props}
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                ) : (
                    leftIcon
                )}
                <span>{children}</span>
                {!isLoading && rightIcon}
            </button>
        );
    },
);

Button.displayName = "Button";
