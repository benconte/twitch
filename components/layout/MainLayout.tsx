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
            <div
                className="h-screen overflow-hidden bg-background flex flex-col"
                suppressHydrationWarning
            >
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
                </div>
            </div>
        </ToastProvider>
    );
}
