"use client";

import Link from "next/link";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-twitch-purple"
                viewBox="0 0 256 268"
                fill="currentColor"
              >
                <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263h192.02v128.029l-40.739 40.741H128L93.098 226.935v-34.902H40.717V23.263zm64.008 116.405h23.275V69.803H104.725v69.865zm63.997 0h23.27V69.803h-23.27v69.865z" />
              </svg>
              <span className="text-xl font-bold text-foreground">
                Twitch Clone
              </span>
            </div>

            <nav className="flex items-center gap-4">
              {isLoading ? (
                <div className="w-20 h-9 bg-background-secondary rounded animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="btn btn-secondary px-4 py-2"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-foreground-secondary hover:text-foreground transition-colors"
                  >
                    Log in
                  </Link>
                  <Link href="/register" className="btn btn-primary px-4 py-2">
                    Sign up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                Where everyone can
                <span className="text-twitch-purple"> stream</span>
              </h1>
              <p className="text-xl text-foreground-secondary max-w-2xl mb-10">
                Join millions of streamers and viewers. Share your content,
                build your community, and connect with fans worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="btn btn-primary px-8 py-3 text-lg"
                >
                  Start streaming
                </Link>
                <Link
                  href="/browse"
                  className="btn btn-secondary px-8 py-3 text-lg"
                >
                  Browse streams
                </Link>
              </div>
            </div>
          </div>

          {/* Decorative gradient */}
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20">
              <div className="w-full h-full bg-linear-to-b from-twitch-purple to-transparent blur-3xl" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-14 h-14 bg-twitch-purple/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-7 h-7 text-twitch-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Live Streaming
              </h3>
              <p className="text-foreground-secondary leading-relaxed">
                Stream in ultra-low latency with WebRTC technology powered by
                LiveKit.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-14 h-14 bg-twitch-purple/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-7 h-7 text-twitch-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Real-time Chat
              </h3>
              <p className="text-foreground-secondary leading-relaxed">
                Engage with your audience through instant, real-time chat
                powered by Convex.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-14 h-14 bg-twitch-purple/10 rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg
                  className="w-7 h-7 text-twitch-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Build Community
              </h3>
              <p className="text-foreground-secondary leading-relaxed">
                Follow your favorite streamers and get notified when they go
                live.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-6 h-6 text-twitch-purple"
                viewBox="0 0 256 268"
                fill="currentColor"
              >
                <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263h192.02v128.029l-40.739 40.741H128L93.098 226.935v-34.902H40.717V23.263zm64.008 116.405h23.275V69.803H104.725v69.865zm63.997 0h23.27V69.803h-23.27v69.865z" />
              </svg>
              <span className="text-sm text-foreground-secondary">
                © 2026 Twitch Clone. Built with Next.js & Convex.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-foreground-secondary">
              <Link
                href="/about"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
