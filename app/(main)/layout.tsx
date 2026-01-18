"use client";

import { useRouter } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Spinner } from "@/components/ui/Spinner";
import { useEffect } from "react";

export default function MainSectionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useConvexAuth();

    // Redirect unauthenticated users from protected routes
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Allow public routes within (main) group
            const publicRoutes = ["/browse", "/search"];
            const currentPath = window.location.pathname;

            const isPublicRoute = publicRoutes.some(
                (route) => currentPath === route || currentPath.startsWith(`${route}/`),
            );

            // Also allow user profile pages (e.g., /username)
            const isProfilePage =
                !currentPath.startsWith("/dashboard") &&
                !currentPath.startsWith("/settings") &&
                !currentPath.startsWith("/following");

            if (!isPublicRoute && !isProfilePage) {
                router.push("/login");
            }
        }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state for protected routes
    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                    <Spinner size="lg" />
                </div>
            </MainLayout>
        );
    }

    return <MainLayout>{children}</MainLayout>;
}
