"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { ToastProvider } from "@/components/ui/Toast";

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-background" suppressHydrationWarning>
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 min-w-0">{children}</main>
                </div>
                {/* Mobile navigation is rendered at the header level */}
            </div>
        </ToastProvider>
    );
}
