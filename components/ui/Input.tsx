"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            label,
            error,
            leftIcon,
            rightIcon,
            className = "",
            containerClassName = "",
            id,
            ...props
        },
        ref,
    ) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-foreground"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
              w-full px-4 py-2.5
              bg-background-secondary border border-border rounded-lg
              text-foreground placeholder:text-foreground-secondary
              transition-all duration-150 ease-in-out
              focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}
              ${className}
            `}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-sm text-red-500"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = "Input";
