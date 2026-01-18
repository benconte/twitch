"use client";

import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    padding?: "none" | "sm" | "md" | "lg";
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: ReactNode;
    className?: string;
}

const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
};

export function Card({
    children,
    className = "",
    hover = false,
    padding = "md",
}: CardProps) {
    return (
        <div
            className={`
        bg-background border border-border rounded-xl
        ${paddingStyles[padding]}
        ${hover ? "transition-all duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
    return (
        <div className={`pb-4 border-b border-border ${className}`}>{children}</div>
    );
}

export function CardBody({ children, className = "" }: CardBodyProps) {
    return <div className={`${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
    return (
        <div className={`pt-4 border-t border-border ${className}`}>{children}</div>
    );
}
